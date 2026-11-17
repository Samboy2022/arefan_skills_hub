import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonPlayerClient } from '@/components/student/courses/LessonPlayerClient';
import { VideoPlayer } from '@/components/student/courses/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2, Download, FileText, Code2, MessageSquare,
  ThumbsUp, Clock, Play, HelpCircle, Star, BookOpen, FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { COURSE_CURRICULUM, curriculumItemHref, findCurriculumLesson, getEnrolledCourse } from '@/lib/student-course-content';

// ── Data Fetchers ─────────────────────────────────────────────────────────────
async function fetchCourse(id: string) {
  const enrolled = getEnrolledCourse(id);
  return {
    id,
    title: enrolled?.name ?? 'Advanced Full-Stack Web Development',
    user_progress: enrolled?.progress ?? 15,
    curriculum: COURSE_CURRICULUM,
  };
}

async function fetchLesson(lessonId: string) {
  const id = parseInt(lessonId);
  const found = findCurriculumLesson(id);
  if (!found) return null;
  const { lesson, section } = found;
  return {
    id,
    title: lesson.title,
    description: 'A comprehensive introduction to the core concepts covered in this lesson. Watch the video carefully and follow along with the materials provided below.',
    video_id: 'vid_12345',
    content_type: lesson.content_type,
    duration_minutes: lesson.duration_minutes,
    section_title: section.title,
    likes: 142,
    rating: 4.8,
  };
}

export const metadata: Metadata = {
  title: 'Lesson Player | Arefan Skills Hub',
};

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const [course, lesson] = await Promise.all([fetchCourse(id), fetchLesson(lessonId)]);

  if (!course || !lesson) notFound();

  const section = findCurriculumLesson(lesson.id)?.section;
  const moduleShortcuts = (section?.lessons ?? []).filter(
    (item) =>
      (item.content_type === 'quiz' || item.content_type === 'assignment') &&
      item.id !== lesson.id
  );

  return (
    <LessonPlayerClient
      course={course}
      currentLessonId={lesson.id}
      currentLesson={lesson}
    >
      {/* ── Main Content Scroll Area ── */}
      <div className="flex flex-col w-full min-w-0 bg-background">

        {/* Video Player — full width, no aspect-ratio shrinkage */}
        <div className="w-full bg-black flex-shrink-0 relative" style={{ aspectRatio: '16/9', maxHeight: '65dvh' }}>
          <VideoPlayer lesson={lesson} />
        </div>

        {/* ── Lesson Meta Bar ── */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-5 flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {lesson.section_title ?? 'Module'}
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug">
              {lesson.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {lesson.duration_minutes} min
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Play className="h-3.5 w-3.5 fill-current" />
                {lesson.content_type}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                {lesson.rating}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                {lesson.likes} found helpful
              </span>
            </div>
          </div>
          {moduleShortcuts.length > 0 ? (
            <div className="flex w-full flex-wrap gap-2">
              {moduleShortcuts.map((item) => {
                const isQuiz = item.content_type === 'quiz';
                return (
                  <Button key={item.id} variant="outline" size="sm" asChild>
                    <Link href={curriculumItemHref(item, id)}>
                      {isQuiz ? <HelpCircle className="h-4 w-4 text-purple-500" /> : <FileCheck className="h-4 w-4 text-amber-500" />}
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* ── Tabs ── */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full h-auto rounded-none border-b border-border grid grid-cols-4 sm:flex sm:justify-start gap-0 p-0 bg-transparent">
              {[
                { value: 'overview', label: 'Overview', icon: <BookOpen className="h-3.5 w-3.5" /> },
                { value: 'qa', label: 'Q & A', icon: <MessageSquare className="h-3.5 w-3.5" /> },
                { value: 'notes', label: 'Notes', icon: <FileText className="h-3.5 w-3.5" /> },
                { value: 'downloads', label: 'Files (2)', icon: <Download className="h-3.5 w-3.5" /> },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-auto rounded-none border-0 border-b-2 border-transparent shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-primary min-h-11 px-2 sm:px-5 py-3 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-w-3xl py-6">

              {/* OVERVIEW */}
              <TabsContent value="overview" className="mt-0 space-y-5 focus-visible:outline-none">
                <p className="text-sm text-muted-foreground leading-relaxed">{lesson.description}</p>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> What you&apos;ll learn in this lesson
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'How color theory affects emotional perception in design',
                      'Primary, secondary, and tertiary color relationships',
                      'Building a harmonious palette for your project',
                      'Common pitfalls in color usage — and how to fix them',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor note */}
                <div className="border-l-2 border-border pl-4 py-1">
                  <p className="text-xs font-medium text-foreground mb-2">Instructor Note</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pause the video whenever you want to try a colour palette yourself. Using the exercise file (in Downloads) will help reinforce the concepts significantly.
                  </p>
                </div>
              </TabsContent>

              {/* Q&A */}
              <TabsContent value="qa" className="mt-0 focus-visible:outline-none">
                <div className="space-y-3">
                  {[
                    { author: 'Jordan Lee', time: '2 days ago', question: 'Can we use this technique with TypeScript generics?', likes: 4, answered: true },
                    { author: 'Mia Chen', time: '5 days ago', question: 'What is the difference between this approach and the older method shown in Module 1?', likes: 2, answered: false },
                    { author: 'Kwame Asante', time: '1 week ago', question: 'Does this principle also apply to dark mode colour palettes?', likes: 7, answered: true },
                  ].map((q, i) => (
                    <div key={i} className="border-b border-border py-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                            {q.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{q.author}</p>
                            <p className="text-[11px] text-muted-foreground">{q.time}</p>
                          </div>
                        </div>
                        {q.answered && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 shrink-0">
                            Answered
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground mb-3 leading-relaxed">{q.question}</p>
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
                  <div className="border border-dashed border-border rounded-lg p-5 text-center bg-muted/10">
                    <HelpCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Have a question about this lesson?</p>
                    <Button size="sm" className="gap-1.5 rounded-full px-4">
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
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                        <Clock className="h-3 w-3" /> at 3:45 · Added yesterday
                      </span>
                      <button className="text-[11px] text-muted-foreground hover:text-primary transition-colors">Edit</button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      Remember to always declare variables with <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">const</code> first, then switch to <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">let</code> only if re-assignment is needed. Avoids accidental mutation bugs.
                    </p>
                  </div>

                  {/* New note textarea */}
                  <div className="border border-border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                    <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">Add a note at current timestamp</p>
                    </div>
                    <textarea
                      className="w-full px-4 py-3 text-sm bg-card text-foreground resize-none outline-none placeholder:text-muted-foreground min-h-[90px]"
                      aria-label="Lesson note" placeholder="Write a note about what you just learned…"
                    />
                    <div className="px-4 py-2 bg-muted/20 border-t border-border flex justify-end">
                      <Button size="sm" className="text-xs h-7 gap-1.5 rounded-full px-3">
                        <FileText className="h-3 w-3" /> Save Note
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DOWNLOADS */}
              <TabsContent value="downloads" className="mt-0 focus-visible:outline-none">
                <ul className="space-y-2">
                  {[
                    { name: 'Colour_Theory_Slides.pdf', size: '2.4 MB', icon: <FileText className="w-4 h-4 text-red-500" />, desc: 'Presentation slides used in this lesson' },
                    { name: 'Exercise_Palette_Files.zip', size: '1.1 MB', icon: <Code2 className="w-4 h-4 text-blue-500" />, desc: 'Figma source files & exercise starters' },
                  ].map((file, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-border group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-md bg-muted/40 group-hover:bg-muted/80 transition-colors shrink-0">
                          {file.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-foreground block truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{file.desc} · {file.size}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 h-10 text-xs shrink-0 shadow-none">
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
  );
}
