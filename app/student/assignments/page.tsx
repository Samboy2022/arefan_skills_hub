"use client";

import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Upload, Eye, Paperclip, BookOpen, ChevronRight, Timer } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { cn } from "@/lib/utils";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

type StatusFilter = "all" | "pending" | "submitted" | "graded" | "late" | "missing";

const categoryLabel = (c: string) =>
  ({ course: "Course", module: "Module", lesson: "Lesson" })[c] ?? "Assignment";

const categoryColor = (c: string) =>
  ({
    course: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400",
    module: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400",
    lesson: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  })[c] ?? "";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  graded:    { label: "Graded",       icon: <CheckCircle className="h-3.5 w-3.5" />, cls: "text-emerald-700 dark:text-emerald-400" },
  submitted: { label: "Under Review", icon: <Clock className="h-3.5 w-3.5" />,        cls: "text-blue-700 dark:text-blue-400" },
  pending:   { label: "Pending",      icon: <AlertCircle className="h-3.5 w-3.5" />,  cls: "text-amber-700 dark:text-amber-400" },
  late:      { label: "Late",         icon: <AlertCircle className="h-3.5 w-3.5" />,  cls: "text-orange-700 dark:text-orange-400" },
  missing:   { label: "Missing",      icon: <AlertCircle className="h-3.5 w-3.5" />,  cls: "text-red-700 dark:text-red-400" },
};

const tabs: { key: StatusFilter; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "pending",   label: "Pending" },
  { key: "submitted", label: "Under Review" },
  { key: "graded",    label: "Graded" },
  { key: "late",      label: "Late" },
  { key: "missing",   label: "Missing" },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts = tabs.reduce((acc, t) => {
    acc[t.key] = t.key === "all"
      ? STUDENT_ASSIGNMENTS.length
      : STUDENT_ASSIGNMENTS.filter(a => a.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = STUDENT_ASSIGNMENTS
    .filter(a => filter === "all" || a.status === filter)
    .sort((a, b) => {
      const order = { pending: 0, missing: 1, late: 2, submitted: 3, graded: 4 };
      return (order[a.status as keyof typeof order] ?? 5) - (order[b.status as keyof typeof order] ?? 5);
    });

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Assignments" }]} />

      <PageHeader
        title="Assignments"
        description="View and submit your course assignments"
      />

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center px-4 py-4 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Total Assigned" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Assigned</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{counts.all}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l lg:border-r border-border px-4">
          <img src="https://img.icons8.com/scribby/96/error.png" alt="Action Required" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Action Required</p>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">
              {(counts.pending ?? 0) + (counts.missing ?? 0)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/check.png" alt="Graded" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Graded</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{counts.graded}</p>
          </div>
        </div>
      </div>

      {/* Main Card with Tabs + List */}
      <Card className="border-border overflow-hidden">

        {/* Filter Tabs */}
        <div className="flex items-center gap-0.5 px-3 pt-3 border-b border-border overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors -mb-px whitespace-nowrap flex items-center gap-1.5",
                filter === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  filter === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Desktop Table Header */}
        <div className="hidden lg:flex items-center px-4 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex-1">Assignment</span>
          <span className="w-28 text-center">Deadline</span>
          <span className="w-24 text-center">Marks</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-20 text-right">Action</span>
        </div>

        {/* Assignment Rows */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle className="h-8 w-8 opacity-20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No assignments in this category.</p>
            </div>
          ) : (
            filtered.map(a => {
              const course = STUDENT_COURSES.find(c => c.id === a.course_id);
              const dueDate = new Date(a.due_date);
              const isOverdue = dueDate < new Date() && a.status === "pending";
              const st = statusConfig[a.status] ?? { label: a.status, icon: null, cls: "text-muted-foreground" };

              return (
                <Link
                  key={a.id}
                  href={`/student/assignments/${a.id}`}
                  className="block hover:bg-muted/20 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0", categoryColor(a.category))}>
                            {categoryLabel(a.category)}
                          </span>
                          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", st.cls)}>
                            {st.icon}{st.label}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-foreground line-clamp-1">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <BookOpen className="h-3 w-3 shrink-0" />{course?.code} · {a.target_name}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className={cn("text-xs font-medium flex items-center gap-1", isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                        <Timer className="h-3 w-3" />
                        {format(dueDate, "MMM dd, yyyy")} · {format(dueDate, "h:mm a")}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        {a.status === "graded" && a.points_earned !== null
                          ? <span className="text-emerald-600 dark:text-emerald-400">{a.points_earned}/{a.total_points} pts</span>
                          : `${a.total_points} pts`}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout -> Flex Table Row */}
                  <div className="hidden lg:flex items-center px-4 py-4 gap-4">
                    {/* Name Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0", categoryColor(a.category))}>
                          {categoryLabel(a.category)}
                        </span>
                        {a.has_attachment && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary shrink-0">
                            <Paperclip className="h-3 w-3" /> Attachment
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm text-foreground line-clamp-1">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <BookOpen className="h-3 w-3 shrink-0" />
                        {course?.code} · {a.target_name}
                      </p>
                    </div>

                    {/* Deadline */}
                    <div className="w-28 text-center">
                      <p className={cn("text-xs font-medium", isOverdue ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                        {format(dueDate, "MMM dd, yyyy")}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{format(dueDate, "h:mm a")}</p>
                    </div>

                    {/* Marks */}
                    <div className="w-24 text-center text-sm">
                      {a.status === "graded" && a.points_earned !== null
                        ? <span className="font-semibold text-emerald-600 dark:text-emerald-400">{a.points_earned}/{a.total_points}</span>
                        : <span className="text-foreground">{a.total_points} pts</span>}
                    </div>

                    {/* Status */}
                    <div className="w-24 text-center">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", st.cls)}>
                        {st.icon}{st.label}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="w-20 flex justify-end" onClick={e => e.stopPropagation()}>
                      {a.status === "pending" ? (
                        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={e => e.stopPropagation()}>
                          <Upload className="h-3.5 w-3.5" /> Submit
                        </Button>
                      ) : a.status === "missing" ? (
                        <span className="text-xs text-muted-foreground">Past Due</span>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-muted-foreground" onClick={e => e.stopPropagation()}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
