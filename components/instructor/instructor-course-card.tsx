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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Course } from "@/lib/instructor-types";

function enrollmentPct(course: Course) {
  if (!course.maxStudents) return 0;
  return Math.min(
    100,
    Math.round((course.enrollmentCount / course.maxStudents) * 100)
  );
}

type Variant = "active" | "archived";

export function InstructorCourseCard({
  course,
  variant = "active",
  onDelete,
}: {
  course: Course;
  variant?: Variant;
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pct = enrollmentPct(course);
  const atCapacity = course.enrollmentCount >= course.maxStudents;
  const initials =
    course.code.replace(/[^A-Za-z]/g, "").slice(0, 2) || "—";

  const viewHref = `/instructor/courses/${course.id}`;
  const editHref = `/instructor/courses/${course.id}/edit`;
  const contentHref = `/instructor/lessons?courseId=${encodeURIComponent(course.id)}`;

  if (variant === "archived") {
    return (
      <div className="h-full">
        <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:translate-y-[-2px] group">
          <div className="relative h-32 w-full overflow-hidden border-b border-border bg-muted">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover opacity-60 transition-all duration-500 scale-105 hover:scale-100 hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            <div className="absolute left-4 top-4">
              <span className="rounded-sm border border-border bg-background px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground">
                {course.code}
              </span>
            </div>

            <div className="absolute -bottom-6 right-6 z-10 flex items-center justify-center rounded-full border border-border bg-card p-1 shadow-none">
              <CircularProgress
                value={100}
                size={42}
                strokeWidth={4}
                className="shrink-0 bg-card"
                labelClassName="text-[10px] font-bold text-green-600"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-card p-6 pt-10">
            <h4 className="mb-4 line-clamp-2 text-base font-bold leading-snug text-foreground">
              {course.title}
            </h4>

            <div className="mb-4 flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 p-2.5">
              <Avatar className="h-8 w-8 border border-border shadow-none">
                <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-wider text-foreground">
                  {course.semester}
                </p>
                <p className="truncate text-[10px] uppercase tracking-tight text-muted-foreground">
                  {course.credits} Academic Credits
                </p>
              </div>
            </div>

            <div className="mt-auto space-y-3 border-t border-border pt-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <Link href={viewHref}>
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <Link href={editHref}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <Link href={contentHref}>
                    <FilePenLine className="h-3.5 w-3.5" />
                    Content
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span>Archived</span>
                <Link
                  href={viewHref}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  Details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this section?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{course.code}</strong> —{" "}
                {course.title} from your list. This action cannot be undone in
                the live product without administrator support.
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
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:translate-y-[-4px] group">
        <div className="relative aspect-[16/9] w-full border-b border-border bg-muted">
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

          <div className="absolute left-4 top-4 z-[2]">
            <span className="rounded bg-background px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
              {course.code}
            </span>
          </div>

          <div className="absolute -bottom-6 right-5 z-[2] flex items-center justify-center rounded-full border border-border bg-card p-1">
            <CircularProgress
              value={pct}
              size={48}
              strokeWidth={4}
              className="shrink-0 bg-card"
              labelClassName="text-xs font-bold text-foreground"
            />
          </div>
        </div>

        <div className="relative z-[2] flex flex-1 flex-col bg-card p-5 pt-8">
          <span className="mb-2 block text-[13px] font-medium text-muted-foreground">
            {course.credits} Credits · {course.semester}
          </span>
          <Link href={viewHref}>
            <h4 className="mb-6 line-clamp-2 text-left text-lg font-bold leading-snug text-foreground transition-colors hover:text-primary">
              {course.title}
            </h4>
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {course.enrollmentCount} / {course.maxStudents} students
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Enrollment
              </p>
            </div>
          </div>

          <div className="mb-4 border-t border-border pt-4">
            {atCapacity ? (
              <div className="flex items-center gap-2 rounded border border-amber-200/50 bg-amber-50/50 px-3 py-2.5 text-[13px] font-medium text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Section at enrollment capacity</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-2.5 text-[13px] font-medium text-primary dark:border-primary/20 dark:bg-primary/10">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Seats available</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
             <Button size="sm" variant="default" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" asChild>
               <Link href={viewHref}>
                 <Eye className="h-3.5 w-3.5" />
                 View course
               </Link>
             </Button>
             <Button size="sm" variant="outline" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" asChild>
               <Link href={editHref}>
                 <Pencil className="h-3.5 w-3.5" />
                 Edit details
               </Link>
             </Button>
             <Button size="sm" variant="outline" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" asChild>
               <Link href={contentHref}>
                 <FilePenLine className="h-3.5 w-3.5" />
                 Edit content
               </Link>
             </Button>
             <Button
               size="sm"
               variant="outline"
               className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
               onClick={() => setDeleteOpen(true)}
             >
               <Trash2 className="h-3.5 w-3.5" />
               Delete
             </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course section?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to remove <strong>{course.code}</strong> —{" "}
              {course.title}. Students will lose access after the change is
              saved in production. This demo only removes the card from your
              current view.
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
    </div>
  );
}
