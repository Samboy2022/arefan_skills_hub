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
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="min-w-[200px]">Course</TableHead>
              <TableHead>Instructor</TableHead>
              {variant === "active" ? (
                <>
                  <TableHead>Progress</TableHead>
                  <TableHead>Tasks</TableHead>
                </>
              ) : (
                <TableHead>Final Grade</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const href = `/student/courses/${course.id}`;

              return (
                <TableRow key={course.id} className={variant === 'completed' ? 'opacity-80' : ''}>
                  <TableCell className="font-medium">
                    <span className="rounded bg-muted px-2 py-1 text-xs font-bold uppercase tracking-wide">
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
                            <AvatarImage src={course.instructor_avatar} />
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
                            <div className="flex flex-col gap-1 w-24">
                              <span className="text-xs font-medium text-right">
                                {course.progress}%
                              </span>
                              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-primary" 
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {course.due_assignments > 0 ? (
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-500 whitespace-nowrap">
                                    {course.due_assignments} Due
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 whitespace-nowrap">
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
                        <Button size="sm" variant="default" className="h-8 gap-1" asChild>
                            <Link href={href}>
                                <PlayCircle className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Resume</span>
                            </Link>
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
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
