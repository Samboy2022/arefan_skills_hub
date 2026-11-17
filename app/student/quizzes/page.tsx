"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, isValid } from "date-fns";
import { ArrowRight, ClipboardCheck, FileQuestion, Hash, ListChecks, RotateCcw, Timer, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, pageStackClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_QUIZZES } from "@/lib/student-mock-data";
import type { StudentQuiz } from "@/lib/student-types";

type Tab = "all" | "todo" | "in_progress" | "completed";

const isDone = (q: StudentQuiz) => q.status === "submitted";

const categoryLabel: Record<StudentQuiz["category"], string> = {
  course: "Course quiz",
  module: "Module quiz",
  lesson: "Lesson quiz",
};

const statusPill: Record<StudentQuiz["status"], { label: string; cls: string }> = {
  not_started: { label: "Not started", cls: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
  submitted: { label: "Completed", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
};

const typePill: Record<StudentQuiz["type"], { label: string; cls: string }> = {
  graded: { label: "Graded", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  practice: { label: "Practice", cls: "bg-primary/10 text-primary" },
  ungraded: { label: "Ungraded", cls: "bg-muted text-muted-foreground" },
};

/** Where the main action for a quiz should go. */
function action(q: StudentQuiz) {
  if (q.status === "in_progress") return { label: "Continue", href: `/student/quizzes/${q.id}/take` };
  if (q.status === "submitted") return { label: "View results", href: `/student/quizzes/${q.id}` };
  return { label: "Start quiz", href: `/student/quizzes/${q.id}/instructions` };
}

function metaLine(q: StudentQuiz) {
  if (isDone(q)) return `Best score ${q.best_score ?? "—"}% · ${q.attempts.length}/${q.attempts_allowed} attempts`;
  return `${q.total_questions} questions · ${q.time_limit} min`;
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={null}>
      <QuizzesContent />
    </Suspense>
  );
}

function QuizzesContent() {
  const searchParams = useSearchParams();
  const session = (searchParams.get("session") ?? "2024-2025").replace("-", "/");
  const [tab, setTab] = useState<Tab>("all");
  const [courseId, setCourseId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const courseMap = useMemo(() => new Map(STUDENT_COURSES.map(c => [c.id, c])), []);
  const byCourse = useMemo(
    () => STUDENT_QUIZZES.filter(q => courseId === "all" || q.course_id === courseId),
    [courseId],
  );

  const counts = {
    all: byCourse.length,
    todo: byCourse.filter(q => q.status === "not_started").length,
    in_progress: byCourse.filter(q => q.status === "in_progress").length,
    completed: byCourse.filter(isDone).length,
  };

  // In-progress first, then not started
  const open = byCourse
    .filter(q => !isDone(q))
    .filter(q => tab === "all" || (tab === "todo" ? q.status === "not_started" : tab === "in_progress" ? q.status === "in_progress" : false))
    .sort((a, b) => Number(b.status === "in_progress") - Number(a.status === "in_progress"));
  const done = byCourse.filter(q => isDone(q) && (tab === "all" || tab === "completed"));
  const visible = [...open, ...done];
  const selected = visible.find(q => q.id === selectedId) ?? visible[0] ?? null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All quizzes" },
    { key: "todo", label: "To do" },
    { key: "in_progress", label: "In progress" },
    { key: "completed", label: "Completed" },
  ];

  const Row = ({ q }: { q: StudentQuiz }) => {
    const course = courseMap.get(q.course_id);
    const pill = statusPill[q.status];
    const act = action(q);
    const Icon = isDone(q) ? ClipboardCheck : FileQuestion;
    const content = (
      <>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            {course?.code ?? "Course"}
            <span className="hidden sm:inline"> – {course?.name ?? ""} · {categoryLabel[q.category]}</span>
          </p>
          <p className="line-clamp-2 text-sm font-semibold sm:truncate">{q.title}</p>
          <p className={cn("text-xs", isDone(q) ? "text-muted-foreground" : "text-primary")}>{metaLine(q)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", pill.cls)}>{pill.label}</span>
          <span className="hidden items-center gap-1 text-xs font-semibold text-primary sm:inline-flex">
            {act.label} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </>
    );
    const base = "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors";
    const active = selected?.id === q.id;
    return (
      <li>
        {/* Phones/tablets: go straight to the quiz */}
        <Link prefetch={false} href={`/student/quizzes/${q.id}`} className={cn(base, "hover:bg-muted/50 lg:hidden")}>
          {content}
        </Link>
        {/* Desktop: show details in the side panel */}
        <button
          type="button"
          onClick={() => setSelectedId(q.id)}
          aria-pressed={active}
          className={cn(base, "hidden lg:flex", active ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50")}
        >
          {content}
        </button>
      </li>
    );
  };

  const groupLabel = "px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className={pageStackClass}>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Quizzes</h1>

      {/* Tabs + course filter */}
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]" role="tablist">
            {tabs.map(t => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  tab === t.key ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label} · {counts[t.key]}
              </button>
            ))}
          </div>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="h-10 w-full bg-card sm:w-48" aria-label="Filter by course">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {STUDENT_COURSES.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Academic Year {session} · {counts.todo + counts.in_progress} quiz{counts.todo + counts.in_progress === 1 ? "" : "zes"} waiting across your courses
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        {/* Quiz list */}
        <section className="min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4 lg:col-span-3">
          <h2 className="mb-1 px-2 pt-1 text-lg font-semibold">Your quiz list</h2>

          {visible.length === 0 ? (
            <div className={cn(emptyStateClass, "border-0 bg-transparent")}>
              <FileQuestion className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <h3 className={emptyTitleClass}>Nothing here</h3>
              <p className={emptyBodyClass}>No quizzes match this filter.</p>
            </div>
          ) : (
            <>
              {open.length > 0 && (
                <>
                  <p className={groupLabel}>To do</p>
                  <ul className="space-y-1">
                    {open.map(q => (
                      <Row key={q.id} q={q} />
                    ))}
                  </ul>
                </>
              )}
              {done.length > 0 && (
                <>
                  <p className={cn(groupLabel, open.length > 0 && "mt-2 border-t border-border")}>Completed</p>
                  <ul className="space-y-1">
                    {done.map(q => (
                      <Row key={q.id} q={q} />
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </section>

        {selected && <DetailPanel q={selected} courseMap={courseMap} />}
      </div>
    </div>
  );
}

function DetailPanel({
  q,
  courseMap,
}: {
  q: StudentQuiz;
  courseMap: Map<string, (typeof STUDENT_COURSES)[number]>;
}) {
  const course = courseMap.get(q.course_id);
  const act = action(q);
  const type = typePill[q.type];
  const attemptsLeft = Math.max(q.attempts_allowed - q.attempts.length, 0);

  const facts = [
    { icon: Hash, label: "Questions", value: q.total_questions },
    { icon: Timer, label: "Time limit", value: `${q.time_limit} min` },
    { icon: RotateCcw, label: "Attempts", value: `${q.attempts.length}/${q.attempts_allowed}` },
    { icon: Trophy, label: "Best score", value: q.best_score !== null ? `${q.best_score}%` : "—" },
  ];

  return (
    <aside className="hidden min-w-0 lg:col-span-2 lg:block">
      <div className="sticky top-20 rounded-2xl border border-border bg-muted/40 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", type.cls)}>{type.label}</span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusPill[q.status].cls)}>
            {statusPill[q.status].label}
          </span>
        </div>

        <h2 className="mt-3 text-xl font-bold leading-snug text-primary">{q.title}</h2>

        <div className="mt-3 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={course?.instructor_avatar} alt="" />
            <AvatarFallback>{course?.instructor?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {course?.code} – {course?.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {course?.instructor} · {q.target_name}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3">
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="h-3.5 w-3.5" /> {label}
              </p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-1.5 font-semibold">
            <ListChecks className="h-4 w-4 text-primary" /> Your attempts
          </h3>
          {q.attempts.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              No attempts yet · {q.attempts_allowed} allowed
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-card">
              {q.attempts.map(at => {
                const d = new Date(at.date_attempted);
                return (
                  <li key={at.attempt_number} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span>
                      Attempt {at.attempt_number}
                      <span className="ml-2 text-xs text-muted-foreground">{isValid(d) ? format(d, "MMM d, yyyy") : ""}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{at.score}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-5 space-y-2">
          <Button asChild className="w-full gap-2">
            <Link prefetch={false} href={act.href}>
              {act.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {isDone(q) && attemptsLeft > 0 && (
            <Button asChild variant="outline" className="w-full gap-2">
              <Link prefetch={false} href={`/student/quizzes/${q.id}/instructions`}>
                <RotateCcw className="h-4 w-4" /> Retake ({attemptsLeft} left)
              </Link>
            </Button>
          )}
          <p className="text-center text-xs text-muted-foreground">
            {q.type === "graded" ? "Counts toward your grade" : "Doesn't count toward your grade"}
          </p>
        </div>
      </div>
    </aside>
  );
}
