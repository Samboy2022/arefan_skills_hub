import { Plus, Edit, Trash2, GripVertical, Settings } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { MOCK_MODULES, MOCK_LESSONS } from "@/lib/instructor-mock-data";
import { LESSON_TYPES } from "@/lib/instructor-constants";

export default function CurriculumBuilderPage() {
  const getLessonIcon = (type: string) => {
    const icons: Record<string, string> = {
      video: "🎥",
      pdf: "📄",
      quiz: "📝",
      live: "🔴",
      assignment: "✏️",
      text: "📖",
    };
    return icons[type] || "📌";
  };

  const getLessonTypeColor = (type: string) => {
    const typeInfo = LESSON_TYPES.find((t) => t.id === type);
    return typeInfo?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Curriculum Builder"
        description="Design and organize your course structure with modules and lessons"
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Module
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Module Tree */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-semibold text-foreground">Course Modules</h3>
              <p className="text-xs text-muted-foreground mt-1">{MOCK_MODULES.length} modules</p>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {MOCK_MODULES.map((module, idx) => {
                const moduleLessons = MOCK_LESSONS.filter((l) => l.moduleId === module.id);
                return (
                  <div key={module.id} className="p-3 hover:bg-muted cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{moduleLessons.length} lessons</p>
                      </div>
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Panel: Lessons Editor */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Week 1: Fundamentals</h3>
                <p className="text-xs text-muted-foreground mt-1">Edit lessons for this module</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Lesson
              </Button>
            </div>

            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {MOCK_LESSONS.filter((l) => l.moduleId === "module-1").map((lesson, idx) => (
                <div key={lesson.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0 cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getLessonIcon(lesson.type)}</span>
                          <h4 className="font-medium text-sm text-foreground">{lesson.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                        {lesson.duration && (
                          <p className="text-xs text-muted-foreground mt-1">Duration: {lesson.duration} minutes</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 dark:text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Settings */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Module Settings</h3>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="text-sm font-medium text-foreground">Module Title</label>
                <input
                  type="text"
                  value="Week 1: Fundamentals"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Week Number</label>
                <input
                  type="number"
                  value="1"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Visibility</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="visibility" defaultChecked className="rounded" />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="visibility" className="rounded" />
                    <span>Draft</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="visibility" className="rounded" />
                    <span>Scheduled</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm font-medium text-foreground">Drip Feed Lessons</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">Release lessons one by one</p>
              </div>

              <Button className="w-full">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
