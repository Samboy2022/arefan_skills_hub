"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SchoolAdminCourse } from "@/lib/school-admin-courses";

function statusLabel(status: SchoolAdminCourse["status"]) {
  if (status === "active") return "Active";
  if (status === "archived") return "Archived";
  if (status === "inactive") return "Inactive";
  return "Draft";
}

function statusClass(status: SchoolAdminCourse["status"]) {
  if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "archived") return "border-border bg-muted text-muted-foreground";
  return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
}

export function AdminCourseDataTable({
  courses,
  instructorNames,
  onEdit,
  onDelete,
}: {
  courses: SchoolAdminCourse[];
  instructorNames: (course: SchoolAdminCourse) => string[];
  onEdit: (course: SchoolAdminCourse) => void;
  onDelete: (course: SchoolAdminCourse) => void;
}) {
  if (courses.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-[220px]">Course</TableHead>
              <TableHead className="w-[110px]">Code</TableHead>
              <TableHead className="min-w-[180px]">Instructors</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[160px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const names = instructorNames(course);
              return (
                <TableRow key={course.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{course.title}</p>
                    {course.semester ? (
                      <p className="text-xs text-muted-foreground">{course.semester}</p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold tracking-wide">{course.code || "—"}</span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {names.length > 0 ? names.join(", ") : <span className="text-muted-foreground">Unassigned</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusClass(course.status)}>
                      {statusLabel(course.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(course)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(course)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
