import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, BookOpen, Users, Globe, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CourseHero } from '@/components/student/courses/CourseHero';
import { CourseCurriculum } from '@/components/student/courses/CourseCurriculum';
import { CourseDetailsTabs } from '@/components/student/courses/CourseDetailsTabs';
import { EnrollmentCard } from '@/components/student/courses/EnrollmentCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';

// Simulated fetch function
async function fetchCourse(id: string) {
  return {
    id,
    title: 'Advanced Full-Stack Web Development',
    short_description: 'Master React, Next.js, Node.js, and PostgreSQL by building real-world applications.',
    description: '<p>This comprehensive course takes you from basics to advanced patterns in modern web development. You will learn how to build scalable, production-ready applications focusing on best practices.</p><p>By the end of this course, you will be able to structure complex UI components, manage state effectively, and connect seamlessly to backend services.</p>',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    rating: 4.8,
    reviews_count: 1245,
    enrolled_students_count: 8540,
    updated_at: new Date().toISOString(),
    category: { name: 'Computer Science' },
    level: 'intermediate',
    language: 'english',
    duration_hours: 42,
    lessons_count: 156,
    is_certificate_enabled: true,
    user_progress: 15, // Simulate a user who has started
    first_lesson_id: 1,
    last_accessed_lesson_id: 5,
    instructor: {
      name: 'Sarah Drasner',
      profile_photo_url: '',
      bio: 'Staff Developer Advocate, engineering manager, and author.',
    },
    learning_outcomes: [
      'Build full-stack applications with Next.js App Router',
      'Design RESTful APIs and GraphQL endpoints',
      'Implement authentication and authorization',
      'Deploy applications to Vercel and AWS',
    ],
    curriculum: [
      {
        id: 1,
        title: 'Introduction to Modern Web',
        description: 'A comprehensive onboarding to the tools, workflows, and fundamental concepts that power modern web applications.',
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
        title: 'React Fundamentals Deep Dive',
        description: 'Master component-driven architecture, advanced state management, and modern React rendering patterns.',
        lessons_count: 4,
        duration_minutes: 120,
        is_locked: false,
        lessons: [
          { id: 4, title: 'Understanding Hooks', duration_minutes: 30, content_type: 'video' },
          { id: 5, title: 'Custom Hooks Pattern', duration_minutes: 25, content_type: 'video' },
          { id: 6, title: 'State Management Exercise', duration_minutes: 45, content_type: 'assignment' },
          { id: 7, title: 'React Performance Notes', duration_minutes: 20, content_type: 'document' },
        ],
      }
    ],
    reviews: [
      { id: 1, author: 'Jane Doe', rating: 5, comment: 'Phenomenal depth! The backend modules fully prepared me for my new job.', date: '2025-10-14' },
      { id: 2, author: 'Alex Turner', rating: 4, comment: 'Great structure, though I wish the React testing section was slightly longer.', date: '2025-11-02' }
    ]
  };
}

export const metadata: Metadata = {
  title: 'Course Details | Student Portal',
};

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await fetchCourse(resolvedParams.id);
  
  if (!course) {
    notFound();
  }
  
  // Assume enrolled for student view
  const isEnrolled = true;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto w-full px-3 md:px-6 pt-4 md:pt-6">
        <Breadcrumb 
          items={[
            { label: "My Courses", href: "/student/courses" },
            { label: course.title }
          ]}
          className="mb-4"
        />
      </div>
      
      {/* Full-width Hero Banner */}
      <CourseHero 
        course={course} 
        isEnrolled={isEnrolled}
      />
      
      {/* Constrained layout for content */}
      <div className="max-w-6xl mx-auto w-full px-3 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-2">
            <CourseDetailsTabs course={course} isEnrolled={isEnrolled} />
          </div>
          
          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Action / Resume Card */}
              <EnrollmentCard 
                course={course} 
                isEnrolled={isEnrolled}
              />
              
              {/* Course Meta Info Card */}
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


                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
