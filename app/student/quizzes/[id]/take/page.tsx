"use client";

import { use, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDENT_QUIZZES } from "@/lib/student-mock-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ total_points: 0, earned_points: 0, percentage: 0 });

  useEffect(() => {
    if (quiz && !isSubmitted) {
      if (timeLeft === 0) setTimeLeft(quiz.time_limit * 60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timer); submitQuiz(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, isSubmitted]);

  if (!quiz || !quiz.questions) {
    return <div className="p-8 text-center text-muted-foreground">Quiz data not available.</div>;
  }

  const handleSelect = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitQuiz = () => {
    let earned = 0, total = 0;
    quiz.questions!.forEach(q => {
      total += q.points;
      if (answers[q.id] === q.correct_option_index) earned += q.points;
    });
    setScore({ total_points: total, earned_points: earned, percentage: Math.round((earned / total) * 100) || 0 });
    setIsSubmitted(true);
  };

  const currentQ = quiz.questions[currentIdx];
  const answered = Object.keys(answers).length;
  const total = quiz.questions.length;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const isLowTime = timeLeft <= 120;

  // ── Grade Analysis View ──────────────────────────────────────────────────
  if (isSubmitted) {
    const passed = score.percentage >= 70;
    const correct = quiz.questions.filter(q => answers[q.id] === q.correct_option_index).length;
    const incorrect = quiz.questions.length - correct;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <Breadcrumb
          items={[
            { label: "Quizzes", href: "/student/quizzes" },
            { label: quiz.title, href: `/student/quizzes/${quiz.id}` },
            { label: "Results" },
          ]}
        />

        {/* Score Hero */}
        <div className="rounded-xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center gap-8">
          {/* Circle Score */}
          <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-border bg-muted/30">
            <span className={cn("text-4xl font-bold", passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
              {score.percentage}%
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              {passed
                ? <CheckCircle className="h-5 w-5 text-emerald-500" />
                : <AlertTriangle className="h-5 w-5 text-amber-500" />}
              <span className={cn("font-bold text-lg", passed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                {passed ? "Passed" : "Not Passed"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Grade Analysis</h1>
            <p className="text-sm text-muted-foreground">{quiz.title}</p>
            <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{score.earned_points}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{score.total_points}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">{incorrect}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Question Review</h2>
          <div className="space-y-3">
            {quiz.questions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.correct_option_index;
              const skipped = answers[q.id] === undefined;
              return (
                <div key={q.id} className={cn(
                  "rounded-lg border-l-4 border border-border bg-card overflow-hidden",
                  isCorrect ? "border-l-emerald-500" : "border-l-red-400"
                )}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between px-5 py-3 gap-4">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                      {q.text}
                    </p>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {isCorrect ? q.points : 0}/{q.points} pts
                    </span>
                  </div>

                  {/* Options */}
                  <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === oIdx;
                      const isRight = q.correct_option_index === oIdx;
                      let cls = "text-muted-foreground border-border bg-muted/20";
                      if (isRight) cls = "text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700";
                      else if (isSelected) cls = "text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700";

                      return (
                        <div key={oIdx} className={cn("flex items-center justify-between px-3 py-2 rounded-md border text-sm", cls)}>
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isRight && <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          {isSelected && !isRight && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                  {skipped && <p className="px-5 pb-3 text-xs font-semibold text-amber-600 dark:text-amber-400">Skipped — no answer provided</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <Button variant="outline" asChild>
            <Link href={`/student/quizzes/${quiz.id}`}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Quiz</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Quiz Taking View ─────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Quizzes", href: "/student/quizzes" },
          { label: quiz.title, href: `/student/quizzes/${quiz.id}` },
          { label: "Take Quiz" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-12rem)] lg:min-h-[600px]">

        {/* ── Left: Question Area ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden min-w-0">

          {/* Quiz Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Question <strong className="text-foreground">{currentIdx + 1}</strong>/{total}
              </span>
              {/* Progress bar */}
              <div className="hidden sm:block w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                />
              </div>
            </div>
            <Button size="sm" onClick={submitQuiz} className="bg-primary/90 hover:bg-primary gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" /> Submit
            </Button>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-secondary/5">
            <div className="max-w-2xl mx-auto">

              {/* Points Badge + Question */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">Question {currentIdx + 1}</span>
                  <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-0.5 bg-muted">
                    {currentQ.points} {currentQ.points === 1 ? "Point" : "Points"}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-foreground leading-relaxed">{currentQ.text}</h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(currentQ.id, idx)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-lg border text-sm font-medium transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border text-muted-foreground"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card">
            <Button
              variant="outline" size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(p => p - 1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">{answered}/{total} answered</span>
            <Button
              variant="outline" size="sm"
              disabled={currentIdx === total - 1}
              onClick={() => setCurrentIdx(p => p + 1)}
            >
              Next <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* ── Right: Timer + Navigator ─────────────────────────── */}
        <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0">

          {/* Timer */}
          <div className={cn(
            "rounded-xl border p-5 text-center",
            isLowTime
              ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
              : "border-border bg-card"
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className={cn("h-4 w-4", isLowTime ? "text-red-500" : "text-muted-foreground")} />
              <span className={cn("text-xs font-bold uppercase tracking-wider", isLowTime ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                Time Remaining
              </span>
            </div>
            <p className={cn("text-3xl font-mono font-bold", isLowTime ? "text-red-600 dark:text-red-400" : "text-foreground")}>
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Navigator */}
          <div className="rounded-xl border border-border bg-card p-4 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Navigator</p>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIdx === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={cn(
                      "h-8 w-8 rounded-full text-xs font-bold border transition-all",
                      isCurrent && "ring-2 ring-primary/30 ring-offset-1",
                      isAnswered
                        ? "bg-primary border-primary text-white"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" /> Answered
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full border border-border" /> Skipped
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
