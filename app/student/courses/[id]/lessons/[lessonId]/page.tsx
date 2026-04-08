import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonPlayerClient } from '@/components/student/courses/LessonPlayerClient';
import { VideoPlayer } from '@/components/student/courses/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  CheckCircle2, Download, FileText, Code2, MessageSquare,
  ThumbsUp, Clock, Play, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Data Fetchers ─────────────────────────────────────────────────────────────
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
  const id = parseInt(lessonId);
  const titles: Record<number, string> = {
    1: 'What is Webflow?',
    5: 'Design Principles Overview',
  };
  return {
    id,
    title: titles[id] ?? `Lesson ${id}`,
    description: 'A comprehensive introduction to the core concepts covered in this lesson. Watch the video and follow along with the materials provided.',
    video_id: 'vid_12345',
    content_type: 'video',
    duration_minutes: 12,
    section_title: 'Secret of Good Design',
  };
}

export const metadata: Metadata = {
  title: 'Lesson Player | FnSkills',
};

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const [course, lesson] = await Promise.all([fetchCourse(id), fetchLesson(lessonId)]);

  if (!course || !lesson) notFound();

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background overflow-hidden">
      {/* Breadcrumb section */}
      <div className="px-6 py-3 border-b border-border bg-card">
        <Breadcrumb 
          items={[
            { label: "My Courses", href: "/student/courses" },
            { label: course.title, href: `/student/courses/${course.id}` },
            { label: lesson.title }
          ]}
        />
      </div>

      <LessonPlayerClient
        course={course}
        currentLessonId={lesson.id}
        currentLesson={lesson}
      >
        {/* ── Main Content Scroll Area ── */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">

          {/* Video Player */}
          <div className="w-full bg-black aspect-video flex-shrink-0 relative">
            <VideoPlayer lesson={lesson} />
          </div>

          {/* ── Lesson Identity Strip ── */}
          <div className="px-6 pt-5 pb-4 border-b border-border bg-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                {/* Section label */}
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {lesson.section_title ?? 'Module'}
                </p>
                <h1 className="text-lg font-bold text-foreground leading-tight">{lesson.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {lesson.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="h-3.5 w-3.5" /> Video lesson
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-card flex-1 border-t border-border">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full h-auto rounded-none bg-transparent border-b border-border grid grid-cols-4 p-0">
                {[
                  { value: 'overview', label: 'Overview' },
                  { value: 'qa', label: 'Q & A' },
                  { value: 'notes', label: 'Notes' },
                  { value: 'downloads', label: 'Downloads (2)' },
                ].map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="px-6 py-5">

                {/* OVERVIEW */}
                <TabsContent value="overview" className="mt-0 space-y-5 focus-visible:outline-none">
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.description}</p>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> What you&apos;ll learn in this lesson
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'How to properly structure your application architecture',
                        'Best practices for performance optimization',
                        'Common pitfalls to avoid and how to fix them',
                        'Real-world patterns used in production systems',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Q&A */}
                <TabsContent value="qa" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-4">
                    {/* Mock questions */}
                    {[
                      { author: 'Jordan Lee', time: '2 days ago', question: 'Can we use this technique with TypeScript generics?', likes: 4, answered: true },
                      { author: 'Mia Chen', time: '5 days ago', question: 'What is the difference between this approach and the older method shown in Module 1?', likes: 2, answered: false },
                    ].map((q, i) => (
                      <div key={i} className="border border-border rounded-lg p-4 bg-card">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                              {q.author.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{q.author}</p>
                              <p className="text-[11px] text-muted-foreground">{q.time}</p>
                            </div>
                          </div>
                          {q.answered && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                              Answered
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-3">{q.question}</p>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="h-3.5 w-3.5" /> {q.likes} Helpful
                          </button>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="h-3.5 w-3.5" /> Reply
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Ask question CTA */}
                    <div className="border border-dashed border-border rounded-lg p-4 text-center">
                      <HelpCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">Have a question about this lesson?</p>
                      <Button size="sm" className="gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Ask a Question
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* NOTES */}
                <TabsContent value="notes" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-4">
                    {/* Existing note */}
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] text-muted-foreground font-medium">at 3:45 · Added yesterday</p>
                        <button className="text-[11px] text-muted-foreground hover:text-primary transition-colors">Edit</button>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        Remember to always declare variables with const first, then switch to let only if re-assignment is needed. Avoids accidental mutation bugs.
                      </p>
                    </div>

                    {/* New note textarea */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="px-4 py-2 bg-muted/30 border-b border-border">
                        <p className="text-xs text-muted-foreground font-medium">Add a note at current timestamp</p>
                      </div>
                      <textarea
                        className="w-full px-4 py-3 text-sm bg-card text-foreground resize-none outline-none placeholder:text-muted-foreground min-h-[80px]"
                        placeholder="Write a note about what you just learned..."
                      />
                      <div className="px-4 py-2 bg-muted/20 border-t border-border flex justify-end">
                        <Button size="sm" variant="outline" className="text-xs h-7">Save Note</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* DOWNLOADS */}
                <TabsContent value="downloads" className="mt-0 focus-visible:outline-none">
                  <ul className="space-y-2">
                    {[
                      { name: 'Presentation_Slides.pdf', size: '2.4 MB', icon: <FileText className="w-4 h-4 text-red-500" /> },
                      { name: 'Source_Code.zip', size: '1.1 MB', icon: <Code2 className="w-4 h-4 text-blue-500" /> },
                    ].map((file, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {file.icon}
                          <span className="text-sm font-medium text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{file.size}</span>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

              </div>
            </Tabs>
          </div>
        </div>
      </LessonPlayerClient>
    </div>
  );
}
