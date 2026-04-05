"use client";

import { Zap, Play, CheckCircle, Clock, Eye, HelpCircle, Timer, Target, Award, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { cn } from "@/lib/utils";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
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
    graded: "Graded",
    practice: "Practice",
    ungraded: "Ungraded",
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "submitted":
      return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "not_started":
      return <Play className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
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

export default function QuizzesPage() {
  const groupedQuizzes = {
    upcoming: STUDENT_QUIZZES.filter(q => q.status === "not_started"),
    inProgress: STUDENT_QUIZZES.filter(q => q.status === "in_progress"),
    completed: STUDENT_QUIZZES.filter(q => q.status === "submitted"),
  };

  // Sort quizzes: In Progress first, then Not Started, then Completed
  const sortedQuizzes = [...STUDENT_QUIZZES].sort((a, b) => {
    const statusOrder = { 'in_progress': 0, 'not_started': 1, 'submitted': 2 };
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  const renderQuizRow = (quiz: typeof STUDENT_QUIZZES[0]) => {
    const course = STUDENT_COURSES.find(c => c.id === quiz.course_id);

    return (
      <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-muted/30 transition-colors gap-4 border-l-4 border-l-transparent hover:border-l-primary/50">
        {/* Quiz Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              {course?.code || 'QUIZ'}
            </span>
            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", getTypeColor(quiz.type))}>
              {getTypeLabel(quiz.type)}
            </span>
          </div>
          <h4 className="font-semibold text-base leading-tight text-foreground line-clamp-2 mb-1">
            {quiz.title}
          </h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span>{quiz.total_questions} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span>{quiz.time_limit} minutes</span>
            </div>
          </div>
        </div>

        {/* Attempts & Score */}
        <div className="sm:w-[140px] shrink-0 flex flex-col items-start sm:items-center justify-center">
          <div className="text-sm font-medium text-foreground mb-1">
            {quiz.attempts.length}/{quiz.attempts_allowed} attempts
          </div>
          {quiz.best_score !== null ? (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Award className="h-4 w-4" />
              <span className="text-sm font-bold">{quiz.best_score}%</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No score yet</div>
          )}
        </div>

        {/* Status */}
        <div className="sm:w-[120px] shrink-0 flex flex-col items-start sm:items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(quiz.status)}
            <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border", getStatusColor(quiz.status))}>
              {getStatusLabel(quiz.status)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="sm:w-[120px] shrink-0 flex justify-start sm:justify-center">
          <Button 
            size="sm" 
            variant={quiz.status === 'submitted' ? 'outline' : 'default'} 
            className="font-semibold shadow-sm min-w-[100px]" 
            asChild
          >
            <Link href={`/student/quizzes/${quiz.id}`}>
              {quiz.status === 'submitted' ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </>
              ) : quiz.status === 'in_progress' ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Quiz
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb 
        items={[
          { label: "Quizzes & Exams" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Quizzes & Exams"
        description="Take assessments and review your performance"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
              <p className="text-xs text-muted-foreground">All assigned</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <HelpCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{STUDENT_QUIZZES.length}</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">To Start</p>
              <p className="text-xs text-muted-foreground">Not attempted</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Play className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedQuizzes.upcoming.length}</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-xs text-muted-foreground">Successfully submitted</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedQuizzes.completed.length}</p>
        </Card>
      </div>

      {/* Quizzes Table */}
      <div className="w-full">
        <Card className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
          {/* Table Header */}
          <div className="hidden sm:flex items-center px-6 py-4 bg-muted/50 border-b border-border">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Quiz Details</h3>
            </div>
            <div className="w-[140px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Progress</h3>
            </div>
            <div className="w-[120px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Status</h3>
            </div>
            <div className="w-[120px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Action</h3>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border">
            {sortedQuizzes.length > 0 ? (
              sortedQuizzes.map(renderQuizRow)
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <HelpCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No quizzes found</h3>
                    <p className="text-sm text-muted-foreground">No quizzes have been assigned yet.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
