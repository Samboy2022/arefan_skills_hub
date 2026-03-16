"use client";

import { use, useState } from "react";
import { ArrowLeft, Play, Clock, HelpCircle, AlertCircle, CheckCircle, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);
  const course = STUDENT_COURSES.find(c => c.id === quiz?.course_id);
  const [started, setStarted] = useState(false);

  if (!quiz) {
    return <div className="p-8 text-center">Quiz not found</div>;
  }

  const isCompleted = quiz.status === "submitted";

  if (started) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] bg-card rounded-md border border-border overflow-hidden shadow-none">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-foreground">{quiz.title}</h3>
            <p className="text-xs text-muted-foreground">Question 1 of {quiz.total_questions}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold">14:52</span>
          </div>
        </div>

        <div className="flex-1 p-8 max-w-3xl mx-auto w-full">
           <div className="space-y-8">
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-foreground">Which of the following is a primitive data type in most programming languages?</h4>
                <div className="grid grid-cols-1 gap-3">
                  {['Class', 'Object', 'Integer', 'Interface'].map((opt, i) => (
                    <button key={i} className="p-4 border border-border rounded-md text-left hover:border-primary hover:bg-primary/5 transition-all outline-none text-sm group">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-[10px] group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex justify-between">
          <Button variant="outline" disabled className="shadow-none border-border">Previous</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStarted(false)} className="hover:bg-muted/50">Exit</Button>
            <Button className="shadow-none">Next Question</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/student/quizzes" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>

      <PageHeader
        title={quiz.title}
        description={course?.name || "Course Assessment"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border shadow-none rounded-md bg-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quiz Instructions</h3>
            <div className="space-y-4 text-muted-foreground text-sm">
              <p>This is a {quiz.type} assessment covering the basic concepts of {quiz.title}.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-md border border-border">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Time Limit</p>
                    <p className="text-xs text-muted-foreground">{quiz.time_limit} minutes to complete.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-md border border-border">
                  <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Questions</p>
                    <p className="text-xs text-muted-foreground">{quiz.total_questions} multiple choice questions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-md border border-border">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Attempts</p>
                    <p className="text-xs text-muted-foreground">{quiz.attempts_allowed} attempts allowed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-md border border-border">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Integrity</p>
                    <p className="text-xs text-muted-foreground">Switching tabs may void your attempt.</p>
                  </div>
                </div>
              </div>
            </div>

            {!isCompleted ? (
              <div className="mt-8">
                <Button className="w-full sm:w-auto h-11 px-8 shadow-none" onClick={() => setStarted(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            ) : (
              <div className="mt-8 p-4 bg-muted/30 border border-border rounded-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">You have completed this quiz</span>
                </div>
                <Button variant="outline" size="sm" className="shadow-none border-border">Review Results</Button>
              </div>
            )}
          </Card>

          {isCompleted && quiz.attempts.length > 0 && (
            <Card className="p-6 border border-border shadow-none rounded-md bg-card">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Attempt History</h3>
              <div className="space-y-3">
                {quiz.attempts.map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                        {attempt.attempt_number}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Attempt {attempt.attempt_number}</p>
                        <p className="text-xs text-muted-foreground">{attempt.date_attempted}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">{attempt.score}%</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Passed</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {quiz.best_score && (
             <Card className="p-6 text-center border border-primary/20 shadow-none rounded-md bg-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Award className="h-24 w-24 -mr-8 -mt-8" />
                </div>
                <Award className="h-12 w-12 mx-auto mb-2 text-primary opacity-80" />
                <p className="text-xs font-bold uppercase tracking-widest text-primary/80">Best Score</p>
                <h2 className="text-5xl font-black text-primary">{quiz.best_score}%</h2>
                <div className="mt-4 pt-4 border-t border-primary/20 text-[10px] font-medium text-primary/70 italic">
                  "Excellence is not a skill, it is an attitude."
                </div>
             </Card>
          )}

          <Card className="p-6 border border-border shadow-none rounded-md bg-card">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Quiz Quick Facts</h3>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Passing Score</span>
                 <span className="font-bold text-foreground">70%</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Late Submission</span>
                 <span className="text-rose-500 font-bold">Not Allowed</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Backtracking</span>
                 <span className="text-green-600 dark:text-green-500 font-bold">Enabled</span>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
