"use client";

import * as React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  MOCK_STUDENTS, MOCK_GRADES, MOCK_ASSIGNMENTS, MOCK_QUIZZES, MOCK_INSTRUCTOR_COURSES
} from "@/lib/instructor-mock-data";
import { StudentHeroCard } from "@/components/instructor/students/StudentHeroCard";
import { StudentTabStrip } from "@/components/instructor/students/StudentTabStrip";
import { TrendingUp, FileText, Brain, ChevronRight, Mail, Calendar, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    default:  return "text-red-700 bg-red-50 border-red-200";
  }
}

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const student = MOCK_STUDENTS.find(s => s.id === unwrappedParams.studentId) || MOCK_STUDENTS[0];
  const enrolledCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => student.enrolledCourses.includes(c.id));

  // Academic Summary calculations
  const myGrades = MOCK_GRADES.filter((g) => g.studentId === student.id).sort((a, b) => b.gradedAt.getTime() - a.gradedAt.getTime());
  const cumulativeAvg = myGrades.length 
    ? Math.round(myGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / myGrades.length) 
    : 0;
  const cumulativeLetter = getLetterGrade(cumulativeAvg);
  
  // Assignment metrics
  const mySubmissions = MOCK_ASSIGNMENTS.flatMap((a) => a.submissions.filter(s => s.studentId === student.id));
  const assignmentsSubmitted = mySubmissions.length;
  const assignmentsTotal = MOCK_ASSIGNMENTS.filter(a => student.enrolledCourses.includes(a.courseId)).length;

  // Quiz metrics
  const myQuizAttempts = MOCK_QUIZZES.flatMap(q => q.attempts.filter(a => a.studentId === student.id).map(a => ({...a, passingScore: q.passingScore})));
  const quizzesAttempted = myQuizAttempts.length;
  const quizzesPassed = myQuizAttempts.filter(a => Math.round((a.score / a.maxScore) * 100) >= a.passingScore).length;

  // Course Progress Table
  const courseProgress = enrolledCourses.map(course => {
    const cGrades = myGrades.filter(g => g.courseId === course.id);
    const cAvg = cGrades.length ? Math.round(cGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / cGrades.length) : 0;
    const cAssignments = MOCK_ASSIGNMENTS.filter(a => a.courseId === course.id);
    const cSubmissions = cAssignments.flatMap(a => a.submissions.filter(s => s.studentId === student.id));
    const cQuizzes = MOCK_QUIZZES.filter(q => q.courseId === course.id);
    const cAttempts = cQuizzes.flatMap(q => q.attempts.filter(a => a.studentId === student.id).map(a => ({...a, passingScore: q.passingScore})));
    const cPassed = cAttempts.filter(a => Math.round((a.score / a.maxScore) * 100) >= a.passingScore).length;

    return {
      course,
      avg: cAvg,
      letter: getLetterGrade(cAvg),
      assignmentsSubmitted: cSubmissions.length,
      assignmentsTotal: cAssignments.length,
      quizzesPassed: cPassed,
      quizzesAttempted: cAttempts.length,
    };
  });

  const recentGrades = myGrades.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name }
        ]} 
      />

      <StudentHeroCard student={student} courses={enrolledCourses} />
      <StudentTabStrip studentId={student.id} />

      {/* Tab Content: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column - Academic Summary */}
        <div className="md:col-span-8 space-y-6">
          
          {/* KPI Row */}
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-center px-6 py-6 rounded-xl border border-border bg-muted/20">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <img src="https://img.icons8.com/scribby/96/star.png" alt="Cumulative Grade" className="h-12 w-12" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Cumulative Grade</p>
                <p className="text-3xl font-extrabold text-foreground leading-none">{cumulativeAvg}%</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l sm:border-r border-border px-6">
              <img src="https://img.icons8.com/scribby/96/todo-list.png" alt="Assignments" className="h-12 w-12" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Assignments</p>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                  {assignmentsSubmitted} <span className="text-sm font-semibold text-muted-foreground">/ {assignmentsTotal}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <img src="https://img.icons8.com/scribby/96/check.png" alt="Quizzes Passed" className="h-12 w-12" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Quizzes Passed</p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">
                  {quizzesPassed} <span className="text-sm font-semibold text-muted-foreground">/ {quizzesAttempted}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Course Progress Table */}
          {/* Course Progress List */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-muted/20">
              <h2 className="font-semibold">Course Progress</h2>
            </div>
            <div className="hidden md:grid md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Course</span>
              <span className="text-center">Avg Grade</span>
              <span className="text-center">Assignments</span>
              <span className="text-center">Quizzes</span>
            </div>
            <div className="divide-y divide-border">
              {courseProgress.map((row) => (
                <div key={row.course.id} className="block hover:bg-muted/20 transition-colors">
                  {/* Mobile */}
                  <div className="md:hidden px-4 py-4 space-y-2">
                    <p className="font-semibold text-foreground line-clamp-1">{row.course.code}</p>
                    <p className="text-xs text-muted-foreground">{row.course.title}</p>
                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="font-medium text-foreground">Avg: {row.avg}%</span>
                      <span className="text-muted-foreground">Assign: {row.assignmentsSubmitted}/{row.assignmentsTotal}</span>
                      <span className="text-muted-foreground">Quiz: {row.quizzesPassed}/{row.quizzesAttempted}</span>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:grid md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center px-5 py-3">
                    <div>
                      <span className="font-medium text-sm text-foreground">{row.course.code}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{row.course.title}</p>
                    </div>
                    <div className="flex justify-center text-center">
                      <span className="font-semibold text-sm">{row.avg}%</span>
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      {row.assignmentsSubmitted} / {row.assignmentsTotal}
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      {row.quizzesPassed} / {row.quizzesAttempted}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Graded Items */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-muted/20 flex justify-between items-center">
              <h2 className="font-semibold">Recent Graded Items</h2>
              <Link href={`/instructor/students/${student.id}/grades`} className="text-sm text-primary hover:underline flex items-center">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentGrades.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">No graded items yet.</div>
              ) : (
                recentGrades.map((grade) => {
                  const course = enrolledCourses.find(c => c.id === grade.courseId);
                  const isQuiz = grade.type === "quiz";
                  const pct = Math.round((grade.score / grade.maxScore) * 100);
                  return (
                    <div key={grade.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-md p-1.5 ${isQuiz ? "bg-purple-100 text-purple-600" : "bg-violet-100 text-violet-600"}`}>
                          {isQuiz ? <Brain className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{grade.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium">{course?.code}</span>
                            <span className="text-xs text-muted-foreground">{grade.gradedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{grade.score} / {grade.maxScore}</p>
                        <p className={`text-xs font-semibold ${pct >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{pct}%</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Student Info Card */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-5 space-y-5">
            <h3 className="font-semibold border-b pb-2">Student Information</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Student ID</p>
                  <p className="font-medium font-mono text-sm">{student.studentId}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="font-medium text-sm truncate">{student.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Join Date</p>
                  <p className="font-medium text-sm">{student.joinDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Active</p>
                  <p className="font-medium text-sm">{student.lastActivity ? student.lastActivity.toLocaleDateString() : "Never"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href={`/instructor/students/${student.id}/grades`}>
                  View Grades <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href={`/instructor/students/${student.id}/submissions`}>
                  View Submissions <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="default" className="w-full justify-between bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href={`/instructor/students/${student.id}/message`}>
                  Send Message <ChevronRight className="h-4 w-4 opacity-70" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
