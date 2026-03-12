import { BarChart3, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_GRADES } from "@/lib/student-mock-data";

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
      return "text-green-600 bg-green-50 border-green-200";
    case "B":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "C":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "D":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "F":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
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
        <Card className="p-6 text-center border-green-200 bg-green-50">
          <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <p className="text-sm text-green-700 mb-2">Overall GPA</p>
          <p className="text-3xl font-bold text-green-600">{overallGPA}</p>
        </Card>
        <Card className="p-6 text-center border-blue-200 bg-blue-50">
          <BarChart3 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-blue-700 mb-2">Average Grade</p>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(
              STUDENT_GRADES.reduce((sum, c) => sum + c.final_grade, 0) / STUDENT_GRADES.length
            )}%
          </p>
        </Card>
        <Card className="p-6 text-center border-purple-200 bg-purple-50">
          <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
          <p className="text-sm text-purple-700 mb-2">Courses</p>
          <p className="text-3xl font-bold text-purple-600">{STUDENT_GRADES.length}</p>
        </Card>
      </div>

      {/* Grade Scale Reference */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Grade Scale Reference</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(GRADE_SCALE).map(([letter, { min, max }]) => (
            <div
              key={letter}
              className={`p-4 rounded text-center border ${
                letter === "A"
                  ? "bg-green-50 border-green-200"
                  : letter === "B"
                  ? "bg-blue-50 border-blue-200"
                  : letter === "C"
                  ? "bg-yellow-50 border-yellow-200"
                  : letter === "D"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-lg font-bold">{letter}</p>
              <p className="text-xs text-muted-foreground">
                {min}-{max}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Course Grades */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Course Grades Breakdown</h2>
        <div className="space-y-4">
          {STUDENT_GRADES.map(grade => (
            <Card key={grade.course_id} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{grade.course_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Final Grade: {grade.final_grade}%
                  </p>
                </div>
                <div className={`px-4 py-2 rounded border text-center ${getGradeColor(grade.letter_grade)}`}>
                  <p className="text-2xl font-bold">{grade.letter_grade}</p>
                  <p className="text-xs mt-1">{getGradeDescription(grade.letter_grade)}</p>
                </div>
              </div>

              {/* Grade Components */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm text-muted-foreground mb-2">Assignments</p>
                  <p className="text-3xl font-bold">{grade.assignments_grade}</p>
                  <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${grade.assignments_grade}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm text-muted-foreground mb-2">Quizzes</p>
                  <p className="text-3xl font-bold">{grade.quizzes_grade}</p>
                  <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${grade.quizzes_grade}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm text-muted-foreground mb-2">Participation</p>
                  <p className="text-3xl font-bold">{grade.participation_grade}</p>
                  <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${grade.participation_grade}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
