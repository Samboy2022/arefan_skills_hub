"use client";

import { Zap, Play, CheckCircle, Clock, Eye, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { cn } from "@/lib/utils";
import { STUDENT_QUIZZES } from "@/lib/student-mock-data";

const getTypeColor = (type: string) => {
  switch (type) {
    case "graded":
      return "bg-red-50 border-red-200 text-red-700";
    case "practice":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "ungraded":
      return "bg-gray-50 border-gray-200 text-gray-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

const getTypeLabel = (type: string) => {
  const labels = {
    graded: "Graded Quiz",
    practice: "Practice Quiz",
    ungraded: "Ungraded",
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "submitted":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "not_started":
      return <Zap className="h-5 w-5 text-gray-400" />;
    default:
      return null;
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

  const renderQuizCard = (quiz: typeof STUDENT_QUIZZES[0]) => (
    <Card key={quiz.id} className="overflow-hidden hover:shadow-xl transition-all border-none shadow-sm flex flex-col h-full bg-card group">
      <div className={cn("h-1.5 w-full", quiz.status === 'submitted' ? 'bg-green-500' : quiz.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300')} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2 rounded-lg bg-muted text-foreground")}>
            {getStatusIcon(quiz.status)}
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getTypeColor(quiz.type))}>
            {getTypeLabel(quiz.type)}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">{quiz.title}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <HelpCircle className="h-3 w-3" />
            <span>{quiz.total_questions} questions</span>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-muted/50 rounded-md">
              <p className="text-muted-foreground mb-0.5">Time Limit</p>
              <p className="font-semibold">{quiz.time_limit} mins</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-md">
              <p className="text-muted-foreground mb-0.5">Attempts</p>
              <p className="font-semibold">{quiz.attempts.length}/{quiz.attempts_allowed}</p>
            </div>
          </div>

          {quiz.best_score !== null && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800/30 flex justify-between items-center">
              <span className="text-[11px] font-medium text-green-800 dark:text-green-300">Best Score</span>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">{quiz.best_score}%</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant={quiz.status === 'submitted' ? 'outline' : 'default'} className="flex-1 text-xs h-9" asChild>
              <a href={`/student/quizzes/${quiz.id}`}>
                {quiz.status === 'submitted' ? (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Review
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    {quiz.status === 'in_progress' ? 'Continue' : 'Start'}
                  </>
                )}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <PageHeader
        title="Quizzes & Exams"
        description="Take assessments and review your performance"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StudentKPICard
          title="Total Quizzes"
          value={STUDENT_QUIZZES.length}
          icon={HelpCircle}
          variant="default"
          hint="All assigned"
        />
        <StudentKPICard
          title="To Start"
          value={groupedQuizzes.upcoming.length}
          icon={Play}
          variant="warning"
          hint="Not attempted"
        />
        <StudentKPICard
          title="Completed"
          value={groupedQuizzes.completed.length}
          icon={CheckCircle}
          variant="success"
          hint="Successfully submitted"
        />
      </div>

      {/* Upcoming / Available Quizzes */}
      {groupedQuizzes.upcoming.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
              <Zap className="h-5 w-5" />
            </div>
            Available to Take
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuizzes.upcoming.map(renderQuizCard)}
          </div>
        </div>
      )}

      {/* In Progress Quizzes */}
      {groupedQuizzes.inProgress.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            In Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuizzes.inProgress.map(renderQuizCard)}
          </div>
        </div>
      )}

      {/* Completed Quizzes */}
      {groupedQuizzes.completed.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            Completed
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuizzes.completed.map(renderQuizCard)}
          </div>
        </div>
      )}
    </div>
  );
}
