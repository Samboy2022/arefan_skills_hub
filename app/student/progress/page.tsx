"use client";

import { CheckCircle, Clock, BookOpen, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { STUDENT_PROGRESS } from "@/lib/student-mock-data";

export default function ProgressPage() {
  const totalLessonsCompleted = STUDENT_PROGRESS.reduce((sum, p) => sum + p.lessons_completed, 0);
  const totalLessons = STUDENT_PROGRESS.reduce((sum, p) => sum + p.total_lessons, 0);
  const totalAssignmentsCompleted = STUDENT_PROGRESS.reduce((sum, p) => sum + p.assignments_completed, 0);
  const totalAssignments = STUDENT_PROGRESS.reduce((sum, p) => sum + p.total_assignments, 0);
  const overallProgress = Math.round(
    (STUDENT_PROGRESS.reduce((sum, p) => sum + p.overall_progress, 0) / STUDENT_PROGRESS.length)
  );

  return (
    <div>
      <PageHeader
        title="Learning Progress"
        description="Track your overall progress across all courses"
      />

      {/* Overall Progress Overview */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Overall Progress</h3>
          <span className="text-4xl font-bold text-primary">{overallProgress}%</span>
        </div>
        <div className="h-6 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StudentKPICard
          title="Lessons Done"
          value={`${totalLessonsCompleted}/${totalLessons}`}
          icon={BookOpen}
          variant="default"
          trend={8}
          hint="Course materials"
        />
        <StudentKPICard
          title="Assignments Done"
          value={`${totalAssignmentsCompleted}/${totalAssignments}`}
          icon={CheckCircle}
          variant="success"
          trend={15}
          hint="Submitted tasks"
        />
        <StudentKPICard
          title="Courses"
          value={STUDENT_PROGRESS.length}
          icon={Zap}
          variant="warning"
          hint="Active learning"
        />
        <StudentKPICard
          title="Last Activity"
          value="Today"
          icon={Clock}
          variant="purple"
          hint="Current engagement"
        />
      </div>

      {/* Course-by-Course Progress */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Progress by Course</h2>
        <div className="space-y-4">
          {STUDENT_PROGRESS.map(progress => {
            const lessonsPercent = Math.round(
              (progress.lessons_completed / progress.total_lessons) * 100
            );
            const assignmentsPercent = Math.round(
              (progress.assignments_completed / progress.total_assignments) * 100
            );
            const quizzesPercent = progress.total_quizzes > 0
              ? Math.round((progress.quizzes_taken / progress.total_quizzes) * 100)
              : 0;

            return (
              <Card key={progress.course_id} className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-lg">{progress.course_name}</p>
                    <span className="text-3xl font-bold text-primary">
                      {progress.overall_progress}%
                    </span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress.overall_progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Breakdown by Category */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Lessons */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Lessons ({progress.lessons_completed}/{progress.total_lessons})
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${lessonsPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{lessonsPercent}% Complete</p>
                    </div>
                  </div>

                  {/* Assignments */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Assignments ({progress.assignments_completed}/{progress.total_assignments})
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${assignmentsPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{assignmentsPercent}% Complete</p>
                    </div>
                  </div>

                  {/* Quizzes */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Quizzes ({progress.quizzes_taken}/{progress.total_quizzes})
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${quizzesPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">{quizzesPercent}% Taken</p>
                    </div>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last activity: {new Date(progress.last_activity).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
