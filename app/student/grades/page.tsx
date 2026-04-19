"use client";

import { useState } from "react";
import { BarChart3, BookOpen, ChevronDown, ChevronUp, Download, Eye, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_GRADES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import type { StudentGrade, GradeComponent } from "@/lib/student-types";

// ── helpers ──────────────────────────────────────────────────────────────────

const GRADE_SCALE = [
  { letter: "A", range: "90–100", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { letter: "B", range: "80–89",  color: "text-blue-600",    bg: "bg-blue-50 border-blue-200" },
  { letter: "C", range: "70–79",  color: "text-amber-600",   bg: "bg-amber-50 border-amber-200" },
  { letter: "D", range: "60–69",  color: "text-orange-600",  bg: "bg-orange-50 border-orange-200" },
  { letter: "F", range: "0–59",   color: "text-red-600",     bg: "bg-red-50 border-red-200" },
];

const letterColor = (letter: string) => {
  const c = letter.charAt(0);
  return c === "A" ? "text-emerald-600 dark:text-emerald-400"
       : c === "B" ? "text-blue-600 dark:text-blue-400"
       : c === "C" ? "text-amber-600 dark:text-amber-400"
       : c === "D" ? "text-orange-600 dark:text-orange-400"
       :             "text-red-600 dark:text-red-400";
};

const letterBadge = (letter: string) => {
  const c = letter.charAt(0);
  return c === "A" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
       : c === "B" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
       : c === "C" ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
       : c === "D" ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400"
       :             "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
};

const ptColor = (earned: number, total: number) => {
  const pct = (earned / total) * 100;
  if (pct >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 80) return "text-blue-600 dark:text-blue-400";
  if (pct >= 70) return "text-amber-600 dark:text-amber-400";
  if (pct >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

const barWidth = (earned: number, total: number) =>
  `${Math.round((earned / total) * 100)}%`;

// ── sub-components ────────────────────────────────────────────────────────────

function PointCell({ comp }: { comp: GradeComponent }) {
  return (
    <div className="flex flex-col gap-1 min-w-[60px]">
      <span className={cn("text-sm font-bold tabular-nums", ptColor(comp.earned, comp.total))}>
        {comp.earned}
        <span className="text-muted-foreground font-normal text-[11px] ml-0.5">/{comp.total}</span>
      </span>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function GradesPage() {
  const [scaleOpen, setScaleOpen] = useState(false);

  const avgFinal =
    STUDENT_GRADES.reduce((s, g) => s + g.final_grade, 0) / STUDENT_GRADES.length;
  const overallGPA = (avgFinal / 100 * 4).toFixed(2);

  return (
    <div>
      <Breadcrumb items={[{ label: "Grades" }]} className="mb-6" />

      <PageHeader
        title="Grades & Performance"
        description="Your grade breakdown by course — all scores shown in points"
      />

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center px-4 py-4 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img
            src="https://img.icons8.com/scribby/96/certificate.png"
            alt="GPA"
            className="h-12 w-12"
          />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">GPA</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{overallGPA}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l lg:border-r border-border px-4">
          <img
            src="https://img.icons8.com/scribby/96/line-chart.png"
            alt="Average"
            className="h-12 w-12"
          />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Avg Score</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{avgFinal.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img
            src="https://img.icons8.com/scribby/96/book.png"
            alt="Courses"
            className="h-12 w-12"
          />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Courses</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{STUDENT_GRADES.length}</p>
          </div>
        </div>
      </div>

      {/* ── Mobile Gradebook Cards ──────────────────────────────────── */}
      <div className="lg:hidden space-y-3">
        {STUDENT_GRADES.length === 0 ? (
          <div className="py-16 text-center border rounded-xl bg-card">
            <BookOpen className="h-8 w-8 opacity-30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No grades available yet.</p>
          </div>
        ) : (
          STUDENT_GRADES.map((grade) => {
            const course = STUDENT_COURSES.find(c => c.id === grade.course_id);
            return (
              <div key={grade.course_id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Course Header */}
                <div className="px-4 py-3 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {course?.code || grade.course_id.toUpperCase()}
                    </span>
                    <span className={cn("text-sm font-extrabold tabular-nums", letterColor(grade.letter_grade))}>
                      {grade.final_grade.toFixed(1)}%
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-foreground line-clamp-1">{grade.course_name}</p>
                  <p className="text-[11px] text-muted-foreground">{course?.instructor || "Instructor"} · {course?.credits || 3} cr</p>
                </div>
                {/* Component Scores */}
                <div className="px-4 py-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Assignments (35%)</p>
                    <PointCell comp={grade.assignments} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Tests (40%)</p>
                    <PointCell comp={grade.tests} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Quizzes (15%)</p>
                    <PointCell comp={grade.quizzes} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Forum (10%)</p>
                    <PointCell comp={grade.forum_activities} />
                  </div>
                </div>
                {/* Footer */}
                <div className="px-4 py-2.5 bg-muted/10 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {grade.final_points}/{grade.total_points} pts
                  </span>
                  <Button variant="ghost" size="sm" asChild className="shadow-none hover:bg-muted font-medium text-xs h-7">
                    <Link href={`/student/grades/${grade.course_id}`}>
                      <Eye className="h-3 w-3 mr-1" /> Details
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Gradebook Data Table ───────────────────────────── */}
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm hidden lg:block">
        <table className="w-full min-w-[720px] text-sm">
          {/* thead */}
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Course
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Assignments
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(35%)</span>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Tests
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(40%)</span>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Quizzes
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(15%)</span>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Forum
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(10%)</span>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Final Grade
              </th>
              <th className="text-center px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          {/* tbody */}
          <tbody className="divide-y divide-border">
            {STUDENT_GRADES.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-muted">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground">No grades available</p>
                    <p className="text-xs text-muted-foreground">Your grades will appear here once published.</p>
                  </div>
                </td>
              </tr>
            ) : (
              STUDENT_GRADES.map((grade) => {
                const course = STUDENT_COURSES.find(c => c.id === grade.course_id);
                return (
                  <tr
                    key={grade.course_id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Course */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1 max-w-[220px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 self-start">
                          {course?.code || grade.course_id.toUpperCase()}
                        </span>
                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                          {grade.course_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {course?.instructor || "Instructor"} · {course?.credits || 3} cr
                        </p>
                      </div>
                    </td>

                    {/* Assignments */}
                    <td className="px-4 py-4 align-top">
                      <PointCell comp={grade.assignments} />
                    </td>

                    {/* Tests */}
                    <td className="px-4 py-4 align-top">
                      <PointCell comp={grade.tests} />
                    </td>

                    {/* Quizzes */}
                    <td className="px-4 py-4 align-top">
                      <PointCell comp={grade.quizzes} />
                    </td>

                    {/* Forum Activities */}
                    <td className="px-4 py-4 align-top">
                      <PointCell comp={grade.forum_activities} />
                    </td>

                    {/* Final Grade */}
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={cn("text-sm font-extrabold tabular-nums", letterColor(grade.letter_grade))}>
                            {grade.final_grade.toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground text-[11px] font-medium">
                            ({grade.final_points}/{grade.total_points} pts)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 align-middle text-center">
                      <Button variant="ghost" size="sm" asChild className="shadow-none hover:bg-muted font-medium border border-transparent">
                        <Link href={`/student/grades/${grade.course_id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* tfoot — totals */}
          {STUDENT_GRADES.length > 0 && (
            <tfoot>
              <tr className="bg-muted/40 border-t-2 border-border">
                <td className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Totals / Avg
                </td>
                {/* Assignments total */}
                <td className="px-4 py-3">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.assignments.earned, 0)}
                    <span className="text-muted-foreground font-normal text-xs">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.assignments.total, 0)}
                    </span>
                  </span>
                </td>
                {/* Tests total */}
                <td className="px-4 py-3">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.tests.earned, 0)}
                    <span className="text-muted-foreground font-normal text-xs">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.tests.total, 0)}
                    </span>
                  </span>
                </td>
                {/* Quizzes total */}
                <td className="px-4 py-3">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.quizzes.earned, 0)}
                    <span className="text-muted-foreground font-normal text-xs">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.quizzes.total, 0)}
                    </span>
                  </span>
                </td>
                {/* Forum total */}
                <td className="px-4 py-3">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.forum_activities.earned, 0)}
                    <span className="text-muted-foreground font-normal text-xs">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.forum_activities.total, 0)}
                    </span>
                  </span>
                </td>
                {/* Final total */}
                <td className="px-4 py-3" colSpan={2}>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.final_points, 0)}
                    <span className="text-muted-foreground font-normal text-xs">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.total_points, 0)} pts
                    </span>
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    avg {avgFinal.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Footer actions ────────────────────────────────────────────── */}
      <div className="mt-6 flex justify-end">
        <p className="text-xs text-muted-foreground">Last updated: Today at 2:30 PM</p>
      </div>
    </div>
  );
}
