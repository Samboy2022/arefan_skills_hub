"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { differenceInCalendarDays, format, isToday, isTomorrow, isValid } from "date-fns";
import { ArrowRight, CheckCircle2, Circle, ClipboardCheck, ClipboardList, FilePen, Paperclip, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, pageStackClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import type { StudentAssignment } from "@/lib/student-types";

type Tab = "all" | "upcoming" | "submitted" | "graded";

const isOpen = (a: StudentAssignment) => a.status === "pending" || a.status === "missing";
const isSubmitted = (a: StudentAssignment) => a.status === "submitted" || a.status === "late";

const categoryLabel: Record<StudentAssignment["category"], string> = {
  course: "Course assignment",
  module: "Module assignment",
  lesson: "Lesson assignment",
};

const statusPill: Record<StudentAssignment["status"], { label: string; cls: string }> = {
  pending: { label: "Not submitted", cls: "bg-muted text-muted-foreground" },
  missing: { label: "Missing", cls: "bg-red-500/10 text-red-700 dark:text-red-400" },
  submitted: { label: "Submitted", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
  late: { label: "Submitted late", cls: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
  graded: { label: "Graded", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
};

const actionLabel = (a: StudentAssignment) =>
  isOpen(a) ? (a.status === "missing" ? "Submit now" : "View brief") : a.status === "graded" ? "Feedback" : "View detail";

function fmtDate(iso: string | null, pattern = "MMM d, h:mm a") {
  if (!iso) return "—";
  const d = new Date(iso);
  if (!isValid(d)) return "—";
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`;
  return format(d, pattern);
}

/** Small coloured label describing how close the deadline is. */
function dueBadge(a: StudentAssignment) {
  const due = new Date(a.due_date);
  if (!isValid(due)) return null;
  if (!isOpen(a)) return { label: statusPill[a.status].label, cls: statusPill[a.status].cls };
  const days = differenceInCalendarDays(due, new Date());
  if (days < 0) return { label: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`, cls: "bg-red-500/10 text-red-700 dark:text-red-400" };
  if (days === 0) return { label: "Due today", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" };
  if (days === 1) return { label: "Due tomorrow", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400" };
  return { label: `Due in ${days} days`, cls: "bg-primary/10 text-primary" };
}

/** Secondary line under the title in the task list. */
function metaLine(a: StudentAssignment) {
  if (a.status === "graded") return `Graded · ${a.points_earned ?? "—"}/${a.total_points}`;
  if (isSubmitted(a)) return `Submitted ${fmtDate(a.submission_date)}`;
  return fmtDate(a.due_date);
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={null}>
      <AssignmentsContent />
    </Suspense>
  );
}

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const session = (searchParams.get("session") ?? "2024-2025").replace("-", "/");
  const [tab, setTab] = useState<Tab>("all");
  const [courseId, setCourseId] = useState("all");

  const courseMap = useMemo(() => new Map(STUDENT_COURSES.map(c => [c.id, c])), []);

  const byCourse = useMemo(
    () => STUDENT_ASSIGNMENTS.filter(a => courseId === "all" || a.course_id === courseId),
    [courseId],
  );

  const counts = {
    all: byCourse.length,
    upcoming: byCourse.filter(isOpen).length,
    submitted: byCourse.filter(isSubmitted).length,
    graded: byCourse.filter(a => a.status === "graded").length,
  };

  // Open work sorted by due date; finished work most recent first
  const upcoming = useMemo(
    () =>
      byCourse
        .filter(isOpen)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()),
    [byCourse],
  );
  const done = useMemo(
    () =>
      byCourse
        .filter(a => !isOpen(a))
        .sort((a, b) => new Date(b.submission_date ?? b.due_date).getTime() - new Date(a.submission_date ?? a.due_date).getTime()),
    [byCourse],
  );

  const showUpcoming = tab === "all" || tab === "upcoming";
  const doneVisible = done.filter(a => tab === "all" || (tab === "submitted" ? isSubmitted(a) : tab === "graded" ? a.status === "graded" : false));
  const visible = [...(showUpcoming ? upcoming : []), ...doneVisible];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = visible.find(a => a.id === selectedId) ?? visible[0] ?? null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All tasks" },
    { key: "upcoming", label: "Upcoming" },
    { key: "submitted", label: "Submitted" },
    { key: "graded", label: "Graded" },
  ];

  const Row = ({ a }: { a: StudentAssignment }) => {
    const course = courseMap.get(a.course_id);
    const pill = statusPill[a.status];
    const active = selected?.id === a.id;
    const Icon = isOpen(a) ? FilePen : ClipboardCheck;
    const content = (
      <>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            {course?.code ?? "Course"}
            <span className="hidden sm:inline"> – {course?.name ?? ""} · {categoryLabel[a.category]}</span>
          </p>
          <p className="line-clamp-2 text-sm font-semibold sm:truncate">{a.title}</p>
          <p className={cn("text-xs", isOpen(a) ? "text-primary" : "text-muted-foreground")}>{metaLine(a)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", pill.cls)}>{pill.label}</span>
          <span className="hidden items-center gap-1 text-xs font-semibold text-primary sm:inline-flex">
            {actionLabel(a)} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </>
    );
    const base = "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors";
    return (
      <li>
        {/* Phones/tablets: open the assignment page */}
        <Link prefetch={false} href={`/student/assignments/${a.id}`} className={cn(base, "hover:bg-muted/50 lg:hidden")}>
          {content}
        </Link>
        {/* Desktop: show details in the side panel */}
        <button
          type="button"
          onClick={() => setSelectedId(a.id)}
          aria-pressed={active}
          className={cn(base, "hidden lg:flex", active ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50")}
        >
          {content}
        </button>
      </li>
    );
  };

  return (
    <div className={pageStackClass}>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Assignments</h1>

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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Academic Year {session} · {counts.upcoming} upcoming task{counts.upcoming === 1 ? "" : "s"} across your courses
          </span>
          <span className="font-medium">Sorted by due date ↓</span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        {/* Task list */}
        <section className="min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4 lg:col-span-3">
          <div className="mb-1 flex items-center justify-between px-2 pt-1">
            <h2 className="text-lg font-semibold">Your task list</h2>
          </div>

          {visible.length === 0 ? (
            <div className={cn(emptyStateClass, "border-0 bg-transparent")}>
              <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <h3 className={emptyTitleClass}>Nothing here</h3>
              <p className={emptyBodyClass}>No assignments match this filter.</p>
            </div>
          ) : (
            <>
              {showUpcoming && upcoming.length > 0 && (
                <>
                  <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</p>
                  <ul className="space-y-1">
                    {upcoming.map(a => (
                      <Row key={a.id} a={a} />
                    ))}
                  </ul>
                </>
              )}
              {doneVisible.length > 0 && (
                <>
                  <p
                    className={cn(
                      "px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                      showUpcoming && upcoming.length > 0 && "mt-2 border-t border-border",
                    )}
                  >
                    Submitted &amp; graded
                  </p>
                  <ul className="space-y-1">
                    {doneVisible.map(a => (
                      <Row key={a.id} a={a} />
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </section>

        {/* Detail panel (desktop) */}
        {selected && <DetailPanel a={selected} courseMap={courseMap} />}
      </div>
    </div>
  );
}

function DetailPanel({
  a,
  courseMap,
}: {
  a: StudentAssignment;
  courseMap: Map<string, (typeof STUDENT_COURSES)[number]>;
}) {
  const course = courseMap.get(a.course_id);
  const badge = dueBadge(a);
  const due = new Date(a.due_date);
  const open = isOpen(a);

  // Checklist derived from the assignment state (no per-step tracking yet)
  const steps = [
    { label: a.has_attachment ? "Download the assignment brief" : "Read the instructions", done: !open },
    { label: "Upload your solution", done: !open },
  ];
  const ready = steps.filter(s => s.done).length;

  return (
    <aside className="hidden min-w-0 lg:col-span-2 lg:block">
      <div className="sticky top-20 rounded-2xl border border-border bg-muted/40 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {badge && <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", badge.cls)}>{badge.label}</span>}
          <span className="text-xs tabular-nums text-muted-foreground">{isValid(due) ? format(due, "MMM d · h:mm a") : ""}</span>
        </div>

        <h2 className="mt-3 text-xl font-bold leading-snug text-primary">{a.title}</h2>

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
              {course?.instructor} · {categoryLabel[a.category]}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-muted-foreground">{a.description}</p>

        {a.status === "graded" ? (
          <div className="mt-5 rounded-xl border border-border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">Your grade</h3>
              <p className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                {a.points_earned}
                <span className="text-sm font-medium text-muted-foreground">/{a.total_points}</span>
              </p>
            </div>
            {a.feedback && <p className="mt-2 text-sm text-muted-foreground">&ldquo;{a.feedback}&rdquo;</p>}
          </div>
        ) : (
          <div className="mt-5">
            <h3 className="font-semibold">Submission checklist</h3>
            <p className="text-xs text-muted-foreground">
              {ready} of {steps.length} steps ready
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(ready / steps.length) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {steps.map(s => (
                <li key={s.label} className="flex items-center gap-2">
                  {s.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={cn(s.done && "text-muted-foreground")}>{s.label}</span>
                </li>
              ))}
            </ul>
            {!open && <p className="mt-3 text-xs text-muted-foreground">Submitted {fmtDate(a.submission_date)} · awaiting grade.</p>}
          </div>
        )}

        <div className="mt-5 space-y-2">
          <Button asChild className="w-full gap-2">
            <Link prefetch={false} href={`/student/assignments/${a.id}`}>
              {open ? (
                <>
                  <Upload className="h-4 w-4" /> Upload submission
                </>
              ) : (
                <>
                  View details <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {a.total_points} points
            {a.has_attachment && (
              <>
                {" · "}
                <Paperclip className="inline h-3 w-3" /> Brief attached
              </>
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
