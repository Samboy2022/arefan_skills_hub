import { Zap, Play, CheckCircle, Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
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
    <Card key={quiz.id} className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getStatusIcon(quiz.status)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{quiz.title}</h4>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs font-medium px-3 py-1 rounded border ${getTypeColor(quiz.type)}`}>
                {getTypeLabel(quiz.type)}
              </span>
              <span className="text-xs text-muted-foreground px-3 py-1">
                {quiz.total_questions} questions
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded bg-muted">
          {getStatusLabel(quiz.status)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="p-3 bg-muted rounded">
          <p className="text-muted-foreground text-xs">Time Limit</p>
          <p className="font-semibold">{quiz.time_limit} mins</p>
        </div>
        <div className="p-3 bg-muted rounded">
          <p className="text-muted-foreground text-xs">Attempts</p>
          <p className="font-semibold">
            {quiz.attempts.length}/{quiz.attempts_allowed}
          </p>
        </div>
        {quiz.best_score !== null ? (
          <div className="p-3 bg-muted rounded">
            <p className="text-muted-foreground text-xs">Best Score</p>
            <p className="font-semibold text-lg">{quiz.best_score}%</p>
          </div>
        ) : null}
      </div>

      {/* Attempts History */}
      {quiz.attempts.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Recent Attempts</p>
          <div className="space-y-1">
            {quiz.attempts.map((attempt, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-blue-800">Attempt {attempt.attempt_number}</span>
                <span className="font-semibold text-blue-800">{attempt.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        {quiz.status === "not_started" || quiz.status === "in_progress" ? (
          <Button size="sm" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            {quiz.status === "in_progress" ? "Continue" : "Start"} Quiz
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Review Answers
          </Button>
        )}
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
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Quizzes</p>
          <p className="text-2xl font-bold">{STUDENT_QUIZZES.length}</p>
        </Card>
        <Card className="p-4 text-center border-yellow-200 bg-yellow-50">
          <p className="text-sm text-yellow-700">To Start</p>
          <p className="text-2xl font-bold text-yellow-700">{groupedQuizzes.upcoming.length}</p>
        </Card>
        <Card className="p-4 text-center border-green-200 bg-green-50">
          <p className="text-sm text-green-700">Completed</p>
          <p className="text-2xl font-bold text-green-700">{groupedQuizzes.completed.length}</p>
        </Card>
      </div>

      {/* Upcoming / Available Quizzes */}
      {groupedQuizzes.upcoming.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Available to Take
          </h3>
          <div className="space-y-4">
            {groupedQuizzes.upcoming.map(renderQuizCard)}
          </div>
        </div>
      )}

      {/* In Progress Quizzes */}
      {groupedQuizzes.inProgress.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            In Progress
          </h3>
          <div className="space-y-4">
            {groupedQuizzes.inProgress.map(renderQuizCard)}
          </div>
        </div>
      )}

      {/* Completed Quizzes */}
      {groupedQuizzes.completed.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed
          </h3>
          <div className="space-y-4">
            {groupedQuizzes.completed.map(renderQuizCard)}
          </div>
        </div>
      )}
    </div>
  );
}
