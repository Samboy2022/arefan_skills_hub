import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, BookOpen, Users, Globe, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CourseHero } from '@/components/student/courses/CourseHero';
import { CourseDetailsTabs } from '@/components/student/courses/CourseDetailsTabs';
import { EnrollmentCard } from '@/components/student/courses/EnrollmentCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  COURSE_CURRICULUM,
  CURRICULUM_LESSON_COUNT,
  CURRICULUM_TOTAL_MINUTES,
  getEnrolledCourse,
} from '@/lib/student-course-content';

// Simulated fetch function
async function fetchCourse(id: string) {
  const enrolled = getEnrolledCourse(id);
  return {
    id,
    title: enrolled?.name ?? 'Advanced Full-Stack Web Development',
    short_description: 'Learn the principles of good design, build responsive websites in Webflow, and turn your skills into freelance work.',
    description: '<p>This course takes you from design fundamentals to publishing production-ready websites. You will learn colour, typography, layout and design systems, then put them into practice in Figma and Webflow.</p><p>By the end of the course you will be able to design and build polished sites, use the Webflow CMS and interactions, and price and pitch your work to real clients.</p>',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    rating: 4.8,
    reviews_count: 1245,
    enrolled_students_count: 8540,
    updated_at: new Date().toISOString(),
    category: { name: enrolled?.code ?? 'Computer Science' },
    level: 'intermediate',
    language: 'english',
    duration_hours: Math.round(CURRICULUM_TOTAL_MINUTES / 60),
    lessons_count: CURRICULUM_LESSON_COUNT,
    is_certificate_enabled: true,
    user_progress: enrolled?.progress ?? 15,
    first_lesson_id: 1,
    last_accessed_lesson_id: 5,
    instructor: {
      name: enrolled?.instructor ?? 'Sarah Drasner',
      profile_photo_url: enrolled?.instructor_avatar ?? '',
      bio: 'Staff Developer Advocate, engineering manager, and author.',
    },
    learning_outcomes: [
      'Apply colour theory, typography and visual hierarchy with confidence',
      'Design wireframes and high-fidelity prototypes in Figma',
      'Build responsive, CMS-driven websites in Webflow',
      'Find clients, price your services and write winning proposals',
    ],
    curriculum: COURSE_CURRICULUM,
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
    <div className="flex w-full flex-col space-y-6 pb-12">
      <Breadcrumb 
        items={[
          { label: "My Courses", href: "/student/courses" },
          { label: course.title }
        ]}
      />
      
      <CourseHero 
        course={course} 
        isEnrolled={isEnrolled}
      />
      
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-2">
            <CourseDetailsTabs course={course} isEnrolled={isEnrolled} />
          </div>
          
          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-6">
              
              {/* Action / Resume Card */}
              <EnrollmentCard 
                course={course} 
                isEnrolled={isEnrolled}
              />
              
              {/* Course Meta Info Card */}
              <Card className="relative gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-none">
                <CardHeader className="relative z-10 flex flex-row items-center justify-between gap-2 border-b border-border px-5 py-4">
                  <h3 className="font-semibold text-foreground">Course Info</h3>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 px-5 py-5">
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
                    <Star className="w-4 h-4 mr-3 text-amber-500 fill-amber-500" />
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
