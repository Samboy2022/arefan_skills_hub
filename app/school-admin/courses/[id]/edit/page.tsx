"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { CourseMetadataForm } from "@/components/school-admin/course-metadata-form";
import {
  loadCourses,
  loadFaculty,
  saveCourse,
  type CourseMetadataInput,
  type SchoolAdminCourse,
} from "@/lib/school-admin-courses";
import type { Faculty } from "@/lib/tenant-types";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [course, setCourse] = useState<SchoolAdminCourse | null | undefined>(undefined);

  useEffect(() => {
    const nextFaculty = loadFaculty();
    setFaculty(nextFaculty);
    setCourse(loadCourses().find((item) => item.id === id) ?? null);
  }, [id]);

  const handleSubmit = (input: CourseMetadataInput) => {
    const courses = loadCourses();
    const currentFaculty = loadFaculty();
    saveCourse(courses, currentFaculty, input, id);
    router.push("/school-admin/courses");
  };

  if (course === undefined) {
    return <p className="text-sm text-muted-foreground">Loading course…</p>;
  }

  if (!course) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground">This course is not in the catalog.</p>
        <Link href="/school-admin/courses" className="text-sm font-medium text-primary hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Courses", href: "/school-admin/courses" },
          { label: "Edit course" },
        ]}
      />
      <PageHeader
        title="Edit course"
        description={`Update ${course.code} and its instructor assignments.`}
      />
      <CourseMetadataForm
        course={course}
        faculty={faculty}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/school-admin/courses")}
      />
    </div>
  );
}
