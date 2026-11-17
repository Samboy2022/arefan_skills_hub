"use client";

import { Mail, GraduationCap, Calendar, Edit, AlertTriangle, Phone, User, BookOpen, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_GRADES } from "@/lib/student-mock-data";
import Link from "next/link";
import { useMemo } from "react";
import { listCardClass, pageStackClass, statGridClass, tableHeadClass, tableHeadRowClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";

export default function ProfilePage() {
  const avgGpa = useMemo(() => {
    const total = STUDENT_COURSES.reduce((sum, c) => sum + (c.gpa ?? 0), 0);
    return (total / STUDENT_COURSES.length).toFixed(2);
  }, []);

  const totalCredits = useMemo(() =>
    STUDENT_COURSES.reduce((sum, c) => sum + c.credits, 0),
  []);

  const pendingWork = useMemo(() =>
    STUDENT_COURSES.reduce((sum, c) => sum + c.due_assignments, 0),
  []);

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Profile" }]} className="mb-2" />

      {/* Security Warning */}
      <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30 sm:flex-row sm:items-center">
        <div className="flex flex-1 min-w-0 items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Default password detected</p>
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
            Please update your password immediately to secure your account.
          </p>
        </div>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 self-start border-amber-300 bg-transparent text-xs hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40 sm:self-auto">
          <Link href="/student/profile/edit#password">Change Password</Link>
        </Button>
      </div>

      {/* Hero Card */}
      <Card className="gap-0 py-0 rounded-2xl border-border shadow-none overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-20 w-20 border-4 border-background ring-2 ring-border shrink-0">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John Doe" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">JD</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1 sm:mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">John Doe</h1>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                Verified Student
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                john.doe@university.edu
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                Computer Science
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Class of 2024
              </span>
            </div>
          </div>

          <Button asChild size="sm" className="shrink-0 gap-1.5 self-start sm:self-auto">
            <Link href="/student/profile/edit">
              <Edit className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </Card>

      <div className={statGridClass}>
        <StudentKPICard title="GPA" value={avgGpa} icon={GraduationCap} variant="purple" />
        <StudentKPICard title="Enrolled Credits" value={totalCredits} icon={BookOpen} />
        <StudentKPICard title="Active Courses" value={STUDENT_COURSES.length} icon={User} />
        <StudentKPICard title="Pending Work" value={pendingWork} icon={ClipboardList} variant="warning" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Academic Performance Table */}
        <div className="lg:col-span-2">
          <Card className={listCardClass}>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Academic Performance</h2>
              <Link href="/student/grades" className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10">
                View Grades
              </Link>
            </div>

            {/* Mobile card layout */}
            <div className="lg:hidden divide-y divide-border">
              {STUDENT_COURSES.map(course => (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="block px-4 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground line-clamp-1">{course.name}</p>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">
                        {course.code}
                      </span>
                    </div>
                    <span className={cn(
                      "text-sm font-bold shrink-0",
                      course.grade?.startsWith("A") ? "text-emerald-600 dark:text-emerald-400" :
                      course.grade?.startsWith("B") ? "text-blue-600 dark:text-blue-400" :
                      "text-amber-600 dark:text-amber-400"
                    )}>
                      {course.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={course.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold text-muted-foreground w-8 shrink-0">{course.progress}%</span>
                    <span className="text-xs text-muted-foreground">GPA: {course.gpa?.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop table layout */}
            <Table className="w-full table-fixed hidden lg:table">
              <TableHeader>
                <TableRow className={tableHeadRowClass}>
                  <TableHead className={cn(tableHeadClass, "w-[38%] pl-5")}>Course</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[12%]")}>Code</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[30%]")}>Progress</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[10%] text-center")}>Grade</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[10%] text-right pr-5")}>GPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENT_COURSES.map(course => (
                  <TableRow key={course.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium pl-5 py-3.5">
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="hover:text-primary transition-colors hover:underline line-clamp-1 text-sm"
                      >
                        {course.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">
                        {course.code}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2">
                        <Progress value={course.progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-muted-foreground w-8 shrink-0">{course.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      <span className={cn(
                        "text-sm font-bold",
                        course.grade?.startsWith("A") ? "text-emerald-600 dark:text-emerald-400" :
                        course.grade?.startsWith("B") ? "text-blue-600 dark:text-blue-400" :
                        "text-amber-600 dark:text-amber-400"
                      )}>
                        {course.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-5 py-3.5 text-sm font-semibold text-muted-foreground">
                      {course.gpa?.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">

          {/* Personal Info */}
          <Card className="gap-0 p-5 rounded-2xl border-border shadow-none">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">University Email</p>
                  <p className="text-sm font-medium text-foreground">john.doe@university.edu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">Computer Science</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Institution Info */}
          <Card className="gap-0 p-5 rounded-2xl border-border shadow-none relative overflow-hidden">
            <img src="https://img.icons8.com/color/96/university.png" className="absolute right-3 top-3 h-10 w-10 opacity-20 pointer-events-none" alt="" aria-hidden="true" />
            <h3 className="font-semibold text-foreground mb-4 text-sm relative z-10">Institution</h3>
            <div className="space-y-3 relative z-10">
              <div>
                <p className="text-[11px] text-muted-foreground">Student ID</p>
                <p className="text-sm font-medium text-foreground font-mono">#UNIV-2024-8842</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Campus</p>
                <p className="text-sm font-medium text-foreground">Main University Campus</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Academic Advisor</p>
                <p className="text-sm font-medium text-foreground">Dr. Michael Henderson</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Year</p>
                <p className="text-sm font-medium text-foreground">Class of 2024</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
