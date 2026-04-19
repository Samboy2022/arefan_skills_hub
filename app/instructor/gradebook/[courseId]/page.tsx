"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MOCK_INSTRUCTOR_COURSES, MOCK_STUDENTS, MOCK_GRADES 
} from "@/lib/instructor-mock-data";
import { 
  Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, Download, 
  Lightbulb, AlertCircle, CheckCircle2, ChevronDown, BookOpen, Brain, MessageSquare
} from "lucide-react";

const PAGE_SIZE = 10;

interface StudentGradeState {
  id: string;
  name: string;
  email: string;
  studentId: string;
  assignmentScore: string;
  quizScore: string;
  forumScore: string;
  status: "not_graded" | "graded";
  gradedItemsBreakdown: { title: string, type: string, score: number, maxScore: number }[];
}

export default function CourseGradebookPage({ params }: { params: Promise<{ courseId: string }> }) {
  const unwrappedParams = React.use(params);
  const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === unwrappedParams.courseId);
  const enrolledStudents = MOCK_STUDENTS.filter(s => s.enrolledCourses.includes(unwrappedParams.courseId));

  // Initialize grading state for students
  const [gradesState, setGradesState] = useState<Record<string, StudentGradeState>>(() => {
    const initialState: Record<string, StudentGradeState> = {};
    
    enrolledStudents.forEach(student => {
      // Find past grades for this student in this course
      const courseGrades = MOCK_GRADES.filter(g => g.studentId === student.id && g.courseId === unwrappedParams.courseId);
      
      const assignments = courseGrades.filter(g => g.type === "assignment");
      const quizzes = courseGrades.filter(g => g.type === "quiz");
      const forums = courseGrades.filter(g => g.type === "forum");

      const sumPercent = (items: typeof courseGrades) => {
        if (!items.length) return 0;
        return Math.round(items.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / items.length);
      };

      const breakdown = courseGrades.map(g => ({
        title: g.label || g.id,
        type: g.type || "other",
        score: g.score,
        maxScore: g.maxScore
      }));

      const hasGrades = courseGrades.length > 0;

      initialState[student.id] = {
        id: student.id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        assignmentScore: hasGrades ? sumPercent(assignments).toString() : "",
        quizScore: hasGrades ? sumPercent(quizzes).toString() : "",
        forumScore: hasGrades ? sumPercent(forums).toString() : "",
        status: hasGrades ? "graded" : "not_graded",
        gradedItemsBreakdown: breakdown,
      };
    });
    return initialState;
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [successDialogState, setSuccessDialogState] = useState<{ open: boolean, studentName: string }>({ open: false, studentName: "" });
  const [breakdownDialogState, setBreakdownDialogState] = useState<{ open: boolean, studentId: string | null }>({ open: false, studentId: null });

  // Filtering & Pagination
  const filteredStudents = useMemo(() => {
    let rows = Object.values(gradesState);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q)
      );
    }
    // Sort by name alphabetically
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [gradesState, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  const handleInputChange = (studentId: string, field: "assignmentScore" | "quizScore" | "forumScore", value: string) => {
    // Only allow numbers and empty string
    if (value !== "" && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) return;
    
    setGradesState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const calculateTotal = (studentId: string) => {
    const s = gradesState[studentId];
    if (!s) return 0;
    const a = Number(s.assignmentScore) || 0;
    const q = Number(s.quizScore) || 0;
    const f = Number(s.forumScore) || 0;
    
    // Sum up to 100%
    return Math.min(100, Math.round(a + q + f));
  };

  const handleGradeAction = (studentId: string) => {
    const student = gradesState[studentId];
    setGradesState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status: "graded" }
    }));
    setSuccessDialogState({ open: true, studentName: student.name });
  };

  const handleEditGrade = (studentId: string) => {
    // This allows them to edit again but doesn't change status until they click Save again
    // For simplicity, we just keep it as graded, let them change values, and click Grade (which could say Update)
  };

  const openBreakdown = (studentId: string) => {
    setBreakdownDialogState({ open: true, studentId });
  };

  // Export functions
  const downloadCSV = () => {
    const headers = ["Name", "Student ID", "Email", "Status", "Assignments %", "Quizzes %", "Forum %", "Total %"];
    const rows = filteredStudents.map(s => [
      `"${s.name}"`, s.studentId, `"${s.email}"`, s.status, 
      s.assignmentScore || "0", s.quizScore || "0", s.forumScore || "0", calculateTotal(s.id)
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course?.code}_Gradebook.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = async () => {
    const XLSX = await import("xlsx");
    const data = filteredStudents.map(s => ({
      "Name": s.name,
      "Student ID": s.studentId,
      "Email": s.email,
      "Status": s.status === "graded" ? "Graded" : "Not Graded",
      "Assignments (%)": Number(s.assignmentScore) || 0,
      "Quizzes (%)": Number(s.quizScore) || 0,
      "Forum (%)": Number(s.forumScore) || 0,
      "Total (%)": calculateTotal(s.id)
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grades");
    XLSX.writeFile(wb, `${course?.code}_Gradebook.xlsx`);
  };

  const downloadPDF = () => {
    const printContent = `
      <html><head><title>Grades Export - ${course?.code}</title>
      <style>
        body{font-family:sans-serif;font-size:12px} table{width:100%;border-collapse:collapse} 
        th,td{padding:8px;border:1px solid #ccc;text-align:left} th{background:#f3f4f6}
      </style></head><body>
      <h2>${course?.code} - ${course?.title} | Gradebook Report</h2>
      <table><thead><tr><th>Name</th><th>ID</th><th>Status</th><th>Assignments</th><th>Quizzes</th><th>Forums</th><th>Total</th></tr></thead>
      <tbody>${filteredStudents.map(s => `<tr>
        <td>${s.name}</td><td>${s.studentId}</td><td>${s.status}</td>
        <td>${s.assignmentScore || "0"}%</td><td>${s.quizScore || "0"}%</td><td>${s.forumScore || "0"}%</td><td><strong>${calculateTotal(s.id)}%</strong></td>
      </tr>`).join("")}</tbody></table></body></html>
    `;
    const w = window.open("", "_blank");
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Gradebook", href: "/instructor/gradebook" },
          { label: course.code }
        ]} 
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Course: {course.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">{course.code}</p>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">Pro Grading Tips</AlertTitle>
        <AlertDescription className="mt-1 flex flex-col gap-1 text-blue-800/80">
          <p>• Enter obtainable marks out of 100% for each category to automatically calculate the total.</p>
          <p>• Make sure to click the <b>Grade</b> action button to securely record the student's marks.</p>
        </AlertDescription>
      </Alert>

      {/* Filter and Table */}
      <div className="rounded-xl border bg-card shadow-sm space-y-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1 w-full">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search student by name or ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap ml-2">Showing {filteredStudents.length} students</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2 text-green-700 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-800">
              <FileText className="h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={downloadExcel} className="gap-2 text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-800">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-2 text-red-700 bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-800">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="w-full">
          <div className="hidden lg:grid lg:grid-cols-[1.5fr_100px_100px_100px_100px_200px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Student</span>
            <span className="text-center">Assignments %</span>
            <span className="text-center">Quizzes %</span>
            <span className="text-center">Forum %</span>
            <span className="text-center">Total</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-border">
              {paginatedStudents.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">
                    No students match your search filter.
                </div>
              ) : (
                paginatedStudents.map((s) => {
                  const total = calculateTotal(s.id);
                  const isGraded = s.status === "graded";
                  
                  return (
                    <div key={s.id} className="block hover:bg-muted/10 transition-colors">
                      {/* Mobile View */}
                      <div className="lg:hidden px-5 py-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                              {s.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-foreground">{s.name}</span>
                              <span className="text-xs text-muted-foreground font-mono">{s.studentId}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`font-bold px-2.5 py-1 ${
                            total >= 70 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
                            total >= 50 ? "bg-amber-100 text-amber-700 border-amber-200" : 
                            total > 0 ? "bg-red-100 text-red-700 border-red-200" : "bg-muted text-muted-foreground border-transparent"
                          }`}>
                            {total}%
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1.5 text-center px-1 truncate">Assign</p>
                              <Input 
                                type="text" 
                                placeholder="0" 
                                value={s.assignmentScore} 
                                onChange={(e) => handleInputChange(s.id, "assignmentScore", e.target.value)}
                                className={`w-full text-center h-9 text-sm font-medium ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                              />
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1.5 text-center px-1 truncate">Quizzes</p>
                              <Input 
                                type="text" 
                                placeholder="0" 
                                value={s.quizScore} 
                                onChange={(e) => handleInputChange(s.id, "quizScore", e.target.value)}
                                className={`w-full text-center h-9 text-sm font-medium ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                              />
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1.5 text-center px-1 truncate">Forum</p>
                              <Input 
                                type="text" 
                                placeholder="0" 
                                value={s.forumScore} 
                                onChange={(e) => handleInputChange(s.id, "forumScore", e.target.value)}
                                className={`w-full text-center h-9 text-sm font-medium ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                              />
                           </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                          {isGraded ? (
                            <>
                              <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold flex-1">
                                <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/breakdown/${s.id}`}>
                                  Breakdown
                                </Link>
                              </Button>
                              <Button variant="default" size="sm" asChild className="h-8 text-xs gap-1.5 flex-1">
                                <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/edit/${s.id}`}>
                                  Edit Grade
                                </Link>
                              </Button>
                            </>
                          ) : (
                            <Button variant="default" size="sm" asChild className="h-8 text-xs flex-1 bg-brand hover:bg-brand/90 text-primary-foreground">
                              <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/edit/${s.id}`}>
                                Issue Grade
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden lg:grid lg:grid-cols-[1.5fr_100px_100px_100px_100px_200px] gap-4 items-center px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                            {s.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-medium text-sm text-foreground truncate">{s.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{s.studentId}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Input 
                            type="text" 
                            placeholder="0-100" 
                            value={s.assignmentScore} 
                            onChange={(e) => handleInputChange(s.id, "assignmentScore", e.target.value)}
                            className={`w-20 text-center h-8 text-sm font-medium transition-colors ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                          />
                        </div>
                        
                        <div className="flex justify-center">
                          <Input 
                            type="text" 
                            placeholder="0-100" 
                            value={s.quizScore} 
                            onChange={(e) => handleInputChange(s.id, "quizScore", e.target.value)}
                            className={`w-20 text-center h-8 text-sm font-medium transition-colors ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                          />
                        </div>
                        
                        <div className="flex justify-center">
                          <Input 
                            type="text" 
                            placeholder="0-100" 
                            value={s.forumScore} 
                            onChange={(e) => handleInputChange(s.id, "forumScore", e.target.value)}
                            className={`w-20 text-center h-8 text-sm font-medium transition-colors ${isGraded ? "border-emerald-200 bg-emerald-50/70 focus-visible:ring-emerald-500" : ""}`}
                          />
                        </div>
                        
                        <div className="flex justify-center">
                          <Badge variant="outline" className={`font-bold px-3 py-1 shadow-sm ${
                            total >= 70 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
                            total >= 50 ? "bg-amber-100 text-amber-700 border-amber-200" : 
                            total > 0 ? "bg-red-100 text-red-700 border-red-200" : "bg-muted text-muted-foreground border-transparent"
                          }`}>
                            {total}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          {isGraded ? (
                            <>
                              <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold shadow-sm">
                                <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/breakdown/${s.id}`}>
                                  Breakdown
                                </Link>
                              </Button>
                              <Button variant="default" size="sm" asChild className="h-8 text-xs shadow-sm">
                                <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/edit/${s.id}`}>
                                  Edit Grade
                                </Link>
                              </Button>
                            </>
                          ) : (
                            <Button variant="default" size="sm" asChild className="h-8 text-xs w-24 bg-brand hover:bg-brand/90 text-primary-foreground shadow-sm">
                              <Link href={`/instructor/gradebook/${unwrappedParams.courseId || 'course'}/edit/${s.id}`}>
                                Grade
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
            <span>
              Page <strong className="text-foreground">{page}</strong> of <strong className="text-foreground">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogState.open} onOpenChange={(open) => setSuccessDialogState(prev => ({...prev, open}))}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Grade Saved!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              The grades for <strong className="text-foreground">{successDialogState.studentName}</strong> have been successfully recorded in the gradebook.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-center">
            <Button onClick={() => setSuccessDialogState(prev => ({...prev, open: false}))} className="w-full sm:w-32">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Breakdown Dialog */}
      {breakdownDialogState.studentId && gradesState[breakdownDialogState.studentId] && (
        <Dialog open={breakdownDialogState.open} onOpenChange={(open) => setBreakdownDialogState(prev => ({...prev, open}))}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Grade Breakdown
              </DialogTitle>
              <DialogDescription>
                Detailed grading information for <strong>{gradesState[breakdownDialogState.studentId].name}</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Instructor Review Tips</p>
                  <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                    <li>Scores below 50% usually require mandatory tutoring sessions.</li>
                    <li>Ensure forum score accurately reflects their qualitative discussion efforts, not just post counts.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border bg-background overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Origin of Marks (Aggregated Items)
                </div>
                <div className="divide-y max-h-[300px] overflow-y-auto">
                  {gradesState[breakdownDialogState.studentId].gradedItemsBreakdown.length > 0 ? (
                    gradesState[breakdownDialogState.studentId].gradedItemsBreakdown.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-1.5 rounded-md">
                            {item.type === "assignment" ? <BookOpen className="h-3.5 w-3.5 text-violet-600" /> : 
                             item.type === "quiz" ? <Brain className="h-3.5 w-3.5 text-emerald-600" /> : 
                             <MessageSquare className="h-3.5 w-3.5 text-blue-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{item.score}/{item.maxScore}</p>
                          <p className="text-xs text-muted-foreground">{Math.round((item.score/item.maxScore)*100)}%</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No specific historical graded items found. These marks may have been entered manually here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setBreakdownDialogState(prev => ({...prev, open: false}))}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
