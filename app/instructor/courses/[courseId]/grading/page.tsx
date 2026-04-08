"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { PageHeader } from "@/components/instructor/page-header";

export default function InstructorCourseGradingEditPage() {
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

  const [forumMarks, setForumMarks] = useState<number>(10);
  const [quizMarks, setQuizMarks] = useState<number>(30);
  const [assignmentMarks, setAssignmentMarks] = useState<number>(60);

  const totalMarks = forumMarks + quizMarks + assignmentMarks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalMarks !== 100) {
      alert("Total marks must equal 100.");
      return;
    }
    
    console.log({
      forum: forumMarks,
      quiz: quizMarks,
      assignment: assignmentMarks,
    });
    
    alert("Grading breakdown updated successfully!");
    router.push(`/instructor/courses/${course.id}`);
  };

  return (
    <div className="font-sans mx-auto max-w-4xl space-y-4 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "My Courses", href: "/instructor/courses" },
            { label: course.title, href: `/instructor/courses/${course.id}` },
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

      <form onSubmit={handleSubmit}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Mark Breakdown</CardTitle>
            <CardDescription>Assign the point weight to different activities in your course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="forumMarks">Forum Contribution (pts)</Label>
                <Input 
                  id="forumMarks" 
                  type="number"
                  min={0}
                  max={100}
                  value={forumMarks}
                  onChange={(e) => setForumMarks(parseInt(e.target.value) || 0)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quizMarks">Quizzes (pts)</Label>
                <Input 
                  id="quizMarks" 
                  type="number"
                  min={0}
                  max={100}
                  value={quizMarks}
                  onChange={(e) => setQuizMarks(parseInt(e.target.value) || 0)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignmentMarks">Assignments (pts)</Label>
                <Input 
                  id="assignmentMarks" 
                  type="number"
                  min={0}
                  max={100}
                  value={assignmentMarks}
                  onChange={(e) => setAssignmentMarks(parseInt(e.target.value) || 0)}
                  required 
                />
              </div>
            </div>

            <div className={`p-4 rounded border ${totalMarks === 100 ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span>Total Marks:</span>
                <span>{totalMarks} / 100 pts</span>
              </div>
              {totalMarks !== 100 && (
                <p className="text-sm mt-1 text-red-500 font-medium">Wait! Your marks must perfectly total 100 points to save.</p>
              )}
            </div>

          </CardContent>
          <CardFooter className="flex flex-wrap justify-end gap-2 border-t pt-6">
            <Button type="button" variant="outline" asChild>
              <Link href={`/instructor/courses/${course.id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={totalMarks !== 100} className="px-8">
              <Save className="w-4 h-4 mr-2" />
              Save Grading
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
