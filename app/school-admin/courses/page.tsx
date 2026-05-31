"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Trash2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { AdminCourseCard } from "@/components/school-admin/admin-course-card";
import { AdminCourseListItem } from "@/components/school-admin/admin-course-list-item";
import { AdminCourseDataTable } from "@/components/school-admin/admin-course-data-table";
import { AdminCourseViewToolbar, ViewMode, SortOption } from "@/components/school-admin/admin-course-view-toolbar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Course } from "@/lib/tenant-types";

import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

const getSeedCourses = (): Course[] => {
  return MOCK_INSTRUCTOR_COURSES.map(c => ({
    id: c.id,
    title: c.title,
    code: c.code,
    categoryId: "science",
    level: "beginner",
    status: c.status === "active" ? "active" : "draft",
    credits: c.credits,
    maxStudents: c.maxStudents,
    enrollmentCount: c.enrollmentCount,
    semester: c.semester,
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600",
    description: c.description,
    createdAt: new Date().toISOString(),
  }));
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_courses");
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse courses", e);
        const seed = getSeedCourses();
        setCourses(seed);
        localStorage.setItem("school_admin_courses", JSON.stringify(seed));
      }
    } else {
      const seed = getSeedCourses();
      setCourses(seed);
      localStorage.setItem("school_admin_courses", JSON.stringify(seed));
    }

    const savedView = localStorage.getItem("instructor-course-view");
    if (savedView === "list" || savedView === "table" || savedView === "grid") {
      setViewMode(savedView as ViewMode);
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
      return parseInt(b.id.replace(/\D/g, "") || "0") - parseInt(a.id.replace(/\D/g, "") || "0");
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

  const draftCourses = useMemo(() => {
    return courses.filter((c) => c.status === "inactive" || c.status === "draft");
  }, [courses]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.size === activeCourses.length && activeCourses.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(activeCourses.map((c) => c.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRowIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRowIds(newSelected);
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedRowIds);
    const updated = courses.filter((c) => !ids.includes(c.id));
    setCourses(updated);
    localStorage.setItem("school_admin_courses", JSON.stringify(updated));
    setSelectedRowIds(new Set());
  };

  const handleDelete = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem("school_admin_courses", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "My Courses" }
        ]} 
        className="mb-2"
      />
      
      <PageHeader
        title="My Courses"
        description="Manage and organize your teaching courses"
        titleAction={
          <div className="flex items-center gap-3">
             <Link href="/school-admin/course-groups">
              <Button variant="outline" className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-primary/20 text-primary hover:bg-primary/5">
                Manage Course Groups
              </Button>
            </Link>
            <Link href="/school-admin/courses/create">
              <Button className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">Create New Course</Button>
            </Link>
          </div>
        }
      />

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center p-6 bg-muted/20">
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
            <img src="https://img.icons8.com/scribby/96/edit-file.png" alt="Draft Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Draft Courses</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{draftCourses.length}</p>
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

          {/* Stretched Bulk Action Toolbar or Filters */}
          {selectedRowIds.size > 0 ? (
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-primary/5 p-4 border border-primary/20 rounded-xl animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
                  {selectedRowIds.size} Courses Selected
                </div>
                <p className="text-xs text-muted-foreground hidden sm:inline">
                  Apply a bulk action to all selected course modules
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleBulkDelete} 
                  className="text-xs h-10 gap-1.5 px-4 flex-1 sm:flex-initial"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>Delete Selected</span>
                </Button>
                <div className="hidden md:block h-6 w-px bg-border/80 mx-1" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRowIds(new Set())} 
                  className="text-xs text-muted-foreground hover:text-foreground h-10 flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <AdminCourseViewToolbar 
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}
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
                <AdminCourseCard
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
                 <AdminCourseListItem course={course} variant="active" onDelete={handleDelete} />
               </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AdminCourseDataTable 
              courses={activeCourses} 
              variant="active" 
              onDelete={handleDelete}
              selectedRowIds={selectedRowIds}
              toggleSelectRow={toggleSelectRow}
              toggleSelectAll={toggleSelectAll}
            />
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
                  <AdminCourseCard course={course} variant="archived" onDelete={handleDelete} />
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
                  <AdminCourseListItem course={course} variant="archived" onDelete={handleDelete} />
                </div>
              ))}
            </div>
          ) : (
            <AdminCourseDataTable 
              courses={archivedCourses} 
              variant="archived" 
              onDelete={handleDelete}
              selectedRowIds={selectedRowIds}
              toggleSelectRow={toggleSelectRow}
              toggleSelectAll={toggleSelectAll}
            />
          )}
        </section>
      )}
    </div>
  );
}
