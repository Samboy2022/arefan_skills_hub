import { Download, Filter, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_STUDENTS, MOCK_GRADES, MOCK_ASSIGNMENTS } from "@/lib/instructor-mock-data";
import { GRADE_RANGES } from "@/lib/instructor-constants";

export default function GradebookPage() {
  // Build gradebook matrix
  const getGradeForStudentAssignment = (studentId: string, assignmentId: string) => {
    const grade = MOCK_GRADES.find((g) => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? `${grade.score}/${grade.maxScore}` : "-";
  };

  const getStudentTotal = (studentId: string) => {
    const grades = MOCK_GRADES.filter((g) => g.studentId === studentId);
    if (grades.length === 0) return 0;
    const total = (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length);
    return Math.round(total);
  };

  const getLetterGrade = (percentage: number) => {
    const range = GRADE_RANGES.find((r) => percentage >= r.min && percentage <= r.max);
    return range?.grade || "N/A";
  };

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Gradebook" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Gradebook"
          description="View and manage grades for all students and assignments"
        >
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Gradebook Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground sticky left-0 bg-muted/50 min-w-[200px]">
                Student
              </th>
              {MOCK_ASSIGNMENTS.map((assignment) => (
                <th key={assignment.id} className="px-3 py-3 text-center font-semibold text-foreground whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">{assignment.title.substring(0, 12)}</span>
                    <span className="text-xs font-normal text-muted-foreground">({assignment.maxScore})</span>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-foreground sticky right-0 bg-muted/50 min-w-[100px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_STUDENTS.map((student) => {
              const total = getStudentTotal(student.id);
              const letterGrade = getLetterGrade(total);

              return (
                <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-left sticky left-0 bg-background">
                    <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white flex-shrink-0">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  {MOCK_ASSIGNMENTS.map((assignment) => {
                    const gradeValue = getGradeForStudentAssignment(student.id, assignment.id);
                    const isEditable = gradeValue !== "-";

                    return (
                      <td
                        key={assignment.id}
                        className={`px-3 py-3 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors font-medium text-sm ${isEditable ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                      >
                        {gradeValue}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center sticky right-0 bg-background font-semibold">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-foreground">{total}%</span>
                      <span
                        className={`text-xs font-bold ${
                          total >= 90
                            ? "text-green-600 dark:text-green-400"
                            : total >= 70
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {letterGrade}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grade Scale Reference */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Grade Scale</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {GRADE_RANGES.map((range) => (
            <div key={range.grade} className={`p-3 rounded-lg text-center ${range.color}`}>
              <p className="font-bold text-lg">{range.grade}</p>
              <p className="text-xs mt-1">
                {range.min}-{range.max}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
