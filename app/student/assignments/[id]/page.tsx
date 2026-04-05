"use client";

import { use } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle, Download, ExternalLink, Calendar, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "graded":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "submitted":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "late":
      return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "missing":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "graded":
      return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
    case "submitted":
      return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    case "pending":
      return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    case "late":
      return <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
    case "missing":
      return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: "Pending Submission",
    submitted: "Under Review",
    graded: "Graded",
    late: "Submitted Late",
    missing: "Missing",
  };
  return labels[status as keyof typeof labels] || status;
};

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignment = STUDENT_ASSIGNMENTS.find(a => a.id === id);
  const course = STUDENT_COURSES.find(c => c.id === assignment?.course_id);

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Assignment Not Found</h2>
        <p className="text-muted-foreground mb-4">The assignment you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/student/assignments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>
      </div>
    );
  }

  const isPending = assignment.status === "pending";
  const isGraded = assignment.status === "graded" || assignment.status === "late";
  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date() && isPending;

  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Assignments", href: "/student/assignments" },
          { label: assignment.title }
        ]}
        className="mb-6"
      />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {course?.code}
              </span>
              <span className="text-sm text-muted-foreground">
                {assignment.total_points} points
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {assignment.title}
            </h1>
            <p className="text-muted-foreground">
              {course?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(assignment.status)}
            <span className={cn("text-sm font-semibold px-3 py-1.5 rounded-full border", getStatusColor(assignment.status))}>
              {getStatusLabel(assignment.status)}
            </span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Due Date</p>
                <p className={cn("text-sm font-semibold", isOverdue ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                  {format(dueDate, 'MMM dd, yyyy')} at {format(dueDate, 'h:mm a')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Points</p>
                <p className="text-sm font-semibold text-foreground">
                  {isGraded && assignment.points_earned !== null 
                    ? `${assignment.points_earned} / ${assignment.total_points}`
                    : `${assignment.total_points} total`
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={course?.instructor_avatar} />
                <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                  {course?.instructor.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Instructor</p>
                <p className="text-sm font-semibold text-foreground">{course?.instructor}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Instructions & Submission */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          <Card className="p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Assignment Instructions
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed">{assignment.description}</p>
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Requirements:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Follow the guidelines provided in the course syllabus</li>
                  <li>• Ensure proper formatting and citations</li>
                  <li>• Submit in PDF or ZIP format as specified</li>
                  <li>• Include all required documentation</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Reference Materials</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="shadow-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Assignment Guidelines
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Reading Material
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Template Files
                </Button>
              </div>
            </div>
          </Card>

          {/* Submission Area */}
          {isPending ? (
            <Card className="border-2 border-dashed border-primary/30 shadow-sm">
              <div className="p-8 text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full text-primary border border-primary/20 inline-flex">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Submit Your Assignment</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                    Upload your completed assignment. Supported formats: PDF, DOCX, ZIP (max 10MB)
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="shadow-sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <Button variant="outline" className="shadow-sm">
                    Save as Draft
                  </Button>
                </div>
                {isOverdue && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                      ⚠️ This assignment is overdue. Late submissions may receive reduced points.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Your Submission
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg border border-border shadow-sm">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Assignment_Solution.pdf</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted on {assignment.submission_date ? format(new Date(assignment.submission_date), 'MMM dd, yyyy \'at\' h:mm a') : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {assignment.feedback && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                          Instructor Feedback
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                          {assignment.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Status & Details */}
        <div className="space-y-6">
          {/* Grade Card */}
          {isGraded && (
            <Card className="p-6 border border-border shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                  <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Final Grade</h3>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {assignment.grade}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {assignment.points_earned} out of {assignment.total_points} points
                </p>
              </div>
            </Card>
          )}

          {/* Grading Rubric */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Grading Rubric</h3>
            <div className="space-y-3">
              {[
                { criteria: "Code Correctness", weight: "40%", points: Math.round(assignment.total_points * 0.4) },
                { criteria: "Documentation", weight: "30%", points: Math.round(assignment.total_points * 0.3) },
                { criteria: "Code Quality", weight: "20%", points: Math.round(assignment.total_points * 0.2) },
                { criteria: "Style & Format", weight: "10%", points: Math.round(assignment.total_points * 0.1) },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.criteria}</p>
                    <p className="text-xs text-muted-foreground">{item.points} points</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{item.weight}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Assignment Details */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Assignment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium text-foreground">{course?.code}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Due Date</span>
                <span className="font-medium text-foreground">{format(dueDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-medium text-foreground">{assignment.total_points}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Status</span>
                <span className={cn("text-sm font-semibold px-2 py-1 rounded-full border", getStatusColor(assignment.status))}>
                  {getStatusLabel(assignment.status)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
