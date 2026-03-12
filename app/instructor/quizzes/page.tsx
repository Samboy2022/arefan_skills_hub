import { Plus, Calendar, Edit, BarChart3, Users, Clock } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_QUIZZES } from "@/lib/instructor-mock-data";

export default function QuizzesPage() {
  const upcomingQuizzes = MOCK_QUIZZES.filter((q) => new Date(q.dueDate || "") > new Date());
  const activeQuizzes = MOCK_QUIZZES.filter((q) => q.published);
  const completedQuizzes = MOCK_QUIZZES.filter((q) => new Date(q.dueDate || "") <= new Date());

  const formatDate = (date?: Date) => {
    if (!date) return "No date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const QuizCard = ({ quiz }: { quiz: typeof MOCK_QUIZZES[0] }) => {
    const attemptCount = quiz.attempts?.length || 0;
    const avgScore = attemptCount > 0 ? Math.round((quiz.attempts?.reduce((sum, a) => sum + a.score, 0) || 0) / attemptCount) : 0;

    return (
      <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{quiz.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
          </div>
        </div>

        <div className="space-y-3 py-4 border-t border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due: {formatDate(quiz.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{quiz.timeLimit || 0} minutes time limit</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{attemptCount} student attempts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Average score: {avgScore}%</span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 grid-cols-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quizzes & Exams"
        description="Create and manage assessments for your courses"
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Quiz
        </Button>
      </PageHeader>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingQuizzes.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeQuizzes.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedQuizzes.length})</TabsTrigger>
        </TabsList>

        {/* Upcoming Quizzes */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingQuizzes.length > 0 ? (
            <div className="grid gap-6">
              {upcomingQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No upcoming quizzes</p>
            </div>
          )}
        </TabsContent>

        {/* Active Quizzes */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeQuizzes.length > 0 ? (
            <div className="grid gap-6">
              {activeQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No active quizzes</p>
            </div>
          )}
        </TabsContent>

        {/* Completed Quizzes */}
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedQuizzes.length > 0 ? (
            <div className="grid gap-6">
              {completedQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No completed quizzes</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
