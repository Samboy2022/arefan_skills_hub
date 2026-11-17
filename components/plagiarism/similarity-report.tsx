"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flag,
  Info,
  Printer,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";
import {
  DEFAULT_CHECK_OPTIONS,
  REVIEW_LABELS,
  RISK_STYLES,
  ReviewStatus,
  SOURCE_TYPE_LABELS,
  SimilarityReport,
  adjustedSimilarity,
  reportWordCount,
  reviewFor,
  riskBand,
  saveReview,
  saveStoredReport,
  sourceColor,
} from "@/lib/plagiarism";
import { newIdempotencyKey, runPlagiarismCheck } from "@/lib/plagiarism-client";
import { ScoreRing } from "@/components/plagiarism/score-ring";
import { REVIEW_BADGES } from "@/components/plagiarism/plagiarism-inbox";
import { useReviews } from "@/components/plagiarism/use-reviews";

type Filters = { bibliography: boolean; quotes: boolean; small: boolean };

export function SimilarityReportView({
  report,
  reports,
  basePath,
}: {
  report: SimilarityReport;
  reports: SimilarityReport[];
  basePath: string;
}) {
  const reviews = useReviews();
  const review = reviewFor(reviews, report.id);
  const [filters, setFilters] = useState<Filters>({ bibliography: false, quotes: false, small: false });
  const [activeSource, setActiveSource] = useState<string>(report.sources[0]?.id ?? "");
  const [matchIndex, setMatchIndex] = useState(-1);
  const [note, setNote] = useState(review.note);
  const [running, setRunning] = useState(false);
  const segmentRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => setNote(review.note), [review.note]);

  useEffect(() => {
    const options = report.options ?? DEFAULT_CHECK_OPTIONS;
    setFilters({
      bibliography: options.excludeBibliography,
      quotes: options.excludeQuotes,
      small: options.smallMatchWords > 0,
    });
    setActiveSource(report.sources[0]?.id ?? "");
    setMatchIndex(-1);
  }, [report]);

  const score = useMemo(() => adjustedSimilarity(report, filters), [report, filters]);
  const band = RISK_STYLES[riskBand(score)];
  const words = useMemo(() => reportWordCount(report), [report]);

  const hidden = (kind: string) =>
    (kind === "bibliography" && filters.bibliography) || (kind === "quote" && filters.quotes) || (kind === "small" && filters.small);

  const matches = useMemo(
    () => report.segments.filter((segment) => segment.sourceId && segment.kind !== "plain" && segment.kind !== "bibliography" && !hidden(segment.kind)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [report, filters],
  );

  const visibleSources = report.sources.filter((source) => matches.some((segment) => segment.sourceId === source.id));
  const ordered = useMemo(() => [...reports].sort((a, b) => b.similarity - a.similarity), [reports]);
  const position = ordered.findIndex((entry) => entry.id === report.id);
  const previous = position > 0 ? ordered[position - 1] : null;
  const next = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : null;
  const byType = useMemo(() => {
    const totals: Record<string, number> = { internet: 0, "student-paper": 0, publication: 0 };
    visibleSources.forEach((source) => {
      totals[source.type] = (totals[source.type] ?? 0) + source.matchPercent;
    });
    return totals;
  }, [visibleSources]);

  function goToMatch(index: number) {
    if (matches.length === 0) return;
    const wrapped = (index + matches.length) % matches.length;
    const segment = matches[wrapped];
    setMatchIndex(wrapped);
    if (segment.sourceId) setActiveSource(segment.sourceId);
    segmentRefs.current[segment.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function selectSource(sourceId: string) {
    setActiveSource(sourceId);
    const first = matches.findIndex((segment) => segment.sourceId === sourceId);
    if (first >= 0) goToMatch(first);
  }

  // j / k step through matches, 1–9 jump to a source. Ignored while typing.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        goToMatch(matchIndex + 1);
      } else if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        goToMatch(matchIndex - 1);
      } else if (/^[1-9]$/.test(event.key)) {
        const source = report.sources[Number(event.key) - 1];
        if (source) selectSource(source.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function decide(status: ReviewStatus) {
    saveReview(report.id, { status, note: note.trim(), reviewedAt: new Date().toISOString() });
    toast.success(
      status === "cleared" ? "Marked as cleared" : status === "flagged" ? "Flagged for follow-up" : "Moved back to review",
      { description: `${report.studentName} · ${report.assignmentTitle}` },
    );
  }

  function saveNote() {
    saveReview(report.id, { ...review, note: note.trim(), reviewedAt: new Date().toISOString() });
    toast.success("Note saved");
  }

  async function rerun() {
    if (running) return;
    setRunning(true);
    try {
      const nextReport = await runPlagiarismCheck({
        submissionId: report.origin === "upload" ? undefined : report.submissionId,
        fileName: report.fileName || "document.txt",
        text: report.segments.map((segment) => segment.text).join(""),
        studentName: report.studentName,
        assignmentTitle: report.assignmentTitle,
        courseTitle: report.courseTitle,
        origin: report.origin ?? "submission",
        options: report.options ?? DEFAULT_CHECK_OPTIONS,
        reportId: report.id,
        idempotencyKey: newIdempotencyKey(),
      });
      saveStoredReport({ ...nextReport, id: report.id, submittedAt: report.submittedAt });
      toast.success("Check updated", { description: `${nextReport.similarity}% overlap` });
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "The check could not be completed.");
    } finally {
      setRunning(false);
    }
  }

  const activeMatch = matchIndex >= 0 ? matches[matchIndex] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={basePath}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> All reports
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <Button asChild={Boolean(previous)} variant="outline" size="sm" disabled={!previous}>
            {previous ? (
              <Link href={`${basePath}/${previous.id}`}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </span>
            )}
          </Button>
          <span className="px-2 text-xs text-muted-foreground">
            {position + 1} of {ordered.length}
          </span>
          <Button asChild={Boolean(next)} variant="outline" size="sm" disabled={!next}>
            {next ? (
              <Link href={`${basePath}/${next.id}`}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <span>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <ScoreRing score={score} size={104} stroke={9} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Similarity</p>
              <p className={cn("text-lg font-bold", band.text)}>{band.label} overlap</p>
              <p className="text-xs text-muted-foreground">
                {score !== report.similarity ? `${report.similarity}% before exclusions` : "No exclusions applied"}
              </p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 border-border text-sm sm:grid-cols-4 md:border-l md:pl-6">
            <Meta label="Student" value={report.studentName} />
            <Meta label="Submitted" value={format(new Date(report.submittedAt), "MMM d, yyyy · h:mm a")} />
            <Meta label="Words" value={words.toLocaleString()} />
            <Meta label="Sources" value={`${visibleSources.length} of ${report.sources.length}`} />
            <Meta label="File" value={report.fileName ?? "Document"} />
            <Meta label="Language" value={report.language ?? "Undetected"} />
            <Meta label="Writing pattern" value={typeof report.aiWriting === "number" ? `${report.aiWriting}%` : "—"} />
            <Meta label="Checked" value={report.checkedAt ? format(new Date(report.checkedAt), "MMM d, yyyy") : "—"} />
          </div>
          <div className="flex gap-2 print:hidden md:flex-col">
            <Button variant="outline" size="sm" onClick={rerun} disabled={running}>
              <RefreshCw className={cn("mr-1.5 h-4 w-4", running && "animate-spin")} /> {running ? "Checking…" : "Run again"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Print report
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {report.provider === "external"
              ? "Returned by the connected plagiarism service."
              : "Compared with the built-in index of internet pages, student papers, and publications."}{" "}
            Internet {byType.internet}% · Student papers {byType["student-paper"]}% · Publications {byType.publication}%.
          </p>
          <p>Overlap is not a verdict. The writing-pattern score is not proof a tool wrote the work.</p>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 print:hidden lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exclude</span>
          <Toggle label="Bibliography" checked={filters.bibliography} onChange={(bibliography) => setFilters({ ...filters, bibliography })} />
          <Toggle label="Quotations" checked={filters.quotes} onChange={(quotes) => setFilters({ ...filters, quotes })} />
          <Toggle label="Small matches" checked={filters.small} onChange={(small) => setFilters({ ...filters, small })} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {matches.length === 0 ? "No matches" : activeMatch ? `Match ${matchIndex + 1} of ${matches.length}` : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToMatch(matchIndex - 1)} disabled={!matches.length} aria-label="Previous match">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToMatch(matchIndex + 1)} disabled={!matches.length} aria-label="Next match">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="hidden items-center gap-1 text-xs text-muted-foreground xl:flex">
            <Kbd>j</Kbd>
            <Kbd>k</Kbd> to step · <Kbd>1</Kbd>–<Kbd>{Math.min(9, report.sources.length)}</Kbd> sources
          </span>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Document ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-6">
          <article className="mx-auto max-w-3xl rounded-sm bg-white px-6 py-10 text-[15px] leading-8 text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_28px_-14px_rgba(0,0,0,0.25)] sm:px-12 dark:bg-stone-900 dark:text-stone-200">
            <header className="mb-8 border-b border-stone-200 pb-4 dark:border-stone-700">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{report.courseTitle}</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">{report.assignmentTitle}</h2>
              <p className="mt-1 text-sm text-stone-500">{report.studentName}</p>
            </header>
            <p className="font-serif">
              {report.segments.map((segment) => {
                if (hidden(segment.kind)) {
                  return (
                    <span key={segment.id} className="text-stone-400 line-through decoration-stone-300 dark:text-stone-600">
                      {segment.text}
                    </span>
                  );
                }
                const matched = segment.sourceId && segment.kind !== "plain" && segment.kind !== "bibliography";
                if (!matched) {
                  return (
                    <span key={segment.id} className={segment.kind === "bibliography" ? "text-stone-500 italic" : undefined}>
                      {segment.text}
                    </span>
                  );
                }
                const color = sourceColor(report, segment.sourceId);
                const rank = report.sources.find((source) => source.id === segment.sourceId)?.rank;
                const isActive = activeMatch?.id === segment.id;
                const isSourceActive = segment.sourceId === activeSource;
                return (
                  <mark
                    key={segment.id}
                    ref={(element) => {
                      segmentRefs.current[segment.id] = element;
                    }}
                    onClick={() => {
                      const index = matches.findIndex((entry) => entry.id === segment.id);
                      if (index >= 0) goToMatch(index);
                    }}
                    className={cn(
                      "cursor-pointer rounded-[3px] px-0.5 py-0.5 transition-all [box-decoration-break:clone]",
                      color.mark,
                      !isSourceActive && activeSource && "opacity-60",
                      isActive && "underline decoration-2 underline-offset-4 ring-2 ring-offset-1 ring-current/30",
                    )}
                  >
                    <sup className={cn("mr-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 align-top text-[9px] font-bold text-white not-italic", color.dot)}>
                      {rank}
                    </sup>
                    {segment.text}
                  </mark>
                );
              })}
            </p>
          </article>
        </div>

        {/* ── Sources and review ─────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-semibold">Match overview</h3>
              <span className={cn("text-sm font-bold", band.text)}>{score}%</span>
            </div>
            <ul className="divide-y divide-border">
              {report.sources.map((source, index) => {
                const color = sourceColor(report, source.id);
                const excluded = !visibleSources.some((entry) => entry.id === source.id);
                const active = source.id === activeSource;
                const count = matches.filter((segment) => segment.sourceId === source.id).length;
                return (
                  <li key={source.id}>
                    <button
                      type="button"
                      onClick={() => selectSource(source.id)}
                      disabled={excluded}
                      className={cn(
                        "w-full border-l-4 px-5 py-3.5 text-left transition-colors",
                        color.border,
                        active && !excluded ? "bg-muted/50" : "hover:bg-muted/30",
                        excluded && "cursor-not-allowed opacity-45",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", color.dot)}>
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug">{source.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {SOURCE_TYPE_LABELS[source.type]} · {source.words} words{excluded ? " · excluded" : ` · ${count} match${count === 1 ? "" : "es"}`}
                          </p>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className={cn("h-full rounded-full", color.bar)} style={{ width: `${Math.min(100, source.matchPercent * 1.5)}%` }} />
                          </div>
                          {active && !excluded && (
                            <p className="mt-2.5 rounded-md bg-muted/60 p-2.5 font-serif text-xs italic leading-relaxed text-foreground/80">
                              “{source.snippet}”
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-bold tabular-nums">{source.matchPercent}%</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 print:hidden">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Your review</h3>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset", REVIEW_BADGES[review.status])}>
                {REVIEW_LABELS[review.status]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={review.status === "cleared" ? "default" : "outline"}
                onClick={() => decide("cleared")}
                className={cn(review.status === "cleared" && "bg-emerald-600 hover:bg-emerald-700")}
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Clear
              </Button>
              <Button
                variant={review.status === "flagged" ? "default" : "outline"}
                onClick={() => decide("flagged")}
                className={cn(review.status === "flagged" && "bg-red-600 hover:bg-red-700")}
              >
                <Flag className="mr-1.5 h-4 w-4" /> Flag
              </Button>
            </div>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") saveNote();
              }}
              rows={3}
              placeholder="Private note, e.g. quotes are cited; spoke with the student on Monday."
              className="mt-3 text-sm"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                {review.reviewedAt ? `Updated ${format(new Date(review.reviewedAt), "MMM d, h:mm a")}` : "Not reviewed yet"}
              </span>
              <div className="flex gap-1">
                {review.status !== "needs-review" && (
                  <Button variant="ghost" size="sm" onClick={() => decide("needs-review")}>
                    <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={saveNote} disabled={note.trim() === review.note}>
                  Save note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}
