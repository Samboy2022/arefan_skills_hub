"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { CourseMetadataForm } from "@/components/school-admin/course-metadata-form";
import {
  loadCourses,
  loadFaculty,
  saveCourse,
  type CourseMetadataInput,
} from "@/lib/school-admin-courses";
import type { Faculty } from "@/lib/tenant-types";

export default function CreateCoursePage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFaculty(loadFaculty());
    loadCourses();
    setReady(true);
  }, []);

  const handleSubmit = (input: CourseMetadataInput) => {
    const courses = loadCourses();
    const currentFaculty = loadFaculty();
    saveCourse(courses, currentFaculty, input);
    router.push("/school-admin/courses");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Courses", href: "/school-admin/courses" },
          { label: "Create course" },
        ]}
      />
      <PageHeader
        title="Create course"
        description="Add the course record and assign instructors. This does not add lessons."
      />
      {ready ? (
        <CourseMetadataForm
          faculty={faculty}
          submitLabel="Create course"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/school-admin/courses")}
        />
      ) : null}
    </div>
  );
}
