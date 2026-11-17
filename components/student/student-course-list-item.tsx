"use client";

import Link from "next/link";
import { AlertCircle, BookOpen, CheckCircle, FileText, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { rowActionClass } from "@/lib/student-ui";
import type { StudentCourse } from "@/lib/student-types";

interface StudentCourseListItemProps {
  course: StudentCourse;
  variant?: "active" | "completed";
}

const codeBadge =
  "inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/15";

export function StudentCourseListItem({ course, variant = "active" }: StudentCourseListItemProps) {
  const href = `/student/courses/${course.id}`;
  const isCompleted = variant === "completed";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {isCompleted ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        ) : (
          <CircularProgress
            value={course.progress}
            size={44}
            strokeWidth={3}
            className="shrink-0"
            labelClassName="text-[10px] font-semibold"
          />
        )}
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={codeBadge}>{course.code}</span>
            <span className="text-xs text-muted-foreground">{course.credits} credits</span>
            {isCompleted && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-inset ring-primary/20">
                Completed
              </span>
            )}
          </div>
          <Link href={href} className="line-clamp-1 font-semibold text-foreground transition-colors hover:text-primary">
            {course.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{course.instructor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                <CheckCircle className="h-3.5 w-3.5" />
                Final grade {course.grade}
              </span>
            ) : course.due_assignments > 0 ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {course.due_assignments} pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Up to date
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch">
        {isCompleted ? (
          <Button size="sm" variant="outline" className={rowActionClass} asChild>
            <Link href={href}>
              <FileText className="h-3.5 w-3.5" />
              Details
            </Link>
          </Button>
        ) : (
          <>
            <Button size="sm" className={rowActionClass} asChild>
              <Link href={href}>
                <PlayCircle className="h-3.5 w-3.5" />
                Resume
              </Link>
            </Button>
            <Button size="sm" variant="outline" className={rowActionClass} asChild>
              <Link href={`${href}#syllabus`}>
                <BookOpen className="h-3.5 w-3.5" />
                Syllabus
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
