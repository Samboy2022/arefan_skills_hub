"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MOCK_INSTRUCTOR_COURSES, MOCK_STUDENTS } from "@/lib/instructor-mock-data";
import { FileEdit, Search, Users, BookOpen, AlertCircle, TrendingUp } from "lucide-react";

export default function GradebookPage() {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return MOCK_INSTRUCTOR_COURSES;
    const q = search.toLowerCase();
    return MOCK_INSTRUCTOR_COURSES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // KPI Calculations
  const totalCourses = MOCK_INSTRUCTOR_COURSES.length;
  const activeCourses = MOCK_INSTRUCTOR_COURSES.filter(c => c.status === "active").length;
  const totalStudents = MOCK_STUDENTS.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Gradebook" }
        ]} 
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground mt-1">Select a course to view and grade your students</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/book.png" alt="Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Courses</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{totalCourses}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 py-4 sm:py-0 border-t sm:border-t-0">
            <img src="https://img.icons8.com/scribby/96/check.png" alt="Active" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Courses</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{activeCourses}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 border-t sm:border-t-0 pt-4 sm:pt-0">
            <img src="https://img.icons8.com/scribby/96/user.png" alt="Students" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Students</p>
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 leading-none">{totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
          <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_140px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Course</span>
            <span>Code</span>
            <span className="text-center">Enrolled Students</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <div className="divide-y divide-border">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-8 w-8 opacity-30" />
                    <p>No courses found matching your search.</p>
                  </div>
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const studentCount = MOCK_STUDENTS.filter(s => s.enrolledCourses.includes(course.id)).length;
                  return (
                    <div key={course.id} className="block transition-colors hover:bg-muted/10">
                      <div className="md:hidden px-5 py-4 space-y-3">
                         <div className="flex justify-between items-start gap-4">
                            <div>
                               <p className="font-semibold text-sm">{course.title}</p>
                               <p className="text-xs text-muted-foreground">{course.code}</p>
                            </div>
                            {course.status === "active" ? (
                              <Badge variant="outline" className="border-transparent bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] px-1.5 py-0 h-5">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground font-bold uppercase text-[10px] px-1.5 py-0 h-5 capitalize">{course.status}</Badge>
                            )}
                         </div>
                         <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                               <Users className="h-3.5 w-3.5" />
                               <span className="font-medium text-foreground">{studentCount}</span>/{course.maxStudents}
                            </div>
                            <Button asChild size="sm" className="h-8 text-xs gap-1.5 shadow-sm">
                               <Link href={`/instructor/gradebook/${course.id}`}>
                                 <FileEdit className="h-3 w-3" /> Grade
                               </Link>
                            </Button>
                         </div>
                      </div>

                      <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_140px] gap-4 items-center px-5 py-4">
                         <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                               <BookOpen className="h-4 w-4 text-blue-600" />
                             </div>
                             <span className="font-medium text-sm text-foreground truncate">{course.title}</span>
                         </div>
                         <div>
                            <span className="bg-muted/50 font-mono text-xs px-2 py-0.5 rounded border">{course.code}</span>
                         </div>
                         <div className="flex items-center justify-center gap-1.5">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{studentCount}</span>
                            <span className="text-muted-foreground text-xs">/ {course.maxStudents}</span>
                         </div>
                         <div>
                            {course.status === "active" ? (
                              <Badge variant="outline" className="border-transparent bg-emerald-100 text-emerald-700 shadow-sm font-medium">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground capitalize font-medium shadow-sm">{course.status}</Badge>
                            )}
                         </div>
                         <div className="flex justify-end">
                            <Button asChild size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 shadow-sm">
                              <Link href={`/instructor/gradebook/${course.id}`}>
                                <FileEdit className="h-3.5 w-3.5" />
                                Open Grades
                              </Link>
                            </Button>
                         </div>
                      </div>
                    </div>
                  );
                })
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
