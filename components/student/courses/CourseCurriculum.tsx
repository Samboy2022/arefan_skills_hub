'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDownIcon, LockIcon, PlayIcon, PlayCircleIcon, 
  FileTextIcon, AlignLeftIcon, HelpCircleIcon, FileIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Lesson {
  id: number;
  title: string;
  duration_minutes: number;
  content_type: string;
  is_preview?: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons_count: number;
  duration_minutes: number;
  is_locked?: boolean;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  course: any;
  isEnrolled: boolean;
  curriculum?: Section[];
}

function getLessonIcon(contentType: string) {
  const icons: Record<string, React.ReactNode> = {
    video: <PlayCircleIcon className="w-5 h-5 text-blue-500" />,
    document: <FileTextIcon className="w-5 h-5 text-purple-500" />,
    text: <AlignLeftIcon className="w-5 h-5 text-gray-500" />,
    quiz: <HelpCircleIcon className="w-5 h-5 text-emerald-500" />,
    assignment: <FileIcon className="w-5 h-5 text-orange-500" />
  };
  
  return icons[contentType] || <FileIcon className="w-5 h-5 text-gray-500" />;
}

export function CourseCurriculum({ course, isEnrolled, curriculum = [] }: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    curriculum.length > 0 ? [curriculum[0].id] : []
  );
  
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Curriculum details are not available yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {curriculum.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden bg-white">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1">
              <ChevronDownIcon
                className={`w-5 h-5 mr-3 text-gray-400 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {section.lessons_count} lessons · {section.duration_minutes} min
                </p>
              </div>
            </div>
            
            {section.is_locked && !isEnrolled && (
              <LockIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {/* Section Content (Lessons) */}
          {expandedSections.includes(section.id) && (
            <div className="border-t bg-gray-50/50">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex items-center flex-1">
                    {/* Lesson Icon */}
                    {getLessonIcon(lesson.content_type)}
                    
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {lesson.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Preview Badge */}
                    {lesson.is_preview && (
                      <Badge variant="outline" className="text-xs">Preview</Badge>
                    )}
                    
                    {/* Play/Lock Icon */}
                    {lesson.is_preview || isEnrolled ? (
                      <Link href={`/student/courses/${course.id}/lessons/${lesson.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600">
                          <PlayIcon className="w-4 h-4 ml-0.5" />
                        </Button>
                      </Link>
                    ) : (
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
