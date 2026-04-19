"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { CourseForm } from "@/components/instructor/courses/CourseForm";

export default function InstructorCourseEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const course = useMemo(
    () => MOCK_INSTRUCTOR_COURSES.find((c) => c.id === courseId),
    [courseId]
  );

  if (!course) {
    notFound();
  }

  const viewHref = `/instructor/courses/${course.id}`;

  return (
    <div className="font-sans mx-auto max-w-6xl space-y-4 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "My Courses", href: "/instructor/courses" },
            { label: course.title, href: viewHref },
            { label: "Edit Details" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Edit course details"
          description={`Update catalog data for ${course.code}. Make sure your description is detailed and clear.`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CourseForm 
            mode="edit" 
            course={course} 
            onSuccess={() => router.push(viewHref)}
            onCancel={() => router.push(viewHref)}
          />

          <p className="text-center text-sm text-muted-foreground mt-4">
            Want to manage curriculum instead? Content editing opens from{" "}
            <Link
              href={`/instructor/lessons?courseId=${encodeURIComponent(course.id)}`}
              className="font-medium text-primary hover:underline underline-offset-2"
            >
              Lessons &amp; content
            </Link>{" "}
            or the course overview.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/30 border-primary/10 shadow-sm sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tips for a Great Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <strong className="text-foreground block mb-1">Clear Titles</strong>
                Make sure your course title is catchy yet descriptive. Avoid overly complex jargon.
              </div>
              <div>
                <strong className="text-foreground block mb-1">Engaging Description</strong>
                Use the rich text editor to break up long paragraphs. Use bullet points for prerequisites and bold text for key learning outcomes.
              </div>
              <div>
                <strong className="text-foreground block mb-1">Upload Visuals</strong>
                A compelling cover image dramatically increases interest. Keep it clean and high-quality.
              </div>
              <div className="pt-4 border-t border-border mt-4">
                Need more help? Check out our <a href="#" className="text-primary hover:underline">Instructor Guide</a> for best practices on course creation.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
