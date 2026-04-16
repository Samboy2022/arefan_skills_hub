"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import type { StudentCourse } from "@/lib/student-types";

interface StudentCourseCardProps {
  course: StudentCourse;
  variant?: "active" | "completed";
}

export function StudentCourseCard({
  course,
  variant = "active",
}: StudentCourseCardProps) {
  const href = `/student/courses/${course.id}`;

  if (variant === "completed") {
    return (
      <Link
        href={href}
        className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        aria-label={`View completed course: ${course.name}`}
      >
        <Card className="h-full border border-border shadow-none rounded-md bg-card flex flex-col overflow-hidden hover:border-primary/50 transition-all group">
          {/* Header */}
          <div className="relative h-32 w-full bg-muted border-b border-border overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={`Completed course thumbnail for ${course.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground">
                {course.code}
              </span>
            </div>

            <div className="absolute -bottom-6 right-6 bg-card rounded-full p-1 border border-border z-10 shadow-none">
              <CircularProgress
                value={100}
                size={42}
                strokeWidth={4}
                className="bg-card shrink-0"
                labelClassName="text-[10px] font-bold text-green-600"
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-6 pt-10 flex flex-col flex-1 bg-card">
            <h4 className="font-bold text-base leading-snug group-hover:text-primary transition-colors mb-4 line-clamp-2 text-foreground">
              {course.name}
            </h4>

            <div className="flex items-center gap-3 mb-6 bg-muted/20 p-2.5 rounded-md border border-border/50">
              <Avatar className="h-8 w-8 border border-border shadow-none">
                <AvatarImage src={course.instructor_avatar} />
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-wider">
                  {course.instructor}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                  {course.credits} Academic Credits
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 text-center">
                  Final Result
                </p>
                <p className="text-xl font-black text-primary leading-none text-center">
                  {course.grade}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                Syllabus & Details
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
      aria-label={`View active course: ${course.name}`}
    >
      <Card className="h-full border border-border bg-card hover:border-primary/50 transition-colors shadow-none rounded flex flex-col overflow-hidden relative">
        {/* Thumbnail Header */}
        <div className="relative aspect-[16/9] w-full bg-muted border-b border-border">
          <Image
            src={course.thumbnail}
            alt={`Course thumbnail for ${course.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Overlay protecting the badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Course Code Badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[11px] font-bold tracking-wide px-2.5 py-1 rounded bg-background text-foreground uppercase shadow-sm">
              {course.code}
            </span>
          </div>

          {/* Due Assignments Badge */}
          {course.due_assignments > 0 && (
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-2.5 py-1 rounded bg-amber-500 text-white uppercase shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                {course.due_assignments} Task
                {course.due_assignments !== 1 ? "s" : ""} Due
              </span>
            </div>
          )}

          {/* Circular Progress (floating) */}
          <div className="absolute -bottom-6 right-5 bg-card rounded-full p-1 border border-border flex items-center justify-center">
            <CircularProgress
              value={course.progress}
              size={48}
              strokeWidth={4}
              className="bg-card shrink-0"
              labelClassName="text-xs font-bold text-foreground"
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-5 pt-10 flex flex-col flex-1 bg-card">
          <span className="text-[13px] text-muted-foreground font-medium mb-2 block">
            {course.credits} Credits
          </span>
          <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors text-foreground mb-6 line-clamp-2">
            {course.name}
          </h4>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={course.instructor_avatar} />
              <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                {course.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {course.instructor}
              </p>
              <p className="text-xs text-muted-foreground truncate">Instructor</p>
            </div>
          </div>

          {/* Assignment Status Banner */}
          <div className="mt-auto pt-4 border-t border-border">
            {course.due_assignments > 0 ? (
              <div className="flex items-center gap-2 text-[13px] font-medium text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-500 px-3 py-2.5 rounded border border-amber-200/50 dark:border-amber-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {course.due_assignments} pending assignment
                  {course.due_assignments !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[13px] font-medium text-primary bg-primary/5 dark:bg-primary/10 px-3 py-2.5 rounded border border-primary/20 dark:border-primary/20">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Up to date</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
