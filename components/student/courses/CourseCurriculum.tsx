'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDownIcon, LockIcon, PlayIcon, PlayCircleIcon, 
  FileTextIcon, AlignLeftIcon, HelpCircleIcon, FileIcon,
  Pencil, PlusCircle
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
  description?: string;
  lessons_count: number;
  duration_minutes: number;
  is_locked?: boolean;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  course: any;
  isEnrolled: boolean;
  curriculum?: Section[];
  isInstructor?: boolean;
}

function getLessonIcon(contentType: string) {
  const icons: Record<string, React.ReactNode> = {
    video:      <PlayCircleIcon className="w-5 h-5 text-primary" />,
    document:   <FileTextIcon  className="w-5 h-5 text-indigo-500" />,
    text:       <AlignLeftIcon className="w-5 h-5 text-muted-foreground" />,
    quiz:       <HelpCircleIcon className="w-5 h-5 text-purple-500" />,
    assignment: <FileIcon      className="w-5 h-5 text-amber-500" />,
  };
  return icons[contentType] || <FileIcon className="w-5 h-5 text-muted-foreground" />;
}

export function CourseCurriculum({
  course,
  isEnrolled,
  curriculum = [],
  isInstructor = false,
}: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    curriculum.length > 0 ? [curriculum[0].id] : []
  );

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Curriculum details are not available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {curriculum.map((section) => (
        <div key={section.id} className="border border-border rounded-md overflow-hidden bg-card">

          {/* ── Section Header ── */}
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center flex-1">
              <ChevronDownIcon
                className={`w-5 h-5 mr-3 text-muted-foreground transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              />
              <div className="text-left w-full pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5 flex items-center bg-muted text-muted-foreground">
                    {section.lessons_count} Lessons
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-1 mb-2 leading-relaxed">
                  {section.description || `Explore the core concepts and fundamental topics covered in ${section.title}.`}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground bg-background/50 inline-flex p-1.5 rounded-md border border-border/50">
                  <span className="font-medium flex items-center gap-1">
                    <PlayCircleIcon className="w-3 h-3" />
                    {section.lessons.filter((l) => l.content_type === 'video' || l.content_type === 'document').length} Multimedia
                  </span>
                  <span>&bull;</span>
                  <span className="font-medium flex items-center gap-1">
                    <FileIcon className="w-3 h-3 text-amber-500" />
                    {section.lessons.filter((l) => l.content_type === 'assignment').length} Assignment
                    {section.lessons.filter((l) => l.content_type === 'assignment').length !== 1 && 's'}
                  </span>
                  <span>&bull;</span>
                  <span className="font-medium flex items-center gap-1">
                    <HelpCircleIcon className="w-3 h-3 text-purple-500" />
                    {section.lessons.filter((l) => l.content_type === 'quiz').length} Quiz
                    {section.lessons.filter((l) => l.content_type === 'quiz').length !== 1 && 'zes'}
                  </span>
                </div>
              </div>
            </div>

            {section.is_locked && !isEnrolled && (
              <LockIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* ── Lessons List ── */}
          {expandedSections.includes(section.id) && (
            <div className="border-t border-border bg-card">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    {getLessonIcon(lesson.content_type)}
                    <div className="ml-3">
                      {lesson.is_preview || isEnrolled ? (
                        <Link
                          href={
                            lesson.content_type === 'assignment'
                              ? `/student/assignments/${lesson.id}`
                              : `/student/courses/${course.id}/lessons/${lesson.id}`
                          }
                          className="font-medium text-sm text-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {lesson.title}
                        </Link>
                      ) : (
                        <p className="font-medium text-sm text-foreground">{lesson.title}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration_minutes} min</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isInstructor ? (
                      <div className="flex items-center gap-2">
                        <Link href={`/instructor/lessons/${lesson.id}/add-assignment`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10">
                            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Assignment</span>
                          </Button>
                        </Link>
                        <Link href={`/instructor/lessons/${lesson.id}/add-quiz`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10">
                            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Quiz</span>
                          </Button>
                        </Link>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Link href={`/instructor/lessons/${lesson.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Edit</span>
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        {lesson.is_preview && (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 flex items-center bg-primary/5 text-primary border-primary/20">
                            Preview
                          </Badge>
                        )}
                        {lesson.is_preview || isEnrolled ? (
                          <Link
                            href={
                              lesson.content_type === 'assignment'
                                ? `/student/assignments/${lesson.id}`
                                : `/student/courses/${course.id}/lessons/${lesson.id}`
                            }
                          >
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                              <PlayIcon className="w-4 h-4 ml-0.5" />
                            </Button>
                          </Link>
                        ) : (
                          <LockIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {isInstructor && (
                <div className="p-3 border-t border-border bg-muted/10 hover:bg-muted/30 transition-colors flex justify-center">
                  <Link href={`/instructor/courses/${course.id}/sections/${section.id}/add-lesson`}>
                    <Button variant="outline" size="sm" className="h-8 border-dashed flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <PlusCircle className="h-4 w-4" />
                      Add New Lesson
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isInstructor && (
        <div className="pt-4 flex justify-center">
          <Link href={`/instructor/courses/${course.id}/add-module`}>
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Module
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
