import { BookOpen, Eye, BarChart3, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_COURSES } from "@/lib/student-mock-data";

export default function MyCoursesPage() {
  const activeCourses = STUDENT_COURSES.filter(c => c.status === "active");
  const completedCourses = STUDENT_COURSES.filter(c => c.status === "completed");

  return (
    <div>
      <PageHeader
        title="My Courses"
        description="View all your enrolled courses and track your progress"
      />

      {/* Active Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Active Courses ({activeCourses.length})
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {activeCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-40 object-cover"
              />

              {/* Course Content */}
              <div className="p-4">
                {/* Course Info */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm line-clamp-2">{course.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{course.code}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {course.credits} credits
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.instructor}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  {course.grade && (
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground">Grade</p>
                      <p className="font-semibold text-sm">{course.grade}</p>
                    </div>
                  )}
                  {course.due_assignments > 0 && (
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-yellow-700">Due</p>
                      <p className="font-semibold text-sm text-yellow-700">
                        {course.due_assignments} assign.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Completed Courses ({completedCourses.length})
          </h2>
          <div className="grid gap-4">
            {completedCourses.map(course => (
              <Card key={course.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.instructor} • {course.credits} credits
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Final Grade</p>
                    <p className="text-lg font-bold">{course.grade}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
