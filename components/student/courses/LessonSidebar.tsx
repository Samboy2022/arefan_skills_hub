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
  Send,
  User,
  Bot,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  onProgressUpdate?: (progress: number) => void;
  externalCompletedIds?: Set<number>;
  onToggleComplete?: (id: number) => void;
}

type SidebarTab = 'content' | 'ai';

// Global cache to persist chats between lesson navigations without a backend
const globalChatHistory: Record<number, { role: 'user' | 'ai'; content: string }[]> = {};

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

export function LessonSidebar({ course, currentLessonId, onProgressUpdate, externalCompletedIds, onToggleComplete }: LessonSidebarProps) {
  const defaultOpen =
    course.curriculum?.find(s => s.lessons.some(l => l.id === currentLessonId))?.id ??
    course.curriculum?.[0]?.id ??
    null;

  const [openSectionId, setOpenSectionId] = useState<number | null>(defaultOpen);
  const [activeTab, setActiveTab] = useState<SidebarTab>('content');

  // Use external state if provided, fall back to local
  const [localCompletedIds, setLocalCompletedIds] = useState<Set<number>>(new Set([1, 2]));
  const completedLessonIds = externalCompletedIds ?? localCompletedIds;

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>(
    globalChatHistory[currentLessonId] || [
      { role: 'ai', content: 'Hello! I am your AI Study Guide. Ask me anything about this lesson, or request a summary!' }
    ]
  );
  
  // Find current lesson for title display
  const activeLesson = course.curriculum?.flatMap(s => s.lessons).find(l => l.id === currentLessonId);

  // Sync global cache when messages change or component unmounts
  useEffect(() => {
    globalChatHistory[currentLessonId] = chatMessages;
  }, [chatMessages, currentLessonId]);

  // Load correct chat when lesson changes
  useEffect(() => {
    setChatMessages(
      globalChatHistory[currentLessonId] || [
        { role: 'ai', content: `Hello! I am your AI Study Guide. Ask me anything about "${activeLesson?.title || 'this lesson'}", or request a summary!` }
      ]
    );
  }, [currentLessonId, activeLesson?.title]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { role: 'user' as const, content: chatInput.trim() };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I am currently a demo AI assistant. You asked: "${newMsg.content}". In a real app, I'd analyze the lesson content and give a smart response!` 
      }]);
    }, 1000);
  };


  // Toggle completion — prefer external handler
  const toggleLessonCompletion = (lessonId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(lessonId);
    } else {
      setLocalCompletedIds(prev => {
        const next = new Set(prev);
        next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
        return next;
      });
    }
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
        <div className="flex-1 flex flex-col min-h-0 bg-muted/10">
          <div className="p-4 border-b border-border bg-card shadow-sm z-10 shrink-0">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">AI Guide: {activeLesson?.title || 'Lesson Guide'}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Ask questions or get summaries for this topic.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-card border-t border-border shrink-0">
            <div className="flex gap-2">
              <Input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your AI guide..." 
                className="flex-1 text-sm bg-background"
              />
              <Button type="submit" size="icon" className="shrink-0" disabled={!chatInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
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
                      isOpen ? 'bg-muted/30' : 'bg-transparent hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0 pr-3">
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {/* Title — NO truncate, allow wrapping, lighter font mapping */}
                      <span
                        className={`text-[13px] font-medium leading-snug ${
                          isOpen || hasActive ? 'text-primary' : 'text-foreground/90'
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
                            href={lesson.content_type === 'assignment' ? `/student/assignments/${lesson.id}` : `/student/courses/${course.id}/lessons/${lesson.id}`}
                            className={`group w-full flex items-center justify-between px-5 py-3 transition-colors duration-200 cursor-pointer ${
                              isActive 
                                ? 'bg-primary/10 dark:bg-primary/20' 
                                : 'hover:bg-muted/40'
                            }`}
                          >
                            {/* Left: status + type icon + title */}
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                              {/* Status checkbox - clickable */}
                              <button
                                onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                                className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded-full"
                                aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {isCompleted ? (
                                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:scale-110">
                                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 bg-transparent border-[1.5px] border-muted-foreground/50 rounded-full transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 hover:scale-105" />
                                )}
                              </button>

                              {/* Type icon for non-video */}
                              {!isVideoType && <LessonTypeIcon type={lesson.content_type} />}

                              {/* Title */}
                              <span
                                className={`text-[13px] leading-5 transition-colors ${
                                  isActive
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground/90 font-normal group-hover:text-foreground/90'
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
