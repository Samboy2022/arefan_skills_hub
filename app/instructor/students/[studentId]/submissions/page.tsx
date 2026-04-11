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
import { SUBMISSION_STATUS } from "@/lib/instructor-constants";

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
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${student.id}` },
          { label: "Submissions" },
        ]}
      />

      {/* Student Header Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-transparent p-6">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">{student.name}</h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <span className="text-sm text-muted-foreground">{student.email}</span>
                <span className="inline-flex items-center gap-1 font-mono text-xs bg-muted px-2 py-0.5 rounded-md">{student.studentId}</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {enrolledCourses.map((c) => (
                  <span key={c.id} className="text-xs bg-background border border-border px-2 py-0.5 rounded-md font-medium">
                    {c.code}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={downloadSubsCSV}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            { label: "Total Assignments", value: totalSubs, color: "text-violet-600", bg: "bg-violet-50", icon: FileText },
            { label: "Graded", value: graded, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
            { label: "Awaiting Review", value: pending, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
            { label: "Average Score", value: `${avgScore}%`, color: "text-blue-600", bg: "bg-blue-50", icon: Star },
          ].map((s) => (
            <div key={s.label} className="bg-card p-4 flex items-center gap-3">
              <div className={`${s.bg} ${s.color} rounded-lg p-2 flex-shrink-0`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
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
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold w-[30%]">Assignment</TableHead>
                <TableHead className="font-semibold">Course</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Submitted</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No assignments match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubs.map((row) => {
                  const statusInfo = getSubmissionStatusInfo(row.status);
                  const isExpanded = expandedRow === row.assignmentId;
                  const isLate = row.submittedDate && row.submittedDate > row.dueDate;
                  return (
                    <>
                      <TableRow
                        key={row.assignmentId}
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${isExpanded ? "bg-muted/20" : ""}`}
                        onClick={() => setExpandedRow(isExpanded ? null : row.assignmentId)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-3.5 w-3.5 text-violet-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{row.assignmentTitle}</p>
                              <p className="text-xs text-muted-foreground capitalize">{row.assignmentType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium">{row.courseCode}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {row.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {row.submittedDate ? (
                            <div>
                              <span>{row.submittedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              {isLate && <span className="ml-1.5 text-xs text-orange-600 font-medium">Late</span>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border-transparent text-xs ${statusInfo.color}`}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {row.score !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{row.score}/{row.maxScore}</span>
                              <span className="text-xs text-muted-foreground">
                                ({Math.round((row.score / row.maxScore) * 100)}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.feedback && (
                            isExpanded
                              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (row.feedback || row.files.length > 0) && (
                        <TableRow key={`${row.assignmentId}-expanded`} className="bg-muted/10 hover:bg-muted/10">
                          <TableCell colSpan={7} className="py-4 px-6">
                            <div className="space-y-3">
                              {row.feedback && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Instructor Feedback</p>
                                  <p className="text-sm bg-background border border-border rounded-lg p-3">{row.feedback}</p>
                                </div>
                              )}
                              {row.files.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Submitted Files</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {row.files.map((f) => (
                                      <span key={f} className="flex items-center gap-1.5 text-xs bg-background border border-border rounded-md px-2 py-1">
                                        <FileText className="h-3.5 w-3.5 text-blue-500" /> {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold w-[30%]">Quiz</TableHead>
                  <TableHead className="font-semibold">Course</TableHead>
                  <TableHead className="font-semibold">Attempt Date</TableHead>
                  <TableHead className="font-semibold">Time Taken</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((row) => (
                  <TableRow key={row.attemptId} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Brain className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="font-medium text-sm">{row.quizTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium">{row.courseCode}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.attemptDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.timeTaken !== null ? `${row.timeTaken} min` : "—"}
                      {row.timeLimit && <span className="text-xs text-muted-foreground ml-1">/ {row.timeLimit} min</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.pct >= 70 ? "bg-emerald-500" : "bg-red-500"}`}
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{row.score}/{row.maxScore}</span>
                        <span className="text-xs text-muted-foreground">({row.pct}%)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-transparent text-xs font-medium ${row.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {row.passed ? "Passed" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}