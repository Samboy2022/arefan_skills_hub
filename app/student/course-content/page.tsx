import { FileText, Play, Lock, CheckCircle, BookOpen, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_LESSONS, STUDENT_COURSES } from "@/lib/student-mock-data";

export default function CourseContentPage() {
  const course = STUDENT_COURSES[0];
  const lessons = STUDENT_LESSONS;
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;

  const groupedLessons = {
    completed: lessons.filter(l => l.completed),
    inProgress: lessons.filter(l => !l.completed && !l.is_locked),
    locked: lessons.filter(l => l.is_locked),
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-5 w-5" />;
      case "quiz":
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Course Content"
        description={`${course.name} • ${completedLessons}/${totalLessons} lessons completed`}
      />

      {/* Course Progress Overview */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Learning Progress</h3>
          <span className="text-2xl font-bold text-primary">
            {Math.round((completedLessons / totalLessons) * 100)}%
          </span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
          ></div>
        </div>
      </Card>

      {/* Lessons by Status */}
      <div className="space-y-6">
        {/* In Progress / Available */}
        {groupedLessons.inProgress.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Continue Learning</h3>
            <div className="space-y-2">
              {groupedLessons.inProgress.map(lesson => (
                <Card key={lesson.id} className="p-4 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • {lesson.duration} mins
                          </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap ml-2">
                          Start
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {groupedLessons.completed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completed ({groupedLessons.completed.length})
            </h3>
            <div className="space-y-2">
              {groupedLessons.completed.map(lesson => (
                <Card key={lesson.id} className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-green-900">{lesson.title}</p>
                      <p className="text-sm text-green-700 mt-1">
                        Completed on {new Date(lesson.completed_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {groupedLessons.locked.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              Locked ({groupedLessons.locked.length})
            </h3>
            <div className="space-y-2">
              {groupedLessons.locked.map(lesson => (
                <Card key={lesson.id} className="p-4 opacity-60">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-500">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete previous lessons to unlock
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
