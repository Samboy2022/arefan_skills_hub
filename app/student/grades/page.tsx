"use client";

import { BarChart3, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { STUDENT_GRADES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";

const GRADE_SCALE = {
  A: { min: 90, max: 100 },
  B: { min: 80, max: 89 },
  C: { min: 70, max: 79 },
  D: { min: 60, max: 69 },
  F: { min: 0, max: 59 },
};

const getGradeColor = (grade: string) => {
  const firstChar = grade.charAt(0);
  switch (firstChar) {
    case "A":
      return "text-green-600 border-green-200 bg-green-500/5";
    case "B":
      return "text-blue-600 border-blue-200 bg-primary/5";
    case "C":
      return "text-yellow-600 border-yellow-200 bg-yellow-500/5";
    case "D":
      return "text-orange-600 border-orange-200 bg-orange-500/5";
    case "F":
      return "text-red-600 border-red-200 bg-red-500/5";
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
};

const getGradeDescription = (grade: string) => {
  const firstChar = grade.charAt(0);
  const descriptions = {
    A: "Excellent",
    B: "Good",
    C: "Satisfactory",
    D: "Needs Improvement",
    F: "Failing",
  };
  return descriptions[firstChar as keyof typeof descriptions] || "Unknown";
};

export default function GradesPage() {
  const overallGPA = (
    STUDENT_GRADES.reduce((sum, course) => sum + course.final_grade, 0) / STUDENT_GRADES.length
  ).toFixed(2);

  const averageLetterGrade = STUDENT_GRADES.reduce((acc, course) => {
    const firstChar = course.letter_grade.charAt(0);
    const gradeValue = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    }[firstChar] || 0;
    return acc + gradeValue;
  }, 0) / STUDENT_GRADES.length;

  return (
    <div>
      <PageHeader
        title="Grades & Performance"
        description="Review your course grades and overall performance"
      />

      {/* Overall Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StudentKPICard
          title="Overall GPA"
          value={overallGPA}
          icon={Award}
          variant="success"
          trend={2.5}
          hint="Excellent performance"
        />
        <StudentKPICard
          title="Average Grade"
          value={`${Math.round(STUDENT_GRADES.reduce((sum, c) => sum + c.final_grade, 0) / STUDENT_GRADES.length)}%`}
          icon={BarChart3}
          variant="default"
          trend={1.2}
          hint="Across all courses"
        />
        <StudentKPICard
          title="Courses"
          value={STUDENT_GRADES.length}
          icon={TrendingUp}
          variant="purple"
          hint="Total enrolled"
        />
      </div>

      {/* Grade Scale Reference */}
      <Card className="p-6 mb-8 border border-border shadow-none rounded-md bg-card">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Grade Scale Reference</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(GRADE_SCALE).map(([letter, { min, max }]) => (
            <div
              key={letter}
              className="p-4 rounded-md text-center border border-border bg-muted/5 flex flex-col items-center justify-center transition-colors hover:bg-muted/10"
            >
              <p className={cn(
                "text-2xl font-bold mb-1",
                letter === "A" ? "text-green-600"
                  : letter === "B" ? "text-primary"
                  : letter === "C" ? "text-amber-600"
                  : letter === "D" ? "text-orange-600"
                  : "text-red-600"
              )}>{letter}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                {min}—{max}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Course Grades */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
          <Award className="h-4 w-4" />
          Academic Record Breakdown
        </h2>
        
        <div className="space-y-4">
          {STUDENT_GRADES.map(grade => (
            <Card key={grade.course_id} className="border border-border shadow-none rounded-md bg-card overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="space-y-1">
                    <p className="font-bold text-xl text-foreground leading-tight">{grade.course_name}</p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Final Average:</span>
                       <span className="text-base font-bold text-foreground">{grade.final_grade}%</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-6 py-4 rounded-md border text-center min-w-[120px] transition-all",
                    getGradeColor(grade.letter_grade).split(' ').map(c => c.includes('bg-') ? 'bg-background' : c).join(' ') // Flatten backgrounds
                  )}>
                    <p className="text-3xl font-black leading-none">{grade.letter_grade}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-2 opacity-80">{getGradeDescription(grade.letter_grade)}</p>
                  </div>
                </div>

                {/* Grade Components */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Assignments", val: grade.assignments_grade, color: "bg-blue-500" },
                    { label: "Quizzes", val: grade.quizzes_grade, color: "bg-primary" },
                    { label: "Participation", val: grade.participation_grade, color: "bg-green-500" }
                  ].map((comp) => (
                    <div key={comp.label} className="p-4 bg-muted/20 border border-border/50 rounded-md">
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{comp.label}</p>
                        <p className="text-xl font-bold leading-none">{comp.val}</p>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border/20">
                        <div
                          className={cn("h-full transition-all duration-500", comp.color)}
                          style={{ width: `${comp.val}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-muted/5 border-t border-border flex items-center justify-between">
                <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  View Detailed Feedback
                </button>
                <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  Download transcript section
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
