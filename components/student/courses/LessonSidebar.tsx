'use client';

import { useState } from 'react';
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

/** Circular progress SVG ring */
function CircularProgress({ value, size = 64 }: { value: number; size?: number }) {
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--primary)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
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

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  const defaultOpen =
    course.curriculum?.find(s => s.lessons.some(l => l.id === currentLessonId))?.id ??
    course.curriculum?.[0]?.id ??
    null;

  const [openSectionId, setOpenSectionId] = useState<number | null>(defaultOpen);
  const [activeTab, setActiveTab] = useState<SidebarTab>('content');

  // Mock completed lesson IDs
  const completedLessonIds = new Set([1, 2]);
  const progress = course.user_progress ?? 15;

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

          {/* Progress header */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
            {/* Circular progress */}
            <div className="relative shrink-0">
              <CircularProgress value={progress} size={60} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {progress}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Course Progress</p>
              <p className="text-xs text-muted-foreground mt-0.5">{progress}% completed</p>
            </div>
          </div>

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
                            className={`w-full flex items-center justify-between px-5 py-3 transition-colors ${
                              isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
                            }`}
                          >
                            {/* Left: status + type icon + title */}
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                              {/* Status checkbox */}
                              {isCompleted ? (
                                <div className="w-4 h-4 bg-primary flex items-center justify-center shrink-0 rounded-sm">
                                  <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                                </div>
                              ) : isActive ? (
                                <div className="w-4 h-4 bg-card border-2 border-primary shrink-0 rounded-sm" />
                              ) : (
                                <div className="w-4 h-4 bg-card border border-border shrink-0 rounded-sm" />
                              )}

                              {/* Type icon for non-video */}
                              {!isVideoType && <LessonTypeIcon type={lesson.content_type} />}

                              {/* Title */}
                              <span
                                className={`text-sm leading-5 ${
                                  isActive
                                    ? 'text-foreground font-medium'
                                    : 'text-muted-foreground font-normal'
                                }`}
                              >
                                {lesson.title}
                              </span>
                            </div>

                            {/* Right: play/pause + duration */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isVideoType && (
                                isActive ? (
                                  <Pause className="w-3.5 h-3.5 text-foreground fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-muted-foreground fill-current" />
                                )
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
      )}
    </div>
  );
}
