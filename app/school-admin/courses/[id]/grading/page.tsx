"use client";

import { useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockCourses } from "@/lib/tenant-mock-data";
import { PageHeader } from "@/components/admin/page-header";
import { GradingWeightsForm } from "@/components/instructor/courses/GradingWeightsForm";

export default function SchoolAdminCourseGradingEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const course = useMemo(
    () => mockCourses.find((c) => c.id === id),
    [id]
  );

  if (!course) {
    notFound();
  }

  // Pre-load from mock API
  const initialCategories = [
    { name: "Forum Participation", points: 10 },
    { name: "Quizzes", points: 30 },
    { name: "Assignments", points: 60 }
  ];

  return (
    <div className="font-sans mx-auto max-w-4xl space-y-4 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/school-admin" },
            { label: "My Courses", href: "/school-admin/courses" },
            { label: course.title.length > 30 ? course.title.slice(0, 30) + "…" : course.title, href: `/school-admin/courses/${course.id}` },
            { label: "Edit Grading" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Grading Setup"
          description={`Configure the grading weighting for ${course.code}. Total marks must equal 100.`}
        />
      </div>

      <GradingWeightsForm 
        course={course as any} 
        initialCategories={initialCategories} 
        onSuccess={() => {/* Toast handles feedback, stay on page per spec */}}
        onCancel={() => router.push(`/school-admin/courses/${course.id}`)}
      />
    </div>
  );
}
