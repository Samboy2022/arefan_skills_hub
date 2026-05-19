"use client";

import { use } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { useRouter } from "next/navigation";
import { CourseForm } from "@/components/instructor/courses/CourseForm";
import { mockCourses } from "@/lib/tenant-mock-data";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="font-sans space-y-6 max-w-4xl mx-auto pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Courses", href: "/school-admin/courses" },
          { label: course.title, href: `/school-admin/courses/${id}` },
          { label: "Edit Settings" }
        ]}
      />

      <div className="pt-2">
        <PageHeader
          title="Edit Course Settings"
          description={`Update information for ${course.code} - ${course.title}.`}
        />
      </div>

      <CourseForm 
        mode="edit" 
        course={course}
        onSuccess={() => router.push(`/school-admin/courses/${id}`)}
        onCancel={() => router.push(`/school-admin/courses/${id}`)}
      />
    </div>
  );
}
