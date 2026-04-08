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
import { BellIcon, AlertCircleIcon, ClockIcon } from "@/components/shared/colored-icons";
import { AlertCircle, ArrowRight, BookOpen, FolderOpen, Clock4, Bell, FileWarning, Info, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentDashboard() {
  // Memoized calculated values (React 19 optimization)
  const activeCourses = useMemo(() => 
    STUDENT_COURSES.filter(c => c.status === "active"), 
  [STUDENT_COURSES]);

  // Calculate academic stats
  const totalCredits = useMemo(() => 
    STUDENT_COURSES.reduce((sum, course) => sum + course.credits, 0), 
  [STUDENT_COURSES]);
  
  const dueSoon = useMemo(() => 
    STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").length, 
  [STUDENT_ASSIGNMENTS]);
  
  const unreadAnnouncements = useMemo(() => 
    COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length, 
  [COURSE_ANNOUNCEMENTS]);

  // Safe array access with null guards
  const upcomingEvent = SCHEDULE_EVENTS.at(0);
  const recentAnnouncements = useMemo(() => 
    COURSE_ANNOUNCEMENTS.slice(0, 4), 
  [COURSE_ANNOUNCEMENTS]);
  
  // Precomputed lookup map for O(1) course lookups (fixes O(n²) anti-pattern)
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

      {/* Academic KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-200 dark:border-emerald-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
            <p className="text-xs text-muted-foreground mb-3">{totalCredits} enrolled credits</p>
            <p className="text-2xl font-bold leading-none">{activeCourses.length}</p>
          </div>
          <BookOpen className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30 text-emerald-600" aria-hidden="true" />
        </Card>

        <Card className="border-sky-200 dark:border-sky-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Course Grouping</p>
            <p className="text-xs text-muted-foreground mb-3">Academic categories</p>
            <p className="text-2xl font-bold leading-none">3</p>
          </div>
          <FolderOpen className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30 text-sky-600" aria-hidden="true" />
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
            <p className="text-xs text-muted-foreground mb-3">Deadlines within 7 days</p>
            <p className="text-2xl font-bold leading-none text-amber-600 dark:text-amber-500">{dueSoon}</p>
          </div>
          <Clock4 className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30 text-amber-600" aria-hidden="true" />
        </Card>

        <Card className="border-red-200 dark:border-red-900 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">Announcements</p>
            <p className="text-xs text-muted-foreground mb-3">Unread dept updates</p>
            <p className="text-2xl font-bold leading-none text-red-600 dark:text-red-500">{unreadAnnouncements}</p>
          </div>
          <Bell className="absolute -right-3 -bottom-3 h-16 w-16 opacity-30 text-red-600" aria-hidden="true" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Your Learning Path */}
          <section>
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <BookOpen className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                 Current Semester
               </h2>
               <Link prefetch={false} href="/student/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1" aria-label="View full course transcript">
                 View Transcript <ArrowRight className="h-4 w-4" />
               </Link>
             </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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
                 <FileWarning className="h-6 w-6 text-amber-600" aria-hidden="true" />
                 Urgent Deadlines
               </h2>
               <Link prefetch={false} href="/student/assignments" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1" aria-label="View all pending assignments">
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
                 {pendingAssignments.map(assignment => {
                     const course = courseMap.get(assignment.course_id);
                      const dueDate = new Date(assignment.due_date);
                      const today = new Date();
                      // Reset time components to properly calculate calendar day difference
                      today.setHours(0, 0, 0, 0);
                      dueDate.setHours(0, 0, 0, 0);
                      const diffTime = dueDate.getTime() - today.getTime();
                      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                     const isValidDate = isValid(dueDate);
                     
                     return (
                       <TableRow key={assignment.id}>
                         <TableCell className="font-medium">
                           <Link prefetch={false} href={`/student/assignments/${assignment.id}`} className="hover:text-primary transition-colors hover:underline" aria-label={`View assignment ${assignment.title}`}>
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
                             <span className="text-sm">{isValidDate ? format(dueDate, 'MMM dd, yyyy') : 'Invalid date'}</span>
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
                         <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50">
                               <Link prefetch={false} href={`/student/assignments/${assignment.id}`} aria-label={`View details for assignment ${assignment.title}`}>View</Link>
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
                 <Info className="h-7 w-7 text-sky-600" aria-hidden="true" />
                 Department Notices
               </h2>
               <Link prefetch={false} href="/student/announcements" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1" aria-label="View all department announcements">
                 View All <ArrowRight className="h-3.5 w-3.5" />
               </Link>
             </div>

            <Card className="overflow-hidden border-border">
              <ul className="divide-y divide-border">
                {recentAnnouncements.map((announcement) => {
                  const isUrgent    = announcement.priority === "urgent";
                  const isImportant = announcement.priority === "important";

                   const announcementDate = new Date(announcement.created_at);
                   const isValidAnnDate = isValid(announcementDate);

                   return (
                     <li key={announcement.id}>
                       <Link
                         prefetch={false}
                         href="/student/announcements"
                         className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                         aria-label={`View announcement: ${announcement.title}`}
                       >
                         {/* Icon */}
                         <div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center mt-0.5">
                           {isUrgent ? (
                             <AlertCircle className="w-4.5 h-4.5 text-red-600" />
                           ) : isImportant ? (
                             <FileWarning className="w-4.5 h-4.5 text-amber-600" />
                           ) : (
                             <Bell className="w-4.5 h-4.5 text-sky-600" />
                           )}
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
                             <time 
                               className="text-[11px] text-muted-foreground shrink-0"
                               dateTime={isValidAnnDate ? announcementDate.toISOString() : undefined}
                             >
                               {isValidAnnDate ? format(announcementDate, 'MMM dd') : 'Unknown date'}
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
