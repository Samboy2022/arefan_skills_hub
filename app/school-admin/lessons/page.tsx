import { notFound } from "next/navigation";
import { mockCourses } from "@/lib/tenant-mock-data";
import { CurriculumBuilder, Module } from "@/components/instructor/builder/CurriculumBuilder";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function SchoolAdminCurriculumPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const courseId = resolvedParams.courseId;

  if (!courseId) {
    notFound();
  }

  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  // Pre-process mock course data into the uniform struct expected by the builder
  // Based on your database schema notes, course -> modules -> lessons
  const initialModules: Module[] = [
    {
      id: "mod_1",
      courseId: course.id,
      title: "Introduction",
      description: "Basics of the subject",
      order: 1,
      lessons: [
        { id: "les_1", title: "Course Overview", lessonType: "video", order: 1 },
        { id: "les_2", title: "Getting Started Guide", lessonType: "pdf", order: 2 },
      ]
    },
    {
      id: "mod_2",
      courseId: course.id,
      title: "Core Concepts",
      description: "Dive deep into the patterns.",
      order: 2,
      lessons: [
        { id: "les_3", title: "Fundamentals", lessonType: "video", order: 1 },
        { id: "les_4", title: "Chapter 1 Test", lessonType: "quiz", order: 2 },
        { id: "les_5", title: "Final Assignment", lessonType: "assignment", order: 3 },
      ]
    }
  ];

  return (
    <div className="font-sans mx-auto max-w-6xl space-y-6 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/school-admin" },
            { label: "My Courses", href: "/school-admin/courses" },
            { label: course.title, href: `/school-admin/courses/${course.id}` },
            { label: "Curriculum Builder" }
          ]} 
        />
      </div>

      <div className="pt-2">
        <PageHeader
          title="Course Curriculum"
          description={`Manage modules and drag-and-drop lessons for ${course.code}.`}
        />
      </div>

      <CurriculumBuilder initialModules={initialModules} courseId={course.id} />
    </div>
  );
}
