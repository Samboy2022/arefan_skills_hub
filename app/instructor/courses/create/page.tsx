"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { useRouter } from "next/navigation";
import { CourseForm } from "@/components/instructor/courses/CourseForm";

export default function CreateCoursePage() {
  const router = useRouter();

  return (
    <div className="font-sans space-y-6 max-w-4xl mx-auto pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses", href: "/instructor/courses" },
          { label: "Create Course" }
        ]}
      />

      <div className="pt-2">
        <PageHeader
          title="Create New Course"
          description="Enter the basic information about your new course."
        />
      </div>

      <CourseForm 
        mode="create" 
        onSuccess={(courseId) => router.push(`/instructor/courses/${courseId}`)}
        onCancel={() => router.push("/instructor/courses")}
      />
    </div>
  );
}
