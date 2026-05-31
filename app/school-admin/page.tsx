"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { PageHeader } from "@/components/tenant/page-header";
import { KPICard } from "@/components/tenant/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  StudentsIcon,
  FacultyIcon,
  CoursesIcon,
  CurriculumIcon,
  AwardIcon,
  TransactionsIcon,
  AlertCircleIcon,
} from "@/components/shared/colored-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";
import { TrendingUp, Users, BookOpen, School } from "lucide-react";

import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { mockFaculty, mockClasses, mockCommunications } from "@/lib/tenant-mock-data";

const ENROLLMENT_BAR_DATA = [
  { name: "Comp. Sci", enrolled: 87, capacity: 100 },
  { name: "Civil Eng.", enrolled: 95, capacity: 100 },
  { name: "Political Sci.", enrolled: 80, capacity: 80 },
  { name: "Business Admin", enrolled: 45, capacity: 60 },
  { name: "Mathematics", enrolled: 60, capacity: 80 },
  { name: "Physics", enrolled: 42, capacity: 50 },
];

export default function SchoolAdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic Lists State
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);

    // Load Students
    const savedStudents = localStorage.getItem("school_admin_students");
    if (savedStudents) {
      try { setStudents(JSON.parse(savedStudents)); } catch (e) { setStudents(MOCK_STUDENTS); }
    } else {
      setStudents(MOCK_STUDENTS);
      localStorage.setItem("school_admin_students", JSON.stringify(MOCK_STUDENTS));
    }

    // Load Instructors
    const savedInstructors = localStorage.getItem("school_admin_instructors");
    if (savedInstructors) {
      try { setInstructors(JSON.parse(savedInstructors)); } catch (e) { setInstructors(mockFaculty); }
    } else {
      const courseMappings: Record<string, string[]> = {
        "1": ["course-1", "course-2"],
        "2": ["course-2"],
        "3": ["course-3"],
        "4": ["course-1", "course-3"],
      };
      const seedInstructors = mockFaculty.map(f => ({
        ...f,
        assignedCourses: courseMappings[f.id] || ["course-1"],
      }));
      setInstructors(seedInstructors);
      localStorage.setItem("school_admin_instructors", JSON.stringify(seedInstructors));
    }

    // Load Courses
    const savedCourses = localStorage.getItem("school_admin_courses");
    if (savedCourses) {
      try { setCourses(JSON.parse(savedCourses)); } catch (e) { setCourses(MOCK_INSTRUCTOR_COURSES); }
    } else {
      setCourses(MOCK_INSTRUCTOR_COURSES);
      localStorage.setItem("school_admin_courses", JSON.stringify(MOCK_INSTRUCTOR_COURSES));
    }

    // Load Classes
    const savedClasses = localStorage.getItem("school_admin_classes");
    if (savedClasses) {
      try { setClasses(JSON.parse(savedClasses)); } catch (e) { setClasses(mockClasses); }
    } else {
      setClasses(mockClasses);
      localStorage.setItem("school_admin_classes", JSON.stringify(mockClasses));
    }
  }, []);

  // Recents List
  const recentStudents = useMemo(() => {
    return students.slice(-5).reverse().map((s, idx) => ({
      id: s.id,
      name: s.name,
      rollNumber: s.studentId || `STU00${idx + 1}`,
      program: s.enrolledCourses && s.enrolledCourses.length > 0 
        ? MOCK_INSTRUCTOR_COURSES.find(c => c.id === s.enrolledCourses[0])?.title || "Degree Program"
        : "Degree Program",
      status: s.status === "active" ? "Active" : s.status === "inactive" ? "Inactive" : "Pending",
    }));
  }, [students]);

  // Dynamic KPIs calculations
  const kpis = useMemo(() => {
    return {
      totalStudents: students.length,
      totalFaculty: instructors.length,
      activeClasses: classes.filter(c => c.status === "Active").length,
      totalCourses: courses.length,
    };
  }, [students, instructors, classes, courses]);

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="School Dashboard"
        description="Welcome back! Here is a quick snapshot of your school's activities today."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Total Students"
          value={kpis.totalStudents.toString()}
          hint="Enrolled students across programs"
          icon={(props: any) => <StudentsIcon {...props} color="0369a1" />}
          trend={5.2}
          color="blue"
        />
        <KPICard
          title="Instructors"
          value={kpis.totalFaculty.toString()}
          hint="Active teaching staff"
          icon={(props: any) => <FacultyIcon {...props} color="22C55E" />}
          trend={2}
          color="green"
        />
        <KPICard
          title="Active Classes"
          value={kpis.activeClasses.toString()}
          hint="Currently ongoing classes"
          icon={(props: any) => <CoursesIcon {...props} color="a855f7" />}
          trend={0}
          color="purple"
        />
        <KPICard
          title="Total Courses"
          value={kpis.totalCourses.toString()}
          hint="Published and active courses"
          icon={(props: any) => <CurriculumIcon {...props} color="f97316" />}
          trend={8}
          color="orange"
        />
        <KPICard
          title="Avg Attendance"
          value="94.2%"
          hint="Throughout the school"
          icon={(props: any) => <AwardIcon {...props} color="22C55E" />}
          trend={3}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value="$8,450"
          hint="Needs follow-up soon"
          icon={(props: any) => <TransactionsIcon {...props} color="ef4444" />}
          trend={-2}
          color="red"
        />
      </div>

      {/* Enrollment Bar Chart — full width */}
      <Card className="p-6 border border-border hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Program Enrollment vs Capacity
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active student enrollments compared to maximum program capacity
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold shrink-0">
            <TrendingUp className="h-3.5 w-3.5" />
            92.3% Fill Rate
          </div>
        </div>
        {isMounted ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ENROLLMENT_BAR_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={48}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <ChartTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="enrolled" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Enrolled Students" />
              <Bar dataKey="capacity" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Max Capacity" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-secondary/10 rounded-md animate-pulse">
            <span className="text-sm text-muted-foreground">Loading chart...</span>
          </div>
        )}
      </Card>

      {/* Bottom grid: Recent Students + Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table */}
        <Card className="lg:col-span-2 border border-border border-t-brand/40 border-t-4 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b px-6 py-4">
            <div>
              <h3 className="text-base font-semibold">Recent Students</h3>
              <p className="text-sm text-muted-foreground">Latest students enrolled</p>
            </div>
            <Link
              href="/school-admin/students"
              className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Open Students Page
            </Link>
          </div>
          <div className="px-6 py-4 flex-1">
            <DataTable
              columns={[
                {
                  header: "Name",
                  accessor: "name",
                  cell: (value) => (
                    <span className="font-semibold text-foreground">
                      {value}
                    </span>
                  ),
                },
                {
                  header: "Reg. No.",
                  accessor: "rollNumber",
                  cell: (value) => (
                    <span className="text-xs font-mono text-muted-foreground font-semibold px-2 py-0.5 bg-muted rounded">{value}</span>
                  ),
                },
                {
                  header: "Program",
                  accessor: "program" as any,
                  cell: (value) => (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px] block">{value || "—"}</span>
                  ),
                },
                {
                  header: "Status",
                  accessor: "status",
                  cell: (value) => {
                    const colors: Record<string, string> = {
                      Active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
                      Inactive: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
                      Pending: "bg-amber-100 text-amber-700 border-amber-200"
                    };
                    return (
                      <span
                        className={`capitalize px-2.5 py-0.5 text-[10px] font-bold border rounded-full ${
                          colors[value] || "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {value}
                      </span>
                    );
                  },
                },
              ]}
              data={recentStudents}
              pageSize={5}
            />
          </div>
        </Card>

        <div className="space-y-6 flex flex-col">
          {/* Announcements */}
          <Card className="border border-border border-t-amber-500/40 border-t-4 hover:shadow-md transition-shadow p-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Announcements</h3>
            <div className="space-y-4">
              {mockCommunications.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="pb-3 border-b border-border last:border-b-0">
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full p-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 mt-0.5 flex-shrink-0">
                      <AlertCircleIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(announcement.sentDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-border border-l-brand/40 border-l-4 hover:shadow-md transition-shadow p-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/school-admin/students/create">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Add Student
                </Button>
              </Link>
              <Link href="/school-admin/instructors/create">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <FacultyIcon className="h-3.5 w-3.5 mr-1.5" color="22C55E" />
                  Add Instructor
                </Button>
              </Link>
              <Link href="/school-admin/courses/create">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                  New Course
                </Button>
              </Link>
              <Link href="/school-admin/programs">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <School className="h-3.5 w-3.5 mr-1.5" />
                  Programs
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
