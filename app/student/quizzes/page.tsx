"use client";

import { useState } from "react";
import { Play, CheckCircle, Clock, Eye, HelpCircle, Timer, Award, BookOpen, ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { cn } from "@/lib/utils";
import { STUDENT_QUIZZES, STUDENT_COURSES } from "@/lib/student-mock-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, listCardClass, pageStackClass, pillClass, rowActionClass, statGridClass, tabButtonClass, tabCountClass, tabRowClass, tableHeadClass, tableHeadRowClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";
import { StudentTip } from "@/components/student/tip";

type StatusFilter = "all" | "not_started" | "in_progress" | "submitted";

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "course": return "Course";
    case "module": return "Module";
    case "lesson": return "Lesson";
    default: return "Quiz";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "course": return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400";
    case "module": return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400";
    case "lesson": return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    default: return "";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "submitted":
      return <span className={pillClass("success")}><CheckCircle className="h-3.5 w-3.5" /> Completed</span>;
    case "in_progress":
      return <span className={pillClass("info")}><Clock className="h-3.5 w-3.5" /> In Progress</span>;
    case "not_started":
      return <span className={pillClass("neutral")}><HelpCircle className="h-3.5 w-3.5" /> Not Started</span>;
    default:
      return null;
  }
};

const getActionButton = (quiz: typeof STUDENT_QUIZZES[0]) => {
  if (quiz.status === "submitted") {
    return (
      <Button size="sm" variant="outline" className={rowActionClass} asChild>
        <Link href={`/student/quizzes/${quiz.id}`}>
          <Eye className="h-3.5 w-3.5" /> Review
        </Link>
      </Button>
    );
  }
  if (quiz.status === "in_progress") {
    return (
      <Button size="sm" className={rowActionClass} asChild>
        <Link href={`/student/quizzes/${quiz.id}`}>
          <Play className="h-3.5 w-3.5 fill-current" /> Continue
        </Link>
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" className={rowActionClass} asChild>
      <Link href={`/student/quizzes/${quiz.id}`}>
        <Play className="h-3.5 w-3.5" /> Take Quiz
      </Link>
    </Button>
  );
};

export default function QuizzesPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts = {
    all: STUDENT_QUIZZES.length,
    not_started: STUDENT_QUIZZES.filter(q => q.status === "not_started").length,
    in_progress: STUDENT_QUIZZES.filter(q => q.status === "in_progress").length,
    submitted: STUDENT_QUIZZES.filter(q => q.status === "submitted").length,
  };

  const filtered = STUDENT_QUIZZES
    .filter(q => filter === "all" || q.status === filter)
    .sort((a, b) => {
      const order = { in_progress: 0, not_started: 1, submitted: 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    });

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "in_progress", label: "In Progress" },
    { key: "not_started", label: "Upcoming" },
    { key: "submitted", label: "Completed" },
  ];

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Quizzes & Exams" }]} />

      <PageHeader
        title="Quizzes & Exams"
        description="Track and take your assessments."
      />

      <StudentTip>
        The timer starts when you click Continue and cannot be paused. Finish before you run out of time.
      </StudentTip>

      <div className={statGridClass}>
        <StudentKPICard title="Total Assigned" value={counts.all} icon={FileText} />
        <StudentKPICard title="In Progress" value={counts.in_progress} icon={Play} variant="info" />
        <StudentKPICard title="Upcoming" value={counts.not_started} icon={Clock} variant="warning" />
        <StudentKPICard title="Completed" value={counts.submitted} icon={CheckCircle} variant="success" />
      </div>

      {/* Filter Tabs + Table */}
      <Card className={listCardClass}>
        {/* Tab Row */}
        <div className={tabRowClass}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={tabButtonClass(filter === tab.key)}
            >
              {tab.label}
              <span className={tabCountClass(filter === tab.key)}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile card layout */}
        <div className="lg:hidden divide-y divide-border">
          {filtered.length === 0 ? (
            <div className={cn(emptyStateClass, "m-3 border-0 bg-transparent py-14")}>
              <HelpCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <h3 className={emptyTitleClass}>No quizzes in this category</h3>
              <p className={emptyBodyClass}>Try another filter to see the rest of your assessments.</p>
            </div>
          ) : (
            filtered.map((quiz) => {
              const course = STUDENT_COURSES.find(c => c.id === quiz.course_id);
              return (
                <Link
                  key={quiz.id}
                  href={`/student/quizzes/${quiz.id}`}
                  className="block px-4 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border", getCategoryColor(quiz.category))}>
                          {getCategoryLabel(quiz.category)}
                        </span>
                        {getStatusBadge(quiz.status)}
                      </div>
                      <p className="font-medium text-sm text-foreground line-clamp-2">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />{course?.code} · {quiz.target_name}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" />{quiz.total_questions} Qs</span>
                      <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{quiz.time_limit}m</span>
                      <span>{quiz.attempts.length}/{quiz.attempts_allowed} attempts</span>
                    </div>
                    {quiz.best_score !== null && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Award className="h-3 w-3" />{quiz.best_score}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Desktop table layout */}
        <Table className="hidden lg:table w-full">
          <TableHeader>
            <TableRow className={tableHeadRowClass}>
              <TableHead className={cn(tableHeadClass, "w-[34%] pl-6")}>Quiz</TableHead>
              <TableHead className={tableHeadClass}>Course / Topic</TableHead>
              <TableHead className={cn(tableHeadClass, "text-center")}>Duration</TableHead>
              <TableHead className={cn(tableHeadClass, "text-center")}>Attempts</TableHead>
              <TableHead className={cn(tableHeadClass, "text-center")}>Best Score</TableHead>
              <TableHead className={cn(tableHeadClass, "text-center")}>Status</TableHead>
              <TableHead className={cn(tableHeadClass, "text-right pr-6")}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <HelpCircle className="h-8 w-8 opacity-30" />
                    <p className="text-sm">No quizzes in this category.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((quiz) => {
                const course = STUDENT_COURSES.find(c => c.id === quiz.course_id);
                return (
                  <TableRow key={quiz.id} className="group hover:bg-muted/30">
                    {/* Quiz Name */}
                    <TableCell className="pl-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border", getCategoryColor(quiz.category))}>
                            {getCategoryLabel(quiz.category)}
                          </span>
                        </div>
                        <Link href={`/student/quizzes/${quiz.id}`} className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                          {quiz.title}
                        </Link>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />
                          {quiz.total_questions} questions
                        </p>
                      </div>
                    </TableCell>

                    {/* Course / Topic */}
                    <TableCell className="py-4">
                      <div className="flex items-start gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{course?.code}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{quiz.target_name}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="text-center py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-foreground">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        {quiz.time_limit}m
                      </span>
                    </TableCell>

                    {/* Attempts */}
                    <TableCell className="text-center py-4">
                      <span className="text-sm text-foreground">
                        {quiz.attempts.length}
                        <span className="text-muted-foreground">/{quiz.attempts_allowed}</span>
                      </span>
                    </TableCell>

                    {/* Best Score */}
                    <TableCell className="text-center py-4">
                      {quiz.best_score !== null ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <Award className="h-3.5 w-3.5" />
                          {quiz.best_score}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center py-4">
                      {getStatusBadge(quiz.status)}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-6 py-4">
                      {getActionButton(quiz)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
