'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Star, StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseCurriculum } from './CourseCurriculum';
import { emptyBodyClass, emptyStateClass, emptyTitleClass, formIconClass, formLabelClass, formSectionClass } from '@/lib/student-ui';
import { StudentTip } from '@/components/student/tip';

export function CourseDetailsTabs({ course, isEnrolled, isInstructor = false }: { course: any, isEnrolled: boolean, isInstructor?: boolean }) {
  const [reviews, setReviews] = useState(course.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Deep links such as /courses/cs101#syllabus open the matching tab
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'syllabus' || hash === 'curriculum') setActiveTab('curriculum');
      else if (hash === 'reviews') setActiveTab('reviews');
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      author: "You (Student)",
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 inline-flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1">
        {(["overview", "curriculum", "reviews"] as const).map((value) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-auto flex-none rounded-md border-0 px-3 py-1.5 text-sm font-medium text-muted-foreground capitalize shadow-none hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {value}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* OVERVIEW TAB */}
      <TabsContent value="overview" className="space-y-10 focus-visible:outline-none">
        
        {/* What You'll Learn */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">What you&apos;ll learn</h2>
          <Card className="gap-0 rounded-2xl border border-border bg-card py-0 shadow-none">
            <CardContent className="p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {course.learning_outcomes.map((outcome: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Instructor Info */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Instructor</h2>
          <Card className="gap-0 rounded-2xl border border-border bg-card py-0 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 shrink-0 border border-border">
                  <AvatarImage src={course.instructor.profile_photo_url || ''} alt="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                    {course.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{course.instructor.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </TabsContent>

      {/* CURRICULUM TAB */}
      <TabsContent value="curriculum" className="space-y-10 focus-visible:outline-none">
        {/* About This Course */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">About this course</h2>
          <div 
            className="max-w-none space-y-3 text-sm leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </section>

        {/* Course Curriculum */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Course Curriculum ({course.curriculum?.length || 0} modules)
          </h2>
          <CourseCurriculum
            course={course}
            isEnrolled={isEnrolled}
            curriculum={course.curriculum}
            isInstructor={isInstructor}
          />
        </section>
      </TabsContent>

      {/* REVIEWS TAB */}
      <TabsContent value="reviews" className="space-y-10 focus-visible:outline-none">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Student reviews</h2>
          
          <div className="mb-10 space-y-4">
            {reviews.length === 0 ? (
              <div className={emptyStateClass}>
                <h3 className={emptyTitleClass}>No reviews yet</h3>
                <p className={emptyBodyClass}>Be the first to share how this course is going.</p>
              </div>
            ) : (
              reviews.map((rev: any) => (
                <Card key={rev.id} className="gap-0 rounded-2xl border border-border bg-card py-0 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{rev.author}</div>
                        <span className="text-xs text-muted-foreground">&bull;</span>
                        <div className="text-xs text-muted-foreground">{rev.date}</div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <section className={formSectionClass}>
            <div className="mb-5 flex items-start gap-3">
              <span className={formIconClass}>
                <Star className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold">Rate this course</h3>
                <p className="text-sm text-muted-foreground">Your rating is visible to classmates.</p>
              </div>
            </div>
            <StudentTip>
              Keep the comment specific — what helped, and what could be clearer. Ratings are visible to classmates.
            </StudentTip>
            <form onSubmit={handleSaveReview} className="mt-4 space-y-4">
              <div>
                <label className={cn(formLabelClass, "mb-1.5 block")}>Your rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} star${star === 1 ? '' : 's'}`}
                      className="text-amber-500 hover:scale-110 transition-transform"
                    >
                      <StarIcon className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-medium">Your comment</label>
                <Textarea 
                  placeholder="Share your thoughts about this course..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] resize-none bg-background px-3 py-3"
                />
              </div>

              <Button type="submit" className="px-6" disabled={!comment.trim()}>
                Save Review
              </Button>
            </form>
          </section>
        </section>
      </TabsContent>

    </Tabs>
  );
}
