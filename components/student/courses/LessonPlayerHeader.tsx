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
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

/** Circular progress ring using CSS variables */
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
  course, currentLesson, progress, prevLessonId, nextLessonId,
  isCompleted, onMarkComplete, sidebarOpen = true, onToggleSidebar,
}: LessonPlayerHeaderProps) {
  const router = useRouter();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border px-3 py-2 flex items-center justify-between gap-2 z-10 shrink-0">

        {/* LEFT: Back + course title breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/student/courses/${course.id}`)}
            className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0 h-8 px-2"
            title="Back to course"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Course</span>
          </Button>

          <div className="h-4 w-px bg-border shrink-0" />

          {/* Course title — truncated on small screens */}
          <span className="text-xs font-medium text-muted-foreground truncate hidden sm:block max-w-[180px] lg:max-w-xs xl:max-w-sm">
            {course.title}
          </span>

          {currentLesson && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 hidden lg:block" />
              <span className="text-xs text-foreground font-semibold truncate hidden lg:block max-w-[180px] xl:max-w-sm">
                {currentLesson.title}
              </span>
            </>
          )}
        </div>

        {/* CENTER: Prev / Next navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevLessonId}
            onClick={() => prevLessonId && router.push(`/student/courses/${course.id}/lessons/${prevLessonId}`)}
            className="h-8 px-2.5 gap-1 text-xs"
            title="Previous lesson"
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
            title="Next lesson"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* RIGHT: Mark complete + progress ring + notes + sidebar toggle + more */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mark Complete */}
          <Button
            size="sm"
            variant={isCompleted ? 'outline' : 'default'}
            className={cn(
              'h-8 text-xs gap-1.5 hidden sm:flex',
              isCompleted && 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            )}
            onClick={onMarkComplete}
            title={isCompleted ? 'Mark as incomplete' : 'Mark lesson as complete'}
          >
            <CheckCircle className={cn('h-3.5 w-3.5', isCompleted && 'fill-emerald-500 text-white')} />
            {isCompleted ? 'Completed ✓' : 'Mark Complete'}
          </Button>

          {/* Progress ring */}
          <ProgressRing value={progress} />

          {/* Notes button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsNotesModalOpen(true)}
            title="Open notes"
          >
            <FileTextIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes</span>
          </Button>

          {/* Sidebar toggle */}
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hidden md:flex"
              onClick={onToggleSidebar}
              title={sidebarOpen ? 'Hide course content' : 'Show course content'}
            >
              {sidebarOpen
                ? <PanelRightClose className="w-4 h-4" />
                : <PanelRightOpen className="w-4 h-4" />
              }
            </Button>
          )}

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild suppressHydrationWarning>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="cursor-pointer sm:hidden" onClick={onMarkComplete}>
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsNotesModalOpen(true)}>
                <FileTextIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                My Notes
              </DropdownMenuItem>
              {onToggleSidebar && (
                <DropdownMenuItem className="cursor-pointer md:hidden" onClick={onToggleSidebar}>
                  {sidebarOpen
                    ? <><PanelRightClose className="w-4 h-4 mr-2" /> Hide Sidebar</>
                    : <><PanelRightOpen className="w-4 h-4 mr-2" /> Show Sidebar</>
                  }
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <BookmarkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                Bookmark Lesson
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share2Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
