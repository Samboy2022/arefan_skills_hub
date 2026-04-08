"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, CheckCircle, Clock, AlertCircle, FileText,
  Award, HelpCircle, BarChart, Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import {
  STUDENT_GRADES,
  STUDENT_COURSES,
  STUDENT_ASSIGNMENTS,
  STUDENT_QUIZZES
} from "@/lib/student-mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getPerformanceColor = (percentage: number | null) => {
  if (percentage === null) return "text-muted-foreground";
  if (percentage >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 70) return "text-amber-600 dark:text-amber-400";
  if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

const getGradeColor = (grade: string) => {
  const firstChar = grade.charAt(0);
  switch (firstChar) {
    case "A":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "B":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "C":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "D":
      return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "F":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function CourseGradeDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const course = STUDENT_COURSES.find((c) => c.id === courseId);
  const gradeRecord = STUDENT_GRADES.find((g) => g.course_id === courseId);

  if (!course || !gradeRecord) {
    notFound();
  }

  // Fetch relevant graded items
  const gradedAssignments = STUDENT_ASSIGNMENTS.filter(
    (a) => a.course_id === courseId && (a.status === "graded" || a.status === "missing")
  ).sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());

  const quizzes = STUDENT_QUIZZES.filter(
    (q) => q.course_id === courseId && (q.status === "submitted" || q.status === "in_progress")
  );

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Back ── */}
      <div>
        <Breadcrumb
          items={[
            { label: "Grades", href: "/student/grades" },
            { label: course.code },
          ]}
          className="mb-4"
        />
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-muted-foreground mb-2">
          <Link href="/student/grades">
            <ArrowLeft className="h-4 w-4" /> Back to Grades
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`${course.code} — ${course.name}`}
        description="Detailed breakdown of your grades and performance in this course."
      />

      {/* ── Main Breakdown KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Final Grade Card */}
        <Card className="p-4 border-border relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Final Grade</p>
            <div className="flex items-end gap-2 mt-auto pt-2">
              <span className={cn("text-3xl font-bold leading-none", getPerformanceColor(gradeRecord.final_grade))}>
                {gradeRecord.final_grade}%
              </span>
              <span className={cn("text-sm font-bold px-2 py-0.5 rounded border mb-0.5", getGradeColor(gradeRecord.letter_grade))}>
                {gradeRecord.letter_grade}
              </span>
            </div>
          </div>
          <img src="https://img.icons8.com/color/96/quality.png" className="absolute -right-2 -bottom-2 h-16 w-16 opacity-15 pointer-events-none" alt="Final" />
        </Card>

        {/* Assignments Card */}
        <Card className="p-4 border-border relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Assignments</p>
            <div className="mt-auto pt-2">
              <span className={cn("text-2xl font-bold", getPerformanceColor(gradeRecord.assignments_grade))}>
                {gradeRecord.assignments_grade}%
              </span>
            </div>
          </div>
          <img src="https://img.icons8.com/color/96/list.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="Assignments" />
        </Card>

        {/* Quizzes Card */}
        <Card className="p-4 border-border relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Quizzes & Exams</p>
            <div className="mt-auto pt-2">
              <span className={cn("text-2xl font-bold", getPerformanceColor(gradeRecord.quizzes_grade))}>
                {gradeRecord.quizzes_grade}%
              </span>
            </div>
          </div>
          <img src="https://img.icons8.com/color/96/exam.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="Quizzes" />
        </Card>

        {/* Participation Card */}
        <Card className="p-4 border-border relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Participation</p>
            <div className="mt-auto pt-2">
              <span className={cn("text-2xl font-bold", getPerformanceColor(gradeRecord.participation_grade))}>
                {gradeRecord.participation_grade}%
              </span>
            </div>
          </div>
          <img src="https://img.icons8.com/color/96/raised-hand.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20 pointer-events-none" alt="Participation" />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        {/* ── Assignments Detail Section ── */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <img src="https://img.icons8.com/color/48/list.png" className="h-6 w-6" alt="Assignments" />
            Assignment Breakdown
          </h3>
          <Card className="border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-5">Item</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right pr-5">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradedAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                      No graded assignments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  gradedAssignments.map((assignment) => {
                    const percentage = assignment.points_earned !== null && assignment.total_points > 0
                      ? Math.round((assignment.points_earned / assignment.total_points) * 100)
                      : null;
                      
                    return (
                      <TableRow key={assignment.id} className="hover:bg-muted/20">
                        <TableCell className="pl-5 py-4">
                          <p className="font-semibold text-sm text-foreground mb-0.5 line-clamp-1">{assignment.title}</p>
                          <div className="flex items-center gap-2">
                            {assignment.status === "missing" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                                <AlertCircle className="h-3 w-3" /> Missing
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-3 w-3" /> Graded
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              Due: {format(new Date(assignment.due_date), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4 font-medium text-sm">
                          {assignment.points_earned !== null ? (
                            <span className="text-foreground">{assignment.points_earned} <span className="text-muted-foreground text-xs font-normal">/ {assignment.total_points}</span></span>
                          ) : (
                            <span className="text-red-600 font-bold">0 <span className="text-muted-foreground text-xs font-normal">/ {assignment.total_points}</span></span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-5 py-4">
                          <span className={cn("font-bold", getPerformanceColor(percentage || 0))}>
                            {percentage !== null ? `${percentage}%` : "0%"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* ── Quizzes Detail Section ── */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <img src="https://img.icons8.com/color/48/exam.png" className="h-6 w-6" alt="Quizzes" />
            Quiz & Exam Breakdown
          </h3>
          <Card className="border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-5">Item</TableHead>
                  <TableHead className="text-center">Attempts</TableHead>
                  <TableHead className="text-right pr-5">Best Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                      No quiz results available.
                    </TableCell>
                  </TableRow>
                ) : (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="hover:bg-muted/20">
                      <TableCell className="pl-5 py-4">
                        <p className="font-semibold text-sm text-foreground mb-0.5 line-clamp-1">{quiz.title}</p>
                        <div className="flex items-center gap-2">
                          {quiz.status === "submitted" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="h-3 w-3" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                              <Clock className="h-3 w-3" /> In Progress
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {quiz.total_questions} questions
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 text-sm text-muted-foreground">
                        {quiz.attempts.length} / {quiz.attempts_allowed}
                      </TableCell>
                      <TableCell className="text-right pr-5 py-4">
                        <span className={cn("font-bold", getPerformanceColor(quiz.best_score))}>
                          {quiz.best_score !== null ? `${quiz.best_score}%` : "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

    </div>
  );
}
