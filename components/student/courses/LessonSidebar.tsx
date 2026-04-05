'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Play,
  Pause,
  Check,
  BookOpen,
  Clock,
  FileText,
  HelpCircle,
  PenSquare,
  Sparkles,
  ListVideo,
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  duration_minutes: number;
  content_type: string; // 'video' | 'document' | 'assignment' | 'quiz'
  is_preview?: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons_count?: number;
  duration_minutes?: number;
  lessons: Lesson[];
}

interface LessonSidebarProps {
  course: {
    id: string | number;
    title: string;
    user_progress?: number;
    curriculum: Section[];
  };
  currentLessonId: number;
  onProgressUpdate?: (progress: number) => void; // Callback to update progress in parent
}

type SidebarTab = 'content' | 'ai';

function formatDuration(minutes: number): string {
  if (!minutes) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTimestamp(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  return `${String(m).padStart(2, '0')}:00`;
}

/** Icon per lesson content type */
function LessonTypeIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5 shrink-0';
  switch (type) {
    case 'assignment':
      return <PenSquare className={`${cls} text-amber-500`} />;
    case 'quiz':
      return <HelpCircle className={`${cls} text-purple-500`} />;
    case 'document':
      return <FileText className={`${cls} text-blue-500`} />;
    default:
      return null; // video — use play/pause
  }
}

export function LessonSidebar({ course, currentLessonId, onProgressUpdate }: LessonSidebarProps) {
  const defaultOpen =
    course.curriculum?.find(s => s.lessons.some(l => l.id === currentLessonId))?.id ??
    course.curriculum?.[0]?.id ??
    null;

  const [openSectionId, setOpenSectionId] = useState<number | null>(defaultOpen);
  const [activeTab, setActiveTab] = useState<SidebarTab>('content');

  // State for completed lesson IDs - now dynamic
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set([1, 2]));

  // Function to toggle lesson completion
  const toggleLessonCompletion = (lessonId: number, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation when clicking checkbox
    event.stopPropagation(); // Stop event bubbling
    
    setCompletedLessonIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  // Calculate progress based on completed lessons and notify parent when it changes
  const totalLessons = course.curriculum?.reduce((total, section) => total + section.lessons.length, 0) || 0;
  const completedCount = completedLessonIds.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Use effect to notify parent of progress changes
  useEffect(() => {
    onProgressUpdate?.(progress);
  }, [progress, onProgressUpdate]);

  if (!course?.curriculum)
    return <div className="p-4 text-muted-foreground">Loading curriculum...</div>;

  return (
    <div className="flex flex-col h-full font-sans">

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListVideo className="w-4 h-4" />
          Course Content
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Study Guide
        </button>
      </div>

      {/* ── AI Study Guide Panel ── */}
      {activeTab === 'ai' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">AI Study Guide</h3>
          <p className="text-sm text-muted-foreground max-w-[220px]">
            Get AI-generated summaries, key concepts, and practice questions for each lesson.
          </p>
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded">
            Coming soon
          </span>
        </div>
      )}

      {/* ── Course Content Panel ── */}
      {activeTab === 'content' && (
        <div className="flex-1 overflow-y-auto">
          {/* Sections accordion */}
          <div className="flex flex-col divide-y divide-border">
            {course.curriculum.map(section => {
              const isOpen = openSectionId === section.id;
              const lessons = section.lessons ?? [];
              const lectureCount = section.lessons_count ?? lessons.length;
              const totalMins =
                section.duration_minutes ??
                lessons.reduce((s, l) => s + (l.duration_minutes ?? 0), 0);
              const completedCount = lessons.filter(l => completedLessonIds.has(l.id)).length;
              const hasActive = lessons.some(l => l.id === currentLessonId);

              return (
                <div key={section.id}>
                  {/* Section header */}
                  <button
                    onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                    className={`w-full flex items-start justify-between px-5 py-4 text-left transition-colors ${
                      isOpen ? 'bg-muted' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0 pr-3">
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {/* Title — NO truncate, allow wrapping */}
                      <span
                        className={`text-sm font-medium leading-snug ${
                          isOpen || hasActive ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {section.title}
                      </span>
                    </div>

                    {/* Meta: lecture count + duration */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs text-muted-foreground">{lectureCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs text-muted-foreground">{formatDuration(totalMins)}</span>
                      </div>
                      {completedCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {completedCount}/{lessons.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Lessons list */}
                  {isOpen && (
                    <div className="flex flex-col py-1 bg-card">
                      {lessons.map(lesson => {
                        const isCompleted = completedLessonIds.has(lesson.id);
                        const isActive = lesson.id === currentLessonId;
                        const isVideoType = lesson.content_type === 'video';

                        return (
                          <Link
                            key={lesson.id}
                            href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                            className={`group w-full flex items-center justify-between px-5 py-4 transition-all duration-200 cursor-pointer ${
                              isActive 
                                ? 'bg-primary/10 border-l-2 border-primary' 
                                : 'hover:bg-muted/80 hover:shadow-sm active:bg-muted'
                            }`}
                          >
                            {/* Left: status + type icon + title */}
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                              {/* Status checkbox - clickable */}
                              <button
                                onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                                className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded-sm"
                                aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {isCompleted ? (
                                  <div className="w-5 h-5 bg-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:scale-110">
                                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 bg-card border-2 border-border transition-all duration-200 hover:border-primary/70 hover:bg-primary/10 hover:scale-105" />
                                )}
                              </button>

                              {/* Type icon for non-video */}
                              {!isVideoType && <LessonTypeIcon type={lesson.content_type} />}

                              {/* Title */}
                              <span
                                className={`text-sm leading-5 transition-colors ${
                                  isActive
                                    ? 'text-foreground font-medium'
                                    : 'text-muted-foreground font-normal group-hover:text-foreground'
                                }`}
                              >
                                {lesson.title}
                              </span>
                            </div>

                            {/* Right: play/pause + duration */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isVideoType && (
                                isActive ? (
                                  <Pause className="w-4 h-4 text-foreground fill-current transition-transform group-hover:scale-110" />
                                ) : (
                                  <Play className="w-4 h-4 text-muted-foreground fill-current transition-all group-hover:text-primary group-hover:scale-110" />
                                )
                              )}
                              <span
                                className={`text-xs tabular-nums transition-colors ${
                                  isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                }`}
                              >
                                {formatTimestamp(lesson.duration_minutes ?? 0)}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
