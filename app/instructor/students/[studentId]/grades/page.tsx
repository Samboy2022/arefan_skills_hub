"use client";

import * as React from "react";
import { useMemo } from "react";
import { Download, ChevronLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_STUDENTS, MOCK_GRADES, MOCK_INSTRUCTOR_COURSES,
} from "@/lib/instructor-mock-data";
import { StudentHeroCard } from "@/components/instructor/students/StudentHeroCard";
import { StudentTabStrip } from "@/components/instructor/students/StudentTabStrip";

function getLetterGrade(pct: number) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function getGradeColor(letter: string) {
  switch (letter) {
    case "A": return "text-emerald-700 font-bold bg-emerald-50 border-emerald-200";
    case "B": return "text-blue-700 font-bold bg-blue-50 border-blue-200";
    case "C": return "text-amber-700 font-bold bg-amber-50 border-amber-200";
    case "D": return "text-orange-700 font-bold bg-orange-50 border-orange-200";
    default:  return "text-red-700 font-bold bg-red-50 border-red-200";
  }
}

export default function StudentGradesPage({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const student = MOCK_STUDENTS.find((s) => s.id === unwrappedParams.studentId) || MOCK_STUDENTS[0];

  const myGrades = useMemo(
    () => MOCK_GRADES.filter((g) => g.studentId === student.id),
    [student.id]
  );
  const enrolledCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => student.enrolledCourses.includes(c.id));

  // Per-course generation
  const courseBreakdowns = useMemo(() => {
    return enrolledCourses.map((course) => {
      const cGrades = myGrades.filter((g) => g.courseId === course.id)
          .sort((a, b) => b.gradedAt.getTime() - a.gradedAt.getTime()); // sort desc
      const cAvg = cGrades.length 
          ? Math.round(cGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / cGrades.length)
          : 0;

      // Calculate overall course average across ALL students for trend comparison
      const allCourseGrades = MOCK_GRADES.filter(g => g.courseId === course.id);
      const overallCourseAvg = allCourseGrades.length
        ? Math.round(allCourseGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / allCourseGrades.length)
        : 0;

      // Trend based on last 3 graded items vs overall course avg
      const last3 = cGrades.slice(0, 3);
      const last3Avg = last3.length 
        ? Math.round(last3.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / last3.length)
        : 0;
      
      const trendDiff = last3.length > 0 ? last3Avg - overallCourseAvg : 0;

      return { course, cGrades, cAvg, letter: getLetterGrade(cAvg), trendDiff };
    });
  }, [enrolledCourses, myGrades]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href={`/instructor/students/${student.id}`}><ChevronLeft className="h-4 w-4" /> Back to {student.name}</Link>
         </Button>
      </div>

      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${student.id}` },
          { label: "Grades" },
        ]}
      />

      <StudentHeroCard student={student} courses={enrolledCourses} />
      <StudentTabStrip studentId={student.id} />

      {/* Flat List Transcripts by Course */}
      <div className="space-y-8">
          {courseBreakdowns.map(({ course, cGrades, cAvg, letter, trendDiff }) => (
              <div key={course.id} className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-foreground">{course.code} — {course.title}</h2>
                      <div className="flex items-center gap-3">
                          {/* Grade Trend Chip */}
                          {trendDiff > 0 ? (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent shadow-none gap-1"><TrendingUp className="h-3 w-3" /> +{trendDiff}%</Badge>
                          ) : trendDiff < 0 ? (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-transparent shadow-none gap-1"><TrendingDown className="h-3 w-3" /> {trendDiff}%</Badge>
                          ) : cGrades.length > 0 ? (
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-transparent shadow-none gap-1"><Minus className="h-3 w-3" /> Stable</Badge>
                          ) : null}
                          
                          <div className="flex items-baseline gap-2 text-right">
                              <span className="text-xl font-bold">{cAvg}%</span>
                          </div>
                      </div>
                  </div>

                  {/* Clean List Without Heavy Accents */}
                  {cGrades.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">No graded assignments strictly recorded for this course yet.</p>
                  ) : (
                      <div className="rounded-md border bg-card overflow-hidden mt-2">
                          <div className="hidden md:grid md:grid-cols-[120px_1fr_100px_100px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              <span>Date</span>
                              <span>Requirement Segment</span>
                              <span className="text-center">Type</span>
                              <span className="text-right">Score</span>
                          </div>
                          <div className="divide-y divide-border">
                              {cGrades.map((g) => {
                                  const pct = Math.round((g.score / g.maxScore) * 100);
                                  return (
                                      <div key={g.id} className="block hover:bg-muted/10 transition-colors">
                                          <div className="md:hidden px-4 py-4 space-y-1">
                                              <p className="font-medium text-foreground">{g.label ?? g.id}</p>
                                              <p className="text-xs text-muted-foreground">{g.gradedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })} &middot; <span className="capitalize">{g.type || "General"}</span></p>
                                              <p className="font-semibold text-sm mt-1">{g.score} / {g.maxScore} <span className="text-muted-foreground font-normal">({pct}%)</span></p>
                                              {g.feedback && <p className="text-xs text-muted-foreground mt-1 italic">"{g.feedback}"</p>}
                                          </div>
                                          <div className="hidden md:grid md:grid-cols-[120px_1fr_100px_100px] gap-4 items-center px-5 py-3 text-sm">
                                              <span className="text-muted-foreground whitespace-nowrap">
                                                  {g.gradedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                              </span>
                                              <div className="min-w-0 pr-4">
                                                  <span className="font-medium text-foreground">{g.label ?? g.id}</span>
                                                  {g.feedback && (
                                                      <span className="block text-xs text-muted-foreground mt-0.5 truncate">Note: "{g.feedback}"</span>
                                                  )}
                                              </div>
                                              <span className="text-muted-foreground capitalize text-center">
                                                  {g.type || "General"}
                                              </span>
                                              <div className="text-right whitespace-nowrap">
                                                  <span className="font-medium text-foreground">{g.score}</span> 
                                                  <span className="text-muted-foreground text-[11px]"> / {g.maxScore}</span>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  )}
              </div>
          ))}
      </div>

    </div>
  );
}