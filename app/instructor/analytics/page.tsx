import { TrendingUp, Users, Target, Activity } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { KPICard } from "@/components/instructor/kpi-card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_STUDENTS, MOCK_ASSIGNMENTS, MOCK_GRADES } from "@/lib/instructor-mock-data";

export default function AnalyticsPage() {
  const activeStudents = MOCK_STUDENTS.filter((s) => s.status === "active").length;
  const avgEngagement = Math.round(Math.random() * 40 + 60); // 60-100%
  const completionRate = Math.round((MOCK_ASSIGNMENTS.filter((a) => a.status === "active").length / MOCK_ASSIGNMENTS.length) * 100);
  const avgScore = Math.round((MOCK_GRADES.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / MOCK_GRADES.length || 0));

  const topPerformers = MOCK_STUDENTS.slice(0, 5).map((student) => {
    const grades = MOCK_GRADES.filter((g) => g.studentId === student.id);
    const avg = grades.length > 0 ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)) : 0;
    return { ...student, score: avg };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Analytics & Performance" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Analytics & Performance"
          description="Analyze student engagement and course performance"
        >
          <Button variant="outline">Export Report</Button>
        </PageHeader>
      </div>

      {/* Overview KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Students"
          value={activeStudents}
          description="Currently enrolled"
          change={8}
          isPositive={true}
          variant="success"
          icon={<Users className="h-6 w-6" />}
        />
        <KPICard
          title="Avg Engagement"
          value={`${avgEngagement}%`}
          description="Course interaction"
          change={12}
          isPositive={true}
          variant="default"
          icon={<Activity className="h-6 w-6" />}
        />
        <KPICard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Assignments submitted"
          change={-5}
          isPositive={false}
          variant="warning"
          icon={<Target className="h-6 w-6" />}
        />
        <KPICard
          title="Avg Score"
          value={`${avgScore}%`}
          description="Across all assignments"
          change={6}
          isPositive={true}
          variant="default"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement Heatmap */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg text-foreground mb-6">Student Engagement Heatmap</h3>
          <div className="space-y-3">
            {MOCK_STUDENTS.slice(0, 5).map((student) => {
              const engagementLevel = Math.round(Math.random() * 100);
              const color = engagementLevel > 70 ? "bg-green-100 dark:bg-green-950" : engagementLevel > 40 ? "bg-yellow-100 dark:bg-yellow-950" : "bg-red-100 dark:bg-red-950";

              return (
                <div key={student.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium text-foreground truncate">{student.name}</div>
                  <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
                    <div className={`h-full ${color} transition-all`} style={{ width: `${engagementLevel}%` }} />
                  </div>
                  <div className="w-12 text-right font-medium text-foreground">{engagementLevel}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg text-foreground mb-6">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{student.score}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Completion Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-lg text-foreground mb-6">Assignment Submission Status</h3>
        <div className="space-y-3">
          {MOCK_ASSIGNMENTS.map((assignment) => {
            const submissionCount = assignment.submissions?.length || 0;
            const submissionRate = MOCK_STUDENTS.length > 0 ? Math.round((submissionCount / MOCK_STUDENTS.length) * 100) : 0;

            return (
              <div key={assignment.id} className="flex items-center gap-3">
                <div className="w-40 text-sm font-medium text-foreground truncate">{assignment.title}</div>
                <div className="flex-1 h-6 rounded-lg bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${submissionRate}%` }} />
                </div>
                <div className="w-16 text-right font-medium text-foreground">
                  {submissionCount}/{MOCK_STUDENTS.length}
                </div>
                <div className="w-12 text-right font-medium text-muted-foreground">{submissionRate}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h3 className="font-semibold text-foreground">Individual Progress</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Lessons Viewed</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Assignments Done</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Avg Grade</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_STUDENTS.map((student) => {
                const lessonsViewed = Math.round(Math.random() * 8) + 2;
                const assignmentsDone = Math.round(Math.random() * 3);
                const grades = MOCK_GRADES.filter((g) => g.studentId === student.id);
                const avgGrade = grades.length > 0 ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)) : 0;
                const status = avgGrade >= 80 ? "On Track" : avgGrade >= 60 ? "At Risk" : "Failing";
                const statusColor = status === "On Track" ? "text-green-600 dark:text-green-400" : status === "At Risk" ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400";

                return (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                    <td className="px-6 py-4 text-center text-foreground">{lessonsViewed}</td>
                    <td className="px-6 py-4 text-center text-foreground">{assignmentsDone}</td>
                    <td className="px-6 py-4 text-center font-medium text-foreground">{avgGrade}%</td>
                    <td className={`px-6 py-4 text-center font-medium ${statusColor}`}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
