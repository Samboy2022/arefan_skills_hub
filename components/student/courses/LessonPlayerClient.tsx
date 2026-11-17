'use client';

import { useState, useMemo, useEffect } from 'react';
import { LessonPlayerHeader } from './LessonPlayerHeader';
import { LessonSidebar } from './LessonSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

interface LessonPlayerClientProps {
  course: any;
  currentLessonId: number;
  currentLesson: { id: number; title: string };
  children: React.ReactNode;
}

export function LessonPlayerClient({ course, currentLessonId, currentLesson, children }: LessonPlayerClientProps) {
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set([1, 2]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Below lg the sidebar overlays the lesson instead of squeezing it
  const [isCompact, setIsCompact] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const apply = () => {
      setIsCompact(mq.matches);
      setSidebarOpen(!mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Flat ordered list of all lesson IDs for prev/next
  const allLessons = useMemo(
    () => (course.curriculum ?? []).flatMap((s: any) => s.lessons ?? []),
    [course.curriculum]
  );
  const currentIdx = allLessons.findIndex((l: any) => l.id === currentLessonId);
  const prevLessonId: number | undefined = currentIdx > 0 ? allLessons[currentIdx - 1]?.id : undefined;
  const nextLessonId: number | undefined = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1]?.id : undefined;

  const isCompleted = completedIds.has(currentLessonId);

  const handleMarkComplete = () => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.has(currentLessonId) ? next.delete(currentLessonId) : next.add(currentLessonId);
      return next;
    });
  };

  const currentProgress = allLessons.length
    ? Math.round(allLessons.filter((lesson: { id: number }) => completedIds.has(lesson.id)).length / allLessons.length * 100)
    : 0;

  const sidebar = (
    <LessonSidebar
      course={course}
      currentLessonId={currentLessonId}
      externalCompletedIds={completedIds}
      onNavigate={() => { if (isCompact) setSidebarOpen(false); }}
      onToggleComplete={(id) => {
        setCompletedIds(prev => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }}
    />
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <LessonPlayerHeader
        course={course}
        currentLesson={currentLesson}
        progress={currentProgress}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
      />

      {/* Main layout: content + sidebar */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
          {children}
        </div>

        {isCompact ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent className="w-[min(100%,380px)] gap-0 p-0 motion-reduce:animate-none" onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.querySelector<HTMLButtonElement>('button[aria-label="Show course content"]')?.focus();
            }}>
              <SheetHeader className="border-b pr-12">
                <SheetTitle>Course content</SheetTitle>
                <SheetDescription className="truncate">{course.title}</SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1">{sidebar}</div>
            </SheetContent>
          </Sheet>
        ) : (
          <aside aria-label="Course content" hidden={!sidebarOpen} className="w-[320px] xl:w-[360px] shrink-0 border-l border-border bg-background overflow-hidden">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
