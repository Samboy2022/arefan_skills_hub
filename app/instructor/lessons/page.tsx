import { Eye, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_LESSONS, MOCK_MODULES } from "@/lib/instructor-mock-data";
import { LESSON_TYPES } from "@/lib/instructor-constants";

export default function LessonsPage() {
  // Group lessons by module
  const lessonsByModule = MOCK_MODULES.map((module) => ({
    ...module,
    lessons: MOCK_LESSONS.filter((lesson) => lesson.moduleId === module.id),
  }));

  const getLessonTypeColor = (type: string) => {
    const typeInfo = LESSON_TYPES.find((t) => t.id === type);
    return typeInfo?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Lessons & Content" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Lessons & Content"
          description="Manage all lesson content and materials for your course"
        >
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Lesson
          </Button>
        </PageHeader>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-64"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Lessons by Module */}
      <div className="space-y-6">
        {lessonsByModule.map((module) => (
          <div key={module.id} className="rounded-lg border border-border bg-card">
            {/* Module Header */}
            <div className="bg-muted px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{module.lessons.length} lessons</p>
                </div>
                <Button variant="ghost" size="sm">
                  Manage Module
                </Button>
              </div>
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-border">
              {module.lessons.length > 0 ? (
                module.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 flex items-start gap-4">
                        <div className="text-sm font-medium text-muted-foreground w-6 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getLessonTypeColor(lesson.type)}`}>
                              {LESSON_TYPES.find((t) => t.id === lesson.type)?.label}
                            </span>
                            <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{lesson.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground">Duration: {lesson.duration} min</span>
                            )}
                            <span className={`text-xs font-medium ${lesson.published ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                              {lesson.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No lessons in this module yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
