"use client";

import { Mail, GraduationCap, Calendar, Edit, AlertTriangle, Phone, User, BookOpen } from "lucide-react";
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

export default function ProfilePage() {
  const avgGpa = useMemo(() => {
    const total = STUDENT_COURSES.reduce((sum, c) => sum + (c.gpa ?? 0), 0);
    return (total / STUDENT_COURSES.length).toFixed(2);
  }, []);

  const totalCredits = useMemo(() =>
    STUDENT_COURSES.reduce((sum, c) => sum + c.credits, 0),
  []);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Profile" }]} className="mb-2" />

      {/* Security Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Default password detected</p>
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
            Please update your password immediately to secure your account.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 text-xs border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40">
          <Link href="/student/profile/edit">Change Password</Link>
        </Button>
      </div>

      {/* Hero Card */}
      <Card className="border-border overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-20 w-20 border-4 border-background ring-2 ring-border shrink-0">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">JD</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1 sm:mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">John Doe</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
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

          <Button asChild size="sm" className="self-start sm:self-auto shrink-0">
            <Link href="/student/profile/edit">
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </Card>

      {/* Stat Strip */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">GPA</p>
            <p className="text-2xl font-bold text-foreground">{avgGpa}</p>
          </div>
          <img src="https://img.icons8.com/color/96/diploma.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Enrolled Credits</p>
            <p className="text-2xl font-bold text-foreground">{totalCredits}</p>
          </div>
          <img src="https://img.icons8.com/color/96/books.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Active Courses</p>
            <p className="text-2xl font-bold text-foreground">{STUDENT_COURSES.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/classroom.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="" />
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Academic Performance Table */}
        <div className="lg:col-span-2">
          <Card className="border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Academic Performance</h2>
              <Link href="/student/grades" className="text-xs font-semibold text-primary hover:underline">
                View Grades
              </Link>
            </div>

            <Table className="w-full table-fixed">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[38%] pl-5">Course</TableHead>
                  <TableHead className="w-[12%]">Code</TableHead>
                  <TableHead className="w-[30%]">Progress</TableHead>
                  <TableHead className="w-[10%] text-center">Grade</TableHead>
                  <TableHead className="w-[10%] text-right pr-5">GPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENT_COURSES.map(course => (
                  <TableRow key={course.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium pl-5 py-3.5">
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="hover:text-primary transition-colors hover:underline line-clamp-1 text-sm"
                      >
                        {course.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
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
          <Card className="border-border p-5">
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
          <Card className="border-border p-5 relative overflow-hidden">
            <img src="https://img.icons8.com/color/96/university.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-10 pointer-events-none" alt="" />
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
