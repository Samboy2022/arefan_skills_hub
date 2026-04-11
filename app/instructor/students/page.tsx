"use client";

import { useState, useMemo, useCallback } from "react";
import { Mail, MessageCircle, Eye, MoreHorizontal, Search, Download, FileSpreadsheet, FileText, Users, TrendingUp, Clock, UserCheck, ChevronUp, ChevronDown, ChevronsUpDown, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
    case "A": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "B": return "text-blue-700 bg-blue-50 border-blue-200";
    case "C": return "text-amber-700 bg-amber-50 border-amber-200";
    case "D": return "text-orange-700 bg-orange-50 border-orange-200";
    default: return "text-red-700 bg-red-50 border-red-200";
  }
}

function getStatusInfo(status: string) {
  return STUDENT_STATUS.find((s) => s.id === status) || STUDENT_STATUS[0];
}

function downloadCSV(rows: StudentRow[]) {
  const headers = ["Name", "Email", "Student ID", "Status", "Enrolled Courses", "Avg Grade (%)", "Letter Grade", "Last Activity"];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) => [
      `"${r.name}"`,
      `"${r.email}"`,
      r.studentId,
      r.status,
      r.enrolledCourses.length,
      r.avgGrade,
      r.letterGrade,
      r.lastActivity ? r.lastActivity.toLocaleDateString() : "Never",
    ].join(","))
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadExcel(rows: StudentRow[]) {
  const XLSX = await import("xlsx");
  const data = rows.map((r) => ({
    "Name": r.name,
    "Email": r.email,
    "Student ID": r.studentId,
    "Status": r.status,
    "Enrolled Courses": r.enrolledCourses.length,
    "Avg Grade (%)": r.avgGrade,
    "Letter Grade": r.letterGrade,
    "Last Activity": r.lastActivity ? r.lastActivity.toLocaleDateString() : "Never",
    "Join Date": r.joinDate.toLocaleDateString(),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, "students_export.xlsx");
}

function downloadPDF(rows: StudentRow[]) {
  const printContent = `
    <html>
    <head>
      <title>Students Export</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f3f4f6; text-align: left; padding: 8px; border: 1px solid #e5e7eb; }
        td { padding: 8px; border: 1px solid #e5e7eb; }
        tr:nth-child(even) { background: #f9fafb; }
      </style>
    </head>
    <body>
      <h1>Students Report — ${new Date().toLocaleDateString()}</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Student ID</th><th>Status</th><th>Courses</th><th>Avg Grade</th><th>Last Activity</th></tr>
        </thead>
        <tbody>
          ${rows.map((r) => `
            <tr>
              <td>${r.name}</td>
              <td>${r.email}</td>
              <td>${r.studentId}</td>
              <td>${r.status}</td>
              <td>${r.enrolledCourses.length}</td>
              <td>${r.avgGrade}% (${r.letterGrade})</td>
              <td>${r.lastActivity ? r.lastActivity.toLocaleDateString() : "Never"}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(printContent);
  w.document.close();
  w.print();
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

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
    if (gradeFilter !== "all") rows = rows.filter((r) => r.letterGrade === gradeFilter);

    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "avgGrade": cmp = a.avgGrade - b.avgGrade; break;
        case "enrolledCourses": cmp = a.enrolledCourses.length - b.enrolledCourses.length; break;
        case "lastActivity":
          cmp = (a.lastActivity?.getTime() ?? 0) - (b.lastActivity?.getTime() ?? 0); break;
        case "joinDate": cmp = a.joinDate.getTime() - b.joinDate.getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [studentRows, search, statusFilter, courseFilter, gradeFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }, [sortField]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-foreground" />
      : <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-foreground" />;
  };

  const activeFilters = [statusFilter !== "all", courseFilter !== "all", gradeFilter !== "all"].filter(Boolean).length;
  const clearFilters = () => { setStatusFilter("all"); setCourseFilter("all"); setGradeFilter("all"); setSearch(""); setPage(1); };

  // KPI calculations
  const totalStudents = studentRows.length;
  const activeStudents = studentRows.filter((s) => s.status === "active").length;
  const pendingStudents = studentRows.filter((s) => s.status === "pending").length;
  const overallAvg = studentRows.length
    ? Math.round(studentRows.reduce((s, r) => s + r.avgGrade, 0) / studentRows.length)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
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

      {/* KPI Cards (Matches Gradebook) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          { label: "Active", value: activeStudents, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Overall Avg Grade", value: `${overallAvg}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Pending Approval", value: pendingStudents, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border ${kpi.border} bg-card p-4 flex items-center gap-4 shadow-sm`}>
            <div className={`${kpi.bg} ${kpi.color} rounded-lg p-2.5`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Student List Wrapped in Card (Matches Gradebook) */}
      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
        
        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap flex-1">
             <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }}>
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
             </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STUDENT_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>

            <select
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none cursor-pointer max-w-[180px] md:max-w-xs"
            >
              <option value="all">All Courses</option>
              {MOCK_INSTRUCTOR_COURSES.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => { setGradeFilter(e.target.value); setPage(1); }}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none cursor-pointer"
            >
              <option value="all">All Grades</option>
              {["A", "B", "C", "D", "F"].map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-xs text-muted-foreground">
                <X className="h-3 w-3" /> Clear ({activeFilters})
              </Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 shadow-sm whitespace-nowrap">
                <Download className="h-4 w-4" /> Export Display
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

        {/* Inner Table View */}
        <div className="rounded-lg border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold w-[28%] cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Student <SortIcon field="name" />
                </TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort("enrolledCourses")}>
                  Courses <SortIcon field="enrolledCourses" />
                </TableHead>
                <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort("avgGrade")}>
                  Avg Grade <SortIcon field="avgGrade" />
                </TableHead>
                <TableHead className="font-semibold cursor-pointer select-none" onClick={() => toggleSort("lastActivity")}>
                  Last Active <SortIcon field="lastActivity" />
                </TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-30" />
                      <p className="font-medium">No students match your filters</p>
                      <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear all filters</button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((student) => {
                  const statusInfo = getStatusInfo(student.status);
                  const lastActivityText = student.lastActivity
                    ? student.lastActivity.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Never";

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-semibold text-foreground truncate">{student.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{student.studentId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-transparent text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-bold">
                          {student.enrolledCourses.length}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium">{student.avgGrade}%</span>
                           <Badge variant="outline" className={`border-transparent text-xs px-1.5 py-0 h-5 font-bold ${getGradeColor(student.letterGrade)}`}>
                             {student.letterGrade}
                           </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lastActivityText}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900" title="View Profile">
                            <Link href={`/instructor/students/${student.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900" title="Send Email">
                            <a href={`mailto:${student.email}`}>
                                <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700 border border-violet-100 dark:bg-violet-900/20 dark:border-violet-900" title="View Submissions">
                            <Link href={`/instructor/students/${student.id}/submissions`}>
                                <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900" title="View Grades">
                            <Link href={`/instructor/students/${student.id}/grades`}>
                                <TrendingUp className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t bg-muted/10 p-3">
              <span>
                Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
                {" "}· Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="h-8 w-8 p-0 bg-background">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | string)[]>((acc, p, i, arr) => {
                    if (i > 0 && typeof arr[i - 1] === "number" && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                       <span key={`ellipsis-${i}`} className="px-1">…</span>
                    ) : (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p as number)}
                        className={`h-8 w-8 p-0 text-xs ${page !== p && "bg-background"}`}
                      >
                        {p}
                      </Button>
                    )
                  )}
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 w-8 p-0 bg-background">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
