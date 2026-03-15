"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_ASSIGNMENTS, COURSE_ANNOUNCEMENTS, SCHEDULE_EVENTS } from "@/lib/student-mock-data";
import { CoursesIcon, AlertCircleIcon, ClockIcon, BellIcon } from "@/components/shared/colored-icons";
import { Clock, AlertCircle, ArrowRight, CalendarDays, BookOpen, GraduationCap, Award } from "lucide-react";

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
      <PageHeader
        title="Student Dashboard"
        description="Welcome back, John. Here is your academic overview for the current semester."
      />

      {/* Academic KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <StudentKPICard
          icon={(props: any) => <GraduationCap className="h-5 w-5 text-primary" />}
          title="Current GPA"
          value={currentGPA.toString()}
          hint="Cumulative average"
          variant="default"
          trend={2.5}
        />
        <StudentKPICard
          icon={(props: any) => <BookOpen className="h-5 w-5 text-emerald-600" />}
          title="Active Courses"
          value={activeCourses.length}
          hint={`${totalCredits} enrolled credits`}
          variant="default"
        />
        <StudentKPICard
          icon={(props: any) => <AlertCircle className="h-5 w-5 text-amber-600" />}
          title="Due Soon"
          value={dueSoon}
          hint="Deadlines within 7 days"
          variant="warning"
        />
        <StudentKPICard
          icon={(props: any) => <BellIcon {...props} color="ef4444" />}
          title="Announcements"
          value={unreadAnnouncements}
          hint="Unread department updates"
          variant="danger"
        />
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

            <div className="grid gap-4 md:grid-cols-2">
              {activeCourses.map(course => (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="block group h-full"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card group-hover:border-primary/30 group-hover:shadow-sm transition-all h-full">
                    <CircularProgress
                      value={course.progress}
                      size={52}
                      strokeWidth={4}
                      className="shrink-0"
                      labelClassName="text-[10px]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{course.code}</p>
                      <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{course.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{course.instructor}</p>
                      {course.due_assignments > 0 && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-500 font-medium mt-1">
                          {course.due_assignments} assignment{course.due_assignments !== 1 ? "s" : ""} due
                        </p>
                      )}
                    </div>
                  </div>
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

            <div className="flex flex-col gap-4 w-full lg:w-[70vw] max-w-full">
              {STUDENT_ASSIGNMENTS.filter(a => a.status === "pending").slice(0, 3).map(assignment => {
                const course = STUDENT_COURSES.find(c => c.id === assignment.course_id);
                // Calculate days left
                const dueDate = new Date(assignment.due_date);
                const today = new Date();
                const diffTime = Math.abs(dueDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <Link key={assignment.id} href={`/student/assignments/${assignment.id}`} className="block group h-full">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card group-hover:border-amber-500/30 group-hover:shadow-md transition-all h-full">
                      
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
                          <span className="text-[14px] font-bold text-foreground">{diffDays}</span>
                          <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tight">Days</span>
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">{course?.code}</p>
                        <h4 className="font-bold text-sm leading-tight line-clamp-1 text-foreground mb-1">{assignment.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate">Due {format(dueDate, 'MMM dd')} • {assignment.total_points} pts</span>
                        </div>
                      </div>
                    </div>
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
            <Card className="p-0 overflow-hidden border-primary/10">
              <div className="bg-primary/5 p-4 border-b">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Next Event</p>
                {upcomingEvent ? (
                  <div>
                    <h3 className="font-semibold text-lg">{upcomingEvent.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {format(new Date(upcomingEvent.start_time), 'MMM dd')} at {format(new Date(upcomingEvent.start_time), 'h:mm a')}
                    </p>
                    {upcomingEvent.location && (
                      <p className="text-sm font-medium mt-3 bg-background p-2 rounded text-center border">
                        {upcomingEvent.location}
                      </p>
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
            <Card className="divide-y relative">
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
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={cn("font-medium text-sm leading-tight", !announcement.is_read && "font-bold text-foreground")}>
                      {announcement.title}
                    </h4>
                    {!announcement.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground">
                      From: {announcement.instructor}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
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
