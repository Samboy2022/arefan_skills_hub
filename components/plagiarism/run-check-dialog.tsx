"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_CHECK_OPTIONS, CheckOptions, saveStoredReport } from "@/lib/plagiarism";
import { candidateById, submissionCandidates } from "@/lib/plagiarism-documents";
import { DocumentReadError, extractDocumentText } from "@/lib/plagiarism-files";
import { newIdempotencyKey, plagiarismServiceStatus, runPlagiarismCheck } from "@/lib/plagiarism-client";

type Mode = "submission" | "upload";

const STEPS = ["Reading the document", "Sending it to the checker", "Comparing indexed sources"];

export function RunCheckDialog({
  open,
  onOpenChange,
  basePath,
  initialSubmissionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basePath: string;
  initialSubmissionId?: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const candidates = useMemo(() => submissionCandidates(), []);
  const [mode, setMode] = useState<Mode>("submission");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [options, setOptions] = useState<CheckOptions>(DEFAULT_CHECK_OPTIONS);
  const [provider, setProvider] = useState<"built-in" | "external">("built-in");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selected = candidates.find((row) => row.submissionId === selectedId) ?? null;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setText(null);
    setFileName(null);
    plagiarismServiceStatus().then(setProvider).catch(() => setProvider("built-in"));
    if (!initialSubmissionId) {
      setSelectedId(null);
      setMode("submission");
      setStudentName("");
      setAssignmentTitle("");
      setCourseTitle("");
      return;
    }
    const row = candidateById(initialSubmissionId);
    if (!row) return;
    setSelectedId(row.submissionId);
    setMode(row.checkable ? "submission" : "upload");
    if (!row.checkable) {
      setStudentName(row.studentName);
      setAssignmentTitle(row.assignmentTitle);
      setCourseTitle(row.courseTitle);
    }
  }, [open, initialSubmissionId]);

  const visible = candidates.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${row.studentName} ${row.assignmentTitle} ${row.courseTitle} ${row.documentFiles.join(" ")}`.toLowerCase().includes(q);
  });

  async function takeFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setFileName(file.name);
    setText(null);
    try {
      const extracted = await extractDocumentText(file);
      setText(extracted);
      setFileName(file.name);
    } catch (caught) {
      setFileName(null);
      setError(caught instanceof DocumentReadError ? caught.message : "That file could not be read.");
    }
  }

  async function run() {
    if (running) return;
    setError(null);
    if (!options.internet && !options.studentPapers && !options.publications) {
      setError("Choose at least one place to search.");
      return;
    }

    let payloadText: string | undefined;
    let payloadFile = fileName ?? "";
    let submissionId: string | undefined;
    let origin: Mode = mode;

    if (mode === "submission") {
      if (!selected?.checkable) {
        setError("Choose a submission that includes a document.");
        return;
      }
      submissionId = selected.submissionId;
      payloadFile = fileName && text ? fileName : selected.documentFiles[0];
      payloadText = text ?? undefined;
      origin = "submission";
    } else {
      if (!text || !fileName) {
        setError("Upload a PDF, Word, text, RTF, or OpenDocument file.");
        return;
      }
      payloadText = text;
      payloadFile = fileName;
      origin = "upload";
    }

    setRunning(true);
    setStep(payloadText ? 1 : 0);
    const key = newIdempotencyKey();
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, STEPS.length - 1)), 700);
    try {
      const report = await runPlagiarismCheck({
        submissionId,
        fileName: payloadFile,
        text: payloadText,
        studentName: mode === "upload" ? studentName : undefined,
        assignmentTitle: mode === "upload" ? assignmentTitle : undefined,
        courseTitle: mode === "upload" ? courseTitle : undefined,
        origin,
        options,
        reportId: submissionId,
        idempotencyKey: key,
      });
      saveStoredReport(report);
      toast.success("Similarity report is ready", {
        description: `${report.studentName} · ${report.similarity}% overlap`,
      });
      onOpenChange(false);
      router.push(`${basePath}/${report.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The check could not be completed.");
    } finally {
      window.clearInterval(timer);
      setRunning(false);
      setStep(0);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !running && onOpenChange(next)}>
      <DialogContent className="flex max-h-[min(90vh,820px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>Run a plagiarism check</DialogTitle>
          <DialogDescription>
            Check a document the student already submitted, or upload a PDF, Word, or text file yourself.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {provider === "external"
              ? "Checks are sent to the connected plagiarism service. A score is an overlap to read, not a verdict."
              : "Checks run on the built-in comparison until a plagiarism service URL is connected. A score is an overlap to read, not a verdict."}
          </p>

          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submission">Submitted document</TabsTrigger>
              <TabsTrigger value="upload">Upload a file</TabsTrigger>
            </TabsList>
            <TabsContent value="submission" className="mt-4 space-y-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search student, assignment, or file"
                aria-label="Search submissions"
              />
              <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {visible.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">No submissions match.</li>
                ) : (
                  visible.map((row) => (
                    <li key={row.submissionId}>
                      <button
                        type="button"
                        disabled={!row.checkable}
                        onClick={() => {
                          setSelectedId(row.submissionId);
                          setText(null);
                          setFileName(null);
                          setError(null);
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 px-3 py-2.5 text-left",
                          row.checkable ? "hover:bg-muted/50" : "cursor-not-allowed opacity-60",
                          selectedId === row.submissionId && row.checkable && "bg-primary/5",
                        )}
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{row.studentName}</span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {format(new Date(row.submittedAt), "MMM d, yyyy")}
                            </span>
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {row.assignmentTitle} · {row.courseTitle}
                          </span>
                          <span className={cn("mt-0.5 block text-xs", row.checkable ? "text-foreground/80" : "text-amber-700 dark:text-amber-400")}>
                            {row.checkable ? row.reason : row.reason}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
              {selected?.checkable && (
                <p className="text-xs text-muted-foreground">
                  The checker uses {selected.documentFiles.join(", ")}. Upload a different copy below only if you want to
                  replace the text that is already on the submission.
                </p>
              )}
              {selected?.checkable && <FileDrop fileName={fileName} words={text ? text.trim().split(/\s+/).length : null} inputRef={inputRef} onFile={takeFile} optional />}
            </TabsContent>
            <TabsContent value="upload" className="mt-4 space-y-4">
              <FileDrop fileName={fileName} words={text ? text.trim().split(/\s+/).length : null} inputRef={inputRef} onFile={takeFile} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Student name" value={studentName} onChange={setStudentName} placeholder="Optional" />
                <Field label="Course" value={courseTitle} onChange={setCourseTitle} placeholder="Optional" />
                <div className="sm:col-span-2">
                  <Field label="Assignment" value={assignmentTitle} onChange={setAssignmentTitle} placeholder="Optional" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3 rounded-xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Where to search</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Option label="Internet" checked={options.internet} onChange={(internet) => setOptions({ ...options, internet })} />
              <Option label="Student papers" checked={options.studentPapers} onChange={(studentPapers) => setOptions({ ...options, studentPapers })} />
              <Option label="Publications" checked={options.publications} onChange={(publications) => setOptions({ ...options, publications })} />
            </div>
            <p className="pt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Leave out of the score</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Option
                label="Bibliography"
                checked={options.excludeBibliography}
                onChange={(excludeBibliography) => setOptions({ ...options, excludeBibliography })}
              />
              <Option label="Quotations" checked={options.excludeQuotes} onChange={(excludeQuotes) => setOptions({ ...options, excludeQuotes })} />
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Ignore matches of</span>
              <select
                value={options.smallMatchWords}
                onChange={(event) => setOptions({ ...options, smallMatchWords: Number(event.target.value) })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Ignore short matches"
              >
                <option value={0}>any length</option>
                <option value={5}>5 words or fewer</option>
                <option value={8}>8 words or fewer</option>
                <option value={12}>12 words or fewer</option>
              </select>
            </label>
          </div>

          {running && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                {STEPS[step]}
              </div>
              <Progress value={((step + 1) / STEPS.length) * 100} />
            </div>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={running}>
            Cancel
          </Button>
          <Button type="button" onClick={run} disabled={running}>
            {running ? "Checking…" : "Run check"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FileDrop({
  fileName,
  words,
  inputRef,
  onFile,
  optional,
}: {
  fileName: string | null;
  words: number | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File | undefined) => void;
  optional?: boolean;
}) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onFile(event.dataTransfer.files?.[0]);
      }}
      className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5 text-center"
    >
      <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
      <p className="mt-2 text-sm font-medium">{fileName ?? (optional ? "Replace with another document" : "Drop a document here")}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {words != null ? `${words.toLocaleString()} words read` : "PDF, DOCX, TXT, RTF, ODT, or MD · up to 8 MB"}
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => inputRef.current?.click()}>
        Browse
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={(event) => {
          onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Option({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
