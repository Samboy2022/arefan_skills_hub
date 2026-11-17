"use client";

import { use, useState, useRef } from "react";
import {
  ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle,
  Award, Paperclip, Download, X, BookOpen, Calendar, PenLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, formLabelClass } from "@/lib/student-ui";
import { FormSection } from "@/components/student/form-section";
import { StudentTip } from "@/components/student/tip";

const categoryLabel = (c: string) =>
  ({ course: "Course Assignment", module: "Module Assignment", lesson: "Lesson Assignment" })[c] ?? "Assignment";

const categoryColor = (c: string) =>
  ({
    course: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400",
    module: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400",
    lesson: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  })[c] ?? "";

const getStatusInfo = (s: string) => ({
  graded:    { label: "Graded",       cls: "text-emerald-700 dark:text-emerald-400", icon: <CheckCircle className="h-4 w-4" /> },
  submitted: { label: "Under Review", cls: "text-blue-700 dark:text-blue-400",       icon: <Clock className="h-4 w-4" /> },
  pending:   { label: "Pending",      cls: "text-amber-700 dark:text-amber-400",     icon: <AlertCircle className="h-4 w-4" /> },
  late:      { label: "Late",         cls: "text-orange-700 dark:text-orange-400",   icon: <AlertCircle className="h-4 w-4" /> },
  missing:   { label: "Missing",      cls: "text-red-700 dark:text-red-400",         icon: <AlertCircle className="h-4 w-4" /> },
})[s] ?? { label: s, cls: "text-muted-foreground", icon: null };

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignment = STUDENT_ASSIGNMENTS.find(a => a.id === id);
  const course = STUDENT_COURSES.find(c => c.id === assignment?.course_id);

  const [answerText, setAnswerText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!assignment) {
    return (
      <div className={emptyStateClass}>
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className={emptyTitleClass}>Assignment not found</h2>
        <p className={emptyBodyClass}>This assignment may have been removed, or the link is incorrect.</p>
        <Button variant="outline" className="mt-6 gap-1.5" asChild>
          <Link href="/student/assignments"><ArrowLeft className="h-4 w-4" /> Back to assignments</Link>
        </Button>
      </div>
    );
  }

  const isPending = assignment.status === "pending";
  const isGraded = assignment.status === "graded" || assignment.status === "late";
  const isAlreadySubmitted = assignment.status === "submitted" || isGraded;
  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date() && isPending;
  const statusInfo = getStatusInfo(assignment.status);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!answerText.trim() && !uploadedFile) return;
    setIsSubmitted(true);
  };

  const sectionTitle = "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3";
  const backButton = (
    <Button variant="ghost" className="-ml-2 gap-1.5" asChild>
      <Link href="/student/assignments"><ArrowLeft className="h-4 w-4" /> Back to Assignments</Link>
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <Breadcrumb
        items={[
          { label: "Assignments", href: "/student/assignments" },
          { label: assignment.title },
        ]}
      />

      <Card className="gap-0 py-0 overflow-hidden rounded-2xl border-border shadow-none">
        {/* ── Header ── */}
        <div className="px-5 py-6 sm:px-8 border-b border-border">
          <span className={cn("inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mb-3", categoryColor(assignment.category))}>
            {categoryLabel(assignment.category)}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1.5">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground flex items-start gap-1.5">
            <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{course?.name} — {assignment.target_name}</span>
          </p>
        </div>

        {/* ── Key details ── */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 divide-border border-b border-border bg-muted/30 [&>div]:px-5 [&>div]:py-4 sm:[&>div]:px-6 [&>div:nth-child(odd)]:border-r sm:[&>div:not(:last-child)]:border-r [&>div:nth-child(-n+2)]:border-b sm:[&>div:nth-child(-n+2)]:border-b-0">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Award className="h-3.5 w-3.5" /> Marks</dt>
            <dd className="text-sm font-semibold">
              {isGraded && assignment.points_earned !== null ? (
                <span className="text-emerald-600 dark:text-emerald-400">{assignment.points_earned} / {assignment.total_points} pts</span>
              ) : (
                <span className="text-foreground">{assignment.total_points} pts</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Calendar className="h-3.5 w-3.5" /> Deadline</dt>
            <dd className={cn("text-sm font-semibold", isOverdue ? "text-red-600 dark:text-red-400" : "text-foreground")}>
              {format(dueDate, "MMM dd, yyyy")}
              <span className="block text-xs font-normal text-muted-foreground">{format(dueDate, "h:mm a")}</span>
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Clock className="h-3.5 w-3.5" /> Status</dt>
            <dd className={cn("flex items-center gap-1.5 text-sm font-semibold", statusInfo.cls)}>
              {statusInfo.icon}{statusInfo.label}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Paperclip className="h-3.5 w-3.5" /> Attachment</dt>
            <dd className={cn("text-sm font-semibold", assignment.has_attachment ? "text-primary" : "text-muted-foreground")}>
              {assignment.has_attachment ? "Available" : "None"}
            </dd>
          </div>
        </dl>

        {/* ── Body ── */}
        <div className="px-5 py-6 sm:px-8 space-y-7">
          {/* Assignment Question / Description */}
          <section>
            <h2 className={sectionTitle}>Assignment Question</h2>
            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <p className="text-sm text-foreground leading-relaxed">{assignment.description}</p>
              {assignment.has_attachment && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="gap-2 bg-card">
                    <Download className="h-4 w-4" /> Download Attachment
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Submission Area */}
          {(isPending || isSubmitted) && !isAlreadySubmitted ? (
            isSubmitted ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Assignment Submitted</p>
                  <p className="text-xs text-muted-foreground">Your answer has been submitted successfully and is now under review.</p>
                </div>
              </div>
            ) : (
              <FormSection icon={PenLine} title="Your answer" hint="Write your response and attach a file if the brief asks for one." className="p-0 sm:p-0 border-0 bg-transparent">
                <StudentTip>
                  PDF, DOCX or ZIP, up to 10MB. Submit before the deadline — late work may lose marks.
                </StudentTip>

                {isOverdue && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-900/10">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    <p className="text-red-700 dark:text-red-400">
                      <strong>Overdue:</strong> This assignment is past its deadline. Late submissions may receive a reduced score.
                    </p>
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="answer" className={cn(formLabelClass, "mb-1.5 block")}>
                      Written response
                    </label>
                    <Textarea
                      id="answer"
                      value={answerText}
                      onChange={e => setAnswerText(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[180px] resize-y bg-background px-3 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className={cn(formLabelClass, "mb-1.5 block")}>
                      Supporting document <span className="text-xs font-normal text-muted-foreground">Optional</span>
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.zip,.png,.jpg"
                    />
                    {uploadedFile ? (
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-3">
                        <div className="flex min-w-0 items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate font-medium text-foreground">{uploadedFile.name}</span>
                          <span className="shrink-0 text-muted-foreground">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button onClick={() => setUploadedFile(null)} aria-label="Remove file" className="p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:flex-row"
                      >
                        <Upload className="h-4 w-4" />
                        Click to upload a file (PDF, DOCX, ZIP — max 10MB)
                      </button>
                    )}
                  </div>
                </div>
              </FormSection>
            )
          ) : isAlreadySubmitted ? (
            /* Already Submitted View */
            <section className="space-y-7">
              <div>
                <h2 className={sectionTitle}>Your Submission</h2>
                <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">Assignment_Solution.pdf</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {assignment.submission_date
                            ? format(new Date(assignment.submission_date), "MMM dd, yyyy 'at' h:mm a")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Download submission">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Grade row */}
                  {isGraded && assignment.grade !== null && (
                    <div className="flex items-center justify-between px-5 py-4 bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-foreground">Final Grade</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{assignment.grade}%</p>
                        <p className="text-xs text-muted-foreground">{assignment.points_earned} / {assignment.total_points} pts</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructor Feedback */}
              {assignment.feedback && (
                <div>
                  <h2 className={sectionTitle}>Instructor Feedback</h2>
                  <div className="rounded-2xl border border-border bg-muted/20 p-5">
                    <p className="text-sm text-foreground leading-relaxed">{assignment.feedback}</p>
                  </div>
                </div>
              )}
            </section>
          ) : (
            /* Missing — no submission possible */
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Submission Window Closed</p>
                <p className="text-xs text-muted-foreground">The deadline has passed and submission is no longer accepted for this assignment.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {backButton}
          {isPending && !isSubmitted && !isAlreadySubmitted && (
            <Button
              onClick={handleSubmit}
              disabled={!answerText.trim() && !uploadedFile}
              className="gap-2 px-6"
            >
              <Upload className="h-4 w-4" /> Submit Assignment
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
