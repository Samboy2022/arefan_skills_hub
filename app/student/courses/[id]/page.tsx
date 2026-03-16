import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, BookOpen, Users, BarChart, Globe, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CourseHero } from '@/components/student/courses/CourseHero';
import { CourseCurriculum } from '@/components/student/courses/CourseCurriculum';
import { EnrollmentCard } from '@/components/student/courses/EnrollmentCard';

// Simulated fetch function
async function fetchCourse(id: string) {
  // In a real app, this would fetch from an API or database
  return {
    id,
    title: 'Advanced Full-Stack Web Development',
    short_description: 'Master React, Next.js, Node.js, and PostgreSQL by building real-world applications.',
    description: '<p>This comprehensive course takes you from basics to advanced patterns in modern web development. You will learn how to build scalable, production-ready applications...</p>',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    rating: 4.8,
    reviews_count: 1245,
    enrolled_students_count: 8540,
    updated_at: new Date().toISOString(),
    category: { name: 'Programming' },
    level: 'intermediate',
    language: 'english',
    duration_hours: 42,
    lessons_count: 156,
    is_certificate_enabled: true,
    price: 49900,
    currency: '₦',
    original_price: 99900,
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
  
  // Hardcode enrollment status for demonstration
  const isEnrolled = true;
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Course Hero Section */}
      <CourseHero 
        course={course} 
        isEnrolled={isEnrolled}
      />
      
      {/* Course Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Overview */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-2xl font-bold">What You'll Learn</h2>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learning_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Course Description */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-bold">About This Course</h2>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </CardContent>
          </Card>
          
          {/* Course Curriculum */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-bold">Course Curriculum</h2>
            </CardHeader>
            <CardContent>
              <CourseCurriculum 
                course={course} 
                isEnrolled={isEnrolled}
                curriculum={course.curriculum}
              />
            </CardContent>
          </Card>
          
          {/* Instructor Info */}
          <Card className="border-0 shadow-sm bg-blue-50/50">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Your Instructor</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{course.instructor.name}</h3>
                  <p className="text-gray-600 mt-1">{course.instructor.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Enrollment Card */}
            <EnrollmentCard 
              course={course} 
              isEnrolled={isEnrolled}
            />
            
            {/* Course Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <h3 className="font-bold text-lg">Course Info</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-900">{course.duration_hours} hours</span>
                  <span className="text-gray-500 ml-1">total length</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <BookOpen className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-900">{course.lessons_count}</span>
                  <span className="text-gray-500 ml-1">lessons</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-900">{course.enrolled_students_count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">students</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <BarChart className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="capitalize font-medium text-gray-900">{course.level}</span>
                  <span className="text-gray-500 ml-1">level</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="capitalize font-medium text-gray-900">{course.language}</span>
                </div>
                {course.is_certificate_enabled && (
                  <div className="flex items-center text-gray-700">
                    <Award className="w-5 h-5 mr-3 text-emerald-500" />
                    <span className="font-medium text-gray-900">Certificate of completion</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
