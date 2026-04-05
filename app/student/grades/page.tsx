"use client";

import { BarChart3, TrendingUp, Award, BookOpen, Target, Eye, Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_GRADES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

const GRADE_SCALE = {
  A: { min: 90, max: 100 },
  B: { min: 80, max: 89 },
  C: { min: 70, max: 79 },
  D: { min: 60, max: 69 },
  F: { min: 0, max: 59 },
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

const getGradeDescription = (grade: string) => {
  const firstChar = grade.charAt(0);
  const descriptions = {
    A: "Excellent",
    B: "Good",
    C: "Satisfactory",
    D: "Needs Improvement",
    F: "Failing",
  };
  return descriptions[firstChar as keyof typeof descriptions] || "Unknown";
};

const getPerformanceColor = (percentage: number) => {
  if (percentage >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 70) return "text-amber-600 dark:text-amber-400";
  if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

export default function GradesPage() {
  const overallGPA = (
    STUDENT_GRADES.reduce((sum, course) => sum + course.final_grade, 0) / STUDENT_GRADES.length
  ).toFixed(2);

  const renderGradeRow = (grade: typeof STUDENT_GRADES[0]) => {
    const course = STUDENT_COURSES.find(c => c.id === grade.course_id);

    return (
      <div key={grade.course_id} className="flex flex-col lg:flex-row lg:items-center px-6 py-5 hover:bg-muted/30 transition-colors gap-4 border-l-4 border-l-transparent hover:border-l-primary/50">
        {/* Course Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {course?.code || grade.course_id.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              {course?.credits || 3} credits
            </span>
          </div>
          <h4 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 mb-1">
            {grade.course_name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {course?.instructor || 'Instructor'}
          </p>
        </div>

        {/* Grade Components */}
        <div className="lg:w-[300px] shrink-0">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">Assignments</p>
              <p className={cn("text-sm font-bold", getPerformanceColor(grade.assignments_grade))}>
                {grade.assignments_grade}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">Quizzes</p>
              <p className={cn("text-sm font-bold", getPerformanceColor(grade.quizzes_grade))}>
                {grade.quizzes_grade}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">Participation</p>
              <p className={cn("text-sm font-bold", getPerformanceColor(grade.participation_grade))}>
                {grade.participation_grade}%
              </p>
            </div>
          </div>
        </div>

        {/* Final Grade */}
        <div className="lg:w-[120px] shrink-0 flex flex-col items-start lg:items-center justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn("text-lg font-bold", getPerformanceColor(grade.final_grade))}>
              {grade.final_grade}%
            </span>
            <span className={cn("text-sm font-semibold px-2 py-1 rounded-full border", getGradeColor(grade.letter_grade))}>
              {grade.letter_grade}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:w-[140px] shrink-0 flex justify-start lg:justify-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb 
        items={[
          { label: "Grades" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Grades & Performance"
        description="Review your course grades and overall performance"
      />

      {/* Overall Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-emerald-200 dark:border-emerald-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall GPA</p>
              <p className="text-xs text-muted-foreground">Excellent performance</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{overallGPA}</p>
        </Card>

        <Card className="border-sky-200 dark:border-sky-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{Math.round(STUDENT_GRADES.reduce((sum, c) => sum + c.final_grade, 0) / STUDENT_GRADES.length)}%</p>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Courses</p>
              <p className="text-xs text-muted-foreground">Total enrolled</p>
            </div>
            <div className="rounded-full p-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{STUDENT_GRADES.length}</p>
        </Card>
      </div>

      {/* Grade Scale Reference */}
      <Card className="p-4 mb-8 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Grade Scale Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(GRADE_SCALE).map(([letter, { min, max }]) => (
            <div
              key={letter}
              className="p-3 rounded-lg text-center border border-border bg-muted/30 flex flex-col items-center justify-center"
            >
              <p className={cn(
                "text-xl font-bold mb-1",
                letter === "A" ? "text-emerald-600"
                  : letter === "B" ? "text-blue-600"
                  : letter === "C" ? "text-amber-600"
                  : letter === "D" ? "text-orange-600"
                  : "text-red-600"
              )}>{letter}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {min}—{max}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Gradebook Table */}
      <div className="w-full">
        <Card className="overflow-hidden border border-border rounded-lg bg-card">
          {/* Table Header */}
          <div className="hidden lg:flex items-center px-6 py-4 bg-muted/50 border-b border-border">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Course Details</h3>
            </div>
            <div className="w-[300px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Grade Components</h3>
            </div>
            <div className="w-[120px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Final Grade</h3>
            </div>
            <div className="w-[140px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Actions</h3>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border">
            {STUDENT_GRADES.length > 0 ? (
              STUDENT_GRADES.map(renderGradeRow)
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No grades available</h3>
                    <p className="text-sm text-muted-foreground">Your grades will appear here once they are published.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Transcript
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Grade Analytics
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: Today at 2:30 PM
        </div>
      </div>
    </div>
  );
}
