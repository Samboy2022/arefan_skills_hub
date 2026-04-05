'use client';

import { useState } from 'react';
import { LessonPlayerHeader } from './LessonPlayerHeader';
import { LessonSidebar } from './LessonSidebar';

interface LessonPlayerClientProps {
  course: any;
  currentLessonId: number;
  currentLesson: {
    id: number;
    title: string;
  };
  children: React.ReactNode;
}

export function LessonPlayerClient({ course, currentLessonId, currentLesson, children }: LessonPlayerClientProps) {
  const [currentProgress, setCurrentProgress] = useState(course.user_progress ?? 15);

  const handleProgressUpdate = (newProgress: number) => {
    setCurrentProgress(newProgress);
  };

  return (
    <>
      {/* Header with dynamic progress */}
      <LessonPlayerHeader 
        course={{ ...course, user_progress: currentProgress }} 
        currentLesson={currentLesson}
      />
      
      {/* Main Content - full viewport layout */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
          {children}
        </div>
        
        {/* Sidebar - outside any container, flush to edge */}
        <div className="w-[360px] bg-card border-l border-border overflow-hidden flex flex-col flex-shrink-0">
          <LessonSidebar 
            course={course} 
            currentLessonId={currentLessonId}
            onProgressUpdate={handleProgressUpdate}
          />
        </div>
      </div>
    </>
  );
}