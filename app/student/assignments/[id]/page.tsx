"use client";

import { use } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignment = STUDENT_ASSIGNMENTS.find(a => a.id === id);
  const course = STUDENT_COURSES.find(c => c.id === assignment?.course_id);

  if (!assignment) {
    return <div className="p-8 text-center">Assignment not found</div>;
  }

  const isPending = assignment.status === "pending";
  const isGraded = assignment.status === "graded" || assignment.status === "late";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/student/assignments" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Link>
      </div>

      <PageHeader
        title={assignment.title}
        description={course?.name || "Course Assignment"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Instructions & Submission */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border shadow-none rounded-md bg-card">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{assignment.description}</p>
              <p className="mt-4">
                Please follow the guidelines provided in the course syllabus for formatting and citations. 
                Ensure your submission is in PDF or ZIP format as specified by your instructor.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border font-medium">
              <h4 className="text-sm mb-3 text-foreground">Reference Materials</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-8 shadow-none border-border">
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  Guidelines.pdf
                </Button>
                <Button variant="outline" size="sm" className="h-8 shadow-none border-border">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Reading Material
                </Button>
              </div>
            </div>
          </Card>

          {isPending ? (
            <Card className="p-8 border-dashed border-2 border-border shadow-none rounded-md bg-card flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary border border-primary/20">
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upload Your Submission</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  Drag and drop your files here, or click to browse. Supported formats: .pdf, .docx, .zip
                </p>
              </div>
              <Button className="px-8 shadow-none">Choose Files</Button>
            </Card>
          ) : (
            <Card className="p-6 border border-border shadow-none rounded-md bg-card">
              <h3 className="text-lg font-semibold mb-4">Your Submission</h3>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-md border border-border shadow-none">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submission_v1.pdf</p>
                    <p className="text-xs text-muted-foreground">Submitted on {assignment.submission_date ? format(new Date(assignment.submission_date), 'MMM dd, yyyy') : "N/A"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {assignment.feedback && (
                <div className="mt-6 p-4 bg-muted/30 rounded-md border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Instructor Feedback</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Status & Info */}
        <div className="space-y-6">
          <Card className="p-6 overflow-hidden relative border border-border shadow-none rounded-md bg-card">
            <div className={cn("absolute top-0 left-0 w-1 h-full", 
               assignment.status === 'graded' ? "bg-green-500" : 
               assignment.status === 'pending' ? "bg-amber-500" : "bg-primary"
            )} />
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Submission Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-semibold text-foreground">
                {assignment.status === 'graded' ? <CheckCircle className="h-5 w-5 text-green-500" /> : 
                 assignment.status === 'pending' ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                 <Clock className="h-5 w-5 text-primary" />}
                <span className="capitalize">{assignment.status.replace('_', ' ')}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium">{format(new Date(assignment.due_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Points</span>
                  <span className="font-medium">{assignment.total_points}</span>
                </div>
                {isGraded && (
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Grade</span>
                    <span className="font-bold text-green-600 dark:text-green-500">{assignment.points_earned} / {assignment.total_points}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30 border-dashed border-border shadow-none rounded-md">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Grading Criteria</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex justify-between">
                <span>Code Correctness</span>
                <span className="font-medium text-foreground">40%</span>
              </li>
              <li className="flex justify-between">
                <span>Documentation</span>
                <span className="font-medium text-foreground">30%</span>
              </li>
              <li className="flex justify-between">
                <span>Optimization</span>
                <span className="font-medium text-foreground">20%</span>
              </li>
              <li className="flex justify-between">
                <span>Style</span>
                <span className="font-medium text-foreground">10%</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
