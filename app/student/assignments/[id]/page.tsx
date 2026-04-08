"use client";

import { use, useState, useRef } from "react";
import {
  ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle,
  Award, Paperclip, Download, X, BookOpen, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Assignment Not Found</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/student/assignments"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Link>
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

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Assignments", href: "/student/assignments" },
          { label: assignment.title },
        ]}
      />

      {/* Page Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", categoryColor(assignment.category))}>
            {categoryLabel(assignment.category)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{assignment.title}</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {course?.name} — {assignment.target_name}
        </p>
      </div>

      {/* Stat Row */}
      <div className="flex flex-wrap gap-6 py-4 border-y border-border">
        <div className="flex items-center gap-2 text-sm">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Marks:</span>
          {isGraded && assignment.points_earned !== null ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {assignment.points_earned} / {assignment.total_points} pts
            </span>
          ) : (
            <span className="font-semibold text-foreground">{assignment.total_points} pts</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deadline:</span>
          <span className={cn("font-semibold", isOverdue ? "text-red-600 dark:text-red-400" : "text-foreground")}>
            {format(dueDate, "MMM dd, yyyy")} at {format(dueDate, "h:mm a")}
          </span>
        </div>
        <div className={cn("flex items-center gap-2 text-sm", statusInfo.cls)}>
          {statusInfo.icon}
          <span className="font-semibold">{statusInfo.label}</span>
        </div>
        {assignment.has_attachment && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Paperclip className="h-4 w-4" />
            <span className="font-semibold">Attachment Available</span>
          </div>
        )}
      </div>

      {/* Assignment Question / Description */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Assignment Question</h2>
        <div className="rounded-lg border border-border bg-muted/20 p-5">
          <p className="text-sm text-foreground leading-relaxed">{assignment.description}</p>
          {assignment.has_attachment && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download Attachment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Submission Area */}
      {(isPending || isSubmitted) && !isAlreadySubmitted ? (
        isSubmitted ? (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Assignment Submitted</p>
              <p className="text-xs text-muted-foreground">Your answer has been submitted successfully and is now under review.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Answer</h2>

            {isOverdue && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 text-sm">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-700 dark:text-red-400">
                  <strong>Overdue:</strong> This assignment is past its deadline. Late submissions may receive a reduced score.
                </p>
              </div>
            )}

            {/* Text Answer */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Enter your answer below
              </label>
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[180px] resize-y text-sm"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Supporting document (optional)
              </label>
              <input
                ref={fileRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{uploadedFile.name}</span>
                    <span className="text-muted-foreground">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-muted/20 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Click Browse to upload a file (PDF, DOCX, ZIP — max 10MB)
                </button>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/assignments"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Link>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!answerText.trim() && !uploadedFile}
                className="gap-2"
              >
                <Upload className="h-4 w-4" /> Submit Assignment
              </Button>
            </div>
          </div>
        )
      ) : isAlreadySubmitted ? (
        /* Already Submitted View */
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Submission</h2>

          <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Assignment_Solution.pdf</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {assignment.submission_date
                      ? format(new Date(assignment.submission_date), "MMM dd, yyyy 'at' h:mm a")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
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

          {/* Instructor Feedback */}
          {assignment.feedback && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Instructor Feedback</h2>
              <div className="rounded-lg border border-border bg-muted/20 p-5">
                <p className="text-sm text-foreground leading-relaxed">{assignment.feedback}</p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <Button variant="outline" size="sm" asChild>
              <Link href="/student/assignments"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Assignments</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Missing — no submission possible */
        <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Submission Window Closed</p>
            <p className="text-xs text-muted-foreground">The deadline has passed and submission is no longer accepted for this assignment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
