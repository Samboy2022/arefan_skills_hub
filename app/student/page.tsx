"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_ASSIGNMENTS, COURSE_ANNOUNCEMENTS, SCHEDULE_EVENTS } from "@/lib/student-mock-data";
import { CoursesIcon, AlertCircleIcon, ClockIcon, BellIcon } from "@/components/shared/colored-icons";
import { Clock, AlertCircle, ArrowRight, CalendarDays, BookOpen, GraduationCap, Award, LayoutGrid } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentDashboard() {
  const activeCourses = STUDENT_COURSES.filter(c => c.status === "active");

  // Calculate academic stats
  const totalCredits = STUDENT_COURSES.reduce((sum, course) => sum + course.credits, 0);
  const dueSoon = STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").length;
  const unreadAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length;

  const upcomingEvent = SCHEDULE_EVENTS[0];
  const recentAnnouncements = COURSE_ANNOUNCEMENTS.slice(0, 4);

  return (
    <div className="space-y-8">
      <Breadcrumb 
        items={[]} 
        showHome={false}
        className="mb-4"
      />
      
      <PageHeader
        title="Student Dashboard"
        description="Welcome back, John. Here is your academic overview for the current semester."
      />

      {/* Academic KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-200 dark:border-emerald-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
            <p className="text-xs text-muted-foreground mb-3">{totalCredits} enrolled credits</p>
            <p className="text-2xl font-bold leading-none">{activeCourses.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/books.png" className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30" alt="Courses" />
        </Card>

        <Card className="border-sky-200 dark:border-sky-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Course Grouping</p>
            <p className="text-xs text-muted-foreground mb-3">Academic categories</p>
            <p className="text-2xl font-bold leading-none">3</p>
          </div>
          <img src="https://img.icons8.com/color/96/opened-folder.png" className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30" alt="Groups" />
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
            <p className="text-xs text-muted-foreground mb-3">Deadlines within 7 days</p>
            <p className="text-2xl font-bold leading-none text-amber-600 dark:text-amber-500">{dueSoon}</p>
          </div>
          <img src="https://img.icons8.com/color/96/test-passed.png" className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30" alt="Assignments" />
        </Card>

        <Card className="border-red-200 dark:border-red-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Announcements</p>
            <p className="text-xs text-muted-foreground mb-3">Unread dept updates</p>
            <p className="text-2xl font-bold leading-none text-red-600 dark:text-red-500">{unreadAnnouncements}</p>
          </div>
          <img src="https://img.icons8.com/color/96/commercial.png" className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30" alt="Announcements" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Your Learning Path */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <img src="https://img.icons8.com/color/48/books.png" alt="Courses" className="h-6 w-6" />
                Current Semester
              </h2>
              <Link href="/student/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View Transcript <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {activeCourses.map(course => (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="block group"
                >
                  <Card className="p-4 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-200 h-full">
                    <div className="flex items-center gap-4 h-full">
                      <CircularProgress
                        value={course.progress}
                        size={48}
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
                            {course.credits} credits
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
                              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {course.due_assignments} due
                              </span>
                            )}
                            {course.unread_announcements > 0 && (
                              <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                <BellIcon className="h-3 w-3" />
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
              <h2 className="text-xl font-bold flex items-center gap-2">
                <img src="https://img.icons8.com/color/48/error.png" alt="Urgent" className="h-6 w-6" />
                Urgent Deadlines
              </h2>
              <Link href="/student/assignments" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Card className="overflow-hidden border-border bg-card p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").slice(0, 5).map(assignment => {
                    const course = STUDENT_COURSES.find(c => c.id === assignment.course_id);
                    const dueDate = new Date(assignment.due_date);
                    const today = new Date();
                    const diffTime = Math.abs(dueDate.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          <Link href={`/student/assignments/${assignment.id}`} className="hover:text-primary transition-colors hover:underline">
                            {assignment.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                            {course?.code || "Course"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">Assignment</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{format(dueDate, 'MMM dd, yyyy')}</span>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{diffDays} days left</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" asChild className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50">
                              <Link href={`/student/assignments/${assignment.id}`}>View</Link>
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

        {/* Sidebar Area (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Department Notices */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <img src="https://img.icons8.com/color/48/appointment-reminders.png" alt="Notices" className="h-7 w-7" />
                Department Notices
              </h2>
              <Link href="/student/announcements" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <Card className="overflow-hidden border-border">
              <ul className="divide-y divide-border">
                {recentAnnouncements.map((announcement) => {
                  const isUrgent    = announcement.priority === "urgent";
                  const isImportant = announcement.priority === "important";

                  const iconSrc = isUrgent
                    ? "https://img.icons8.com/color/96/high-priority.png"
                    : isImportant
                    ? "https://img.icons8.com/color/96/info.png"
                    : "https://img.icons8.com/color/96/appointment-reminders.png";

                  return (
                    <li key={announcement.id}>
                      <Link
                        href="/student/announcements"
                        className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors group"
                      >
                        {/* Icon — neutral background, no coloured tint */}
                        <div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center mt-0.5">
                          <img src={iconSrc} alt="" className="w-4.5 h-4.5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title + unread dot */}
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors",
                              !announcement.is_read ? "font-semibold text-foreground" : "font-medium text-foreground/75"
                            )}>
                              {announcement.title}
                            </p>
                            {!announcement.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                            )}
                          </div>

                          {/* Meta: sender + date */}
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <p className="text-[11px] text-muted-foreground truncate">
                              {announcement.instructor}
                            </p>
                            <time className="text-[11px] text-muted-foreground shrink-0">
                              {format(new Date(announcement.created_at), 'MMM dd')}
                            </time>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-muted/30 border-t border-border text-center">
                <Link
                  href="/student/announcements"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View all notices <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
