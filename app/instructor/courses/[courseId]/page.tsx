import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  FilePenLine,
  Users,
  BookOpen,
  LayoutList,
} from "lucide-react";
import { PageHeader } from "@/components/student/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default async function InstructorCourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = MOCK_INSTRUCTOR_COURSES.find((c) => c.id === courseId);
  if (!course) notFound();

  const editHref = `/instructor/courses/${course.id}/edit`;
  const contentHref = `/instructor/lessons?courseId=${encodeURIComponent(course.id)}`;

  return (
    <div className="font-sans space-y-8">
      <div>
        <Link
          href="/instructor/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>
      </div>

      <PageHeader
        title={course.title}
        description={`${course.code} · ${course.semester} · ${course.credits} credits`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={editHref}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit course
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={contentHref}>
                <FilePenLine className="mr-2 h-4 w-4" />
                Edit content
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-border shadow-none lg:col-span-2">
          <div className="relative aspect-[21/9] w-full bg-muted">
            <Image
              src={course.thumbnail}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="pt-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Catalog description
            </h2>
            <p className="text-[15px] leading-relaxed text-foreground">
              {course.description}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Section details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{course.status}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Enrollment</span>
                <span className="font-medium tabular-nums">
                  {course.enrollmentCount} / {course.maxStudents}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-medium">{course.credits}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href={contentHref}>
                  <LayoutList className="mr-2 h-4 w-4" />
                  Lessons &amp; materials
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/instructor/curriculum">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Curriculum builder
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/instructor/students">
                  <Users className="mr-2 h-4 w-4" />
                  Class roster
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
