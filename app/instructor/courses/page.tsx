"use client";

import { useMemo, useState } from "react";
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
    <div className="font-sans space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="My Courses"
          description="Manage and organize your teaching courses"
          action={<Button>Create New Course</Button>}
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="border-sky-200 p-3 transition-shadow hover:shadow-md dark:border-sky-900">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Courses
              </p>
              <p className="text-xs text-muted-foreground">All sections</p>
            </div>
            <div className="rounded-full bg-sky-100 p-1.5 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{courses.length}</p>
        </Card>

        <Card className="border-emerald-200 p-3 transition-shadow hover:shadow-md dark:border-emerald-900">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Courses
              </p>
              <p className="text-xs text-muted-foreground">Currently teaching</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{activeCourses.length}</p>
        </Card>

        <Card className="border-blue-200 p-3 transition-shadow hover:shadow-md dark:border-blue-900">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. enrollment fill
              </p>
              <p className="text-xs text-muted-foreground">
                Across active sections
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{avgEnrollmentFill}%</p>
        </Card>

        <Card className="border-amber-200 p-3 transition-shadow hover:shadow-md dark:border-amber-900">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Need attention
              </p>
              <p className="text-xs text-muted-foreground">At capacity</p>
            </div>
            <div className="rounded-full bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{needAttention}</p>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Active Courses
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            ({activeCourses.length})
          </span>
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCourses.map((course) => (
            <InstructorCourseCard
              key={course.id}
              course={course}
              variant="active"
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {archivedCourses.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 flex items-center gap-3 border-t border-border pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            <Award className="h-4 w-4" />
            Archived sections
            <span className="ml-1 text-xs font-normal text-muted-foreground/60">
              ({archivedCourses.length})
            </span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {archivedCourses.map((course) => (
              <InstructorCourseCard
                key={course.id}
                course={course}
                variant="archived"
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
