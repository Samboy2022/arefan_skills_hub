import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_ASSIGNMENTS, COURSE_ANNOUNCEMENTS, SCHEDULE_EVENTS } from "@/lib/student-mock-data";
import { CoursesIcon, AlertCircleIcon, ClockIcon, BellIcon } from "@/components/shared/colored-icons";
import { Clock, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const totalCourses = STUDENT_COURSES.length;
  const dueSoon = STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").length;
  const pendingReview = STUDENT_ASSIGNMENTS.filter(a => a.status === "submitted").length;
  const unreadAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length;

  const upcomingEvent = SCHEDULE_EVENTS[0];
  const recentAnnouncements = COURSE_ANNOUNCEMENTS.slice(0, 3);
  const inProgressCourses = STUDENT_COURSES.filter(c => c.status === "active");

  return (
    <div>
      <PageHeader
        title="Welcome back, John!"
        description="Here's your learning summary for today"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StudentKPICard
          icon={(props) => <CoursesIcon {...props} color="22C55E" />}
          label="Active Courses"
          value={totalCourses}
          subtext="Currently enrolled"
          variant="default"
        />
        <StudentKPICard
          icon={(props) => <AlertCircleIcon {...props} color="facc15" />}
          label="Due Soon"
          value={dueSoon}
          subtext="Next 7 days"
          variant="warning"
        />
        <StudentKPICard
          icon={(props) => <ClockIcon {...props} color="22C55E" />}
          label="Under Review"
          value={pendingReview}
          subtext="Waiting for grading"
          variant="default"
        />
        <StudentKPICard
          icon={(props) => <BellIcon {...props} color="ef4444" />}
          label="Announcements"
          value={unreadAnnouncements}
          subtext="Unread updates"
          variant="danger"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events & To-Do */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Event */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Event</h3>
            {upcomingEvent ? (
              <div className="flex items-start gap-4 p-4 bg-brand/5 rounded-lg border border-brand/20">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
                    <Clock className="h-6 w-6 text-brand" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{upcomingEvent.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(upcomingEvent.start_time), 'MMM dd, yyyy')} at{" "}
                    {format(new Date(upcomingEvent.start_time), 'HH:mm')}
                  </p>
                  {upcomingEvent.location && (
                    <p className="text-xs text-muted-foreground">{upcomingEvent.location}</p>
                  )}
                </div>
              </div>
            ) : null}
          </Card>

          {/* Pending Assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Due Soon</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").slice(0, 3).map(assignment => (
                <div key={assignment.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>
          <div className="space-y-3">
            {recentAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className={cn(
                  "p-3 rounded-lg border text-sm",
                  announcement.is_read
                    ? "border-border bg-background"
                    : "border-brand/20 bg-brand/5"
                )}
              >
                <p className="font-medium line-clamp-2">{announcement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {announcement.instructor}
                </p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All
            </Button>
          </div>
        </Card>
      </div>

      {/* In Progress Courses */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Your Learning Path</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {inProgressCourses.map(course => (
            <div
              key={course.id}
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <p className="font-semibold text-sm line-clamp-2">{course.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs text-muted-foreground">{course.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {course.due_assignments > 0 && (
                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs text-amber-700">
                    {course.due_assignments} assignment{course.due_assignments !== 1 ? "s" : ""} due
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
