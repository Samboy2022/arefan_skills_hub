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

export function LessonPlayerHeader({
  course, currentLesson, progress, prevLessonId, nextLessonId,
  isCompleted, onMarkComplete, sidebarOpen = true, onToggleSidebar,
}: LessonPlayerHeaderProps) {
  const router = useRouter();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  return (
    <>
      <header className="bg-background border-b border-border px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 sm:px-6 lg:flex lg:justify-between z-10 shrink-0">

        {/* LEFT: Back + course title breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/student/courses/${course.id}`)}
            className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0 h-10 px-2"
            aria-label="Back to course" title="Back to course"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Course</span>
          </Button>

          <div className="h-4 w-px bg-border shrink-0" />

          {/* Course title — truncated on small screens */}
          <span className="text-sm font-medium text-foreground truncate max-w-[55vw] lg:max-w-xs xl:max-w-sm">
            {course.title}
          </span>


        </div>

        {/* CENTER: Prev / Next navigation */}
        <div className="order-3 col-span-2 flex items-center justify-between gap-1 border-t border-border/60 pt-2 lg:order-none lg:col-span-1 lg:border-0 lg:pt-0 lg:justify-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prevLessonId}
            onClick={() => prevLessonId && router.push(`/student/courses/${course.id}/lessons/${prevLessonId}`)}
            className="h-10 px-3 gap-1 text-xs"
            aria-label="Previous lesson" title="Previous lesson"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!nextLessonId}
            onClick={() => nextLessonId && router.push(`/student/courses/${course.id}/lessons/${nextLessonId}`)}
            className="h-10 px-3 gap-1 text-xs"
            aria-label="Next lesson" title="Next lesson"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* RIGHT: Mark complete + progress + notes + sidebar toggle + more */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Mark Complete */}
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'h-10 text-xs gap-1.5 hidden sm:flex shadow-none',
              isCompleted && 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            )}
            onClick={onMarkComplete}
            title={isCompleted ? 'Mark as incomplete' : 'Mark lesson as complete'}
          >
            <CheckCircle className={cn('h-3.5 w-3.5', isCompleted && 'fill-emerald-500 text-white')} />
            {isCompleted ? 'Completed' : 'Mark complete'}
          </Button>

          {/* Course progress */}
          <span className="hidden xl:inline text-xs tabular-nums text-muted-foreground px-2" aria-label={`${progress}% of course completed`}>{progress}% complete</span>

          {/* Notes button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden xl:flex h-10 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
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
              className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground flex"
              onClick={onToggleSidebar}
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Hide course content' : 'Show course content'}
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
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0" aria-label="More lesson options">
                <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-2 text-xs text-muted-foreground">{progress}% of course completed</div>
              <DropdownMenuSeparator />
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
