'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, StarIcon, UsersIcon, ClockIcon, BookOpenIcon } from 'lucide-react';

interface Course {
  id: number | string;
  title: string;
  short_description: string;
  thumbnail_url: string;
  rating: number;
  reviews_count: number;
  enrolled_students_count: number;
  updated_at: string;
  duration_hours?: number;
  lessons_count?: number;
  category?: { name: string };
  instructor: {
    name: string;
    profile_photo_url?: string;
  };
  user_progress?: number;
}

interface CourseHeroProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseHero({ course, isEnrolled }: CourseHeroProps) {
  return (
    <div className="relative w-full h-56 bg-black overflow-hidden border-b border-border">
      {/* Background thumbnail */}
      {course.thumbnail_url && (
        <div className="absolute inset-0 w-full h-full">
          {/* We push the image to the right side so the left text overlay is solid */}
          <div className="absolute inset-0 md:left-1/3">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Gradient overlay blending the image smoothly into the black background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/20" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-6 py-6 max-w-6xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
          <Link href="/student/courses" className="hover:text-white transition-colors">
            My Courses
          </Link>
          <ChevronRightIcon className="w-3 h-3 text-white/50" />
          <span className="text-white/80">{course.category?.name || 'Course'}</span>
        </div>

        {/* Bottom row: title + meta */}
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-white/70 text-sm mt-2 line-clamp-2">
              {course.short_description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white text-sm font-medium">{course.rating.toFixed(1)}</span>
                <span className="text-white/60 text-sm">({course.reviews_count.toLocaleString()})</span>
              </div>
              {/* Students */}
              <div className="flex items-center gap-1.5">
                <UsersIcon className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">{course.enrolled_students_count.toLocaleString()} students</span>
              </div>
              {/* Duration */}
              {course.duration_hours && (
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">{course.duration_hours}h total</span>
                </div>
              )}
              {/* Lessons */}
              {course.lessons_count && (
                <div className="flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">{course.lessons_count} lessons</span>
                </div>
              )}
              {/* Instructor */}
              <div className="flex items-center gap-1">
                <span className="text-white/60 text-sm">by</span>
                <span className="text-white text-sm font-medium">{course.instructor.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
