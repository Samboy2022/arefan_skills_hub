'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="px-5 py-6 sm:px-8">
          {course.category?.name && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {course.category.name}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {course.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {course.short_description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {course.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({course.reviews_count.toLocaleString()} reviews)
              </span>
            </span>
            <span>{course.enrolled_students_count.toLocaleString()} students</span>
            {course.duration_hours ? <span>{course.duration_hours}h total</span> : null}
            {course.lessons_count ? <span>{course.lessons_count} lessons</span> : null}
            <span className="inline-flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-border">
                <AvatarImage src={course.instructor.profile_photo_url || ''} alt="" />
                <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                  {course.instructor.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{course.instructor.name}</span>
            </span>
          </div>
        </div>

        {course.thumbnail_url ? (
          <div className="relative hidden min-h-44 border-l border-border bg-muted md:block">
            <Image
              src={course.thumbnail_url}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
