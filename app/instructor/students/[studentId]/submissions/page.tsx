"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText, CheckCircle2, Clock, AlertCircle, BookOpen, Brain,
  Download, Search, X, ChevronDown, ChevronUp, Calendar, Star, Filter
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  MOCK_STUDENTS, MOCK_ASSIGNMENTS, MOCK_QUIZZES, MOCK_INSTRUCTOR_COURSES,
} from "@/lib/instructor-mock-data";
import { StudentHeroCard } from "@/components/instructor/students/StudentHeroCard";
import { StudentTabStrip } from "@/components/instructor/students/StudentTabStrip";
import { SUBMISSION_STATUS } from "@/lib/instructor-constants";
import { Pencil } from "lucide-react";

function getSubmissionStatusInfo(status: string) {
  return SUBMISSION_STATUS.find((s) => s.id === status) || SUBMISSION_STATUS[0];
}

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-4 shadow-sm">
      <div className={`${bg} ${color} rounded-lg p-2.5 flex-shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function StudentSubmissionsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const student = MOCK_STUDENTS.find((s) => s.id === unwrappedParams.studentId) || MOCK_STUDENTS[0];
  const [activeTab, setActiveTab] = useState<"assignments" | "quizzes">("assignments");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Gather all submissions for this student across all assignments
  const mySubmissions = useMemo(() => {
    return MOCK_ASSIGNMENTS.flatMap((assignment) => {
      const sub = assignment.submissions.find((s) => s.studentId === student.id);
      const course = MOCK_INSTRUCTOR_COURSES.find((c) => c.id === assignment.courseId);
      return [{
        submissionId: sub?.id ?? null,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        assignmentType: assignment.type,
        courseId: assignment.courseId,
        courseTitle: course?.title ?? assignment.courseId,
        courseCode: course?.code ?? "",
        dueDate: assignment.dueDate,
        submittedDate: sub?.submissionDate ?? null,
        score: sub?.score ?? null,
        maxScore: assignment.maxScore,
        feedback: sub?.feedback ?? null,
        files: sub?.files ?? [],
        status: sub?.status ?? "pending",
      }];
    });
  }, [student.id]);

  // Gather all quiz attempts for this student
  const myAttempts = useMemo(() => {
    return MOCK_QUIZZES.flatMap((quiz) => {
      const attempts = quiz.attempts.filter((a) => a.studentId === student.id);
      const course = MOCK_INSTRUCTOR_COURSES.find((c) => c.id === quiz.courseId);
      return attempts.map((attempt) => {
        const timeTaken = attempt.endTime && attempt.startTime
          ? Math.round((attempt.endTime.getTime() - attempt.startTime.getTime()) / 60000)
          : null;
        const pct = Math.round((attempt.score / attempt.maxScore) * 100);
        return {
          attemptId: attempt.id,
          quizId: quiz.id,
          quizTitle: quiz.title,
          courseId: quiz.courseId,
          courseTitle: course?.title ?? quiz.courseId,
          courseCode: course?.code ?? "",
          attemptDate: attempt.endTime,
          timeTaken,
          score: attempt.score,
          maxScore: attempt.maxScore,
          pct,
          passed: pct >= quiz.passingScore,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
        };
      });
    });
  }, [student.id]);

  // Filtered assignments
  const filteredSubs = useMemo(() => {
    let rows = [...mySubmissions];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.assignmentTitle.toLowerCase().includes(q) || r.courseTitle.toLowerCase().includes(q));
    }
    if (courseFilter !== "all") rows = rows.filter((r) => r.courseId === courseFilter);
    if (statusFilter !== "all") rows = rows.filter((r) => r.status === statusFilter);
    return rows;
  }, [mySubmissions, search, courseFilter, statusFilter]);

  // Filtered quizzes
  const filteredAttempts = useMemo(() => {
    let rows = [...myAttempts];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.quizTitle.toLowerCase().includes(q) || r.courseTitle.toLowerCase().includes(q));
    }
    if (courseFilter !== "all") rows = rows.filter((r) => r.courseId === courseFilter);
    return rows;
  }, [myAttempts, search, courseFilter]);

  // Stats
  const totalSubs = mySubmissions.length;
  const graded = mySubmissions.filter((s) => s.status === "graded").length;
  const pending = mySubmissions.filter((s) => ["submitted", "pending"].includes(s.status)).length;
  const gradedWithScore = mySubmissions.filter((s) => s.score !== null);
  const avgScore = gradedWithScore.length
    ? Math.round(gradedWithScore.reduce((sum, s) => sum + ((s.score ?? 0) / s.maxScore) * 100, 0) / gradedWithScore.length)
    : 0;

  const initials = student.name.split(" ").map((n) => n[0]).join("");

  function downloadSubsCSV() {
    const headers = ["Assignment", "Course", "Due Date", "Submitted", "Status", "Score", "Feedback"];
    const rows = filteredSubs.map((r) => [
      `"${r.assignmentTitle}"`,
      `"${r.courseTitle}"`,
      r.dueDate.toLocaleDateString(),
      r.submittedDate ? r.submittedDate.toLocaleDateString() : "N/A",
      r.status,
      r.score !== null ? `${r.score}/${r.maxScore}` : "N/A",
      `"${r.feedback ?? ""}"`,
    ].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.name.replace(" ", "_")}_submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const clearFilters = () => { setSearch(""); setCourseFilter("all"); setStatusFilter("all"); };
  const hasFilters = search || courseFilter !== "all" || statusFilter !== "all";
  const enrolledCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => student.enrolledCourses.includes(c.id));

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${student.id}` },
          { label: "Submissions" },
        ]}
      />

      <StudentHeroCard student={student} courses={enrolledCourses} />
      <StudentTabStrip studentId={student.id} />

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Total" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Assignments</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{totalSubs}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 py-4 sm:py-0">
            <img src="https://img.icons8.com/scribby/96/check.png" alt="Graded" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Graded</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{graded}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center md:border-l border-border px-4 border-t sm:border-t-0 md:border-t-0 pt-4 sm:pt-0 pb-4 sm:pb-0">
            <img src="https://img.icons8.com/scribby/96/clock.png" alt="Pending" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Awaiting Review</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{pending}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 border-t md:border-t-0 pt-4 md:pt-0">
            <img src="https://img.icons8.com/scribby/96/star.png" alt="Avg" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Average Score</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">{avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "assignments"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Assignments
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${activeTab === "assignments" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            {mySubmissions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "quizzes"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Brain className="h-4 w-4" /> Quizzes
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${activeTab === "quizzes" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            {myAttempts.length}
          </span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
          />
          {search && <button onClick={() => setSearch("")}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none cursor-pointer"
        >
          <option value="all">All Courses</option>
          {enrolledCourses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
        </select>
        {activeTab === "assignments" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {SUBMISSION_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        )}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs text-muted-foreground">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="hidden md:grid md:grid-cols-[1.5fr_100px_1fr_1fr_120px_80px_40px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Assignment</span>
            <span>Course</span>
            <span>Due Date</span>
            <span>Submitted</span>
            <span>Status</span>
            <span>Score</span>
            <span></span>
          </div>
          <div className="divide-y divide-border">
              {filteredSubs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No assignments match your filters.
                </div>
              ) : (
                filteredSubs.map((row) => {
                  const statusInfo = getSubmissionStatusInfo(row.status);
                  const isExpanded = expandedRow === row.assignmentId;
                  const isLate = row.submittedDate && row.submittedDate > row.dueDate;
                  return (
                    <div key={row.assignmentId} className="block transition-colors">
                      <div
                        className={`hover:bg-muted/30 cursor-pointer ${isExpanded ? "bg-muted/10" : ""}`}
                        onClick={() => setExpandedRow(isExpanded ? null : row.assignmentId)}
                      >
                         <div className="md:hidden px-5 py-4 space-y-2">
                            <div className="flex items-center justify-between">
                               <p className="font-semibold text-sm truncate">{row.assignmentTitle}</p>
                               <Badge variant="outline" className={`border-transparent text-[10px] uppercase font-bold py-0 h-4 ${statusInfo.color}`}>{statusInfo.label}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                               <span>{row.courseCode} &middot; {row.assignmentType}</span>
                               <span className="font-medium text-foreground">{row.score !== null ? `${row.score}/${row.maxScore}` : "—"}</span>
                            </div>
                         </div>
                         <div className="hidden md:grid md:grid-cols-[1.5fr_100px_1fr_1fr_120px_80px_40px] gap-4 items-center px-5 py-3">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-violet-600" />
                              </div>
                              <div className="min-w-0 pr-2">
                                <p className="font-medium text-sm text-foreground truncate">{row.assignmentTitle}</p>
                                <p className="text-xs text-muted-foreground capitalize">{row.assignmentType}</p>
                              </div>
                            </div>
                            <div>
                               <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium">{row.courseCode}</span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                               <Calendar className="h-3 w-3" />
                               {row.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                               {row.submittedDate ? (
                                <div className="whitespace-nowrap">
                                  <span>{row.submittedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                  {isLate && <Badge className="ml-1.5 bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent shadow-none px-1 py-0 h-4 text-[10px] font-bold">Late</Badge>}
                                </div>
                              ) : (
                                <span>—</span>
                              )}
                            </div>
                            <div>
                               <Badge variant="outline" className={`border-transparent text-xs whitespace-nowrap ${statusInfo.color}`}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div>
                               {row.score !== null ? (
                                <div className="flex items-baseline gap-1">
                                  <span className="font-medium text-sm text-foreground">{row.score}/{row.maxScore}</span>
                                  <span className="text-[11px] text-muted-foreground">({Math.round((row.score / row.maxScore) * 100)}%)</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                            <div className="flex justify-end">
                               {row.feedback || row.files.length > 0 ? (
                                 isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                               ) : null}
                            </div>
                         </div>
                      </div>
                      {isExpanded && (row.feedback || row.files.length > 0) && (
                        <div className="bg-muted/5 px-5 lg:px-14 py-4 border-t border-border/50">
                            <div className="space-y-4">
                              {row.feedback && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Instructor Review</p>
                                  <p className="text-sm bg-background border border-border rounded-lg p-3 italic text-foreground/80">"{row.feedback}"</p>
                                </div>
                              )}
                              {row.files.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Attached Work</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {row.files.map((f) => (
                                      <span key={f} className="flex items-center gap-1.5 text-xs bg-background border border-border shadow-sm rounded-md px-2.5 py-1.5">
                                        <FileText className="h-3.5 w-3.5 text-blue-500" /> {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          {filteredAttempts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Brain className="h-8 w-8 opacity-30 mx-auto mb-2" />
              <p>No quiz attempts found</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid md:grid-cols-[1.5fr_100px_1fr_100px_100px_100px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Quiz</span>
                  <span>Course</span>
                  <span>Attempt Date</span>
                  <span>Time Taken</span>
                  <span className="text-right">Score</span>
                  <span className="text-center">Result</span>
              </div>
              <div className="divide-y divide-border">
                {filteredAttempts.map((row) => (
                    <div key={row.attemptId} className="block hover:bg-muted/10 transition-colors">
                       <div className="md:hidden px-5 py-4 space-y-2">
                           <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm truncate">{row.quizTitle}</p>
                              <Badge variant="outline" className={`border-transparent text-[10px] font-bold px-1 py-0 h-4 uppercase ${row.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                {row.passed ? "Passed" : "Failed"}
                              </Badge>
                           </div>
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{row.courseCode} &middot; {row.attemptDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              <span className="font-medium text-foreground">{row.score}/{row.maxScore}</span>
                           </div>
                       </div>
                       <div className="hidden md:grid md:grid-cols-[1.5fr_100px_1fr_100px_100px_100px] gap-4 items-center px-5 py-3">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Brain className="h-4 w-4 text-purple-600" />
                              </div>
                              <span className="font-medium text-sm text-foreground truncate pr-2">{row.quizTitle}</span>
                           </div>
                           <div>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium">{row.courseCode}</span>
                           </div>
                           <div className="text-sm text-muted-foreground">
                              {row.attemptDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                           </div>
                           <div className="text-sm text-muted-foreground whitespace-nowrap">
                              {row.timeTaken !== null ? `${row.timeTaken}m` : "—"}
                              {row.timeLimit && <span className="text-[11px] ml-1">/ {row.timeLimit}m</span>}
                           </div>
                           <div className="flex items-baseline justify-end gap-1">
                              <span className="text-sm font-medium text-foreground">{row.score}/{row.maxScore}</span>
                              <span className="text-[11px] text-muted-foreground">({row.pct}%)</span>
                           </div>
                           <div className="flex justify-center">
                              <Badge variant="outline" className={`border-transparent text-[10px] font-bold h-5 px-1.5 py-0 uppercase ${row.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                {row.passed ? "Passed" : "Failed"}
                              </Badge>
                           </div>
                       </div>
                    </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}