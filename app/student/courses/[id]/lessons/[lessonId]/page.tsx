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
        lessons_count: 52,
        duration_minutes: 349,
        lessons: [
          { id: 5, title: 'Design Principles Overview', duration_minutes: 12, content_type: 'video' },
          { id: 6, title: 'Color Theory Basics', duration_minutes: 15, content_type: 'video' },
          { id: 7, title: 'Typography Fundamentals', duration_minutes: 18, content_type: 'video' },
          { id: 8, title: 'Spacing & Layout Rules', duration_minutes: 14, content_type: 'video' },
          { id: 9, title: 'Design Systems 101', duration_minutes: 20, content_type: 'video' },
          { id: 10, title: 'Visual Hierarchy', duration_minutes: 11, content_type: 'video' },
          { id: 11, title: 'Design Critique Exercise', duration_minutes: 30, content_type: 'assignment' },
        ],
      },
      {
        id: 3,
        title: 'Practice Design Like an Artist',
        lessons_count: 43,
        duration_minutes: 51,
        lessons: [
          { id: 12, title: 'Sketching UI Wireframes', duration_minutes: 9, content_type: 'video' },
          { id: 13, title: 'Low-Fidelity Prototyping', duration_minutes: 14, content_type: 'video' },
          { id: 14, title: 'High-Fidelity Design in Figma', duration_minutes: 16, content_type: 'video' },
          { id: 15, title: 'Design Review & Iteration', duration_minutes: 12, content_type: 'video' },
        ],
      },
      {
        id: 4,
        title: 'Web Development (Webflow)',
        lessons_count: 137,
        duration_minutes: 606,
        lessons: [
          { id: 16, title: 'Webflow Interface Tour', duration_minutes: 10, content_type: 'video' },
          { id: 17, title: 'Building Your First Page', duration_minutes: 20, content_type: 'video' },
          { id: 18, title: 'Flexbox in Webflow', duration_minutes: 18, content_type: 'video' },
          { id: 19, title: 'Grid Layouts', duration_minutes: 22, content_type: 'video' },
          { id: 20, title: 'Interactions & Animations', duration_minutes: 25, content_type: 'video' },
          { id: 21, title: 'CMS & Dynamic Content', duration_minutes: 30, content_type: 'video' },
          { id: 22, title: 'E-Commerce Setup', duration_minutes: 28, content_type: 'video' },
          { id: 23, title: 'Publishing Your Site', duration_minutes: 15, content_type: 'video' },
          { id: 24, title: 'SEO Fundamentals in Webflow', duration_minutes: 18, content_type: 'document' },
          { id: 25, title: 'Webflow Project Challenge', duration_minutes: 40, content_type: 'assignment' },
        ],
      },
      {
        id: 5,
        title: 'Secrets of Making Money Freelancing',
        lessons_count: 21,
        duration_minutes: 38,
        lessons: [
          { id: 26, title: 'Building Your Portfolio', duration_minutes: 8, content_type: 'video' },
          { id: 27, title: 'Finding Your First Client', duration_minutes: 10, content_type: 'video' },
          { id: 28, title: 'Pricing Your Services', duration_minutes: 7, content_type: 'video' },
          { id: 29, title: 'Writing Proposals That Win', duration_minutes: 13, content_type: 'video' },
        ],
      },
      {
        id: 6,
        title: 'Advanced',
        lessons_count: 39,
        duration_minutes: 91,
        lessons: [
          { id: 30, title: 'Custom Code in Webflow', duration_minutes: 20, content_type: 'video' },
          { id: 31, title: 'JavaScript Interactions', duration_minutes: 25, content_type: 'video' },
          { id: 32, title: 'API Integrations', duration_minutes: 22, content_type: 'video' },
          { id: 33, title: 'Performance Optimization', duration_minutes: 18, content_type: 'video' },
          { id: 34, title: 'Advanced Animation Techniques', duration_minutes: 6, content_type: 'video' },
        ],
      },
      {
        id: 7,
        title: "What's Next",
        lessons_count: 7,
        duration_minutes: 77,
        lessons: [
          { id: 35, title: 'Growing Your Skills Further', duration_minutes: 12, content_type: 'video' },
          { id: 36, title: 'Recommended Resources', duration_minutes: 8, content_type: 'document' },
          { id: 37, title: 'Join the Community', duration_minutes: 5, content_type: 'video' },
          { id: 38, title: 'Course Completion Certificate', duration_minutes: 52, content_type: 'document' },
        ],
      },
    ],
  };
}

async function fetchLesson(lessonId: string) {
  const parsedLessonId = parseInt(lessonId);
  return {
    id: parsedLessonId,
    title: parsedLessonId === 1 ? 'Course Overview' : 'Understanding Hooks',
    description: 'A deep dive into the modern React features. Learn how to manage state and side effects with hooks.',
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
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <LessonPlayerHeader course={course} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar placeholder (would use a sheet or drawer conceptually) */}
        
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full">
          {/* Main Video/Content Player Layer */}
          <div className="w-full bg-black aspect-video flex-shrink-0 relative">
            <VideoPlayer lesson={lesson} />
          </div>
          
          {/* Content Tabs (below video) */}
          <div className="bg-white flex-1 p-6 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 bg-gray-100">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="qa">Q&A</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="downloads">Downloads (2)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="prose max-w-none text-gray-700">
                  <p>{lesson.description}</p>
                  <h3>In this lesson you will learn:</h3>
                  <ul>
                    <li>How to properly structure your application</li>
                    <li>Best practices for performance optimization</li>
                    <li>Common pitfalls to avoid</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="qa" className="text-gray-600">
                  <div className="py-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                    <p>Got a question about this lesson?</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition">
                      Ask a Question
                    </button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="text-gray-600">
                  <div className="py-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                    <p>Create notes to review later.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                      Create Note
                    </button>
                  </div>
                </TabsContent>
                
                <TabsContent value="downloads" className="text-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium text-gray-800">Presentation_Slides.pdf</span>
                      </div>
                      <span className="text-xs text-gray-500">2.4 MB</span>
                    </li>
                    <li className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <span className="text-sm font-medium text-gray-800">Source_Code.zip</span>
                      </div>
                      <span className="text-xs text-gray-500">1.1 MB</span>
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Sidebar (Curriculum) */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block flex-shrink-0">
          <LessonSidebar course={course} currentLessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}
