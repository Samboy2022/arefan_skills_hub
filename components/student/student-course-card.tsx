"use client";

import Link from "next/link";
import { AlertCircle, BookOpen, CheckCircle } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import type { StudentCourse } from "@/lib/student-types";

interface StudentCourseCardProps {
  course: StudentCourse;
  variant?: "active" | "completed";
}

const codeBadge =
  "inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/15";

export function StudentCourseCard({ course, variant = "active" }: StudentCourseCardProps) {
  const href = `/student/courses/${course.id}`;
  const isCompleted = variant === "completed";

  return (
    <Link
      href={href}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`View ${isCompleted ? "completed " : ""}course: ${course.name}`}
    >
      <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-200 group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          {isCompleted ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className={codeBadge}>{course.code}</span>
          <span className="text-xs text-muted-foreground">{course.credits} cr</span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {course.name}
        </h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">{course.instructor}</p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {!isCompleted && course.due_assignments > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                {course.due_assignments} due
              </span>
            )}
            {!isCompleted && course.unread_announcements > 0 && (
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-400">
                {course.unread_announcements} new
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-inset ring-primary/20">
                <CheckCircle className="h-3 w-3" /> Completed
              </span>
            )}
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">{course.grade ?? "—"}</span>
        </div>
      </div>
    </Link>
  );
}
