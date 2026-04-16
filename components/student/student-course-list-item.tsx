"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  AlertCircle,
  PlayCircle,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { StudentCourse } from "@/lib/student-types";

interface StudentCourseListItemProps {
  course: StudentCourse;
  variant?: "active" | "completed";
}

export function StudentCourseListItem({
  course,
  variant = "active",
}: StudentCourseListItemProps) {
  const href = `/student/courses/${course.id}`;

  return (
    <Card className={`relative flex flex-col md:flex-row overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md group ${variant === 'completed' ? 'opacity-90' : ''}`}>
      
      {/* Left: Thumbnail & Code */}
      <div className="relative h-32 md:h-auto md:w-48 lg:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted overflow-hidden">
        <Link href={href} className="absolute inset-0 z-[1] block">
          <span className="sr-only">View {course.name}</span>
        </Link>
        <Image
          src={course.thumbnail}
          alt={course.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        <div className="absolute left-3 top-3 z-[2]">
          <span className="rounded bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
            {course.code}
          </span>
        </div>

        <div className="absolute -bottom-3 -right-3 z-[2] flex items-center justify-center rounded-full border border-border bg-card p-0.5">
           <CircularProgress
              value={variant === "completed" ? 100 : course.progress}
              size={36}
              strokeWidth={3}
              className="shrink-0 bg-card"
              labelClassName={`text-[10px] font-bold ${variant === "completed" ? "text-green-600" : "text-foreground"}`}
            />
        </div>
      </div>

      {/* Center: Metadata */}
      <div className="flex flex-1 flex-col justify-center p-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {course.credits} Credits
          </span>
          {variant === "completed" && (
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider">Completed</span>
          )}
        </div>
        
        <Link href={href}>
          <h4 className="line-clamp-1 mb-2 text-base md:text-lg font-bold leading-snug text-foreground transition-colors hover:text-primary">
            {course.name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5 border border-border shadow-none">
              <AvatarImage src={course.instructor_avatar} />
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                {course.instructor.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground block truncate">{course.instructor}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto">
          {variant === "completed" ? (
             <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Final Grade: {course.grade}</span>
             </div>
          ) : (
            course.due_assignments > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{course.due_assignments} pending task{course.due_assignments !== 1 ? 's' : ''}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Up to date</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 p-4 md:border-l border-border bg-muted/10 md:bg-transparent">
        {variant === "completed" ? (
            <Button size="sm" variant="outline" className="w-full md:w-auto gap-1.5" asChild>
              <Link href={href}>
                <FileText className="h-3.5 w-3.5" />
                Details
              </Link>
            </Button>
        ) : (
            <div className="flex w-full md:w-auto flex-col gap-2 justify-center">
                <Button size="sm" variant="default" className="w-full gap-1.5 transition-all duration-200 hover:scale-[1.02]" asChild>
                  <Link href={href}>
                    <PlayCircle className="h-3.5 w-3.5" />
                    Resume
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full gap-1.5 transition-all duration-200 hover:scale-[1.02]" asChild>
                  <Link href={`${href}#syllabus`}>
                    <FileText className="h-3.5 w-3.5" />
                    Syllabus
                  </Link>
                </Button>
            </div>
        )}
      </div>
    </Card>
  );
}
