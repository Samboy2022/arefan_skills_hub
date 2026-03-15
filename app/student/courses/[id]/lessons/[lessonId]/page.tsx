"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Send,
  Lock,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import {
  STUDENT_COURSES,
  STUDENT_MODULES,
  STUDENT_LESSONS,
} from "@/lib/student-mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LessonViewPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"content" | "ai">("content");
  const [aiMessage, setAiMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const course = STUDENT_COURSES.find((c) => c.id === id);
  const currentLesson = STUDENT_LESSONS.find((l) => l.id === lessonId);
  const lessons = STUDENT_LESSONS.filter((l) => l.course_id === id).sort(
    (a, b) => a.order - b.order
  );
  const modules = STUDENT_MODULES.filter((m) => m.course_id === id).sort(
    (a, b) => a.order - b.order
  );

  // Auto-expand the module containing the current lesson
  const currentModule = modules.find(
    (m) => m.id === currentLesson?.module_id
  );

  // Initialize expanded modules to include the current lesson's module
  useState(() => {
    if (currentModule && !expandedModules.includes(currentModule.id)) {
      setExpandedModules((prev) => [...prev, currentModule.id]);
    }
  });

  if (!course || !currentLesson) return <div className="p-8">Lesson not found</div>;

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];
  const completedCount = lessons.filter((l) => l.completed).length;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((m) => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-2 px-1 border-b mb-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link href={`/student/courses/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">
              {currentLesson.title}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {course.name} &bull; {completedCount}/{lessons.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {prevLesson && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/student/courses/${id}/lessons/${prevLesson.id}`}>
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Link>
            </Button>
          )}
          {nextLesson ? (
            <Button variant="default" size="sm" asChild>
              <Link href={`/student/courses/${id}/lessons/${nextLesson.id}`}>
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button variant="success" size="sm">
              Complete Course
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video + Lesson Info */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Video Player */}
          <div className="bg-black w-full aspect-video shrink-0">
            {currentLesson.type === "video" ? (
              <video
                className="w-full h-full object-contain"
                src={currentLesson.video_url}
                poster={course.thumbnail}
                controls
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/70">
                <FileText className="h-12 w-12 mb-3" />
                <h3 className="font-semibold text-lg">Document Lesson</h3>
                <p className="text-sm mt-1">
                  Read the materials or download resources below.
                </p>
                <Button className="mt-4" variant="outline" size="sm">
                  Download Materials
                </Button>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="p-6 space-y-3">
            <h1 className="text-xl font-bold">{currentLesson.title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentLesson.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="capitalize">{currentLesson.type}</span>
              <span>&bull;</span>
              <span>{currentLesson.duration} min</span>
              {currentLesson.completed && (
                <>
                  <span>&bull;</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        {sidebarOpen && (
          <div className="w-[340px] border-l flex flex-col bg-background shrink-0">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("content")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors",
                  activeTab === "content"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Course Content
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-1.5",
                  activeTab === "ai"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Study Guide
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "content" ? (
              <div className="flex-1 overflow-y-auto">
                {modules.map((module) => {
                  const moduleLessons = lessons
                    .filter((l) => l.module_id === module.id)
                    .sort((a, b) => a.order - b.order);
                  const isExpanded = expandedModules.includes(module.id);
                  const moduleCompleted = moduleLessons.filter(
                    (l) => l.completed
                  ).length;

                  return (
                    <div key={module.id} className="border-b last:border-b-0">
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {module.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {moduleCompleted}/{moduleLessons.length} &bull;{" "}
                              {moduleLessons.reduce(
                                (sum, l) => sum + l.duration,
                                0
                              )}{" "}
                              min
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <div className="bg-muted/20">
                          {moduleLessons.map((lesson) => {
                            const isCurrent = lesson.id === lessonId;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  if (!lesson.is_locked) {
                                    router.push(
                                      `/student/courses/${id}/lessons/${lesson.id}`
                                    );
                                  }
                                }}
                                disabled={lesson.is_locked}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                  isCurrent
                                    ? "bg-primary/10 border-l-2 border-primary"
                                    : "hover:bg-muted/50 border-l-2 border-transparent",
                                  lesson.is_locked &&
                                    "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {/* Status icon */}
                                <div className="shrink-0">
                                  {lesson.is_locked ? (
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                  ) : lesson.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                  ) : isCurrent ? (
                                    <Play className="h-3.5 w-3.5 text-primary fill-primary" />
                                  ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/40" />
                                  )}
                                </div>

                                {/* Lesson info */}
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={cn(
                                      "text-xs truncate",
                                      isCurrent
                                        ? "font-semibold text-primary"
                                        : "font-medium"
                                    )}
                                  >
                                    {lesson.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    {lesson.type === "video" ? (
                                      <Play className="h-2.5 w-2.5" />
                                    ) : (
                                      <FileText className="h-2.5 w-2.5" />
                                    )}
                                    {lesson.duration} min
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* AI Study Guide Tab */
              <div className="flex-1 flex flex-col">
                {/* AI Header */}
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Study Assistant</p>
                      <p className="text-[10px] text-muted-foreground">
                        Context: {currentLesson.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[90%] bg-muted/50 p-3 rounded-lg rounded-tl-none">
                      <p className="text-xs leading-relaxed">
                        Hello! I&apos;m your AI Study Guide for this lesson. Ask
                        me anything about{" "}
                        <strong>&quot;{currentLesson.title}&quot;</strong> and
                        I&apos;ll help you understand the concepts better.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t">
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Ask anything about this lesson..."
                      className="w-full p-3 pr-10 text-xs rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                    <Button
                      size="icon"
                      className="absolute right-2 bottom-2 h-7 w-7 rounded-md"
                      disabled={!aiMessage.trim()}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[9px] text-center text-muted-foreground mt-1.5">
                    AI-generated answers should be verified for accuracy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
