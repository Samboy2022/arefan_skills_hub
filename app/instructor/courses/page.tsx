"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { InstructorCourseCard } from "@/components/instructor/instructor-course-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Course } from "@/lib/instructor-types";

function enrollmentPct(course: Course) {
  if (!course.maxStudents) return 0;
  return Math.min(
    100,
    Math.round((course.enrollmentCount / course.maxStudents) * 100)
  );
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(MOCK_INSTRUCTOR_COURSES);

  const activeCourses = useMemo(
    () => courses.filter((c) => c.status === "active"),
    [courses]
  );
  const archivedCourses = useMemo(
    () => courses.filter((c) => c.status === "archived"),
    [courses]
  );

  const avgEnrollmentFill =
    activeCourses.length > 0
      ? Math.round(
          activeCourses.reduce((sum, c) => sum + enrollmentPct(c), 0) /
            activeCourses.length
        )
      : 0;
  const needAttention = activeCourses.filter(
    (c) => c.enrollmentCount >= c.maxStudents
  ).length;

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses" }
        ]} 
        className="mb-2"
      />
      
      <PageHeader
        title="My Courses"
        description="Manage and organize your teaching courses"
        action={
          <Link href="/instructor/courses/create">
            <Button className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">Create New Course</Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-sky-200 p-4 transition-all duration-200 hover:shadow-md hover:border-sky-300 hover:translate-y-[-2px] dark:border-sky-900 dark:hover:border-sky-800">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Courses
              </p>
              <p className="text-xs text-muted-foreground">All sections</p>
            </div>
            <div className="rounded-full bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 transition-transform duration-200 hover:scale-110">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{courses.length}</p>
        </Card>

        <Card className="border-emerald-200 p-4 transition-all duration-200 hover:shadow-md hover:border-emerald-300 hover:translate-y-[-2px] dark:border-emerald-900 dark:hover:border-emerald-800">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Courses
              </p>
              <p className="text-xs text-muted-foreground">Currently teaching</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 transition-transform duration-200 hover:scale-110">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{activeCourses.length}</p>
        </Card>

        <Card className="border-blue-200 p-4 transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:translate-y-[-2px] dark:border-blue-900 dark:hover:border-blue-800">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. enrollment fill
              </p>
              <p className="text-xs text-muted-foreground">
                Across active sections
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 transition-transform duration-200 hover:scale-110">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{avgEnrollmentFill}%</p>
        </Card>

        <Card className="border-amber-200 p-4 transition-all duration-200 hover:shadow-md hover:border-amber-300 hover:translate-y-[-2px] dark:border-amber-900 dark:hover:border-amber-800">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Need attention
              </p>
              <p className="text-xs text-muted-foreground">At capacity</p>
            </div>
            <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 transition-transform duration-200 hover:scale-110">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{needAttention}</p>
        </Card>
      </div>

      {/* Active Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Active Courses
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              ({activeCourses.length})
            </span>
          </h2>
        </div>

        {activeCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-muted/30">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No active courses yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">Create your first course to start teaching students and managing your class content.</p>
            <Link href="/instructor/courses/create">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {activeCourses.map((course, index) => (
              <div 
                key={course.id}
                className="transition-all duration-300" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <InstructorCourseCard
                  course={course}
                  variant="active"
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Archived Courses Section */}
      {archivedCourses.length > 0 && (
        <section className="space-y-6 pt-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5 text-muted-foreground" />
              Archived Courses
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({archivedCourses.length})
              </span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {archivedCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="transition-all duration-300 opacity-90"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <InstructorCourseCard
                  course={course}
                  variant="archived"
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
