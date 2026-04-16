"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import { STUDENT_COURSES } from "@/lib/student-mock-data";
import { StudentCourseCard } from "@/components/student/student-course-card";
import { StudentCourseListItem } from "@/components/student/student-course-list-item";
import { StudentCourseDataTable } from "@/components/student/student-course-data-table";
import { CourseViewToolbar, ViewMode, SortOption } from "@/components/student/course-view-toolbar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";

export default function MyCoursesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("student-course-view");
    if (saved === "list" || saved === "table" || saved === "grid") {
      setViewMode(saved as ViewMode);
    }
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("student-course-view", mode);
  };

  const processedCourses = useMemo(() => {
    let filtered = [...STUDENT_COURSES];

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q)
      );
    }

    // Apply Sort
    return filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "code") return a.code.localeCompare(b.code);
      if (sortBy === "progress_desc") return b.progress - a.progress;
      if (sortBy === "due_assignments") return b.due_assignments - a.due_assignments;
      
      // Default: recent (enrollment_date)
      return new Date(b.enrollment_date).getTime() - new Date(a.enrollment_date).getTime();
    });
  }, [searchQuery, sortBy]);

  // Memoized calculated values
  const activeCourses = useMemo(() => 
    processedCourses.filter((c) => c.status === "active"), 
  [processedCourses]);
  
  const completedCourses = useMemo(() => 
    processedCourses.filter((c) => c.status === "completed"), 
  [processedCourses]);

  // Calculate stats with proper null guards - fixes division by zero crash
  const totalCredits = useMemo(() => 
    STUDENT_COURSES.reduce((sum, course) => sum + course.credits, 0), 
  [STUDENT_COURSES]);
  
  const averageProgress = useMemo(() => {
    if (activeCourses.length === 0) return 0;
    return Math.round(activeCourses.reduce((sum, course) => sum + course.progress, 0) / activeCourses.length);
  }, [activeCourses]);
  
  const coursesWithDueAssignments = useMemo(() => 
    activeCourses.filter(c => c.due_assignments > 0).length, 
  [activeCourses]);

  return (
    <div className="font-sans">
      <Breadcrumb 
        items={[
          { label: "My Courses" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="My Courses"
        description="View all your enrolled courses and track your progress"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Total Enrolled</p>
            <p className="text-2xl font-bold text-foreground">{STUDENT_COURSES.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/books.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Total" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCourses.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/open-book.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Active" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Avg. Progress</p>
            <p className="text-2xl font-bold text-primary">{averageProgress}%</p>
          </div>
          <img src="https://img.icons8.com/color/96/line-chart.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Progress" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Need Attention</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{coursesWithDueAssignments}</p>
          </div>
          <img src="https://img.icons8.com/color/96/error.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Attention" />
        </Card>
      </div>


      {/* ── Active Courses ── */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Active Courses
              <span className="ml-1 text-sm font-normal text-muted-foreground">
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
            <p className="text-sm text-muted-foreground mb-6 max-w-md">Try adjusting your search criteria or visit the course catalog to enroll.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {activeCourses.map((course, index) => (
              <div 
                key={course.id}
                className="transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StudentCourseCard course={course} variant="active" />
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
                  <StudentCourseListItem course={course} variant="active" />
                </div>
              ))}
           </div>
        ) : (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StudentCourseDataTable courses={activeCourses} variant="active" />
           </div>
        )}
      </div>


      {/* ── Completed Courses ── */}
      {completedCourses.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5 text-green-600" />
              Completed Courses
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({completedCourses.length})
              </span>
            </h2>
          </div>
          
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course, index) => (
                 <div 
                    key={course.id}
                    className="transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <StudentCourseCard course={course} variant="completed" />
                  </div>
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="flex flex-col gap-4">
              {completedCourses.map((course, index) => (
                 <div 
                    key={course.id}
                    className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <StudentCourseListItem course={course} variant="completed" />
                  </div>
              ))}
            </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <StudentCourseDataTable courses={completedCourses} variant="completed" />
             </div>
          )}
        </div>
      )}
    </div>
  );
}
