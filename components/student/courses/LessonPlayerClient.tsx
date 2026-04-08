'use client';

import { useState, useMemo } from 'react';
import { LessonPlayerHeader } from './LessonPlayerHeader';
import { LessonSidebar } from './LessonSidebar';

interface LessonPlayerClientProps {
  course: any;
  currentLessonId: number;
  currentLesson: { id: number; title: string };
  children: React.ReactNode;
}

export function LessonPlayerClient({ course, currentLessonId, currentLesson, children }: LessonPlayerClientProps) {
  const [currentProgress, setCurrentProgress] = useState(course.user_progress ?? 15);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set([1, 2]));

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

  const handleProgressUpdate = (newProgress: number) => {
    setCurrentProgress(newProgress);
  };

  return (
    <>
      <LessonPlayerHeader
        course={course}
        currentLesson={currentLesson}
        progress={currentProgress}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
      />

      {/* Main layout: content + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
          {children}
        </div>

        {/* Sidebar */}
        <div className="w-[340px] xl:w-[380px] bg-card border-l border-border overflow-hidden flex flex-col flex-shrink-0 hidden md:flex">
          <LessonSidebar
            course={course}
            currentLessonId={currentLessonId}
            onProgressUpdate={handleProgressUpdate}
            externalCompletedIds={completedIds}
            onToggleComplete={(id) => {
              setCompletedIds(prev => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              });
            }}
          />
        </div>
      </div>
    </>
  );
}