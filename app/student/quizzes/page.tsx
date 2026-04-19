"use client";

import { useState } from "react";
import { Play, CheckCircle, Clock, Eye, HelpCircle, Timer, Award, BookOpen, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle className="h-3.5 w-3.5" /> Completed</span>;
    case "in_progress":
      return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400"><Clock className="h-3.5 w-3.5" /> In Progress</span>;
    case "not_started":
      return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><HelpCircle className="h-3.5 w-3.5" /> Not Started</span>;
    default:
      return null;
  }
};

const getActionButton = (quiz: typeof STUDENT_QUIZZES[0]) => {
  if (quiz.status === "submitted") {
    return (
      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
        <Link href={`/student/quizzes/${quiz.id}`}>
          <Eye className="h-3.5 w-3.5" /> Review
        </Link>
      </Button>
    );
  }
  if (quiz.status === "in_progress") {
    return (
      <Button size="sm" className="gap-1.5" asChild>
        <Link href={`/student/quizzes/${quiz.id}`}>
          <Play className="h-3.5 w-3.5 fill-current" /> Continue
        </Link>
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" className="gap-1.5" asChild>
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
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Quizzes & Exams" }]} />

      <PageHeader
        title="Quizzes & Exams"
        description="Track and take your assessments"
      />

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center px-4 py-4 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/document.png" alt="Total Assigned" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Assigned</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{counts.all}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l lg:border-r border-border px-4">
          <img src="https://img.icons8.com/scribby/96/clock.png" alt="Upcoming" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Upcoming</p>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{counts.not_started + counts.in_progress}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/check.png" alt="Completed" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{counts.submitted}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Table */}
      <Card className="border-border overflow-hidden">
        {/* Tab Row */}
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors -mb-px",
                filter === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                filter === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile card layout */}
        <div className="lg:hidden divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <HelpCircle className="h-8 w-8 opacity-30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No quizzes in this category.</p>
            </div>
          ) : (
            filtered.map((quiz) => {
              const course = STUDENT_COURSES.find(c => c.id === quiz.course_id);
              return (
                <Link
                  key={quiz.id}
                  href={`/student/quizzes/${quiz.id}`}
                  className="block px-4 py-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", getCategoryColor(quiz.category))}>
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
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[40%] pl-6">Quiz</TableHead>
              <TableHead>Course / Topic</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center">Attempts</TableHead>
              <TableHead className="text-center">Best Score</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
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
                  <TableRow key={quiz.id} className="group hover:bg-muted/20">
                    {/* Quiz Name */}
                    <TableCell className="pl-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", getCategoryColor(quiz.category))}>
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
