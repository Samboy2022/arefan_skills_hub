"use client";

import Link from "next/link";
import { differenceInCalendarDays, format, isValid } from "date-fns";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { StudentKPICard } from "@/components/student/kpi-card";
import { DailyGoal, Donut, WeeklyStreak } from "@/components/student/progress-widgets";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Hourglass,
  Play,
  Video,
} from "lucide-react";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, pageStackClass, statGridClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";
import {
  STUDENT_COURSES,
  STUDENT_ASSIGNMENTS,
  COURSE_ANNOUNCEMENTS,
  STUDENT_PROGRESS,
  STUDENT_MOCK_MEETINGS,
} from "@/lib/student-mock-data";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Days until the due date (negative when overdue). */
function daysUntil(dueDate: string) {
  const due = new Date(dueDate);
  return isValid(due) ? differenceInCalendarDays(due, new Date()) : Infinity;
}

/** Colour accents cycled across courses. */
const COURSE_TONES = [
  { tile: "from-emerald-500 to-emerald-700", text: "text-emerald-600 dark:text-emerald-400" },
  { tile: "from-sky-500 to-indigo-600", text: "text-sky-600 dark:text-sky-400" },
  { tile: "from-amber-400 to-orange-600", text: "text-amber-600 dark:text-amber-400" },
  { tile: "from-violet-500 to-fuchsia-600", text: "text-violet-600 dark:text-violet-400" },
];

/** White progress ring that sits inside the coloured course-code tile. */
function TileRing({ value, size = 40, stroke = 3.5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-white/30" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className="stroke-white"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums">{value}%</span>
    </div>
  );
}

const panelClass = "min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5";
const panelHeadClass = "mb-4 flex items-center justify-between gap-3";
const panelTitleClass = "text-base font-semibold";
const linkClass = "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline";

const statusStyles: Record<string, { label: string; cls: string }> = {
  graded: { label: "Graded", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  submitted: { label: "Submitted", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  late: { label: "Late", cls: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
  missing: { label: "Missing", cls: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

/* Mock study hours per course (until a study-time API exists). */
const WEEKLY_STUDY = [
  { label: "Mon", cs101: 1.5, math201: 1.0, eng102: 0.5 },
  { label: "Tue", cs101: 2.0, math201: 1.5, eng102: 1.0 },
  { label: "Wed", cs101: 1.0, math201: 2.0, eng102: 0.5 },
  { label: "Thu", cs101: 2.5, math201: 1.0, eng102: 1.5 },
  { label: "Fri", cs101: 1.0, math201: 0.5, eng102: 1.0 },
  { label: "Sat", cs101: 3.0, math201: 1.5, eng102: 2.0 },
  { label: "Sun", cs101: 0.5, math201: 1.0, eng102: 0.5 },
];
const MONTHLY_STUDY = [
  { label: "Wk 1", cs101: 8, math201: 6, eng102: 4 },
  { label: "Wk 2", cs101: 10, math201: 7, eng102: 5 },
  { label: "Wk 3", cs101: 7, math201: 9, eng102: 6 },
  { label: "Wk 4", cs101: 11, math201: 8, eng102: 7 },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function StudentDashboard() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  const activeCourses = useMemo(() => STUDENT_COURSES.filter(c => c.status === "active"), []);
  const totalCredits = activeCourses.reduce((sum, c) => sum + c.credits, 0);
  const completedCourses = STUDENT_COURSES.filter(c => c.status === "completed").length;
  const unreadAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length;
  const courseMap = useMemo(() => new Map(STUDENT_COURSES.map(c => [c.id, c])), []);
  const progressMap = useMemo(() => new Map(STUDENT_PROGRESS.map(p => [p.course_id, p])), []);

  const dueSoon = STUDENT_ASSIGNMENTS.filter(a => {
    if (a.status !== "pending" && a.status !== "missing") return false;
    const d = daysUntil(a.due_date);
    return d >= 0 && d <= 7;
  }).length;

  // Overall semester progress across active courses
  const overallProgress = activeCourses.length
    ? Math.round(activeCourses.reduce((s, c) => s + c.progress, 0) / activeCourses.length)
    : 0;

  // Assignments: open work first (soonest due), then recently finished
  const assignments = useMemo(() => {
    const open = STUDENT_ASSIGNMENTS.filter(a => a.status === "pending" || a.status === "missing")
      .sort((a, b) => daysUntil(a.due_date) - daysUntil(b.due_date));
    const done = STUDENT_ASSIGNMENTS.filter(a => a.status !== "pending" && a.status !== "missing");
    return [...open, ...done].slice(0, 5);
  }, []);

  const liveSessions = useMemo(
    () =>
      STUDENT_MOCK_MEETINGS.filter(m => m.status !== "ended").sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      ),
    [],
  );

  const chartConfig = useMemo(() => {
    const colors = ["var(--primary)", "oklch(0.68 0.15 237)", "oklch(0.8 0.16 80)"];
    return Object.fromEntries(
      activeCourses.slice(0, 3).map((c, i) => [c.id, { label: c.code, color: colors[i] }]),
    ) satisfies ChartConfig;
  }, [activeCourses]);
  const chartData = range === "weekly" ? WEEKLY_STUDY : MONTHLY_STUDY;
  const chartKeys = Object.keys(chartConfig);
  const totalHours = chartData.reduce((s, row) => s + chartKeys.reduce((t, k) => t + Number(row[k as keyof typeof row] ?? 0), 0), 0);
  const avgLabel = range === "weekly"
    ? `Avg. ${(totalHours / 7).toFixed(1)}h per day this week`
    : `Avg. ${(totalHours / 4).toFixed(1)}h per week this month`;

  return (
    <div className={pageStackClass}>
      {/* Stats */}
      <div className={statGridClass}>
        <StudentKPICard title="Active Courses" value={activeCourses.length} hint={`${totalCredits} enrolled credits`} icon={BookOpen} />
        <StudentKPICard title="Completed" value={completedCourses} hint="Courses finished" icon={BadgeCheck} variant="success" />
        <StudentKPICard title="Due Soon" value={dueSoon} hint="Deadlines within 7 days" icon={Hourglass} variant="warning" />
        <StudentKPICard title="Announcements" value={unreadAnnouncements} hint="Unread notices" icon={Bell} variant="info" />
      </div>

      {/* Continue Learning + Goals */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <section className={cn(panelClass, "xl:col-span-2")}>
          <div className={panelHeadClass}>
            <h2 className={panelTitleClass}>Continue Learning</h2>
            <Link prefetch={false} href="/student/courses" className={linkClass}>
              All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {activeCourses.map((course, i) => {
              const tone = COURSE_TONES[i % COURSE_TONES.length];
              const p = progressMap.get(course.id);
              return (
                <Link
                  key={course.id}
                  prefetch={false}
                  href={`/student/courses/${course.id}`}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background p-3 transition-shadow hover:shadow-md sm:gap-4"
                >
                  <div className={cn("flex h-[72px] w-[72px] shrink-0 flex-col sm:h-20 sm:w-20 items-center justify-center gap-1 rounded-lg bg-gradient-to-br text-white", tone.tile)}>
                    <span className="text-[11px] font-extrabold tracking-wide">{course.code}</span>
                    <TileRing value={course.progress} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-[10px] font-bold uppercase tracking-wider", tone.text)}>{course.instructor}</p>
                    <p className="truncate text-sm font-semibold">{course.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {p ? `${p.lessons_completed}/${p.total_lessons} Lessons` : `${course.credits} credits`}
                      <span aria-hidden>•</span>
                      {course.due_assignments} due
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card sm:h-9 sm:w-9 text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className={panelClass}>
          <div className={panelHeadClass}>
            <h2 className={panelTitleClass}>Goals &amp; Progress</h2>
            <Link prefetch={false} href="/student/profile/goals" className={linkClass}>
              Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Donut value={overallProgress} />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold tabular-nums">{overallProgress}%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold tabular-nums">{100 - overallProgress}%</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <DailyGoal />
          </div>
          <div className="mt-4">
            <WeeklyStreak />
          </div>
        </section>
      </div>

      {/* Assignments | Live Sessions + Study Statistics */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <section className={cn(panelClass, "xl:col-span-2")}>
          <div className={panelHeadClass}>
            <h2 className={panelTitleClass}>My Assignments</h2>
            <Link prefetch={false} href="/student/assignments" className={linkClass}>
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <div className={cn(emptyStateClass, "border-0 bg-transparent")}>
              <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
              <h3 className={emptyTitleClass}>You&apos;re all caught up</h3>
              <p className={emptyBodyClass}>No assignments right now.</p>
            </div>
          ) : (
            <>
              {/* Mobile: compact list */}
              <ul className="divide-y divide-border md:hidden">
                {assignments.map(a => {
                  const course = courseMap.get(a.course_id);
                  const status = statusStyles[a.status] ?? statusStyles.pending;
                  const due = new Date(a.due_date);
                  return (
                    <li key={a.id}>
                      <Link prefetch={false} href={`/student/assignments/${a.id}`} className="flex items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {course?.code ?? "Course"} · {isValid(due) ? format(due, "MMM d") : "No date"}
                            {a.points_earned !== null ? ` · ${a.points_earned}/${a.total_points}` : ""}
                          </p>
                        </div>
                        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", status.cls)}>{status.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Tablet & desktop: table */}
              <table className="hidden w-full text-sm md:table">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="w-10 py-3 pl-2">#</th>
                    <th className="py-3">Assignment</th>
                    <th className="py-3">Due</th>
                    <th className="py-3">Score</th>
                    <th className="py-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignments.map((a, i) => {
                    const course = courseMap.get(a.course_id);
                    const status = statusStyles[a.status] ?? statusStyles.pending;
                    const open = a.status === "pending" || a.status === "missing";
                    const due = new Date(a.due_date);
                    return (
                      <tr key={a.id} className="hover:bg-muted/30">
                        <td className="py-3 pl-2 font-medium tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3">
                          <Link prefetch={false} href={`/student/assignments/${a.id}`} className="font-medium hover:text-primary">
                            {a.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{course?.name ?? "Course"}</p>
                        </td>
                        <td className="py-3 tabular-nums text-muted-foreground">
                          {isValid(due) ? format(due, "MMM d") : "—"}
                        </td>
                        <td className="py-3 tabular-nums">
                          {a.points_earned !== null ? (
                            <>
                              <span className="font-semibold">{a.points_earned}</span>
                              <span className="text-muted-foreground">/{a.total_points}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—/{a.total_points}</span>
                          )}
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <div className="inline-flex items-center gap-3">
                            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.cls)}>{status.label}</span>
                            {open && (
                              <Link
                                prefetch={false}
                                href={`/student/assignments/${a.id}`}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                Start
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </section>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-1">
          <section className={panelClass}>
            <div className={panelHeadClass}>
              <h2 className={panelTitleClass}>Live Sessions</h2>
              <Link prefetch={false} href="/student/live-classes" className={linkClass}>
                All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {liveSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CalendarClock className="mb-2 h-7 w-7 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No upcoming sessions.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {liveSessions.slice(0, 3).map(m => {
                  const start = new Date(m.start_time);
                  const isLive = m.status === "live";
                  return (
                    <li key={m.id}>
                      <Link
                        prefetch={false}
                        href={`/student/live-classes/${m.id}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition-shadow hover:shadow-md"
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            isLive ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary",
                          )}
                        >
                          <Video className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{m.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 shrink-0" />
                            {isValid(start) ? format(start, "EEE, MMM d · h:mm a") : "TBA"}
                          </p>
                        </div>
                        {isLive ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-600">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> LIVE
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">{m.duration} min</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={panelClass}>
            <div className={cn(panelHeadClass, "mb-2")}>
              <div className="min-w-0">
                <h2 className={panelTitleClass}>Study Statistics</h2>
                <p className="truncate text-xs text-muted-foreground">{avgLabel}</p>
              </div>
              <div className="flex shrink-0 rounded-lg border border-border bg-muted/40 p-0.5" role="tablist">
                {(["weekly", "monthly"] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    role="tab"
                    aria-selected={range === r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors",
                      range === r ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <ChartContainer config={chartConfig} className="aspect-auto h-[170px] w-full">
              <BarChart data={chartData} margin={{ left: -20, right: 0, top: 6, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={v => `${v}h`} width={40} fontSize={10} />
                <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
                {chartKeys.map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="study"
                    fill={`var(--color-${key})`}
                    maxBarSize={22}
                    radius={i === chartKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {chartKeys.map(key => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: chartConfig[key].color }} />
                  {chartConfig[key].label}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
