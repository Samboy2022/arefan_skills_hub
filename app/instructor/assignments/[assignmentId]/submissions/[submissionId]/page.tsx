"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, FileText, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_ASSIGNMENTS, MOCK_STUDENTS } from "@/lib/instructor-mock-data";

export default function GradeSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId as string;
  const submissionId = params.submissionId as string;

  const assignment = useMemo(
    () => MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  );

  const submission = useMemo(
    () => assignment?.submissions?.find((s) => s.id === submissionId),
    [assignment, submissionId]
  );

  const student = useMemo(
    () => MOCK_STUDENTS.find((s) => s.id === submission?.studentId),
    [submission]
  );

  if (!assignment || !submission || !student) {
    notFound();
  }

  const [score, setScore] = useState<number | string>(submission.score ?? "");
  const [feedback, setFeedback] = useState(submission.feedback || "");

  const handleSaveGrade = () => {
    window.alert("Grade saved successfully! (Demo)");
    router.push(`/instructor/assignments/${assignmentId}/submissions`);
  };

  return (
    <div className="mx-auto max-w-7xl flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Assignments", href: "/instructor/assignments" },
            { label: assignment.title, href: `/instructor/assignments/${assignment.id}/submissions` },
            { label: `Grade ${student.name}` }
          ]} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-start">
        
        {/* Left Side: Student Submission Content */}
        <div className="lg:col-span-2 flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Submission Payload
            </h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Source
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-muted/10 min-h-[400px]">
            {/* Mock content rendering */}
            {assignment.type === 'file' ? (
              <div className="max-w-md text-center space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
                <h3 className="font-medium text-lg">solution_v2.pdf</h3>
                <p className="text-sm text-muted-foreground">PDF Document • 2.4 MB</p>
                <Button>Preview Document</Button>
              </div>
            ) : assignment.type === 'essay' ? (
              <div className="max-w-3xl self-start w-full bg-background p-8 rounded-lg border shadow-sm prose prose-sm dark:prose-invert">
                <h3>The Evolution of Computer Science</h3>
                <p>Computer science has evolved drastically over the last few decades. What started with simple mechanical calculators has transformed into a vast ecosystem of distributed computing, artificial intelligence, and quantum networks...</p>
                <p className="mt-4">[Student essay content renders here dynamically...]</p>
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                Content rendering for {assignment.type} is not supported in this demo.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Grading Sidebar */}
        <div className="flex flex-col h-full">
          <Card className="flex-1 flex flex-col h-full shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4 shrink-0">
              <CardTitle>Grading Panel</CardTitle>
              <CardDescription>Review and mark this student's work.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-6 pt-6">
              
              {/* Student Metadata Card */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback><User className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{student.name}</div>
                  <div className="text-sm text-accent-foreground">{student.email}</div>
                  <div className="text-xs mt-1 font-medium text-muted-foreground">
                    Submitted: {submission.submissionDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}
                  </div>
                </div>
              </div>

              {/* Grading Form */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground" htmlFor="score">Assigned Score</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="score"
                      type="number"
                      className="text-2xl h-14 font-bold w-28 text-center" 
                      value={score}
                      onChange={(e) => setScore(e.target.value ? Number(e.target.value) : "")}
                      min={0}
                      max={assignment.maxScore}
                    />
                    <span className="text-muted-foreground font-medium text-lg">/ {assignment.maxScore} Points</span>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-5">
                  <Label className="text-base font-semibold text-foreground" htmlFor="feedback">Instructor Feedback</Label>
                  <Textarea 
                    id="feedback"
                    placeholder="Provide constructive feedback for the student..."
                    className="min-h-[180px] resize-y"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This feedback will be visible directly to the student once published.
                  </p>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t p-4 shrink-0 bg-muted/10 gap-3">
              <Button variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
              <Button className="flex-1 gap-2" onClick={handleSaveGrade}>
                <CheckCircle className="h-4 w-4" />
                Publish Grade
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
