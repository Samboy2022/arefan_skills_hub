"use client";

import * as React from "react";
import { useMemo } from "react";
import { Download, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  MOCK_STUDENTS, MOCK_GRADES, MOCK_INSTRUCTOR_COURSES,
} from "@/lib/instructor-mock-data";

function getLetterGrade(pct: number) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function getGradeColor(letter: string) {
  switch (letter) {
    case "A": return "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded";
    case "B": return "text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded";
    case "C": return "text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded";
    case "D": return "text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded";
    default:  return "text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded";
  }
}

export default function StudentGradesPage({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const student = MOCK_STUDENTS.find((s) => s.id === unwrappedParams.studentId) || MOCK_STUDENTS[0];

  const myGrades = useMemo(
    () => MOCK_GRADES.filter((g) => g.studentId === student.id),
    [student.id]
  );
  const enrolledCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => student.enrolledCourses.includes(c.id));

  // Determine overall aggregate cleanly
  const overallAvg = myGrades.length
      ? Math.round(myGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / myGrades.length)
      : 0;
  const overallLetter = getLetterGrade(overallAvg);

  // Per-course generation
  const courseBreakdowns = useMemo(() => {
    return enrolledCourses.map((course) => {
      const cGrades = myGrades.filter((g) => g.courseId === course.id)
          .sort((a, b) => a.gradedAt.getTime() - b.gradedAt.getTime());
      const cAvg = cGrades.length 
          ? Math.round(cGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / cGrades.length)
          : 0;
      return { course, cGrades, cAvg, letter: getLetterGrade(cAvg) };
    });
  }, [enrolledCourses, myGrades]);

  function downloadCSV() {
    const gradeHistory = [...myGrades].sort((a, b) => a.gradedAt.getTime() - b.gradedAt.getTime());
    const headers = ["Date", "Type", "Assignment Name", "Course", "Score", "Max", "Percentage", "Grade", "Feedback"];
    const rows = gradeHistory.map((g) => {
      const course = MOCK_INSTRUCTOR_COURSES.find((c) => c.id === g.courseId);
      const pct = Math.round((g.score / g.maxScore) * 100);
      return [
        g.gradedAt.toLocaleDateString(),
        g.type ?? "—",
        `"${g.label ?? ""}"`,
        `"${course?.title ?? g.courseId}"`,
        g.score,
        g.maxScore,
        `${pct}%`,
        getLetterGrade(pct),
        `"${g.feedback ?? ""}"`,
      ].join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.name.replace(" ", "_")}_grades.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/instructor/students"><ChevronLeft className="h-4 w-4" /> Back to Students List</Link>
         </Button>
      </div>

      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${student.id}` },
          { label: "Grades Transcript" },
        ]}
      />

      {/* Clean Transcription Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6 border-b pb-6">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{student.name}</h1>
              <p className="text-muted-foreground">{student.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                  {enrolledCourses.map(c => (
                      <span key={c.id} className="text-xs uppercase tracking-wider font-semibold border px-2 py-0.5 rounded text-muted-foreground">
                          {c.code}
                      </span>
                  ))}
              </div>
          </div>
          <div className="text-left md:text-right flex flex-col md:items-end w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Cumulative Grade</span>
              <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{overallAvg}%</span>
                  <span className={getGradeColor(overallLetter)}>{overallLetter}</span>
              </div>
              <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-2 mt-3 w-full md:w-auto">
                 <Download className="h-4 w-4" /> Export CSV Record
              </Button>
          </div>
      </div>

      {/* Flat List Transcripts by Course */}
      <div className="space-y-12">
          {courseBreakdowns.map(({ course, cGrades, cAvg, letter }) => (
              <div key={course.id}>
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-bold text-foreground">{course.code} — {course.title}</h2>
                      <div className="flex items-baseline gap-2 text-right">
                          <span className="text-sm font-semibold text-muted-foreground mr-1">Final:</span>
                          <span className="text-xl font-bold">{cAvg}%</span>
                          <span className={getGradeColor(letter)}>{letter}</span>
                      </div>
                  </div>

                  {/* Clean Semantic Table Without Heavy Accents */}
                  {cGrades.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">No graded assignments strictly recorded for this course yet.</p>
                  ) : (
                      <div className="rounded-md border bg-card overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-muted/30 border-b">
                                  <tr className="text-muted-foreground">
                                      <th className="px-4 py-3 font-semibold w-[120px]">Date</th>
                                      <th className="px-4 py-3 font-semibold">Requirement Segment</th>
                                      <th className="px-4 py-3 font-semibold w-[100px]">Type</th>
                                      <th className="px-4 py-3 font-semibold text-right w-[100px]">Score</th>
                                      <th className="px-4 py-3 font-semibold text-right w-[80px]">Grade</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                  {cGrades.map((g) => {
                                      const pct = Math.round((g.score / g.maxScore) * 100);
                                      return (
                                          <tr key={g.id} className="hover:bg-muted/10 transition-colors">
                                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                  {g.gradedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                              </td>
                                              <td className="px-4 py-3">
                                                  <span className="font-medium text-foreground">{g.label ?? g.id}</span>
                                                  {g.feedback && (
                                                      <span className="block text-xs text-muted-foreground mt-0.5 italic">
                                                          Instructor notes: "{g.feedback}"
                                                      </span>
                                                  )}
                                              </td>
                                              <td className="px-4 py-3 text-muted-foreground capitalize">
                                                  {g.type || "General"}
                                              </td>
                                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                                  <span className="font-medium text-foreground">{g.score}</span> 
                                                  <span className="text-muted-foreground"> / {g.maxScore}</span>
                                              </td>
                                              <td className="px-4 py-3 text-right">
                                                  <span className={getGradeColor(getLetterGrade(pct))}>
                                                      {getLetterGrade(pct)}
                                                  </span>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>
          ))}
      </div>

    </div>
  );
}