"use client";

import { use } from "react";
import { Play, CheckCircle, HelpCircle, Timer, Target, Award, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { detailCardClass, detailFooterClass, detailSectionClass, detailWrapClass, emptyBodyClass, emptyStateClass, emptyTitleClass, pillClass, sectionTitleClass } from "@/lib/student-ui";

const categoryLabel = (c: string) => ({ course: "Course Quiz", module: "Module Quiz", lesson: "Lesson Quiz" })[c] ?? "Quiz";
const typeLabel = (t: string) => ({ graded: "Graded", practice: "Practice", ungraded: "Ungraded" })[t] ?? t;
const typeColor = (t: string) => ({
  graded: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  practice: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",
  ungraded: "bg-muted text-muted-foreground border-border",
})[t] ?? "bg-muted text-muted-foreground border-border";

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);
  const course = STUDENT_COURSES.find(c => c.id === quiz?.course_id);

  if (!quiz) {
    return (
      <div className={emptyStateClass}>
        <HelpCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className={emptyTitleClass}>Quiz not found</h2>
        <p className={emptyBodyClass}>This quiz may have been removed, or the link is incorrect.</p>
        <Button variant="outline" className="mt-6 gap-1.5" asChild>
          <Link href="/student/quizzes"><ArrowLeft className="h-4 w-4" /> Back to quizzes</Link>
        </Button>
      </div>
    );
  }

  const isCompleted = quiz.status === "submitted";
  const isInProgress = quiz.status === "in_progress";
  const attemptsLeft = quiz.attempts_allowed - quiz.attempts.length;

  return (
    <div className={detailWrapClass}>
      <Breadcrumb
        items={[
          { label: "Quizzes", href: "/student/quizzes" },
          { label: quiz.title },
        ]}
      />

      <Card className={detailCardClass}>
        {/* ── Header ── */}
        <div className={cn(detailSectionClass, "border-b border-border")}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {categoryLabel(quiz.category)}
            </span>
            <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", typeColor(quiz.type))}>
              {typeLabel(quiz.type)}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1.5">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground flex items-start gap-1.5">
            <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{course?.name} — {quiz.target_name}</span>
          </p>
        </div>

        {/* ── Key details ── */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-muted/30 [&>div]:px-5 [&>div]:py-4 sm:[&>div]:px-6 [&>div:nth-child(odd)]:border-r sm:[&>div:not(:last-child)]:border-r [&>div:nth-child(-n+2)]:border-b sm:[&>div:nth-child(-n+2)]:border-b-0 [&>div]:border-border">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><HelpCircle className="h-3.5 w-3.5" /> Questions</dt>
            <dd className="text-sm font-semibold text-foreground">{quiz.total_questions}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Timer className="h-3.5 w-3.5" /> Duration</dt>
            <dd className="text-sm font-semibold text-foreground">{quiz.time_limit} min</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Target className="h-3.5 w-3.5" /> Attempts</dt>
            <dd className="text-sm font-semibold text-foreground">{quiz.attempts.length}/{quiz.attempts_allowed} used</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Award className="h-3.5 w-3.5" /> Best Score</dt>
            <dd className={cn("text-sm font-semibold", quiz.best_score !== null ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
              {quiz.best_score !== null ? `${quiz.best_score}%` : "—"}
            </dd>
          </div>
        </dl>

        {/* ── Body ── */}
        <div className={cn(detailSectionClass, "space-y-7")}>
          <section>
            <h2 className={sectionTitleClass}>About this Quiz</h2>
            <p className="text-sm text-foreground leading-relaxed">
              This is a {typeLabel(quiz.type).toLowerCase()} assessment for <strong>{quiz.target_name}</strong>.
              It consists of {quiz.total_questions} questions and must be completed within the {quiz.time_limit}-minute time limit.
              You have {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Before you begin</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> <span>The timer starts the moment you click <strong className="text-foreground">Continue</strong> on the next screen and cannot be paused.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> <span>You can navigate freely between questions using the Question Navigator.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> <span>Submit only when you&apos;ve finished reviewing all your answers.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> <span>Switching tabs or windows may be flagged as a policy violation.</span></li>
            </ul>
          </section>

          {isCompleted && (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Quiz Completed</p>
                <p className="text-xs text-muted-foreground">You have already submitted this quiz.</p>
              </div>
            </div>
          )}

          {/* Attempt History */}
          {quiz.attempts.length > 0 && (
            <section>
              <h2 className={cn(sectionTitleClass, "flex items-center gap-2")}>
                <Calendar className="h-4 w-4" /> Attempt History
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                {quiz.attempts.map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">Attempt {attempt.attempt_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(attempt.date_attempted), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={pillClass(attempt.score >= 70 ? "success" : "danger")}>
                        {attempt.score >= 70 ? "Passed" : "Failed"}
                      </span>
                      <p className={cn("text-lg font-bold tabular-nums", attempt.score >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
                        {attempt.score}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className={detailFooterClass}>
          <Button variant="outline" className="gap-1.5" asChild>
            <Link href="/student/quizzes"><ArrowLeft className="h-4 w-4" /> Back to Quizzes</Link>
          </Button>
          {isCompleted ? (
            <Button variant="outline" className="gap-2 px-6">
              <Award className="h-4 w-4" /> View Results
            </Button>
          ) : (
            <Button asChild className="gap-2 px-6">
              <Link href={`/student/quizzes/${quiz.id}/instructions`}>
                <Play className="h-4 w-4 fill-current" />
                {isInProgress ? "Continue Quiz" : "Take Quiz"}
              </Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
