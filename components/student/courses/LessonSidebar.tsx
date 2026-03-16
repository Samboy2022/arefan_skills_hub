'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Play, Pause, Check, BookOpen, Clock } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  duration_minutes: number;
  content_type: string;
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
}

/** Format minutes → "1h 30m" or "45m" */
function formatDuration(minutes: number): string {
  if (!minutes) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Format minutes → "MM:SS" */
function formatTimestamp(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  return `${String(m).padStart(2, '0')}:00`;
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  // Find the section that contains the current lesson and open it by default
  const defaultOpen =
    course.curriculum?.find(s => s.lessons.some(l => l.id === currentLessonId))?.id ??
    course.curriculum?.[0]?.id ??
    null;

  const [openSectionId, setOpenSectionId] = useState<number | null>(defaultOpen);

  // Mock completed lesson IDs (real app: from API)
  const completedLessonIds = new Set([1, 2]);

  const progress = course.user_progress ?? 15;

  if (!course?.curriculum)
    return <div className="p-4 text-muted-foreground">Loading curriculum...</div>;

  return (
    <div className="flex flex-col gap-6 p-5 font-sans">
      {/* ── Top: title + % completed ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Course Contents</h2>
          <span className="text-sm font-semibold text-primary">{progress}% Completed</span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Sections accordion ── */}
      <div className="border border-border bg-card flex flex-col divide-y divide-border">
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
              {/* Section header button */}
              <button
                onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors
                  ${isOpen ? 'bg-muted' : 'bg-card hover:bg-muted/50'}`}
              >
                {/* Left: chevron + title */}
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <span
                    className={`text-sm font-medium leading-5 truncate ${
                      isOpen || hasActive ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>

                {/* Right: meta badges */}
                <div className="flex items-center gap-4 shrink-0 ml-3">
                  {/* Lectures */}
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs text-muted-foreground">{lectureCount} lectures</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{formatDuration(totalMins)}</span>
                  </div>

                  {/* Completion (only when > 0) */}
                  {completedCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-xs">
                        <span className="text-muted-foreground">
                          {Math.round((completedCount / lessons.length) * 100)}% finish{' '}
                        </span>
                        <span className="text-muted-foreground/60">
                          ({completedCount}/{lessons.length})
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Lessons list (shown when open) */}
              {isOpen && (
                <div className="flex flex-col py-2">
                  {lessons.map(lesson => {
                    const isCompleted = completedLessonIds.has(lesson.id);
                    const isActive = lesson.id === currentLessonId;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                        className={`w-full flex items-center justify-between px-5 py-3 transition-colors ${
                          isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
                        }`}
                      >
                        {/* Left: status box + title */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Status indicator */}
                          {isCompleted ? (
                            /* Filled brand square with checkmark */
                            <div className="w-4 h-4 bg-primary flex items-center justify-center shrink-0 rounded-sm">
                              <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                            </div>
                          ) : isActive ? (
                            /* Outlined brand square */
                            <div className="w-4 h-4 bg-card border-2 border-primary shrink-0 rounded-sm" />
                          ) : (
                            /* Outlined gray square */
                            <div className="w-4 h-4 bg-card border border-border shrink-0 rounded-sm" />
                          )}

                          <span
                            className={`text-sm leading-5 truncate ${
                              isActive
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground font-normal'
                            }`}
                          >
                            {!isCompleted && `${lesson.id}. `}
                            {lesson.title}
                          </span>
                        </div>

                        {/* Right: icon + duration */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          {isActive ? (
                            <Pause className="w-3.5 h-3.5 text-foreground fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-muted-foreground fill-current" />
                          )}
                          <span
                            className={`text-xs tabular-nums ${
                              isActive ? 'text-foreground' : 'text-muted-foreground'
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
  );
}
