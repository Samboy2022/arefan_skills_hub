'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2Icon, TwitterIcon, FacebookIcon, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: number | string;
  slug?: string;
  price?: number;
  currency?: string;
  original_price?: number;
  first_lesson_id?: number;
  last_accessed_lesson_id?: number;
  user_progress?: number;
}

interface EnrollmentCardProps {
  course: Course;
  isEnrolled: boolean;
}

export function EnrollmentCard({ course, isEnrolled }: EnrollmentCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEnroll = () => {
    setIsLoading(true);
    if (course.price && course.price > 0) {
      // Simulate navigate to payment
      setTimeout(() => {
        router.push(`/student/courses/${course.id}/checkout`);
        setIsLoading(false);
      }, 500);
    } else {
      // Free enrollment simulation
      setTimeout(() => {
        router.push(`/student/courses/${course.id}/lessons/${course.first_lesson_id || 1}`);
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleContinue = () => {
    router.push(`/student/courses/${course.id}/lessons/${course.last_accessed_lesson_id || course.first_lesson_id || 1}`);
  };
  
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardContent className="p-6">
        {/* Price */}
        {course.price && course.price > 0 ? (
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {course.currency || '₦'} {course.price.toLocaleString()}
            </div>
            {course.original_price && (
              <div className="text-gray-500 line-through mt-1 text-lg">
                {course.currency || '₦'} {course.original_price.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium">
              Free Course
            </Badge>
          </div>
        )}
        
        {/* Action Button */}
        {isEnrolled ? (
          <div className="space-y-5">
            <Button 
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              size="lg"
            >
              Continue Learning
            </Button>
            
            {/* Progress */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Course Progress</span>
                <span className="font-bold text-blue-600">
                  {course.user_progress || 0}%
                </span>
              </div>
              <Progress value={course.user_progress || 0} className="h-2.5 bg-gray-200" />
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : course.price && course.price > 0 ? (
              'Enroll Now'
            ) : (
              'Start Learning for Free'
            )}
          </Button>
        )}
        
        {/* Money-back guarantee */}
        {course.price && course.price > 0 && (
          <p className="text-sm text-center text-gray-500 mt-4">
            30-day money-back guarantee
          </p>
        )}
        
        {/* Share */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Share this course</p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-50">
              <Share2Icon className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200">
              <TwitterIcon className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
              <FacebookIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
