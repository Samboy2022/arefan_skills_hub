"use client";

import { use } from "react";
import { ArrowLeft, Play, AlertCircle, Clock, HelpCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { detailCardClass, detailFooterClass, detailSectionClass, detailWrapClass, sectionTitleClass } from "@/lib/student-ui";

export default function QuizInstructionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);
  const course = STUDENT_COURSES.find(c => c.id === quiz?.course_id);

  if (!quiz) return null;

  return (
    <div className={detailWrapClass}>
      <Breadcrumb
        items={[
          { label: "Quizzes", href: "/student/quizzes" },
          { label: quiz.title, href: `/student/quizzes/${quiz.id}` },
          { label: "Instructions" },
        ]}
      />

      <Card className={detailCardClass}>
      {/* Header */}
      <div className={cn(detailSectionClass, "border-b border-border")}>
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 mb-3">{course?.code}</span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Read the instructions carefully before starting.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 border-b border-border bg-muted/30 divide-x divide-border">
        <div className="px-3 py-4 text-center">
          <HelpCircle className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-xl font-bold text-foreground">{quiz.total_questions}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Questions</p>
        </div>
        <div className="px-3 py-4 text-center">
          <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-xl font-bold text-foreground">{quiz.time_limit}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Minutes</p>
        </div>
        <div className="px-3 py-4 text-center">
          <Target className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-xl font-bold text-foreground">{quiz.attempts_allowed - quiz.attempts.length}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Attempts Left</p>
        </div>
      </div>

      <div className={cn(detailSectionClass, "space-y-7")}>
      {/* Instructions */}
      <section>
        <h2 className={sectionTitleClass}>Instructions</h2>
        <ol className="space-y-4">
          {[
            {
              title: "Timer Starts Immediately",
              body: `You will have ${quiz.time_limit} minutes once you click "Continue." The timer cannot be paused or reset for any reason.`,
            },
            {
              title: "Answer All Questions",
              body: `There are ${quiz.total_questions} questions. Each question may carry different point values — check the indicator on each question.`,
            },
            {
              title: "Navigate Freely",
              body: "Use the Next/Previous buttons or click any number in the Question Navigator panel to jump between questions.",
            },
            {
              title: "Submit When Ready",
              body: "Once submitted, your answers are final. Review your selections before clicking Submit.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800/50 dark:bg-amber-900/10">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-800 dark:text-amber-300">
          <strong>Academic Integrity:</strong> By proceeding, you confirm you will complete this assessment independently. Switching browser tabs may be flagged.
        </p>
      </div>

      </div>

      {/* Actions */}
      <div className={detailFooterClass}>
        <Button variant="outline" className="gap-1.5" asChild>
          <Link href={`/student/quizzes/${quiz.id}`}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <Button className="gap-2 px-8" asChild>
          <Link href={`/student/quizzes/${quiz.id}/take`}>
            Continue <Play className="h-4 w-4 fill-current" />
          </Link>
        </Button>
      </div>
      </Card>
    </div>
  );
}
