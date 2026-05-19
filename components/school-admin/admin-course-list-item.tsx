"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Pencil,
  FilePenLine,
  Trash2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Course } from "@/lib/tenant-types";

function enrollmentPct(course: Course) {
  if (!course.maxStudents) return 0;
  return Math.min(100, Math.round((course.enrollmentCount / course.maxStudents) * 100));
}

export function AdminCourseListItem({
  course,
  variant = "active",
  onDelete,
}: {
  course: Course;
  variant?: "active" | "archived";
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pct = enrollmentPct(course);
  const atCapacity = course.enrollmentCount >= course.maxStudents;

  const viewHref = `/school-admin/courses/${course.id}`;
  const editHref = `/school-admin/courses/${course.id}/edit`;
  const contentHref = `/school-admin/lessons?courseId=${encodeURIComponent(course.id)}`;

  return (
    <>
      <Card className={`relative flex flex-col md:flex-row overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md group ${variant === 'archived' ? 'opacity-90' : ''}`}>
        
        {/* Left: Thumbnail & Code */}
        <div className="relative h-32 md:h-auto md:w-48 lg:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted">
          <Link href={viewHref} className="absolute inset-0 z-[1] block">
            <span className="sr-only">View {course.title}</span>
          </Link>
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="absolute left-3 top-3 z-[2]">
            <span className="rounded bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
              {course.code}
            </span>
          </div>


        </div>

        {/* Center: Metadata */}
        <div className="flex flex-1 flex-col justify-center p-4 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {course.semester} • {course.credits} Credits
            </span>
            {variant === "archived" && (
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider">Archived</span>
            )}
          </div>
          
          <Link href={viewHref}>
            <h4 className="line-clamp-1 mb-2 text-base md:text-lg font-bold leading-snug text-foreground transition-colors hover:text-primary">
              {course.title}
            </h4>
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="font-semibold">{course.enrollmentCount} / {course.maxStudents}</span>
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
            
            {variant !== "archived" && (
               atCapacity ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>At capacity</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Seats available</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 p-4 md:border-l border-border bg-muted/10 md:bg-transparent">
          {variant === "archived" ? (
             <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
               <Button size="sm" variant="outline" className="gap-1.5 flex-1 md:flex-none" asChild>
                  <Link href={viewHref}>
                    <Eye className="h-3.5 w-3.5" />
                    Details
                  </Link>
                </Button>
                <Button size="icon" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
             </div>
          ) : (
            <>
              {/* Desktop Actions */}
              <div className="hidden md:flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <Button size="sm" variant="default" className="flex-1 gap-1.5 transition-all duration-200 hover:scale-[1.02]" asChild>
                    <Link href={viewHref}>
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 transition-all duration-200 hover:scale-[1.02]" asChild>
                    <Link href={editHref}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="outline" className="flex-1 gap-1.5 transition-all duration-200 hover:scale-[1.02]" asChild>
                    <Link href={contentHref}>
                      <FilePenLine className="h-3.5 w-3.5" />
                      Content
                    </Link>
                  </Button>
                  <Button size="icon" variant="outline" className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Actions Dropdown */}
              <div className="flex w-full items-center justify-between md:hidden">
                 <Button size="sm" variant="default" className="gap-1.5 flex-1 mr-2" asChild>
                    <Link href={viewHref}>View</Link>
                  </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={editHref}><Pencil className="mr-2 h-4 w-4" /> Edit Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={contentHref}><FilePenLine className="mr-2 h-4 w-4" /> Edit Content</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course section?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to remove <strong>{course.code}</strong> — {course.title}. Students will lose access after the change is saved in production. This demo only removes the item from your current view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(course.id);
                setDeleteOpen(false);
              }}
            >
              Delete course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
