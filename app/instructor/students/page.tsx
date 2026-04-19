"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Download, FileSpreadsheet, FileText, Users, TrendingUp, Clock, UserCheck, X, ChevronLeft, ChevronRight, Eye, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MOCK_STUDENTS, MOCK_GRADES, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { STUDENT_STATUS } from "@/lib/instructor-constants";

const PAGE_SIZE = 10;

type SortField = "name" | "avgGrade" | "lastActivity" | "joinDate" | "enrolledCourses";
type SortDir = "asc" | "desc";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  studentId: string;
  status: string;
  enrolledCourses: string[];
  joinDate: Date;
  lastActivity?: Date;
  avgGrade: number;
  letterGrade: string;
}

function getLetterGrade(pct: number) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function getGradeColor(letter: string) {
  switch (letter) {
    case "A": return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "B": return "text-blue-700 bg-blue-50 border-blue-200 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "C": return "text-amber-700 bg-amber-50 border-amber-200 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "D": return "text-orange-700 bg-orange-50 border-orange-200 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    default: return "text-red-700 bg-red-50 border-red-200 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400";
  }
}

function getStatusInfo(status: string) {
  return STUDENT_STATUS.find((s) => s.id === status) || STUDENT_STATUS[0];
}

function downloadCSV(rows: StudentRow[]) { /* Mocked implementation */ }
async function downloadExcel(rows: StudentRow[]) { /* Mocked implementation */ }
function downloadPDF(rows: StudentRow[]) { /* Mocked implementation */ }

const tabs = [
  { key: "all", label: "All Students" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending Approval" },
  { key: "suspended", label: "Suspended" },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const studentRows: StudentRow[] = useMemo(() => {
    return MOCK_STUDENTS.map((s) => {
      const grades = MOCK_GRADES.filter((g) => g.studentId === s.id);
      const avgGrade = grades.length
        ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)
        : 0;
      return {
        ...s,
        avgGrade,
        letterGrade: getLetterGrade(avgGrade),
      };
    });
  }, []);

  const counts = tabs.reduce((acc, t) => {
    acc[t.key] = t.key === "all"
      ? studentRows.length
      : studentRows.filter((s) => s.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = useMemo(() => {
    let rows = [...studentRows];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") rows = rows.filter((r) => r.status === statusFilter);
    if (courseFilter !== "all") rows = rows.filter((r) => r.enrolledCourses.includes(courseFilter));

    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [studentRows, search, statusFilter, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = [courseFilter !== "all", search !== ""].filter(Boolean).length;
  const clearFilters = () => { setCourseFilter("all"); setSearch(""); setPage(1); };

  const totalStudents = studentRows.length;
  const activeStudents = studentRows.filter((s) => s.status === "active").length;
  const pendingStudents = studentRows.filter((s) => s.status === "pending").length;
  const overallAvg = studentRows.length
    ? Math.round(studentRows.reduce((s, r) => s + r.avgGrade, 0) / studentRows.length)
    : 0;
  const atRiskStudents = studentRows.filter((s) => s.avgGrade < 60).length;

  return (
    <div className="mx-auto max-w-7xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students" },
        ]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor student progress across all your courses</p>
        </div>
      </div>

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 items-center justify-center px-6 py-6 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/user.png" alt="Total Students" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Students</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{totalStudents}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4">
          <img src="https://img.icons8.com/scribby/96/check.png" alt="Active" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{activeStudents}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l lg:border-r border-border px-4 col-span-2 lg:col-span-1 border-t lg:border-t-0 pt-6 lg:pt-0">
          <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Avg Grade" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Avg Grade</p>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">{overallAvg}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-r border-border px-4 col-span-1 border-t lg:border-t-0 pt-6 lg:pt-0">
          <img src="https://img.icons8.com/scribby/96/clock.png" alt="Pending" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Pending Approval</p>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{pendingStudents}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center px-4 col-span-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-l lg:border-l-0">
          <img src="https://img.icons8.com/scribby/96/error.png" alt="At Risk" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">At Risk</p>
            <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 leading-none">{atRiskStudents}</p>
          </div>
        </div>
      </div>

      {/* Main Card with Tabs + List */}
      <Card className="border-border overflow-hidden shadow-sm">
        
        {/* Filter Tabs & Additional Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-background">
          <div className="flex items-center gap-0.5 px-3 pt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors -mb-px whitespace-nowrap flex items-center gap-1.5",
                  statusFilter === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                    statusFilter === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-3 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-2.5 h-9 flex-1 max-w-[200px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent text-xs outline-none placeholder:text-muted-foreground w-full"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }}>
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            <select
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
              className="text-xs border border-border rounded-lg px-2.5 h-9 bg-background outline-none cursor-pointer max-w-[120px]"
            >
              <option value="all">All Courses</option>
              {MOCK_INSTRUCTOR_COURSES.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 text-xs shadow-sm whitespace-nowrap hidden sm:flex">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Export format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => downloadCSV(filtered)}>
                  <FileText className="h-4 w-4 text-green-600" /> Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => downloadExcel(filtered)}>
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" /> Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => downloadPDF(filtered)}>
                  <FileText className="h-4 w-4 text-red-600" /> Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Column Header (desktop only) */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_100px_90px_140px_120px_auto] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="w-6 flex justify-center">
            <Checkbox 
              checked={paginated.length > 0 && paginated.every(s => selectedStudentIds.includes(s.id)) ? true : paginated.some(s => selectedStudentIds.includes(s.id)) ? "indeterminate" : false}
              onCheckedChange={(checked) => {
                if (checked === true) {
                  const newIds = paginated.map(s => s.id).filter(id => !selectedStudentIds.includes(id));
                  setSelectedStudentIds(prev => [...prev, ...newIds]);
                } else {
                  setSelectedStudentIds(prev => prev.filter(id => !paginated.some(s => s.id === id)));
                }
              }}
              aria-label="Select all on page"
            />
          </div>
          <span>Student</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-20 text-center">Courses</span>
          <span className="w-32 text-center">Avg Grade</span>
          <span className="w-28 text-center">Last Active</span>
          <span className="w-16 text-right">Action</span>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-border">
          {paginated.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="h-8 w-8 opacity-20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No students match your criteria.</p>
              {activeFilters > 0 && (
                <Button variant="link" onClick={clearFilters} className="text-xs mt-2 h-auto p-0">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            paginated.map(student => {
              const statusInfo = getStatusInfo(student.status);
              const lastActivityText = student.lastActivity
                ? student.lastActivity.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Never";
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <div key={student.id} className={cn("block hover:bg-muted/20 transition-colors group", isSelected && "bg-muted/10")}>
                  
                  {/* Mobile Layout */}
                  <div className="md:hidden px-4 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked === true) setSelectedStudentIds(prev => [...prev, student.id]);
                            else setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground line-clamp-1">{student.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{student.studentId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("border-transparent text-[10px] uppercase font-bold shrink-0", statusInfo.color)}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pl-7">
                      <span className="text-muted-foreground truncate">{student.email}</span>
                      <span className="font-medium shrink-0">Avg: {student.avgGrade}%</span>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 pt-2">
                       <Button size="sm" variant="secondary" asChild className="h-8 text-xs gap-1.5 flex-1 w-full bg-muted data-[state=open]:bg-muted">
                          <Link href={`/instructor/students/${student.id}`}>
                            View Profile
                          </Link>
                       </Button>
                       <Button size="icon" variant="outline" asChild className="h-8 w-8 shrink-0">
                          <Link href={`/instructor/students/${student.id}/message`}>
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Link>
                       </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[auto_1fr_100px_90px_140px_120px_auto] gap-4 items-center px-5 py-3">
                    
                    {/* Checkbox */}
                    <div className="w-6 flex justify-center">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked === true) setSelectedStudentIds(prev => [...prev, student.id]);
                          else setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                        }}
                      />
                    </div>

                    {/* Name Column */}
                    <div className="min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm text-foreground line-clamp-1">{student.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{student.studentId}</span>
                          <span>&middot;</span>
                          <span className="truncate">{student.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="w-24 text-center">
                      <Badge variant="outline" className={cn("border-transparent text-[10px] font-bold uppercase", statusInfo.color)}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Courses */}
                    <div className="w-20 flex justify-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-bold text-foreground">
                        {student.enrolledCourses.length}
                      </span>
                    </div>
                    
                    {/* Avg Grade */}
                    <div className="w-32 px-2 flex justify-center text-center">
                       <span className="text-sm font-semibold text-foreground">{student.avgGrade}%</span>
                    </div>

                    {/* Last Active */}
                    <div className="w-28 text-center text-xs text-muted-foreground">
                      {lastActivityText}
                    </div>

                    {/* Action */}
                    <div className="w-16 flex justify-end gap-1" >
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                             <DropdownMenuLabel className="text-xs text-muted-foreground">Student Actions</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/instructor/students/${student.id}`}>
                                  <Eye className="h-4 w-4 mr-2" /> View Profile
                                </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/instructor/students/${student.id}/message`}>
                                  <MessageCircle className="h-4 w-4 mr-2" /> Message
                                </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/instructor/students/${student.id}/grades`}>
                                  <TrendingUp className="h-4 w-4 mr-2" /> View Grades
                                </Link>
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border bg-muted/10 p-3">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-7 w-7 p-0 bg-background">
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i-1] === "number" && (p as number) - (arr[i-1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-muted-foreground">...</span>
                  ) : (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p as number)}
                      className={cn("h-7 w-7 p-0 text-xs", page !== p && "bg-background")}
                    >
                      {p}
                    </Button>
                  )
                )}

              <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-7 w-7 p-0 bg-background">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}
