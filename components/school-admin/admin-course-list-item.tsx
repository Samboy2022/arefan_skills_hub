"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SchoolAdminCourse } from "@/lib/school-admin-courses";

export function AdminCourseListItem({
  course,
  instructors,
  onEdit,
  onDelete,
}: {
  course: SchoolAdminCourse;
  instructors: string[];
  onEdit: (course: SchoolAdminCourse) => void;
  onDelete: (course: SchoolAdminCourse) => void;
}) {
  return (
    <Card className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs font-semibold text-muted-foreground">{course.code}</p>
          <Badge variant="outline" className="capitalize">
            {course.status}
          </Badge>
        </div>
        <h3 className="mt-1 font-semibold text-foreground">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {instructors.length > 0 ? instructors.join(", ") : "No instructor assigned"}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => onEdit(course)}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(course)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
