"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminCourseCard } from "@/components/school-admin/admin-course-card";
import { AdminCourseListItem } from "@/components/school-admin/admin-course-list-item";
import { AdminCourseDataTable } from "@/components/school-admin/admin-course-data-table";
import {
  AdminCourseViewToolbar,
  SortOption,
  StatusFilter,
  ViewMode,
} from "@/components/school-admin/admin-course-view-toolbar";
import { CourseMetadataForm } from "@/components/school-admin/course-metadata-form";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { KPICard } from "@/components/tenant/kpi-card";
import {
  instructorLabels,
  loadCourses,
  loadFaculty,
  removeCourse,
  saveCourse,
  type CourseMetadataInput,
  type SchoolAdminCourse,
} from "@/lib/school-admin-courses";
import type { Faculty } from "@/lib/tenant-types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<SchoolAdminCourse[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [ready, setReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editor, setEditor] = useState<SchoolAdminCourse | null | "create">(null);
  const [pendingDelete, setPendingDelete] = useState<SchoolAdminCourse | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setFaculty(loadFaculty());
    setCourses(loadCourses());
    setReady(true);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const namesFor = useCallback(
    (course: SchoolAdminCourse) => instructorLabels(course, faculty),
    [faculty],
  );

  const visibleCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return courses
      .filter((course) => {
        const status = course.status === "inactive" ? "draft" : course.status;
        if (statusFilter !== "all" && status !== statusFilter) return false;
        if (!query) return true;
        const instructors = namesFor(course).join(" ").toLowerCase();
        return (
          course.title.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          instructors.includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "code") return a.code.localeCompare(b.code);
        if (sortBy === "enrollment") return b.enrollmentCount - a.enrollmentCount;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [courses, searchQuery, sortBy, statusFilter, namesFor]);

  const counts = useMemo(() => {
    return {
      total: courses.length,
      active: courses.filter((course) => course.status === "active").length,
      draft: courses.filter((course) => course.status === "draft" || course.status === "inactive").length,
    };
  }, [courses]);

  const handleSave = (input: CourseMetadataInput) => {
    const editing = editor && editor !== "create" ? editor : null;
    const result = saveCourse(courses, faculty, input, editing?.id);
    setCourses(result.courses);
    setFaculty(result.faculty);
    window.setTimeout(() => setEditor(null), 0);
  };

  const requestDelete = (course: SchoolAdminCourse) => {
    setPendingDelete(course);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    const result = removeCourse(courses, faculty, pendingDelete.id);
    setCourses(result.courses);
    setFaculty(result.faculty);
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Courses" },
        ]}
        className="mb-2"
      />

      <PageHeader
        title="Courses"
        description="Create course records, set their details, and assign instructors."
        titleAction={
          <Button type="button" onClick={() => setEditor("create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create course
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard title="Courses" value={counts.total} hint="Records in this school" icon={BookOpen} color="blue" />
        <KPICard title="Active" value={counts.active} hint="Open for teaching" icon={BookOpen} color="green" />
        <KPICard title="Drafts" value={counts.draft} hint="Not yet active" icon={BookOpen} color="orange" />
      </div>

      <AdminCourseViewToolbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading courses…</p>
      ) : visibleCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <BookOpen className="mb-3 h-8 w-8 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">No courses match this view</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {courses.length === 0
              ? "Create a course to add it to the catalog. Lesson content is not managed here."
              : "Try a different search or status filter."}
          </p>
          {courses.length === 0 ? (
            <Button type="button" className="mt-4" onClick={() => setEditor("create")}>
              Create course
            </Button>
          ) : null}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <AdminCourseCard
              key={course.id}
              course={course}
              instructors={namesFor(course)}
              onEdit={setEditor}
              onDelete={requestDelete}
            />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {visibleCourses.map((course) => (
            <AdminCourseListItem
              key={course.id}
              course={course}
              instructors={namesFor(course)}
              onEdit={setEditor}
              onDelete={requestDelete}
            />
          ))}
        </div>
      ) : (
        <AdminCourseDataTable
          courses={visibleCourses}
          instructorNames={namesFor}
          onEdit={setEditor}
          onDelete={requestDelete}
        />
      )}

      <Dialog open={editor !== null} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent className="max-h-[min(90vh,820px)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editor === "create" ? "Create course" : "Edit course"}</DialogTitle>
            <DialogDescription>
              Course information only. Assign instructors here. Lessons and modules are not part of this form.
            </DialogDescription>
          </DialogHeader>
          {editor !== null ? (
            <CourseMetadataForm
              key={editor === "create" ? "create" : editor.id}
              course={editor === "create" ? null : editor}
              faculty={faculty}
              submitLabel={editor === "create" ? "Create course" : "Save changes"}
              onSubmit={handleSave}
              onCancel={() => setEditor(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        itemName={pendingDelete?.title}
        description={
          pendingDelete
            ? `Delete ${pendingDelete.code ? `${pendingDelete.code} — ` : ""}${pendingDelete.title}? Instructor assignments for this course are removed. This cannot be undone.`
            : undefined
        }
      />
    </div>
  );
}
