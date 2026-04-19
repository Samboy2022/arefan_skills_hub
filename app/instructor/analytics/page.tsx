"use client";

import { FileText, Users, Activity, Target, TrendingUp, BookOpen, PenTool, MessageSquare, Plus, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MOCK_STUDENTS, 
  MOCK_ASSIGNMENTS, 
  MOCK_GRADES, 
  MOCK_INSTRUCTOR_COURSES,
  MOCK_QUIZZES,
  MOCK_DISCUSSIONS
} from "@/lib/instructor-mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AnalyticsPage() {
  const activeStudents = MOCK_STUDENTS.filter((s) => s.status === "active").length;
  const avgEngagement = Math.round(Math.random() * 40 + 60); // 60-100%
  const completionRate = Math.round((MOCK_ASSIGNMENTS.filter((a) => a.status === "active").length / Math.max(1, MOCK_ASSIGNMENTS.length)) * 100);
  const avgScore = Math.round((MOCK_GRADES.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / Math.max(1, MOCK_GRADES.length)));

  const totalCourses = MOCK_INSTRUCTOR_COURSES.length;
  const totalAssignments = MOCK_ASSIGNMENTS.length;
  const totalQuizzes = MOCK_QUIZZES.length;
  const totalDiscussions = MOCK_DISCUSSIONS.length;

  // Data for Pie Chart (Student Status)
  const statusData = [
    { name: 'On Track', value: 0, color: '#22c55e' }, // green-500
    { name: 'At Risk', value: 0, color: '#f59e0b' },  // amber-500
    { name: 'Failing', value: 0, color: '#ef4444' },  // red-500
  ];
  
  MOCK_STUDENTS.forEach(student => {
    const grades = MOCK_GRADES.filter((g) => g.studentId === student.id);
    const avgGrade = grades.length > 0 ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)) : 0;
    if (avgGrade >= 80) statusData[0].value += 1;
    else if (avgGrade >= 60) statusData[1].value += 1;
    else statusData[2].value += 1;
  });

  if (statusData.every(d => d.value === 0)) {
    statusData[0].value = 1; // Fallback
  }

  // Data for Bar Chart (Assignments)
  const assignmentData = MOCK_ASSIGNMENTS.map(a => ({
    name: a.title.length > 15 ? a.title.substring(0, 15) + '...' : a.title,
    submissions: a.submissions?.length || 0,
    total: MOCK_STUDENTS.length
  }));

  const topPerformers = MOCK_STUDENTS.slice(0, 5).map((student) => {
    const grades = MOCK_GRADES.filter((g) => g.studentId === student.id);
    const avg = grades.length > 0 ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)) : 0;
    return { ...student, score: avg };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Analytics" }
        ]} 
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed breakdown of course performance and student engagement.</p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <FileText className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Stats row 1 */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/user.png" alt="Active Students" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Students</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-extrabold text-foreground leading-none">{activeStudents}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center">+4%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4">
            <img src="https://img.icons8.com/scribby/96/line-chart.png" alt="Avg Engagement" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Avg Engagement</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-extrabold text-foreground leading-none">{avgEngagement}%</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center">+12%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/check.png" alt="Completion Rate" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Completion Rate</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-extrabold text-foreground leading-none">{completionRate}%</p>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 px-1.5 py-0.5 rounded-full flex items-center">-2%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/test.png" alt="Avg Score" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Avg Score</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-extrabold text-foreground leading-none">{avgScore}%</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center">+8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row 2 */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/book.png" alt="Total Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Courses</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{totalCourses}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4">
            <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Assignments" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Assignments</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{totalAssignments}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/idea.png" alt="Active Quizzes" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Quizzes</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{totalQuizzes}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/comments.png" alt="Discussions" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Discussions</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-extrabold text-foreground leading-none">{totalDiscussions}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center">+2 new</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Submissions Volume</CardTitle>
            <CardDescription>Number of submissions per assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assignmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Student Academic Standing</CardTitle>
            <CardDescription>Distribution of student grade health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Performers</CardTitle>
            <CardDescription>Students with the highest average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, idx) => (
                <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm bg-muted px-2.5 py-1 rounded-md">
                    {student.score}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-200 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Needs Attention
            </CardTitle>
            <CardDescription>Students currently at risk or failing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_STUDENTS.map(student => {
                const grades = MOCK_GRADES.filter((g) => g.studentId === student.id);
                const avgGrade = grades.length > 0 ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)) : 0;
                return { ...student, avgGrade };
              })
              .filter(s => s.avgGrade < 80)
              .sort((a, b) => a.avgGrade - b.avgGrade)
              .slice(0, 5)
              .map((student) => (
                <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 rounded-full items-center justify-center bg-muted`}>
                      <div className={`h-2.5 w-2.5 rounded-full ${student.avgGrade < 60 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm px-2.5 py-1 rounded-md ${student.avgGrade < 60 ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'}`}>
                    {student.avgGrade}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
