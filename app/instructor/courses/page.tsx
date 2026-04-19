"use client";

import { useMemo, useState, useEffect } from "react";
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
import { CourseListItem } from "@/components/instructor/course-list-item";
import { CourseDataTable } from "@/components/instructor/course-data-table";
import { CourseViewToolbar, ViewMode, SortOption } from "@/components/instructor/course-view-toolbar";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("instructor-course-view");
    if (saved === "list" || saved === "table" || saved === "grid") {
      setViewMode(saved as ViewMode);
    }
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("instructor-course-view", mode);
  };

  const activeCourses = useMemo(() => {
    let filtered = courses.filter((c) => c.status === "active");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "code") return a.code.localeCompare(b.code);
      if (sortBy === "enrollment") {
        const pctA = a.maxStudents ? a.enrollmentCount / a.maxStudents : 0;
        const pctB = b.maxStudents ? b.enrollmentCount / b.maxStudents : 0;
        return pctB - pctA;
      }
      return parseInt(b.id) - parseInt(a.id); // Newest heuristic since no date
    });
  }, [courses, searchQuery, sortBy]);

  const archivedCourses = useMemo(() => {
    let filtered = courses.filter((c) => c.status === "archived");
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [courses, searchQuery]);

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
          <div className="flex items-center gap-3">
             <Link href="/instructor/course-groups">
              <Button variant="outline" className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-primary/20 text-primary hover:bg-primary/5">
                Manage Course Groups
              </Button>
            </Link>
            <Link href="/instructor/courses/create">
              <Button className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">Create New Course</Button>
            </Link>
          </div>
        }
      />

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/book.png" alt="Total Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Courses</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{courses.length}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4">
            <img src="https://img.icons8.com/scribby/96/check.png" alt="Active Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Group Course</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{activeCourses.length}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Avg Enrollment" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Avg Enrollment %</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">{avgEnrollmentFill}%</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/error.png" alt="Need Attention" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Need Attention</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{needAttention}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Courses Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center text-foreground">
              Group Course
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({activeCourses.length})
              </span>
            </h2>
          </div>

          <CourseViewToolbar 
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {activeCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-muted/30">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No active courses found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">Try adjusting your search criteria or create a new course.</p>
          </div>
        ) : viewMode === "grid" ? (
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
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {activeCourses.map((course, index) => (
               <div 
                key={course.id}
                className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                 <CourseListItem course={course} variant="active" onDelete={handleDelete} />
               </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CourseDataTable courses={activeCourses} variant="active" onDelete={handleDelete} />
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

          {viewMode === "grid" ? (
             <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {archivedCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="transition-all duration-300 opacity-90"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <InstructorCourseCard course={course} variant="archived" onDelete={handleDelete} />
                </div>
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="flex flex-col gap-4">
              {archivedCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="transition-all duration-300 opacity-90"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CourseListItem course={course} variant="archived" onDelete={handleDelete} />
                </div>
              ))}
            </div>
          ) : (
            <CourseDataTable courses={archivedCourses} variant="archived" onDelete={handleDelete} />
          )}
        </section>
      )}
    </div>
  );
}
