"use client";

import { use } from "react";
import { Play, CheckCircle, HelpCircle, Timer, Target, Award, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

const categoryLabel = (c: string) => ({ course: "Course Quiz", module: "Module Quiz", lesson: "Lesson Quiz" })[c] ?? "Quiz";
const typeLabel = (t: string) => ({ graded: "Graded", practice: "Practice", ungraded: "Ungraded" })[t] ?? t;
const typeColor = (t: string) => ({
  graded: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  practice: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  ungraded: "bg-muted text-muted-foreground border-border",
})[t] ?? "bg-muted text-muted-foreground border-border";

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);
  const course = STUDENT_COURSES.find(c => c.id === quiz?.course_id);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
        <HelpCircle className="h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Quiz Not Found</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/student/quizzes"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Quizzes</Link>
        </Button>
      </div>
    );
  }

  const isCompleted = quiz.status === "submitted";
  const isInProgress = quiz.status === "in_progress";
  const attemptsLeft = quiz.attempts_allowed - quiz.attempts.length;

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Quizzes", href: "/student/quizzes" },
          { label: quiz.title },
        ]}
      />

      {/* Page Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            {categoryLabel(quiz.category)}
          </span>
          <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", typeColor(quiz.type))}>
            {typeLabel(quiz.type)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {course?.name} — {quiz.target_name}
        </p>
      </div>

      {/* Stat Row */}
      <div className="flex flex-wrap gap-4 py-4 border-y border-border">
        <div className="flex items-center gap-2 text-sm">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Questions:</span>
          <span className="font-semibold text-foreground">{quiz.total_questions}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-semibold text-foreground">{quiz.time_limit} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Attempts:</span>
          <span className="font-semibold text-foreground">{quiz.attempts.length}/{quiz.attempts_allowed} used</span>
        </div>
        {quiz.best_score !== null && (
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-emerald-500" />
            <span className="text-muted-foreground">Best Score:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{quiz.best_score}%</span>
          </div>
        )}
      </div>

      {/* About */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">About this Quiz</h2>
        <p className="text-sm text-foreground leading-relaxed">
          This is a {typeLabel(quiz.type).toLowerCase()} assessment for <strong>{quiz.target_name}</strong>. 
          It consists of {quiz.total_questions} questions and must be completed within the {quiz.time_limit}-minute time limit. 
          You have {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining.
        </p>
      </div>

      {/* Instructions (brief, readable) */}
      <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Before you begin</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> The timer starts the moment you click <strong className="text-foreground">Continue</strong> on the next screen and cannot be paused.</li>
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> You can navigate freely between questions using the Question Navigator.</li>
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> Submit only when you've finished reviewing all your answers.</li>
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> Switching tabs or windows may be flagged as a policy violation.</li>
        </ul>
      </div>

      {/* CTA */}
      <div>
        {isCompleted ? (
          <div className="flex items-center justify-between p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-foreground">Quiz Completed</p>
                <p className="text-xs text-muted-foreground">You have already submitted this quiz.</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Award className="h-4 w-4 mr-2" /> View Results
            </Button>
          </div>
        ) : (
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href={`/student/quizzes/${quiz.id}/instructions`}>
              <Play className="h-4 w-4 mr-2 fill-current" />
              {isInProgress ? "Continue Quiz" : "Take Quiz"}
            </Link>
          </Button>
        )}
      </div>

      {/* Attempt History */}
      {quiz.attempts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Attempt History
          </h2>
          <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
            {quiz.attempts.map((attempt, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/20 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">Attempt {attempt.attempt_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(attempt.date_attempted), "MMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("text-lg font-bold", attempt.score >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
                    {attempt.score}%
                  </p>
                  <p className="text-xs text-muted-foreground">{attempt.score >= 70 ? "Passed" : "Failed"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
