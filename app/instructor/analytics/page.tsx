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

      {/* KPI Cards Grid - 8 Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Students</p>
              <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{activeStudents}</h2>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                <Plus className="h-2 w-2 mr-0.5" />4%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Engagement</p>
              <div className="h-9 w-9 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{avgEngagement}%</h2>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                <Plus className="h-2 w-2 mr-0.5" />12%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completion Rate</p>
              <div className="h-9 w-9 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{completionRate}%</h2>
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-full flex items-center">
                -2%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Score</p>
              <div className="h-9 w-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{avgScore}%</h2>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                <Plus className="h-2 w-2 mr-0.5" />8%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Row 2 */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Courses</p>
              <div className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{totalCourses}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignments</p>
              <div className="h-9 w-9 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <PenTool className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{totalAssignments}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Quizzes</p>
              <div className="h-9 w-9 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FileQuestion className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{totalQuizzes}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discussions</p>
              <div className="h-9 w-9 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-bold text-foreground">{totalDiscussions}</h2>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                <Plus className="h-2 w-2 mr-0.5" />2 new
              </span>
            </div>
          </CardContent>
        </Card>
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
