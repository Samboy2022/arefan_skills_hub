"use client";

import { use, useState } from "react";
import { ArrowLeft, Play, Clock, HelpCircle, AlertCircle, CheckCircle, Shield, Award, Timer, Target, BookOpen, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

const getTypeColor = (type: string) => {
  switch (type) {
    case "graded":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "practice":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "ungraded":
    default:
      return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getTypeLabel = (type: string) => {
  const labels = {
    graded: "Graded Quiz",
    practice: "Practice Quiz",
    ungraded: "Ungraded Quiz",
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "in_progress":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "not_started":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  const labels = {
    not_started: "Not Started",
    in_progress: "In Progress",
    submitted: "Completed",
  };
  return labels[status as keyof typeof labels] || status;
};

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = STUDENT_QUIZZES.find(q => q.id === id);
  const course = STUDENT_COURSES.find(c => c.id === quiz?.course_id);
  const [started, setStarted] = useState(false);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <HelpCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Quiz Not Found</h2>
        <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/student/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>
      </div>
    );
  }

  const isCompleted = quiz.status === "submitted";
  const isInProgress = quiz.status === "in_progress";

  if (started) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] bg-background">
        {/* Minimal Quiz Header */}
        <div className="px-6 py-4 border-b border-border bg-card flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg text-foreground">{quiz.title}</h3>
            <span className="text-sm text-muted-foreground">
              Question 1 of {quiz.total_questions}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-sm">14:52</span>
          </div>
        </div>

        {/* Clean Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground leading-relaxed">
                Which of the following is a primitive data type in most programming languages?
              </h4>
              
              <div className="space-y-3">
                {['Class', 'Object', 'Integer', 'Interface'].map((opt, i) => (
                  <button 
                    key={i} 
                    className="w-full p-4 border border-border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-sm font-medium group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-foreground">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex justify-between items-center">
          <Button variant="outline" disabled size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setStarted(false)} size="sm">
              Exit
            </Button>
            <Button size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Quizzes & Exams", href: "/student/quizzes" },
          { label: quiz.title }
        ]}
        className="mb-6"
      />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {course?.code || 'QUIZ'}
              </span>
              <span className={cn("text-sm font-semibold px-3 py-1.5 rounded-full border", getTypeColor(quiz.type))}>
                {getTypeLabel(quiz.type)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {quiz.title}
            </h1>
            <p className="text-muted-foreground">
              {course?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-semibold px-3 py-1.5 rounded-full border", getStatusColor(quiz.status))}>
              {getStatusLabel(quiz.status)}
            </span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="text-sm font-semibold text-foreground">{quiz.total_questions}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Timer className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{quiz.time_limit}m</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Target className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-muted-foreground">Attempts</p>
              <p className="text-sm font-semibold text-foreground">{quiz.attempts.length}/{quiz.attempts_allowed}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Best</p>
              <p className="text-sm font-semibold text-foreground">{quiz.best_score || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Instructions & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          <Card className="p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Quiz Instructions
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-base leading-relaxed">
                This is a {quiz.type} assessment covering the fundamental concepts related to {quiz.title}. 
                Please read all questions carefully and select the best answer for each question.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">Time Management</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have {quiz.time_limit} minutes to complete all {quiz.total_questions} questions.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">Attempts</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have {quiz.attempts_allowed} attempt{quiz.attempts_allowed !== 1 ? 's' : ''} to complete this quiz.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">Navigation</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can navigate between questions and review your answers.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">Academic Integrity</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Switching tabs or windows may void your attempt.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-border">
              {!isCompleted && !isInProgress ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="shadow-sm flex-1 sm:flex-none" 
                    onClick={() => setStarted(true)}
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Quiz
                  </Button>
                  <Button variant="outline" className="shadow-sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study Materials
                  </Button>
                </div>
              ) : isInProgress ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="shadow-sm flex-1 sm:flex-none" 
                    onClick={() => setStarted(true)}
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Continue Quiz
                  </Button>
                  <Button variant="outline" className="shadow-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Quiz in Progress
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-semibold text-foreground">Quiz Completed</p>
                        <p className="text-sm text-muted-foreground">You have successfully completed this quiz</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Award className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Attempt History */}
          {isCompleted && quiz.attempts.length > 0 && (
            <Card className="p-6 border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Attempt History
              </h2>
              <div className="space-y-3">
                {quiz.attempts.map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                        {attempt.attempt_number}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Attempt {attempt.attempt_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(attempt.date_attempted), 'MMM dd, yyyy \'at\' h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{attempt.score}%</p>
                      <p className="text-xs uppercase font-semibold text-muted-foreground">
                        {attempt.score >= 70 ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Stats & Details */}
        <div className="space-y-6">
          {/* Best Score Card */}
          {quiz.best_score !== null && (
            <Card className="p-6 border border-border shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                  <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Best Score</h3>
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {quiz.best_score}%
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Excellence is not a skill, it is an attitude."
                </p>
              </div>
            </Card>
          )}

          {/* Quiz Details */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quiz Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium text-foreground">{course?.code}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Quiz Type</span>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", getTypeColor(quiz.type))}>
                  {getTypeLabel(quiz.type)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Questions</span>
                <span className="font-medium text-foreground">{quiz.total_questions}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Time Limit</span>
                <span className="font-medium text-foreground">{quiz.time_limit} minutes</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Status</span>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", getStatusColor(quiz.status))}>
                  {getStatusLabel(quiz.status)}
                </span>
              </div>
            </div>
          </Card>

          {/* Quiz Rules */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quiz Rules</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Passing Score</span>
                <span className="font-semibold text-foreground">70%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Late Submission</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">Not Allowed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Question Review</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Randomized</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Yes</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
