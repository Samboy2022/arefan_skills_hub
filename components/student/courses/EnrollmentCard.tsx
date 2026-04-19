'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2Icon, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/circular-progress';

interface Course {
  id: number | string;
  slug?: string;
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
    setTimeout(() => {
      router.push(`/student/courses/${course.id}/lessons/${course.first_lesson_id || 1}`);
      setIsLoading(false);
    }, 500);
  };
  
  const handleContinue = () => {
    router.push(`/student/courses/${course.id}/lessons/${course.last_accessed_lesson_id || course.first_lesson_id || 1}`);
  };
  
  return (
    <Card className="shadow-none border border-border rounded-md overflow-hidden bg-card">
      <CardContent className="p-6">
        
        {/* Action Button */}
        {isEnrolled ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Ready to resume?</h3>
            <Button 
              onClick={handleContinue}
              className="w-full shadow-none hover:bg-primary/90 text-primary-foreground font-semibold transition-colors flex items-center justify-center gap-2"
              size="lg"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            {/* Progress */}
            <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-4 border border-transparent">
              <div className="flex items-center justify-center rounded-full bg-card shadow-sm shrink-0 w-[64px] h-[64px]">
                 <CircularProgress 
                   value={course.user_progress || 0} 
                   size={52} 
                   strokeWidth={4}
                   className="shrink-0"
                   labelClassName="text-sm font-bold text-foreground"
                 />
              </div>
              <div className="min-w-0">
                <span className="text-foreground font-semibold block mb-0.5 text-sm">Course Progress</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{course.user_progress || 0}% completed</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Begin your journey</h3>
            <Button 
              onClick={handleEnroll}
              disabled={isLoading}
              className="w-full shadow-none hover:bg-primary/90 text-primary-foreground font-semibold transition-colors"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                'Start Learning'
              )}
            </Button>
          </div>
        )}
        
        {/* Share */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Share this course</p>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
            <Share2Icon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
