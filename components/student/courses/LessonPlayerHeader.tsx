'use client';

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

interface LessonPlayerHeaderProps {
  course: any;
}

export function LessonPlayerHeader({ course }: LessonPlayerHeaderProps) {
  const router = useRouter();
  
  return (
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
        {/* Progress removed - now exists only in the sidebar as a circular widget */}
        
        {/* Notes */}
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <FileTextIcon className="w-4 h-4 mr-2" />
          Notes
        </Button>
        
        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <BookmarkIcon className="w-4 h-4 mr-2 text-gray-500" />
              Bookmark Lesson
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileTextIcon className="w-4 h-4 mr-2 text-gray-500" />
              My Notes
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
  );
}
