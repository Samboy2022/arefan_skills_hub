"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, CheckCircle2, Circle, ClipboardList, FileQuestion, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { DailyGoal, Donut, WeeklyStreak } from "@/components/student/progress-widgets";
import { pageStackClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_PROGRESS } from "@/lib/student-mock-data";

const panelClass = "min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5";

/* Mock semester goals until goals are stored server-side. */
const INITIAL_GOALS = [
  { id: "g1", text: "Finish all CS101 lessons", done: false },
  { id: "g2", text: "Score 85%+ on the Calculus midterm", done: false },
  { id: "g3", text: "Submit every assignment on time", done: true },
  { id: "g4", text: "Study at least 4 hours a day", done: false },
];

export default function GoalsProgressPage() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [draft, setDraft] = useState("");

  const active = STUDENT_COURSES.filter(c => c.status === "active");
  const overall = active.length ? Math.round(active.reduce((s, c) => s + c.progress, 0) / active.length) : 0;
  const totals = STUDENT_PROGRESS.reduce(
    (t, p) => ({
      lessons: t.lessons + p.lessons_completed,
      lessonsAll: t.lessonsAll + p.total_lessons,
      assignments: t.assignments + p.assignments_completed,
      assignmentsAll: t.assignmentsAll + p.total_assignments,
      quizzes: t.quizzes + p.quizzes_taken,
      quizzesAll: t.quizzesAll + p.total_quizzes,
    }),
    { lessons: 0, lessonsAll: 0, assignments: 0, assignmentsAll: 0, quizzes: 0, quizzesAll: 0 },
  );
  const doneGoals = goals.filter(g => g.done).length;

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setGoals(g => [...g, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  };

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Profile", href: "/student/profile" }, { label: "Goals & Progress" }]} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Overview */}
        <section className={panelClass}>
          <h2 className="mb-4 text-base font-semibold">Semester Progress</h2>
          <div className="flex items-center gap-5">
            <Donut value={overall} size={104} />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold tabular-nums">{overall}%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold tabular-nums">{100 - overall}%</span>
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <DailyGoal />
          </div>
        </section>

        <section className={panelClass}>
          <h2 className="mb-4 text-base font-semibold">This Week</h2>
          <WeeklyStreak />
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: BookOpen, label: "Lessons", v: totals.lessons, all: totals.lessonsAll },
              { icon: ClipboardList, label: "Assignments", v: totals.assignments, all: totals.assignmentsAll },
              { icon: FileQuestion, label: "Quizzes", v: totals.quizzes, all: totals.quizzesAll },
            ].map(({ icon: Icon, label, v, all }) => (
              <div key={label} className="rounded-xl border border-border bg-background p-2.5">
                <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-sm font-bold tabular-nums">
                  {v}
                  <span className="font-medium text-muted-foreground">/{all}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Semester goals checklist */}
        <section className={panelClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">My Goals</h2>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
              {doneGoals}/{goals.length} done
            </span>
          </div>
          <ul className="space-y-2">
            {goals.map(g => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setGoals(list => list.map(x => (x.id === g.id ? { ...x, done: !x.done } : x)))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/50"
                >
                  {g.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={cn(g.done && "text-muted-foreground line-through")}>{g.text}</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addGoal} className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Add a goal…"
              aria-label="New goal"
              className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Add goal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>

      {/* Per-course progress */}
      <section className={panelClass}>
        <h2 className="mb-4 text-base font-semibold">Course Progress</h2>
        <div className="divide-y divide-border">
          {active.map(course => {
            const p = STUDENT_PROGRESS.find(x => x.course_id === course.id);
            return (
              <Link
                key={course.id}
                prefetch={false}
                href={`/student/courses/${course.id}`}
                className="flex flex-col gap-2 py-3 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 sm:w-1/3">
                  <p className="truncate text-sm font-semibold">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.code} · {course.instructor}</p>
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <Progress value={course.progress} className="h-2 flex-1" />
                  <span className="w-10 text-right text-sm font-semibold tabular-nums">{course.progress}%</span>
                </div>
                {p && (
                  <p className="text-xs text-muted-foreground sm:w-56 sm:text-right">
                    {p.lessons_completed}/{p.total_lessons} lessons · {p.assignments_completed}/{p.total_assignments} assignments
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
