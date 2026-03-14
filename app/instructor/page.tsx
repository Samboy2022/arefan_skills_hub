import { PageHeader } from "@/components/instructor/page-header";
import { KPICard } from "@/components/instructor/kpi-card";
import { Button } from "@/components/ui/button";
import { MOCK_INSTRUCTOR_COURSES, MOCK_ASSIGNMENTS, MOCK_STUDENTS } from "@/lib/instructor-mock-data";
import { CoursesIcon, StudentsIcon, LessonsIcon, ClockIcon } from "@/components/shared/colored-icons";

export default function InstructorDashboard() {
  const totalStudents = MOCK_STUDENTS.length;
  const activeCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => c.status === "active").length;
  const pendingAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "active").length;
  const totalEnrollments = MOCK_INSTRUCTOR_COURSES.reduce((sum, course) => sum + course.enrollmentCount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <PageHeader
          title="Welcome back, Dr. Jane Smith"
          description="Here's what's happening with your courses today"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Courses"
          value={activeCourses}
          description={`${totalEnrollments} total students`}
          variant="default"
          icon={<CoursesIcon className="h-6 w-6" color="22C55E" />}
        />
        <KPICard
          title="Total Students"
          value={totalStudents}
          description="Across all courses"
          change={12}
          isPositive={true}
          variant="success"
          icon={<StudentsIcon className="h-6 w-6" color="22C55E" />}
        />
        <KPICard
          title="Pending Assignments"
          value={pendingAssignments}
          description="To be reviewed"
          variant="warning"
          icon={<LessonsIcon className="h-6 w-6" color="22C55E" />}
        />
        <KPICard
          title="Avg Response Time"
          value="2.3 hrs"
          description="To student inquiries"
          change={-8}
          isPositive={true}
          variant="default"
          icon={<ClockIcon className="h-6 w-6" color="22C55E" />}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Submissions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Alice Johnson</p>
                <p className="text-xs text-muted-foreground">Submitted: Hello World Program</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">95/100</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Bob Smith</p>
                <p className="text-xs text-muted-foreground">Submitted: Control Flow Assignment</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Carol Davis</p>
                <p className="text-xs text-muted-foreground">Submitted: Variables Quiz</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">88/100</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Submissions
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2 flex flex-col">
            <Button variant="outline" className="justify-start">
              Create Lesson
            </Button>
            <Button variant="outline" className="justify-start">
              Create Assignment
            </Button>
            <Button variant="outline" className="justify-start">
              Create Quiz
            </Button>
            <Button variant="outline" className="justify-start">
              Post Announcement
            </Button>
            <Button variant="outline" className="justify-start">
              View Gradebook
            </Button>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Latest Announcements</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
            <p className="font-medium text-sm text-foreground">Welcome to CS101</p>
            <p className="text-sm text-muted-foreground mt-1">Let's have a great semester together!</p>
            <p className="text-xs text-muted-foreground mt-2">Posted on Jan 15, 2024</p>
          </div>
          <div className="p-4 rounded-lg bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30">
            <p className="font-medium text-sm text-foreground">Assignment 1 Posted</p>
            <p className="text-sm text-muted-foreground mt-1">Assignment 1 is now available. Due on February 15th.</p>
            <p className="text-xs text-muted-foreground mt-2">Posted on Feb 1, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
