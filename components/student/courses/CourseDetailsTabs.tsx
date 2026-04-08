'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, MessageSquare, StarIcon } from 'lucide-react';
import { CourseCurriculum } from './CourseCurriculum';

export function CourseDetailsTabs({ course, isEnrolled }: { course: any, isEnrolled: boolean }) {
  const [reviews, setReviews] = useState(course.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6 w-full justify-start border-b border-border rounded-none bg-transparent p-0">
        <TabsTrigger 
          value="overview" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="curriculum" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
        >
          Curriculum
        </TabsTrigger>
        <TabsTrigger 
          value="reviews" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      {/* OVERVIEW TAB */}
      <TabsContent value="overview" className="space-y-10 focus-visible:outline-none">
        
        {/* What You'll Learn */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">What You'll Learn</h2>
          <Card className="border border-border shadow-none rounded-md bg-card">
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
          <h2 className="text-xl font-bold text-foreground mb-4">Instructor</h2>
          <Card className="border border-border shadow-none rounded-md bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {course.instructor.name.charAt(0)}
                </div>
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
          <h2 className="text-xl font-bold text-foreground mb-4">About This Course</h2>
          <div 
            className="prose prose-sm max-w-none text-muted-foreground prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </section>

        {/* Course Curriculum */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center justify-between">
            <span>Course Curriculum ({course.curriculum?.length || 0} Modules)</span>
          </h2>
          <Card className="border border-border shadow-none rounded-md bg-card overflow-hidden">
            <CourseCurriculum 
              course={course} 
              isEnrolled={isEnrolled}
              curriculum={course.curriculum}
            />
          </Card>
        </section>
      </TabsContent>

      {/* REVIEWS TAB */}
      <TabsContent value="reviews" className="space-y-10 focus-visible:outline-none">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Student Reviews</h2>
          
          <div className="space-y-6 mb-10">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((rev: any) => (
                <Card key={rev.id} className="border border-border shadow-none bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{rev.author}</div>
                        <span className="text-xs text-muted-foreground">&bull;</span>
                        <div className="text-xs text-muted-foreground">{rev.date}</div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-muted/30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Rate Course */}
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <h3 className="font-bold text-lg mb-4">Rate Course</h3>
            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-500 hover:scale-110 transition-transform"
                    >
                      <StarIcon className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-muted/30'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Your Comment</label>
                <Textarea 
                  placeholder="Share your thoughts about this course..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={!comment.trim()}>
                Save Review
              </Button>
            </form>
          </div>
        </section>
      </TabsContent>

    </Tabs>
  );
}
