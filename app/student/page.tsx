"use client";

import Link from "next/link";
import { format, isValid } from "date-fns";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_ASSIGNMENTS, COURSE_ANNOUNCEMENTS, SCHEDULE_EVENTS } from "@/lib/student-mock-data";
import { BellIcon } from "@/components/shared/colored-icons";
import { AlertCircle, ArrowRight, BookOpen, FileWarning } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentDashboard() {
  const activeCourses = useMemo(() =>
    STUDENT_COURSES.filter(c => c.status === "active"),
  [STUDENT_COURSES]);

  const totalCredits = useMemo(() =>
    STUDENT_COURSES.reduce((sum, course) => sum + course.credits, 0),
  [STUDENT_COURSES]);

  const dueSoon = useMemo(() =>
    STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").length,
  [STUDENT_ASSIGNMENTS]);

  const completedCourses = useMemo(() =>
    STUDENT_COURSES.filter(c => c.status === "completed").length,
  [STUDENT_COURSES]);

  const unreadAnnouncements = useMemo(() =>
    COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length,
  [COURSE_ANNOUNCEMENTS]);

  const courseMap = useMemo(() => {
    return new Map(STUDENT_COURSES.map(c => [c.id, c]));
  }, [STUDENT_COURSES]);

  const pendingAssignments = useMemo(() =>
    STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").slice(0, 5),
  [STUDENT_ASSIGNMENTS]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        description="Welcome back, John. Here is your academic overview for the current semester."
      />

      {/* KPI Cards — matched to quizzes page style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Courses */}
        <Card className="p-5 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Active Courses</p>
            <p className="text-3xl font-bold text-foreground">{activeCourses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalCredits} enrolled credits</p>
          </div>
          <img src="https://img.icons8.com/color/96/books.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-20" alt="Courses" />
        </Card>

        {/* Completed */}
        <Card className="p-5 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedCourses}</p>
            <p className="text-xs text-muted-foreground mt-1">Courses finished</p>
          </div>
          <img src="https://img.icons8.com/color/96/approval.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-20" alt="Completed" />
        </Card>

        {/* Due Soon */}
        <Card className="p-5 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Due Soon</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{dueSoon}</p>
            <p className="text-xs text-muted-foreground mt-1">Deadlines within 7 days</p>
          </div>
          <img src="https://img.icons8.com/color/96/hourglass.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-20" alt="Due" />
        </Card>

        {/* Announcements */}
        <Card className="p-5 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Announcements</p>
            <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{unreadAnnouncements}</p>
            <p className="text-xs text-muted-foreground mt-1">Unread notices</p>
          </div>
          <img src="https://img.icons8.com/color/96/appointment-reminders.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-20" alt="Announcements" />
        </Card>
      </div>

      <div className="space-y-8">
        {/* My Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Courses</h2>
            <Link
              prefetch={false}
              href="/student/courses"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              aria-label="View all courses"
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map(course => (
              <Link
                key={course.id}
                prefetch={false}
                href={`/student/courses/${course.id}`}
                className="block group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label={`View course ${course.name}`}
              >
                <Card className="p-4 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-200 h-full">
                  <div className="flex items-center gap-4 h-full">
                    <CircularProgress
                      value={course.progress}
                      size={52}
                      strokeWidth={3}
                      className="shrink-0"
                      labelClassName="text-xs font-semibold"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.credits} cr
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                        {course.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {course.instructor}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {course.due_assignments > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              {course.due_assignments} due
                            </span>
                          )}
                          {course.unread_announcements > 0 && (
                            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                              {course.unread_announcements} new
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {course.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Urgent Deadlines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Urgent Deadlines</h2>
            <Link
              prefetch={false}
              href="/student/assignments"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
              aria-label="View all pending assignments"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Card className="overflow-hidden border-border bg-card p-0 w-full">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[40%] pl-6">Task Name</TableHead>
                  <TableHead className="w-[18%]">Course</TableHead>
                  <TableHead className="w-[14%]">Type</TableHead>
                  <TableHead className="w-[18%]">Due Date</TableHead>
                  <TableHead className="w-[10%] text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAssignments.map(assignment => {
                  const course = courseMap.get(assignment.course_id);
                  const dueDate = new Date(assignment.due_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  dueDate.setHours(0, 0, 0, 0);
                  const diffTime = dueDate.getTime() - today.getTime();
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  const isValidDate = isValid(dueDate);

                  return (
                    <TableRow key={assignment.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium pl-6">
                        <Link
                          prefetch={false}
                          href={`/student/assignments/${assignment.id}`}
                          className="hover:text-primary transition-colors hover:underline"
                          aria-label={`View assignment ${assignment.title}`}
                        >
                          {assignment.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                          {course?.code || "Course"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                          Assignment
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{isValidDate ? format(dueDate, "MMM dd, yyyy") : "Invalid date"}</span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            diffDays < 0 ? "text-red-600 dark:text-red-400" :
                            diffDays <= 2 ? "text-amber-600 dark:text-amber-400" :
                            "text-muted-foreground"
                          )}>
                            {diffDays < 0 ? `${Math.abs(diffDays)} days OVERDUE` : `${diffDays} days left`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50">
                          <Link prefetch={false} href={`/student/assignments/${assignment.id}`} aria-label={`View details for ${assignment.title}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </section>
      </div>
    </div>
  );
}
