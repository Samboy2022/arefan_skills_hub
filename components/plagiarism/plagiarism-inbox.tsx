"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ChevronRight, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  REVIEW_LABELS,
  RISK_STYLES,
  RiskBand,
  ReviewStatus,
  SOURCE_TYPE_LABELS,
  reviewFor,
  riskBand,
  sourceColor,
} from "@/lib/plagiarism";
import { ScoreRing } from "@/components/plagiarism/score-ring";
import { RunCheckDialog } from "@/components/plagiarism/run-check-dialog";
import { useReports } from "@/components/plagiarism/use-reports";
import { useReviews } from "@/components/plagiarism/use-reviews";

type StatusFilter = "all" | ReviewStatus;
type Sort = "score" | "newest" | "student";

export const REVIEW_BADGES: Record<ReviewStatus, string> = {
  "needs-review": "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400",
  cleared: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  flagged: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400",
};

export function PlagiarismInbox({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionParam = searchParams.get("submission");
  const { reports } = useReports();
  const reviews = useReviews();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [risk, setRisk] = useState<"all" | RiskBand>("all");
  const [course, setCourse] = useState("all");
  const [sort, setSort] = useState<Sort>("score");
  const [checkOpen, setCheckOpen] = useState(false);
  const [seedSubmission, setSeedSubmission] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionParam) return;
    setSeedSubmission(submissionParam);
    setCheckOpen(true);
    router.replace(basePath, { scroll: false });
  }, [submissionParam, basePath, router]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const courses = useMemo(() => Array.from(new Set(reports.map((report) => report.courseTitle))), [reports]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = reports.filter((report) => {
      if (q && !`${report.studentName} ${report.assignmentTitle} ${report.courseTitle}`.toLowerCase().includes(q)) return false;
      if (status !== "all" && reviewFor(reviews, report.id).status !== status) return false;
      if (risk !== "all" && riskBand(report.similarity) !== risk) return false;
      if (course !== "all" && report.courseTitle !== course) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "newest") return b.submittedAt.localeCompare(a.submittedAt);
      if (sort === "student") return a.studentName.localeCompare(b.studentName);
      return b.similarity - a.similarity;
    });
  }, [query, status, risk, course, sort, reviews, reports]);

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = { all: reports.length, "needs-review": 0, cleared: 0, flagged: 0 };
    reports.forEach((report) => {
      result[reviewFor(reviews, report.id).status] += 1;
    });
    return result;
  }, [reviews, reports]);

  const average = Math.round(
    reports.reduce((sum, report) => sum + report.similarity, 0) / Math.max(1, reports.length),
  );
  const high = reports.filter((report) => riskBand(report.similarity) === "high").length;

  const stats = [
    { icon: "https://img.icons8.com/scribby/96/book.png", label: "Reports", value: reports.length, tone: "text-foreground" },
    { icon: "https://img.icons8.com/scribby/96/line-chart.png", label: "Avg. similarity", value: `${average}%`, tone: "text-primary" },
    { icon: "https://img.icons8.com/scribby/96/error.png", label: "High similarity", value: high, tone: "text-red-600 dark:text-red-400" },
    { icon: "https://img.icons8.com/scribby/96/search.png", label: "Needs review", value: counts["needs-review"], tone: "text-sky-600 dark:text-sky-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setSeedSubmission(null); setCheckOpen(true); }}>Run check</Button>
      </div>
      <RunCheckDialog
        open={checkOpen}
        onOpenChange={setCheckOpen}
        basePath={basePath}
        initialSubmissionId={seedSubmission}
      />
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 px-4 py-5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center gap-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stat.icon} alt="" className="h-11 w-11" />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className={cn("text-3xl font-extrabold leading-none", stat.tone)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Run a check on a submitted document, or upload one. A similarity score is a prompt to read the work closely, never a
          verdict on its own. The writing-pattern percentage is the same kind of signal.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1 sm:w-fit">
          {(["all", "needs-review", "flagged", "cleared"] as StatusFilter[]).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setStatus(entry)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                status === entry ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry === "all" ? "All" : REVIEW_LABELS[entry]}
              <span className="rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">{counts[entry]}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student, assignment, or course"
              className="pl-9 pr-10"
            />
            <Kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</Kbd>
          </div>
          <Select value={risk} onValueChange={(value) => setRisk(value as "all" | RiskBand)}>
            <SelectTrigger className="w-full md:w-[160px]" aria-label="Filter by similarity"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any similarity</SelectItem>
              <SelectItem value="high">High (40%+)</SelectItem>
              <SelectItem value="moderate">Moderate (15–39%)</SelectItem>
              <SelectItem value="low">Low (under 15%)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-full md:w-[220px]" aria-label="Filter by course"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
            <SelectTrigger className="w-full md:w-[170px]" aria-label="Sort"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Highest similarity</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="student">Student A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 py-14 text-center">
          <p className="font-semibold">No reports match</p>
          <p className="mt-1 text-sm text-muted-foreground">Change the status tab or clear a filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1fr)_120px_120px_24px] gap-4 border-b border-border bg-muted/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground lg:grid">
            <span>Score</span>
            <span>Submission</span>
            <span>Top source</span>
            <span>Submitted</span>
            <span>Status</span>
            <span />
          </div>
          <ul className="divide-y divide-border">
            {visible.map((report) => {
              const band = RISK_STYLES[riskBand(report.similarity)];
              const review = reviewFor(reviews, report.id);
              const top = report.sources[0];
              return (
                <li key={report.id}>
                  <Link
                    href={`${basePath}/${report.id}`}
                    className="group grid grid-cols-[56px_minmax(0,1fr)_24px] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30 lg:grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1fr)_120px_120px_24px]"
                  >
                    <ScoreRing score={report.similarity} size={52} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-foreground group-hover:text-primary">{report.studentName}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", band.badge)}>
                          {band.label}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {report.assignmentTitle} · {report.courseTitle}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {report.fileName ? report.fileName : report.origin === "upload" ? "Uploaded file" : "Submitted work"}
                        {typeof report.aiWriting === "number" ? ` · writing pattern ${report.aiWriting}%` : ""}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 lg:hidden">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", REVIEW_BADGES[review.status])}>
                          {REVIEW_LABELS[review.status]}
                        </span>
                        <span className="text-xs text-muted-foreground">{format(new Date(report.submittedAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <div className="hidden min-w-0 lg:block">
                      {top ? (
                        <>
                          <p className="flex items-center gap-2 truncate text-sm font-medium">
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", sourceColor(report, top.id).dot)} />
                            <span className="truncate">{top.title}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {SOURCE_TYPE_LABELS[top.type]} · {top.matchPercent}% · {report.sources.length} source{report.sources.length === 1 ? "" : "s"}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No matches</p>
                      )}
                    </div>
                    <span className="hidden text-sm text-muted-foreground lg:block">{format(new Date(report.submittedAt), "MMM d, yyyy")}</span>
                    <span className="hidden lg:block">
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", REVIEW_BADGES[review.status])}>
                        {REVIEW_LABELS[review.status]}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
