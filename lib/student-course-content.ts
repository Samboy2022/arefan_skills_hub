import { STUDENT_COURSES } from "@/lib/student-mock-data";

export type CurriculumLesson = {
  id: number;
  title: string;
  duration_minutes: number;
  content_type: string;
  is_preview?: boolean;
  resource_id?: string;
};

export type CurriculumSection = {
  id: number;
  title: string;
  description?: string;
  lessons_count: number;
  duration_minutes: number;
  is_locked?: boolean;
  lessons: CurriculumLesson[];
};

/**
 * Shared demo curriculum used by both the course detail page and the
 * lesson player, so lesson links always open the lesson they describe.
 */
export const COURSE_CURRICULUM: CurriculumSection[] = [
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
      { id: 11, title: 'Module Quiz: Design Fundamentals', duration_minutes: 30, content_type: 'quiz', resource_id: 'quiz2' },
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
      { id: 16, title: 'Assignment: Redesign a Real App', duration_minutes: 20, content_type: 'assignment', resource_id: 'assign2' },
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
];

export const CURRICULUM_LESSON_COUNT = COURSE_CURRICULUM.reduce((n, s) => n + s.lessons.length, 0);
export const CURRICULUM_TOTAL_MINUTES = COURSE_CURRICULUM.reduce(
  (n, s) => n + s.lessons.reduce((m, l) => m + l.duration_minutes, 0),
  0
);

/** Destination for a curriculum quiz or assignment. Other lesson types stay on the player. */
export function curriculumItemHref(lesson: CurriculumLesson, courseId: string) {
  if (lesson.content_type === "quiz") {
    return lesson.resource_id ? `/student/quizzes/${lesson.resource_id}` : "/student/quizzes";
  }
  if (lesson.content_type === "assignment") {
    return lesson.resource_id ? `/student/assignments/${lesson.resource_id}` : "/student/assignments";
  }
  return `/student/courses/${courseId}/lessons/${lesson.id}`;
}

/** Finds a lesson (and its section) in the shared curriculum. */
export function findCurriculumLesson(lessonId: number) {
  for (const section of COURSE_CURRICULUM) {
    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, section };
  }
  return null;
}

/** The student's enrolment record for a course id, if they are enrolled. */
export function getEnrolledCourse(id: string) {
  return STUDENT_COURSES.find((c) => c.id === id) ?? null;
}
