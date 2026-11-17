'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Check,
  FileText,
  HelpCircle,
  PenSquare,
  Sparkles,
  ListVideo,
  Send,
  User,
  Bot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { curriculumItemHref } from '@/lib/student-course-content';

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
  onNavigate?: () => void;
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

/** Icon per lesson content type */
function LessonTypeIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5 shrink-0';
  switch (type) {
    case 'assignment':
      return <PenSquare className={`${cls} text-muted-foreground`} />;
    case 'quiz':
      return <HelpCircle className={`${cls} text-muted-foreground`} />;
    case 'document':
      return <FileText className={`${cls} text-muted-foreground`} />;
    default:
      return null; // video — use play/pause
  }
}

export function LessonSidebar({ course, currentLessonId, onProgressUpdate, externalCompletedIds, onToggleComplete, onNavigate }: LessonSidebarProps) {
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { role: 'user' as const, content: chatInput.trim() };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
    <div className="flex flex-col h-full font-sans overflow-hidden">

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab('content')} aria-pressed={activeTab === 'content'}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListVideo className="w-4 h-4" />
          Contents
        </button>
        <button
          onClick={() => setActiveTab('ai')} aria-pressed={activeTab === 'ai'}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Study guide
        </button>
      </div>

      {/* ── AI Study Guide Panel ── */}
      {activeTab === 'ai' && (
        <div className="flex-1 flex flex-col min-h-0 bg-muted/10">
          <div className="p-4 border-b border-border bg-card z-10 shrink-0">
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
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-card border-t border-border shrink-0">
            <div className="relative flex items-end w-full">
              <textarea
                ref={textareaRef}
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  e.target.style.height = 'auto'; // Reset the height
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; // Set height based on content
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim()) {
                      handleSendMessage();
                    }
                  }
                }}
                aria-label="Ask your study guide" placeholder="Ask your AI guide..."
                className="flex-1 text-sm bg-background border border-input rounded-3xl pl-4 pr-[44px] py-2.5 resize-none outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                rows={1}
                style={{ minHeight: '40px' }}
              />
              <Button type="submit" size="icon" className="absolute right-1.5 bottom-1.5 h-7 w-7 rounded-full transition-all" aria-label="Send message" disabled={!chatInput.trim()}>
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Contents Panel ── */}
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

              return (
                <div key={section.id}>
                  {/* Section header */}
                  <button
                    aria-expanded={isOpen}
                    onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                    className={`w-full flex items-start justify-between px-5 py-4 text-left transition-colors ${
                      isOpen ? 'bg-muted/30' : 'bg-transparent hover:bg-muted/30'
                    }`}
                  >
                    <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 text-muted-foreground transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
                    <div className="min-w-0 flex-1 pl-3">
                      <span className="block text-sm font-medium leading-5 text-foreground">{section.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {lectureCount} lessons · {formatDuration(totalMins)}
                        {completedCount > 0 && ` · ${completedCount}/${lessons.length} complete`}
                      </span>
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
                          <div
                            key={lesson.id}
                            className={`group w-full flex items-center justify-between px-4 py-1.5 transition-colors duration-200 ${
                              isActive
                                ? 'bg-primary/5'
                                : 'hover:bg-muted/40'
                            }`}
                          >
                            {/* Left: status + type icon + title */}
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                              {/* Status checkbox - clickable */}
                              <button
                                onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                                className="shrink-0 flex h-10 w-8 items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded-full"
                                aria-pressed={isCompleted}
                                aria-label={`${isCompleted ? 'Mark as incomplete' : 'Mark as complete'}: ${lesson.title}`}
                              >
                                {isCompleted ? (
                                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center transition-all duration-200 hover:bg-primary/90">
                                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 bg-transparent border-[1.5px] border-muted-foreground/50 rounded-full transition-all duration-200 hover:border-primary/60 hover:bg-primary/5" />
                                )}
                              </button>

                              <Link
                                href={curriculumItemHref(lesson, course.id)}
                                onClick={onNavigate}
                                aria-current={isActive ? 'page' : undefined}
                                className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                              >
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
                              <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{formatDuration(lesson.duration_minutes ?? 0)}</span>
                              </Link>
                            </div>

                          </div>
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
