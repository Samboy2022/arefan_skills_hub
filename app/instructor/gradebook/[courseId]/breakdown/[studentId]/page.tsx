"use client";

import * as React from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  MOCK_INSTRUCTOR_COURSES, MOCK_STUDENTS, MOCK_GRADES 
} from "@/lib/instructor-mock-data";
import { ChevronLeft, Info, AlertCircle, BookOpen, Brain, MessageSquare } from "lucide-react";

export default function BreakdownPage({ params }: { params: Promise<{ courseId: string, studentId: string }> }) {
  const unwrappedParams = React.use(params);
  
  const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === unwrappedParams.courseId);
  const student = MOCK_STUDENTS.find(s => s.id === unwrappedParams.studentId);

  // Get historical grades for this course
  const courseGrades = MOCK_GRADES.filter(g => g.studentId === unwrappedParams.studentId && g.courseId === unwrappedParams.courseId);
  
  const breakdown = courseGrades.map(g => ({
    title: g.label || g.id,
    type: g.type || "other",
    score: g.score,
    maxScore: g.maxScore
  }));

  const assignments = breakdown.filter(b => b.type === "assignment");
  const quizzes = breakdown.filter(b => b.type === "quiz");
  const forums = breakdown.filter(b => b.type === "forum");

  const sumPercent = (items: typeof breakdown) => {
    if (!items.length) return 0;
    return Math.round(items.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / items.length);
  };

  const aSum = assignments.length ? sumPercent(assignments) : 0;
  const qSum = quizzes.length ? sumPercent(quizzes) : 0;
  const fSum = forums.length ? sumPercent(forums) : 0;
  
  const total = Math.min(100, Math.round(aSum + qSum + fSum));

  if (!course || !student) {
    return <div className="p-8 text-center text-red-500">Resource not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Gradebook", href: "/instructor/gradebook" },
          { label: course.code, href: `/instructor/gradebook/${course.id}` },
          { label: `Breakdown: ${student.name}` }
        ]} 
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
          <Link href={`/instructor/gradebook/${course.id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Breakdown: <span className="text-muted-foreground">{course.title}</span></h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">{course.code} • Detailed origin of marks for this course.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold">Origin of Marks</h2>
                <p className="text-sm text-muted-foreground mt-1">Detailed breakdown of {student.name}'s performance</p>
            </div>
            
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/instructor/gradebook/${course.id}/edit/${student.id}`}>
                        Override Grades
                    </Link>
                </Button>
            </div>
        </div>

        <Alert className="mx-6 mt-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 top-3 border-none" />
            <AlertTitle className="text-amber-900 font-semibold text-sm">Instructor Review Tips</AlertTitle>
            <AlertDescription className="text-amber-800 text-xs mt-2 space-y-2">
                <p>• Review the specific items below to see exactly where the student struggled most.</p>
                <p>• <b>Tip:</b> If the quiz mark is lower than the assignment mark, consider providing additional multiple-choice practice materials.</p>
            </AlertDescription>
        </Alert>

        <div className="p-6 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="font-semibold w-[30%] min-w-[200px]">Item Title</TableHead>
                        <TableHead className="font-semibold w-[20%]">Category</TableHead>
                        <TableHead className="font-semibold text-center w-[15%]">Max Score</TableHead>
                        <TableHead className="font-semibold text-center w-[15%]">Acquired Score</TableHead>
                        <TableHead className="font-semibold text-right w-[20%]">Performance %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {breakdown.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                <Info className="h-8 w-8 mx-auto opacity-30 mb-3" />
                                <p>No historical graded items found.</p>
                                <p className="text-sm mt-1">If marks exist, they may have been manually entered.</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        breakdown.map((item, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/30">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border">
                                            {item.type === "assignment" ? <BookOpen className="h-3.5 w-3.5 text-violet-600" /> : 
                                             item.type === "quiz" ? <Brain className="h-3.5 w-3.5 text-emerald-600" /> : 
                                             <MessageSquare className="h-3.5 w-3.5 text-blue-600" />}
                                        </div>
                                        <span className="font-medium text-sm">{item.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm capitalize text-muted-foreground">
                                        {item.type} Submission
                                    </span>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {item.maxScore}
                                </TableCell>
                                <TableCell className="text-center font-semibold">
                                    {item.score}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                                        Math.round((item.score/item.maxScore)*100) >= 70 ? "bg-emerald-100 text-emerald-700" :
                                        Math.round((item.score/item.maxScore)*100) >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {Math.round((item.score/item.maxScore)*100)}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            
            <div className="mt-8 flex justify-end">
                <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-6 min-w-[300px] flex justify-between items-center relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 left-0" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground relative z-10">Total Calculated Mark</span>
                    <div className="flex items-baseline gap-1 relative z-10">
                        <span className={`text-4xl font-bold tracking-tighter ${
                            total >= 70 ? "text-emerald-500" :
                            total >= 50 ? "text-amber-500" : "text-rose-500"
                        }`}>{total}</span>
                        <span className="text-xl font-bold text-muted-foreground">%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}
