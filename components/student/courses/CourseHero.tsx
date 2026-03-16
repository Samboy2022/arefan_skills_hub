'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, StarIcon, UsersIcon, CalendarIcon, CheckCircleIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: number | string;
  title: string;
  slug?: string;
  short_description: string;
  thumbnail_url: string;
  rating: number;
  reviews_count: number;
  enrolled_students_count: number;
  updated_at: string;
  category?: { name: string };
  instructor: {
    name: string;
    profile_photo_url?: string;
  };
}

interface CourseHeroProps {
  course: Course;
  isEnrolled: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(date);
}

export function CourseHero({ course, isEnrolled }: CourseHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden">
      {course.thumbnail_url && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/student/courses" className="hover:underline">
              Courses
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span>{course.category?.name || 'Uncategorized'}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {course.title}
          </h1>
          
          {/* Short Description */}
          <p className="text-xl mb-6 opacity-90">
            {course.short_description}
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Rating */}
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(course.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">
                {(course.rating || 0).toFixed(1)}
              </span>
              <span className="ml-1 opacity-75">
                ({course.reviews_count || 0} reviews)
              </span>
            </div>
            
            {/* Students Enrolled */}
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>{(course.enrolled_students_count || 0).toLocaleString()} students</span>
            </div>
            
            {/* Last Updated */}
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>Updated {formatDate(course.updated_at || new Date().toISOString())}</span>
            </div>
          </div>
          
          {/* Instructor */}
          <div className="flex items-center mt-6">
            <Avatar className="h-10 w-10 border-2 border-white/20">
               <AvatarImage src={course.instructor.profile_photo_url} alt={course.instructor.name} />
               <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm opacity-75">Created by</p>
              <p className="font-semibold">{course.instructor.name}</p>
            </div>
          </div>
          
          {/* Enrollment Status Badge */}
          {isEnrolled && (
            <div className="mt-6">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1 px-3">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                You're enrolled in this course
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
