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
import { Clock, AlertCircle, ArrowRight, CalendarDays, BookOpen, GraduationCap, Award } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function StudentDashboard() {
  const activeCourses = STUDENT_COURSES.filter(c => c.status === "active");

  // Calculate academic stats
  const totalCredits = STUDENT_COURSES.reduce((sum, course) => sum + course.credits, 0);
  const currentGPA = (STUDENT_COURSES.reduce((sum, course) => sum + (course.gpa || 0), 0) / STUDENT_COURSES.length).toFixed(1);
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
        <Card className="border-sky-200 dark:border-sky-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current GPA</p>
              <p className="text-xs text-muted-foreground">Cumulative average</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{currentGPA}</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <p className="text-xs text-muted-foreground">{totalCredits} enrolled credits</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{activeCourses.length}</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
              <p className="text-xs text-muted-foreground">Deadlines within 7 days</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{dueSoon}</p>
        </Card>

        <Card className="border-red-200 dark:border-red-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Announcements</p>
              <p className="text-xs text-muted-foreground">Unread department updates</p>
            </div>
            <div className="rounded-full p-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <BellIcon className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{unreadAnnouncements}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Your Learning Path */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
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
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Urgent Deadlines
              </h2>
              <Link href="/student/assignments" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").slice(0, 3).map(assignment => {
                const course = STUDENT_COURSES.find(c => c.id === assignment.course_id);
                // Calculate days left
                const dueDate = new Date(assignment.due_date);
                const today = new Date();
                const diffTime = Math.abs(dueDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <Link key={assignment.id} href={`/student/assignments/${assignment.id}`} className="block group">
                    <Card className="p-4 group-hover:border-amber-500/30 group-hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-4">
                        
                        {/* Circular "Days Left" Indicator */}
                        <div className="relative inline-flex items-center justify-center shrink-0">
                          <svg width={56} height={56} className="-rotate-90">
                            <circle cx={28} cy={28} r={24} fill="none" stroke="currentColor" strokeWidth={4} className="text-amber-100 dark:text-amber-900/30" />
                            <circle 
                              cx={28} cy={28} r={24} fill="none" stroke="currentColor" strokeWidth={4} 
                              strokeDasharray={2 * Math.PI * 24} 
                              strokeDashoffset={(2 * Math.PI * 24) * 0.25} // fixed 75% visual for urgency
                              strokeLinecap="round" 
                              className="text-amber-500" 
                            />
                          </svg>
                          <span className="absolute flex flex-col items-center justify-center leading-none">
                            <span className="text-sm font-bold text-foreground">{diffDays}</span>
                            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tight">Days</span>
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                              {course?.code}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.total_points} pts
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground mb-1 group-hover:text-amber-600 transition-colors">
                            {assignment.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span className="truncate">Due {format(dueDate, 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Area (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Upcoming Event (Academic Calendar) */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Academic Calendar
            </h2>
            <Card className="overflow-hidden">
              <div className="bg-primary/5 p-4 border-b">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Next Event</p>
                {upcomingEvent ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{upcomingEvent.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(upcomingEvent.start_time), 'MMM dd, yyyy')} at {format(new Date(upcomingEvent.start_time), 'h:mm a')}</span>
                    </div>
                    {upcomingEvent.location && (
                      <div className="bg-background p-3 rounded-lg border text-center">
                        <span className="text-sm font-medium">{upcomingEvent.location}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
                )}
              </div>
              <div className="p-3 bg-muted/30 text-center">
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                  Open Full Calendar
                </Link>
              </div>
            </Card>
          </section>

          {/* Department Announcements */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-red-500" />
              Department Notices
            </h2>
            <Card className="divide-y overflow-hidden">
              {/* Highlight bar for unread */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500/20 to-transparent rounded-l-xl z-0 pointer-events-none" />

              {recentAnnouncements.map(announcement => (
                <div
                  key={announcement.id}
                  className={cn(
                    "p-4 relative z-10 transition-colors hover:bg-muted/50 cursor-pointer",
                    !announcement.is_read && "bg-red-50/50 dark:bg-red-900/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={cn("font-medium text-sm leading-tight", !announcement.is_read && "font-semibold text-foreground")}>
                      {announcement.title}
                    </h4>
                    {!announcement.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      From: {announcement.instructor}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(new Date(announcement.created_at), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-muted/30 text-center relative z-10">
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                  View All Notices
                </Link>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
