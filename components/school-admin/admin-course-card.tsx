"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SchoolAdminCourse } from "@/lib/school-admin-courses";

export function AdminCourseCard({
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
    <Card className="flex h-full flex-col overflow-hidden border border-border bg-card">
      {course.thumbnail ? (
        <div className="relative aspect-[16/9] w-full bg-muted">
          <Image
            src={course.thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-muted-foreground">{course.code}</p>
            <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">{course.title}</h3>
          </div>
          <Badge variant="outline" className="shrink-0 capitalize">
            {course.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {instructors.length > 0 ? instructors.join(", ") : "No instructor assigned"}
        </p>
        <div className="mt-auto flex gap-2 border-t border-border pt-4">
          <Button type="button" size="sm" variant="secondary" className="flex-1" onClick={() => onEdit(course)}>
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
      </div>
    </Card>
  );
}
