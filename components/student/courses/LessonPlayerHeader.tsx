'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  FileTextIcon, 
  MoreVerticalIcon, 
  BookmarkIcon, 
  Share2Icon, 
  FlagIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotesModal } from './NotesModal';

interface LessonPlayerHeaderProps {
  course: any;
  currentLesson?: {
    id: number;
    title: string;
  };
}

/** Circular progress SVG ring */
function CircularProgress({ value, size = 32 }: { value: number; size?: number }) {
  const strokeWidth = 3;
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

export function LessonPlayerHeader({ course, currentLesson }: LessonPlayerHeaderProps) {
  const router = useRouter();
  const progress = course.user_progress ?? 15;
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/student/courses/${course.id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          
          {/* Course Title */}
          <div className="border-l border-gray-300 pl-4 hidden md:block">
            <h1 className="font-semibold text-lg text-gray-900 truncate max-w-md">
              {course.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Circular Progress Indicator */}
          <div className="relative shrink-0">
            <CircularProgress value={progress} size={32} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
              {progress}%
            </span>
          </div>
          
          {/* Notes */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex"
            onClick={() => setIsNotesModalOpen(true)}
          >
            <FileTextIcon className="w-4 h-4 mr-2" />
            Notes
          </Button>
          
          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild suppressHydrationWarning>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setIsNotesModalOpen(true)}
              >
                <FileTextIcon className="w-4 h-4 mr-2 text-gray-500" />
                My Notes
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BookmarkIcon className="w-4 h-4 mr-2 text-gray-500" />
                Bookmark Lesson
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share2Icon className="w-4 h-4 mr-2 text-gray-500" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <FlagIcon className="w-4 h-4 mr-2" />
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notes Modal */}
      {currentLesson && (
        <NotesModal
          isOpen={isNotesModalOpen}
          onClose={() => setIsNotesModalOpen(false)}
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.title}
        />
      )}
    </>
  );
}
