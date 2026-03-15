"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Lock,
  ArrowLeft
} from "lucide-react";
import { 
  STUDENT_COURSES, 
  STUDENT_MODULES, 
  STUDENT_LESSONS 
} from "@/lib/student-mock-data";
import { PageHeader } from "@/components/student/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [expandedModules, setExpandedModules] = useState<string[]>(["mod1"]);

  const course = STUDENT_COURSES.find(c => c.id === id);
  const courseModules = STUDENT_MODULES.filter(m => m.course_id === id).sort((a, b) => a.order - b.order);
  const lessons = STUDENT_LESSONS.filter(l => l.course_id === id);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId) 
        : [...prev, moduleId]
    );
  };

  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/student/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Course Info & Modules */}
        <div className="lg:col-span-2 space-y-6">
          <PageHeader
            title={course.name}
            description={`${course.code} • ${course.instructor}`}
          />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Course Modules</h3>
            
            {courseModules.map((module) => {
              const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a, b) => a.order - b.order);
              const isExpanded = expandedModules.includes(module.id);
              const completedLessons = moduleLessons.filter(l => l.completed).length;

              return (
                <Card key={module.id} className="overflow-hidden border-none shadow-sm">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        W{module.week_number}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{module.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {completedLessons}/{moduleLessons.length} lessons completed
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-card">
                      {moduleLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg group transition-all",
                            lesson.is_locked ? "opacity-60 grayscale cursor-not-allowed" : "hover:bg-muted/50 cursor-pointer"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              lesson.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                            )}>
                              {lesson.completed ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : lesson.type === "video" ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span className="capitalize">{lesson.type}</span>
                                <span>•</span>
                                <span>{lesson.duration} mins</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {lesson.is_locked ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Button 
                                size="sm" 
                                variant={lesson.completed ? "outline" : "default"}
                                className="h-8 text-[11px]"
                                asChild
                              >
                                <Link href={`/student/courses/${course.id}/lessons/${lesson.id}`}>
                                  {lesson.completed ? "Watch Again" : "Start Lesson"}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Sidebar / Summary */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h4 className="font-bold">Your Progress</h4>
            <div className="flex flex-col items-center py-2">
              <CircularProgress
                value={course.progress}
                size={80}
                strokeWidth={6}
                labelClassName="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">Overall Completion</p>
            </div>
            
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Enrolled On</span>
                <span className="font-medium">{course.enrollment_date}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Credits</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize text-green-600 font-bold">{course.status}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-brand/5">
            <h4 className="font-bold mb-2">Continue where you left off</h4>
            {(() => {
              const nextLesson = lessons.find(l => !l.completed && !l.is_locked);
              return (
                <>
                  <p className="text-xs text-muted-foreground mb-4">
                    Next Lesson: {nextLesson?.title || "No pending lessons"}
                  </p>
                  {nextLesson ? (
                    <Button className="w-full shadow-lg shadow-brand/20" asChild>
                      <Link href={`/student/courses/${id}/lessons/${nextLesson.id}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      All Caught Up!
                    </Button>
                  )}
                </>
              );
            })()}
          </Card>
        </div>
      </div>
    </div>
  );
}
