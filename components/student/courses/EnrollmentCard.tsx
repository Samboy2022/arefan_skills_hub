'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed or clipboard unavailable — nothing to do
    }
  };
  
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
    <Card className="gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-none">
      <CardContent className="p-6">
        
        {/* Action Button */}
        {isEnrolled ? (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Ready to resume?</h3>
            <Button 
              onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2 font-semibold"
              size="lg"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            {/* Progress */}
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-card">
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
                <span className="text-xs text-muted-foreground font-medium">{course.user_progress || 0}% completed</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Begin your journey</h3>
            <Button 
              onClick={handleEnroll}
              disabled={isLoading}
              className="w-full font-semibold"
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
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">{copied ? 'Link copied' : 'Share this course'}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            aria-label="Share this course"
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Share2Icon className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
