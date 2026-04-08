'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  FileTextIcon,
  MoreVerticalIcon,
  BookmarkIcon,
  Share2Icon,
  FlagIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotesModal } from './NotesModal';
import { cn } from '@/lib/utils';

interface LessonPlayerHeaderProps {
  course: any;
  currentLesson?: { id: number; title: string };
  progress: number;
  prevLessonId?: number;
  nextLessonId?: number;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

/** Inline circular progress ring using design tokens */
function ProgressRing({ value, size = 34 }: { value: number; size?: number }) {
  const sw = 3;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border)" strokeWidth={sw} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--primary)" strokeWidth={sw} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
        {value}%
      </span>
    </div>
  );
}

export function LessonPlayerHeader({
  course, currentLesson, progress, prevLessonId, nextLessonId, isCompleted, onMarkComplete,
}: LessonPlayerHeaderProps) {
  const router = useRouter();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 z-10 sticky top-0 shrink-0">
        {/* Left: Back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/student/courses/${course.id}`)}
            className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0 h-8 px-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Back</span>
          </Button>

          <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

          <h1 className="text-sm font-semibold text-foreground truncate hidden md:block max-w-xs lg:max-w-sm">
            {course.title}
          </h1>
          {currentLesson && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground hidden lg:block shrink-0" />
              <span className="text-xs text-muted-foreground truncate hidden lg:block max-w-xs">{currentLesson.title}</span>
            </>
          )}
        </div>

        {/* Center: Prev / Next */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevLessonId}
            onClick={() => prevLessonId && router.push(`/student/courses/${course.id}/lessons/${prevLessonId}`)}
            className="h-8 px-2.5 gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!nextLessonId}
            onClick={() => nextLessonId && router.push(`/student/courses/${course.id}/lessons/${nextLessonId}`)}
            className="h-8 px-2.5 gap-1 text-xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Right: Mark complete + progress + notes + more */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            className={cn(
              "h-8 text-xs gap-1.5 hidden sm:flex",
              isCompleted && "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            )}
            onClick={onMarkComplete}
          >
            <CheckCircle className={cn("h-3.5 w-3.5", isCompleted && "fill-emerald-500 text-white")} />
            {isCompleted ? "Completed" : "Mark Complete"}
          </Button>

          <ProgressRing value={progress} />

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsNotesModalOpen(true)}
          >
            <FileTextIcon className="w-3.5 h-3.5" />
            Notes
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild suppressHydrationWarning>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer sm:hidden" onClick={onMarkComplete}>
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                {isCompleted ? "Mark Incomplete" : "Mark Complete"}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsNotesModalOpen(true)}>
                <FileTextIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                My Notes
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BookmarkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                Bookmark Lesson
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share2Icon className="w-4 h-4 mr-2 text-muted-foreground" />
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
