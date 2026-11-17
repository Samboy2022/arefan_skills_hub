"use client";

import Link from "next/link";
import {
  FileText,
  PlayCircle,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { StudentCourse } from "@/lib/student-types";
import { cn } from "@/lib/utils";
import { rowActionClass, tableHeadClass, tableHeadRowClass } from "@/lib/student-ui";

interface StudentCourseDataTableProps {
  courses: StudentCourse[];
  variant?: "active" | "completed";
}

export function StudentCourseDataTable({
  courses,
  variant = "active",
}: StudentCourseDataTableProps) {
  if (courses.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={tableHeadRowClass}>
              <TableHead className={cn(tableHeadClass, "w-[100px]")}>Code</TableHead>
              <TableHead className={cn(tableHeadClass, "min-w-[200px]")}>Course</TableHead>
              <TableHead className={tableHeadClass}>Instructor</TableHead>
              {variant === "active" ? (
                <>
                  <TableHead className={tableHeadClass}>Progress</TableHead>
                  <TableHead className={tableHeadClass}>Tasks</TableHead>
                </>
              ) : (
                <TableHead className={tableHeadClass}>Final Grade</TableHead>
              )}
              <TableHead className={cn(tableHeadClass, "text-right")}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const href = `/student/courses/${course.id}`;

              return (
                <TableRow key={course.id} className={variant === 'completed' ? 'opacity-80' : ''}>
                  <TableCell className="font-medium">
                    <span className="rounded-md bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
                      {course.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={href} className="font-semibold text-foreground hover:text-primary transition-colors hover:underline line-clamp-1 block">
                      {course.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{course.credits} Credits</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border shadow-none">
                            <AvatarImage src={course.instructor_avatar} alt="" />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                {course.instructor.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate hidden sm:inline-block max-w-[120px]">{course.instructor}</span>
                    </div>
                  </TableCell>
                  {variant === "active" ? (
                    <>
                        <TableCell>
                            <div className="flex items-center gap-2.5 w-32">
                              <div className="h-1.5 flex-1 bg-primary/15 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-primary" 
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="w-9 text-right text-xs font-semibold tabular-nums">
                                {course.progress}%
                              </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            {course.due_assignments > 0 ? (
                                <Badge variant="outline" className="rounded-full text-amber-700 border-amber-500/20 bg-amber-500/10 dark:text-amber-400 whitespace-nowrap">
                                    {course.due_assignments} Due
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="rounded-full text-primary border-primary/20 bg-primary/10 whitespace-nowrap">
                                    Up to date
                                </Badge>
                            )}
                        </TableCell>
                    </>
                  ) : (
                     <TableCell>
                        <span className="font-bold text-primary">{course.grade}</span>
                     </TableCell>
                  )}
                  <TableCell className="text-right">
                    {variant === "active" ? (
                        <Button size="sm" variant="default" className={rowActionClass} asChild>
                            <Link href={href}>
                                <PlayCircle className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Resume</span>
                            </Link>
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" className={rowActionClass} asChild>
                            <Link href={href}>
                                <FileText className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Details</span>
                            </Link>
                        </Button>
                    )}
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
