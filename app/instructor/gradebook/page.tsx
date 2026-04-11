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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Courses", value: totalCourses, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Active Courses", value: activeCourses, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border ${kpi.border} bg-card p-4 flex items-center gap-4 shadow-sm`}>
            <div className={`${kpi.bg} ${kpi.color} rounded-lg p-2.5`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
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

        <div className="rounded-lg border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold w-[40%]">Course</TableHead>
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold text-center">Enrolled Students</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-8 w-8 opacity-30" />
                      <p>No courses found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => {
                  const studentCount = MOCK_STUDENTS.filter(s => s.enrolledCourses.includes(course.id)).length;
                  
                  return (
                    <TableRow key={course.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <span className="font-semibold">{course.title}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50 font-mono text-xs">{course.code}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{studentCount}</span>
                          <span className="text-muted-foreground text-xs">/ {course.maxStudents}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.status === "active" ? (
                          <Badge variant="outline" className="border-transparent bg-emerald-100 text-emerald-700">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground capitalize">{course.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" className="gap-1.5">
                          <Link href={`/instructor/gradebook/${course.id}`}>
                            <FileEdit className="h-4 w-4" />
                            Grade Students
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
