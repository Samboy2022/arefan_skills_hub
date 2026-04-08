import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2, Clock, BookOpen, Users, Globe, Star, MessageSquare, Pencil, LayoutList
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseHero } from "@/components/student/courses/CourseHero";
import { CourseDetailsTabs } from "@/components/student/courses/CourseDetailsTabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

interface CourseInstructor {
  name: string;
  profile_photo_url: string;
  bio: string;
}

interface CourseLesson {
  id: number;
  title: string;
  duration_minutes: number;
  content_type: string;
  is_preview?: boolean;
}

interface CurriculumSection {
  id: number;
  title: string;
  description: string;
  lessons_count: number;
  duration_minutes: number;
  is_locked?: boolean;
  lessons: CourseLesson[];
}

interface CourseReview {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface RichCourseData {
  id: string;
  title: string;
  short_description: string;
  description: string;
  thumbnail_url: string;
  rating: number;
  reviews_count: number;
  enrolled_students_count: number;
  updated_at: string;
  category: { name: string };
  level: string;
  language: string;
  duration_hours: number;
  lessons_count: number;
  is_certificate_enabled: boolean;
  user_progress: number;
  instructor: CourseInstructor;
  learning_outcomes: string[];
  curriculum: CurriculumSection[];
  reviews: CourseReview[];
}

// Helper function to bridge instructor mock data with the rich data expected by CourseHero/CourseDetailsTabs
async function getRichCourseData(courseId: string): Promise<RichCourseData | null> {
  const baseCourse = MOCK_INSTRUCTOR_COURSES.find((c) => c.id === courseId);
  if (!baseCourse) return null;

  // TODO: Replace mock generated data with real API data once backend integration is complete
  // TODO: Move hardcoded static values to configuration or database
  return {
    id: baseCourse.id,
    title: baseCourse.title,
    short_description: 'Master the principles and patterns of this subject through comprehensive materials.',
    description: baseCourse.description || '<p>This comprehensive course takes you from basics to advanced patterns. You will learn how to build scalable, production-ready concepts focusing on best practices.</p>',
    thumbnail_url: baseCourse.thumbnail,
    rating: 4.8,
    reviews_count: 1245,
    enrolled_students_count: baseCourse.enrollmentCount,
    updated_at: new Date().toISOString(),
    category: { name: 'Computer Science' },
    level: 'intermediate',
    language: 'english',
    duration_hours: 42,
    lessons_count: 156,
    is_certificate_enabled: true,
    user_progress: 0,
    instructor: {
      name: 'Instructor',
      profile_photo_url: '',
      bio: 'Professional instructor.',
    },
    learning_outcomes: [
      'Understand the core fundamentals and theories',
      'Design modern, effective solutions for common problems',
      'Implement structured workflows',
      'Deploy fully functional projects'
    ],
    curriculum: [
      {
        id: 1,
        title: 'Introduction to the Subject',
        description: 'A comprehensive onboarding to the tools, workflows, and fundamental concepts that power this field.',
        lessons_count: 3,
        duration_minutes: 45,
        lessons: [
          { id: 1, title: 'Course Overview', duration_minutes: 10, content_type: 'video', is_preview: true },
          { id: 2, title: 'Setting Up Your Environment', duration_minutes: 15, content_type: 'video', is_preview: true },
          { id: 3, title: 'Prerequisites Quiz', duration_minutes: 20, content_type: 'quiz' },
        ],
      },
      {
        id: 2,
        title: 'Deep Dive into Core Concepts',
        description: 'Master architecture, state management, and modern rendering patterns.',
        lessons_count: 4,
        duration_minutes: 120,
        is_locked: false,
        lessons: [
          { id: 4, title: 'Understanding Architectures', duration_minutes: 30, content_type: 'video' },
          { id: 5, title: 'Pattern Explanations', duration_minutes: 25, content_type: 'video' },
          { id: 6, title: 'Practical Exercise', duration_minutes: 45, content_type: 'assignment' },
          { id: 7, title: 'Performance Notes', duration_minutes: 20, content_type: 'document' },
        ],
      }
    ],
    reviews: [
      { id: 1, author: 'Jane Doe', rating: 5, comment: 'Phenomenal depth! The modules fully prepared me.', date: '2025-10-14' },
      { id: 2, author: 'Alex Turner', rating: 4, comment: 'Great structure, though I wish there was more practice.', date: '2025-11-02' }
    ]
  };
}

export default async function InstructorCourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getRichCourseData(courseId);
  
  if (!course) {
    notFound();
  }

  const editHref = `/instructor/courses/${course.id}/edit`;
  const contentHref = `/instructor/lessons?courseId=${encodeURIComponent(course.id)}`;
  const rosterHref = `/instructor/students?courseId=${encodeURIComponent(course.id)}`;
  const gradingEditHref = `/instructor/courses/${course.id}/grading`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-6">
        <Breadcrumb 
          items={[
            { label: "My Courses", href: "/instructor/courses" },
            { label: course.title }
          ]}
          className="mb-4"
        />
      </div>
      
      {/* Full-width Hero Banner */}
      <CourseHero 
        course={course} 
        isEnrolled={false} // Instructor doesn't enroll
      />
      
      {/* Constrained layout for content */}
      <div className="max-w-6xl mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-2">
            <CourseDetailsTabs course={course} isEnrolled={false} isInstructor={true} />
          </div>
          
          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Manage Course Card (Replaces EnrollmentCard) */}
              <Card className="border border-border shadow-md rounded-md bg-card overflow-hidden">
                <div className="h-2 w-full bg-primary" />
                <CardHeader className="pb-2">
                  <h3 className="font-bold text-lg text-foreground">Manage Course</h3>
                  <p className="text-sm text-muted-foreground">Administer details, content, and students.</p>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                  <Button className="w-full justify-start" size="lg" asChild>
                    <Link href={editHref}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Course Details
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                    <Link href={contentHref}>
                      <LayoutList className="mr-2 h-4 w-4" />
                      Edit Curriculum
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                    <Link href={rosterHref}>
                      <Users className="mr-2 h-4 w-4" />
                      Class Roster
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Course Meta Info Card with Edit Grading link */}
              <Card className="border border-border shadow-none rounded-md bg-card relative overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/50 px-6 pt-6 relative z-10">
                  <h3 className="font-semibold text-foreground">Course Info</h3>
                </CardHeader>
                <img src="https://img.icons8.com/color/96/info.png" className="absolute -right-2 top-2 h-16 w-16 opacity-10 pointer-events-none" alt="Info" />
                <CardContent className="space-y-4 px-6 py-5 relative z-10">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{course.duration_hours} hours</span>
                    <span className="text-muted-foreground ml-1">total length</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{course.lessons_count}</span>
                    <span className="text-muted-foreground ml-1">lessons</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-3 text-amber-500" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                    <span className="text-muted-foreground ml-1">({course.reviews_count.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{course.enrolled_students_count.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">students</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="capitalize font-medium text-foreground">{course.language}</span>
                  </div>

                  {/* Grading & Mark Breakdown with Edit capability */}
                  <div className="pt-4 border-t border-border group">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grading &amp; Breakdown</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" asChild>
                        <Link href={gradingEditHref} title="Edit Grading Marks">
                          <Pencil className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="py-2 text-muted-foreground flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-emerald-500" /> Forum
                          </td>
                          <td className="py-2 text-right font-medium text-foreground">10.00 pts</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" /> Quiz
                          </td>
                          <td className="py-2 text-right font-medium text-foreground">30.00 pts</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Assignment
                          </td>
                          <td className="py-2 text-right font-medium text-foreground">60.00 pts</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="pt-2 font-bold text-foreground">Total</td>
                          <td className="pt-2 font-bold text-right text-primary">100.00 pts</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
