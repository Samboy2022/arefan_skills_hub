import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonPlayerHeader } from '@/components/student/courses/LessonPlayerHeader';
import { LessonSidebar } from '@/components/student/courses/LessonSidebar';
import { VideoPlayer } from '@/components/student/courses/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simulated fetchers
async function fetchCourse(id: string) {
  return {
    id,
    title: 'Advanced Full-Stack Web Development',
    user_progress: 15,
    curriculum: [
      {
        id: 1,
        title: 'Getting Started',
        lessons_count: 4,
        duration_minutes: 51,
        lessons: [
          { id: 1, title: 'What is Webflow?', duration_minutes: 7, content_type: 'video', is_preview: true },
          { id: 2, title: 'Sign up in Webflow', duration_minutes: 7, content_type: 'video' },
          { id: 3, title: 'Teaser of Webflow', duration_minutes: 18, content_type: 'video' },
          { id: 4, title: 'Figma Introduction', duration_minutes: 19, content_type: 'video' },
        ],
      },
      {
        id: 2,
        title: 'Secret of Good Design',
        lessons_count: 7,
        duration_minutes: 120,
        lessons: [
          { id: 5, title: 'Design Principles Overview', duration_minutes: 12, content_type: 'video' },
          { id: 6, title: 'Color Theory Basics', duration_minutes: 15, content_type: 'video' },
          { id: 7, title: 'Typography Fundamentals', duration_minutes: 18, content_type: 'video' },
          { id: 8, title: 'Spacing & Layout Rules', duration_minutes: 14, content_type: 'video' },
          { id: 9, title: 'Design Systems 101', duration_minutes: 20, content_type: 'video' },
          { id: 10, title: 'Visual Hierarchy', duration_minutes: 11, content_type: 'video' },
          { id: 11, title: 'Module Quiz: Design Fundamentals', duration_minutes: 30, content_type: 'quiz' },
        ],
      },
      {
        id: 3,
        title: 'Practice Design Like an Artist',
        lessons_count: 5,
        duration_minutes: 71,
        lessons: [
          { id: 12, title: 'Sketching UI Wireframes', duration_minutes: 9, content_type: 'video' },
          { id: 13, title: 'Low-Fidelity Prototyping', duration_minutes: 14, content_type: 'video' },
          { id: 14, title: 'High-Fidelity Design in Figma', duration_minutes: 16, content_type: 'video' },
          { id: 15, title: 'Design Review & Iteration', duration_minutes: 12, content_type: 'video' },
          { id: 16, title: 'Assignment: Redesign a Real App', duration_minutes: 20, content_type: 'assignment' },
        ],
      },
      {
        id: 4,
        title: 'Web Development (Webflow)',
        lessons_count: 12,
        duration_minutes: 266,
        lessons: [
          { id: 17, title: 'Webflow Interface Tour', duration_minutes: 10, content_type: 'video' },
          { id: 18, title: 'Building Your First Page', duration_minutes: 20, content_type: 'video' },
          { id: 19, title: 'Flexbox in Webflow', duration_minutes: 18, content_type: 'video' },
          { id: 20, title: 'Grid Layouts', duration_minutes: 22, content_type: 'video' },
          { id: 21, title: 'Interactions & Animations', duration_minutes: 25, content_type: 'video' },
          { id: 22, title: 'CMS & Dynamic Content', duration_minutes: 30, content_type: 'video' },
          { id: 23, title: 'E-Commerce Setup', duration_minutes: 28, content_type: 'video' },
          { id: 24, title: 'Publishing Your Site', duration_minutes: 15, content_type: 'video' },
          { id: 25, title: 'SEO Fundamentals in Webflow', duration_minutes: 18, content_type: 'document' },
          { id: 26, title: 'Quiz: Webflow Foundations', duration_minutes: 15, content_type: 'quiz' },
          { id: 27, title: 'Assignment: Build a Landing Page', duration_minutes: 45, content_type: 'assignment' },
          { id: 28, title: 'Assignment: Build a Portfolio Site', duration_minutes: 60, content_type: 'assignment' },
        ],
      },
      {
        id: 5,
        title: 'Secrets of Making Money Freelancing',
        lessons_count: 6,
        duration_minutes: 78,
        lessons: [
          { id: 29, title: 'Building Your Portfolio', duration_minutes: 8, content_type: 'video' },
          { id: 30, title: 'Finding Your First Client', duration_minutes: 10, content_type: 'video' },
          { id: 31, title: 'Pricing Your Services', duration_minutes: 7, content_type: 'video' },
          { id: 32, title: 'Writing Proposals That Win', duration_minutes: 13, content_type: 'video' },
          { id: 33, title: 'Quiz: Freelancing Strategies', duration_minutes: 10, content_type: 'quiz' },
          { id: 34, title: 'Assignment: Write a Client Proposal', duration_minutes: 30, content_type: 'assignment' },
        ],
      },
      {
        id: 6,
        title: 'Advanced Techniques',
        lessons_count: 7,
        duration_minutes: 121,
        lessons: [
          { id: 35, title: 'Custom Code in Webflow', duration_minutes: 20, content_type: 'video' },
          { id: 36, title: 'JavaScript Interactions', duration_minutes: 25, content_type: 'video' },
          { id: 37, title: 'API Integrations', duration_minutes: 22, content_type: 'video' },
          { id: 38, title: 'Performance Optimization', duration_minutes: 18, content_type: 'video' },
          { id: 39, title: 'Advanced Animation Techniques', duration_minutes: 16, content_type: 'video' },
          { id: 40, title: 'Quiz: Advanced Webflow', duration_minutes: 10, content_type: 'quiz' },
          { id: 41, title: 'Assignment: Build an Advanced Web App', duration_minutes: 10, content_type: 'assignment' },
        ],
      },
      {
        id: 7,
        title: "What's Next",
        lessons_count: 4,
        duration_minutes: 77,
        lessons: [
          { id: 42, title: 'Growing Your Skills Further', duration_minutes: 12, content_type: 'video' },
          { id: 43, title: 'Recommended Resources', duration_minutes: 8, content_type: 'document' },
          { id: 44, title: 'Join the Community', duration_minutes: 5, content_type: 'video' },
          { id: 45, title: 'Course Completion Certificate', duration_minutes: 52, content_type: 'document' },
        ],
      },
    ],
  };
}

async function fetchLesson(lessonId: string) {
  const parsedLessonId = parseInt(lessonId);
  return {
    id: parsedLessonId,
    title: parsedLessonId === 1 ? 'What is Webflow?' : 'Understanding Hooks',
    description: 'A comprehensive introduction to the core concepts covered in this lesson. Watch the video and follow along with the materials below.',
    video_id: 'vid_12345',
    content_type: 'video'
  };
}

export const metadata: Metadata = {
  title: 'Lesson Player | Student Portal',
};

export default async function LessonPlayerPage({ 
  params 
}: { 
  params: Promise<{ id: string; lessonId: string }> 
}) {
  const resolvedParams = await params;
  const [course, lesson] = await Promise.all([
    fetchCourse(resolvedParams.id),
    fetchLesson(resolvedParams.lessonId)
  ]);
  
  if (!course || !lesson) {
    notFound();
  }
  
  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <LessonPlayerHeader course={course} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
          {/* Video Player */}
          <div className="w-full bg-black aspect-video flex-shrink-0 relative">
            <VideoPlayer lesson={lesson} />
          </div>
          
          {/* Content Tabs — full width */}
          <div className="bg-card flex-1 border-t border-border">
            {/* Lesson title */}
            <div className="px-6 pt-5 pb-3 border-b border-border">
              <h1 className="text-xl font-semibold text-foreground">{lesson.title}</h1>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              {/* Full-width tab list */}
              <TabsList className="w-full h-auto rounded-none bg-muted/40 border-b border-border grid grid-cols-4 p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-sm font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="qa"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-sm font-medium"
                >
                  Q&amp;A
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-sm font-medium"
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="downloads"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-sm font-medium"
                >
                  Downloads (2)
                </TabsTrigger>
              </TabsList>
              
              {/* Tab content */}
              <div className="px-6 py-5">
                <TabsContent value="overview" className="mt-0 prose prose-sm max-w-none text-muted-foreground">
                  <p>{lesson.description}</p>
                  <h3 className="text-foreground font-semibold text-base mt-4 mb-2">In this lesson you will learn:</h3>
                  <ul className="space-y-1">
                    <li>How to properly structure your application</li>
                    <li>Best practices for performance optimization</li>
                    <li>Common pitfalls to avoid</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="qa" className="mt-0">
                  <div className="py-10 text-center bg-muted/40 border border-border rounded">
                    <p className="text-muted-foreground text-sm">Got a question about this lesson?</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition">
                      Ask a Question
                    </button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <div className="py-10 text-center bg-muted/40 border border-border rounded">
                    <p className="text-muted-foreground text-sm">Create notes to review later.</p>
                    <button className="mt-4 px-4 py-2 border border-border bg-card text-foreground rounded text-sm font-medium hover:bg-muted transition">
                      Create Note
                    </button>
                  </div>
                </TabsContent>
                
                <TabsContent value="downloads" className="mt-0">
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/50 transition">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium text-foreground">Presentation_Slides.pdf</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2.4 MB</span>
                    </li>
                    <li className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/50 transition">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <span className="text-sm font-medium text-foreground">Source_Code.zip</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1.1 MB</span>
                    </li>
                  </ul>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        
        {/* Sidebar (Curriculum) */}
        <div className="w-[360px] bg-card border-l border-border overflow-hidden hidden lg:flex flex-col flex-shrink-0">
          <LessonSidebar course={course} currentLessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}
