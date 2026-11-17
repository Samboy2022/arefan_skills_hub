"use client";

import { useState } from "react";
import { Award, BarChart3, BookOpen, ChevronDown, ChevronUp, Download, Eye, FileText, Info, GraduationCap, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_GRADES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, listCardClass, pageStackClass, rowActionClass, statGridClass, tableHeadClass, tableHeadRowClass } from "@/lib/student-ui";
import { StudentTip } from "@/components/student/tip";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentKPICard } from "@/components/student/kpi-card";
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
  const totalCredits = STUDENT_COURSES.reduce((s, c) => s + c.credits, 0);

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Grades" }]} />

      <PageHeader
        title="Grades & Performance"
        description="Your grade breakdown by course — all scores shown in points."
      />

      <StudentTip>
        Column weights are shown in the table header. Final grade uses those weights across assignments, tests, quizzes, and forum work.
      </StudentTip>

      <div className={statGridClass}>
        <StudentKPICard title="GPA" value={overallGPA} icon={GraduationCap} variant="purple" />
        <StudentKPICard title="Avg Score" value={`${avgFinal.toFixed(1)}%`} icon={LineChart} />
        <StudentKPICard title="Courses" value={STUDENT_GRADES.length} icon={BookOpen} />
        <StudentKPICard title="Credits" value={totalCredits} icon={Award} variant="info" />
      </div>

      {/* ── Mobile Gradebook Cards ──────────────────────────────────── */}
      <div className="lg:hidden space-y-3">
        {STUDENT_GRADES.length === 0 ? (
          <div className={emptyStateClass}>
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className={emptyTitleClass}>No grades available yet</h3>
            <p className={emptyBodyClass}>Your grades will appear here once they are published.</p>
          </div>
        ) : (
          STUDENT_GRADES.map((grade) => {
            const course = STUDENT_COURSES.find(c => c.id === grade.course_id);
            return (
              <div key={grade.course_id} className="overflow-hidden rounded-2xl border border-border bg-card">
                {/* Course Header */}
                <div className="px-4 py-3 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
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
                  <Button variant="outline" size="sm" asChild className={rowActionClass}>
                    <Link href={`/student/grades/${grade.course_id}`}>
                      <Eye className="h-3 w-3" /> Details
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Gradebook Data Table ───────────────────────────── */}
      <div className={cn("hidden lg:block", listCardClass)}>
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className={tableHeadRowClass}>
              <TableHead className={cn(tableHeadClass, "pl-5")}>Course</TableHead>
              <TableHead className={tableHeadClass}>
                Assignments
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(35%)</span>
              </TableHead>
              <TableHead className={tableHeadClass}>
                Tests
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(40%)</span>
              </TableHead>
              <TableHead className={tableHeadClass}>
                Quizzes
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(15%)</span>
              </TableHead>
              <TableHead className={tableHeadClass}>
                Forum
                <span className="ml-1 text-[9px] font-normal normal-case text-muted-foreground/70">(10%)</span>
              </TableHead>
              <TableHead className={tableHeadClass}>Final Grade</TableHead>
              <TableHead className={cn(tableHeadClass, "text-center")}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUDENT_GRADES.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className={emptyTitleClass}>No grades available</p>
                    <p className={emptyBodyClass}>Your grades will appear here once published.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              STUDENT_GRADES.map((grade) => {
                const course = STUDENT_COURSES.find(c => c.id === grade.course_id);
                return (
                  <TableRow key={grade.course_id} className="group hover:bg-muted/30">
                    <TableCell className="px-5 py-4">
                      <div className="flex max-w-[220px] flex-col gap-1">
                        <span className="self-start rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {course?.code || grade.course_id.toUpperCase()}
                        </span>
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                          {grade.course_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {course?.instructor || "Instructor"} · {course?.credits || 3} cr
                        </p>
                      </div>
                    </TableCell>
                    <TableCell><PointCell comp={grade.assignments} /></TableCell>
                    <TableCell><PointCell comp={grade.tests} /></TableCell>
                    <TableCell><PointCell comp={grade.quizzes} /></TableCell>
                    <TableCell><PointCell comp={grade.forum_activities} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className={cn("text-sm font-extrabold tabular-nums", letterColor(grade.letter_grade))}>
                          {grade.final_grade.toFixed(1)}%
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          ({grade.final_points}/{grade.total_points} pts)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" asChild className={rowActionClass}>
                        <Link href={`/student/grades/${grade.course_id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {STUDENT_GRADES.length > 0 && (
            <TableFooter>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell className={cn(tableHeadClass, "pl-5")}>Totals / Avg</TableCell>
                <TableCell>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.assignments.earned, 0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.assignments.total, 0)}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.tests.earned, 0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.tests.total, 0)}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.quizzes.earned, 0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.quizzes.total, 0)}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.forum_activities.earned, 0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.forum_activities.total, 0)}
                    </span>
                  </span>
                </TableCell>
                <TableCell colSpan={2}>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {STUDENT_GRADES.reduce((s, g) => s + g.final_points, 0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{STUDENT_GRADES.reduce((s, g) => s + g.total_points, 0)} pts
                    </span>
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    avg {avgFinal.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* ── Footer actions ────────────────────────────────────────────── */}
      <div className="mt-6 flex justify-end">
        <p className="text-xs text-muted-foreground">Last updated: Today at 2:30 PM</p>
      </div>
    </div>
  );
}
