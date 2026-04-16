"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Pencil,
  FilePenLine,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Course } from "@/lib/instructor-types";

function enrollmentPct(course: Course) {
  if (!course.maxStudents) return 0;
  return Math.min(100, Math.round((course.enrollmentCount / course.maxStudents) * 100));
}

export function CourseDataTable({
  courses,
  variant = "active",
  onDelete,
}: {
  courses: Course[];
  variant?: "active" | "archived";
  onDelete: (id: string) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="min-w-[200px]">Course</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const viewHref = `/instructor/courses/${course.id}`;
              const editHref = `/instructor/courses/${course.id}/edit`;
              const contentHref = `/instructor/lessons?courseId=${encodeURIComponent(course.id)}`;
              const pct = enrollmentPct(course);
              const atCapacity = course.enrollmentCount >= course.maxStudents;

              return (
                <TableRow key={course.id} className={variant === 'archived' ? 'opacity-80' : ''}>
                  <TableCell className="font-medium">
                    <span className="rounded bg-muted px-2 py-1 text-xs font-bold uppercase tracking-wide">
                      {course.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={viewHref} className="font-semibold text-foreground hover:text-primary transition-colors hover:underline line-clamp-1 block">
                      {course.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">{course.credits} Credits</span>
                  </TableCell>
                  <TableCell className="text-sm">{course.semester}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {course.enrollmentCount} / {course.maxStudents}
                      </span>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${variant === "archived" ? "bg-muted-foreground" : atCapacity ? "bg-amber-500" : "bg-primary"}`} 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {variant === "archived" ? (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">Archived</Badge>
                    ) : atCapacity ? (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-500">Full</Badge>
                    ) : (
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={viewHref}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                        </DropdownMenuItem>
                        {variant !== "archived" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={editHref}><Pencil className="mr-2 h-4 w-4" /> Edit Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={contentHref}><FilePenLine className="mr-2 h-4 w-4" /> Edit Content</Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => setDeleteId(course.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Section
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course section?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? Students will lose access after the change is saved in production. This demo only removes the item from your current view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
