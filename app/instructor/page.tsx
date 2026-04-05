'use client'

import {
  BookOpen,
  Users,
  ClipboardList,
  Clock,
  GraduationCap,
  FileCheck,
  Megaphone,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { PageHeader } from '@/components/instructor/page-header'
import { ChartCard } from '@/components/admin/chart-card'
import { DataTable } from '@/components/admin/data-table'
import { RevenueChart } from '@/components/admin/charts/revenue-chart'
import { SimpleDonutChart, BarPieChart } from '@/components/admin/charts/pie-charts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MOCK_INSTRUCTOR_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_STUDENTS,
  MOCK_LESSONS,
  MOCK_GRADES,
  MOCK_ANNOUNCEMENTS,
} from '@/lib/instructor-mock-data'
import { Breadcrumb } from '@/components/ui/breadcrumb'

type SubmissionRow = {
  id: string
  studentName: string
  assignment: string
  status: string
  score?: number
  submittedAt: Date
}

function buildRecentSubmissions(): SubmissionRow[] {
  const rows: SubmissionRow[] = []
  for (const assignment of MOCK_ASSIGNMENTS) {
    for (const sub of assignment.submissions) {
      const student = MOCK_STUDENTS.find((s) => s.id === sub.studentId)
      rows.push({
        id: sub.id,
        studentName: student?.name ?? 'Unknown',
        assignment: assignment.title,
        status: sub.status,
        score: sub.score,
        submittedAt: sub.submissionDate,
      })
    }
  }
  return rows.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
}

export default function InstructorDashboard() {
  const totalStudents = MOCK_STUDENTS.length
  const activeCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => c.status === 'active').length
  const pendingAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === 'active').length
  const totalEnrollments = MOCK_INSTRUCTOR_COURSES.reduce(
    (sum, course) => sum + course.enrollmentCount,
    0
  )
  const publishedLessons = MOCK_LESSONS.filter((l) => l.published).length
  const pendingReviews = MOCK_ASSIGNMENTS.reduce(
    (n, a) => n + a.submissions.filter((s) => s.status === 'submitted').length,
    0
  )

  const weeklyActivity = [
    { name: 'Mon', value: 14 },
    { name: 'Tue', value: 22 },
    { name: 'Wed', value: 18 },
    { name: 'Thu', value: 26 },
    { name: 'Fri', value: 31 },
    { name: 'Sat', value: 9 },
    { name: 'Sun', value: 7 },
  ]

  const enrollmentsByCourse = MOCK_INSTRUCTOR_COURSES.map((c) => ({
    name: c.code,
    value: c.enrollmentCount,
  }))

  const studentsByCourse = MOCK_INSTRUCTOR_COURSES.map((course) => ({
    name: course.code,
    value: MOCK_STUDENTS.filter((s) => s.enrolledCourses.includes(course.id)).length,
  }))

  const topStudentsByScore = [...MOCK_STUDENTS]
    .map((student) => {
      const grades = MOCK_GRADES.filter((g) => g.studentId === student.id)
      const avg =
        grades.length > 0
          ? Math.round(
              grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
            )
          : 0
      return { name: student.name, value: avg }
    })
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const recentSubmissions = buildRecentSubmissions()
  const announcementSortTime = (a: (typeof MOCK_ANNOUNCEMENTS)[number]) =>
    new Date(a.publishedAt ?? a.createdAt).getTime()
  const sortedAnnouncements = [...MOCK_ANNOUNCEMENTS].sort(
    (a, b) => announcementSortTime(b) - announcementSortTime(a)
  )

  const dashboardStats = [
    {
      title: 'Active Courses',
      value: activeCourses.toLocaleString(),
      hint: `${totalEnrollments.toLocaleString()} seats filled`,
      subtext: '+2 this term',
      icon: BookOpen,
      borderTone: 'border-sky-200 dark:border-sky-900',
      iconTone: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      hint: 'Across your courses',
      subtext: '+12% from last month',
      icon: Users,
      borderTone: 'border-indigo-200 dark:border-indigo-900',
      iconTone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Open assignments',
      value: pendingAssignments.toLocaleString(),
      hint: 'Active & accepting work',
      subtext: `${pendingReviews} awaiting review`,
      icon: ClipboardList,
      borderTone: 'border-amber-200 dark:border-amber-900',
      iconTone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      subtextTone: 'text-amber-700 dark:text-amber-400',
    },
    {
      title: 'Published lessons',
      value: publishedLessons.toLocaleString(),
      hint: 'Visible to students',
      subtext: '+4 this month',
      icon: GraduationCap,
      borderTone: 'border-green-200 dark:border-green-900',
      iconTone: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Avg. response time',
      value: '2.3 hrs',
      hint: 'To student messages',
      subtext: '-8% faster vs last month',
      icon: Clock,
      borderTone: 'border-violet-200 dark:border-violet-900',
      iconTone: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Pending reviews',
      value: pendingReviews.toLocaleString(),
      hint: 'Submissions to grade',
      subtext: pendingReviews > 0 ? 'Prioritize this week' : 'All caught up',
      icon: FileCheck,
      borderTone:
        pendingReviews > 0
          ? 'border-red-200 dark:border-red-900'
          : 'border-emerald-200 dark:border-emerald-900',
      iconTone:
        pendingReviews > 0
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      subtextTone:
        pendingReviews > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false} 
        items={[{ label: 'Dashboard' }]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Welcome back, Dr. Jane Smith"
          description="Here is a quick snapshot of your teaching workspace today."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.borderTone} p-3 transition-shadow hover:shadow-md`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div className={`rounded-full p-1.5 ${stat.iconTone}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xl font-bold leading-none">{stat.value}</p>
            <p className={`mt-1.5 text-xs ${stat.subtextTone}`}>{stat.subtext}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Weekly activity"
          description="Student logins and lesson views (sample trend)"
          className="border-blue-200 dark:border-blue-900"
        >
          <RevenueChart data={weeklyActivity} type="line" />
        </ChartCard>

        <ChartCard
          title="Enrollment by course"
          description="Seats filled per course"
          className="border-green-200 dark:border-green-900"
        >
          <RevenueChart data={enrollmentsByCourse} type="bar" />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Roster by course"
          description="Students with access per course"
          className="border-purple-200 dark:border-purple-900"
        >
          <SimpleDonutChart data={studentsByCourse} />
        </ChartCard>

        <ChartCard
          title="Top performers"
          description="Average score across graded work"
          className="border-amber-200 dark:border-amber-900"
        >
          {topStudentsByScore.length > 0 ? (
            <BarPieChart data={topStudentsByScore} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No graded work yet</p>
          )}
        </ChartCard>
      </div>

      <Card className="border border-border transition-shadow hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-6 py-4">
          <div>
            <h3 className="text-base font-semibold">Recent submissions</h3>
            <p className="text-sm text-muted-foreground">Latest student work across assignments</p>
          </div>
          <Link
            href="/instructor/assignments"
            className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Open assignments
          </Link>
        </div>
        <div className="px-6 py-4">
          <DataTable
            columns={[
              {
                header: 'Student',
                accessor: 'studentName',
                cell: (value) => (
                  <Link
                    href="/instructor/students"
                    className="font-medium text-primary hover:underline"
                  >
                    {value}
                  </Link>
                ),
              },
              {
                header: 'Assignment',
                accessor: 'assignment',
              },
              {
                header: 'Status',
                accessor: 'status',
                cell: (value) => {
                  const colors: Record<string, string> = {
                    graded:
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
                    submitted:
                      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
                    late: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
                  }
                  return (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[value] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      {value}
                    </span>
                  )
                },
              },
              {
                header: 'Score',
                accessor: 'score',
                cell: (value) =>
                  value != null ? (
                    <span className="font-medium">{value}/100</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  ),
              },
              {
                header: 'Submitted',
                accessor: 'submittedAt',
                cell: (value) => format(new Date(value), 'MMM dd, yyyy'),
              },
            ]}
            data={recentSubmissions}
            pageSize={10}
            emptyMessage="No submissions yet"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-border transition-shadow hover:shadow-md">
          <div className="border-b px-6 py-4">
            <h3 className="text-base font-semibold">Quick actions</h3>
            <p className="text-sm text-muted-foreground">Jump to common teaching tasks</p>
          </div>
          <div className="flex flex-col gap-2 p-6">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/instructor/lessons">Create lesson</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/instructor/assignments">Create assignment</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/instructor/quizzes">Create quiz</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/instructor/announcements">Post announcement</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/instructor/gradebook">View gradebook</Link>
            </Button>
          </div>
        </Card>

        <Card className="border border-border transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b px-6 py-4">
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-muted-foreground" />
                Latest announcements
              </h3>
              <p className="text-sm text-muted-foreground">What students see on the course feed</p>
            </div>
            <Link
              href="/instructor/announcements"
              className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Manage all
            </Link>
          </div>
          <div className="space-y-3 p-6">
            {sortedAnnouncements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-border bg-muted/30 p-4 dark:bg-muted/10"
              >
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Posted {format(new Date(a.publishedAt ?? a.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
