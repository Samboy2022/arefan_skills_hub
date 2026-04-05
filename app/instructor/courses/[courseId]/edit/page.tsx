"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";

export default function InstructorCourseEditPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const course = useMemo(
    () => MOCK_INSTRUCTOR_COURSES.find((c) => c.id === courseId),
    [courseId]
  );

  if (!course) {
    notFound();
  }

  const [description, setDescription] = useState(course.description || "");
  const viewHref = `/instructor/courses/${course.id}`;

  return (
    <div className="font-sans mx-auto max-w-6xl space-y-4">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Courses", href: "/instructor/courses" },
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
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course title</Label>
                <Input id="title" name="title" defaultValue={course.title} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Catalog code</Label>
                  <Input id="code" name="code" defaultValue={course.code} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Term</Label>
                  <Input
                    id="semester"
                    name="semester"
                    defaultValue={course.semester}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="credits">Credit hours</Label>
                  <Input
                    id="credits"
                    name="credits"
                    type="number"
                    min={1}
                    max={12}
                    defaultValue={course.credits}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Enrollment cap</Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    min={1}
                    defaultValue={course.maxStudents}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="mt-2 text-foreground">
                  <ForumRichEditor
                    content={description}
                    onChange={setDescription}
                    placeholder="Provide a comprehensive course description..."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2 border-t pt-6">
              <Button variant="outline" asChild>
                <Link href={viewHref}>Cancel</Link>
              </Button>
              <Button
                type="button"
                className="px-8"
                onClick={() => {
                  window.alert(
                    "Demo only: connect this form to your API to persist course updates."
                  );
                }}
              >
                Save changes
              </Button>
            </CardFooter>
          </Card>

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
                <strong className="text-foreground block mb-1">Enrollment Limits</strong>
                Setting an enrollment cap ensures you can provide adequate attention to each student. Discuss with your department if you need to increase this later.
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
