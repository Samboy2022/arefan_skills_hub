"use client";

import { CheckCircle, Clock, AlertCircle, Upload, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { cn } from "@/lib/utils";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

const ASSIGNMENT_STATUS_COLORS: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  submitted: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  graded: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  late: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  missing: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const getStatusColor = (status: string): string => {
  return ASSIGNMENT_STATUS_COLORS[status] || "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "graded":
      return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "submitted":
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case "late":
      return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    case "missing":
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: "Pending",
    submitted: "Submitted",
    graded: "Graded",
    late: "Late",
    missing: "Missing",
  };
  return labels[status as keyof typeof labels] || status;
};

export default function AssignmentsPage() {
  const groupedAssignments = {
    pending: STUDENT_ASSIGNMENTS.filter(a => a.status === "pending"),
    submitted: STUDENT_ASSIGNMENTS.filter(a => a.status === "submitted"),
    graded: STUDENT_ASSIGNMENTS.filter(a => a.status === "graded"),
    late: STUDENT_ASSIGNMENTS.filter(a => a.status === "late"),
    missing: STUDENT_ASSIGNMENTS.filter(a => a.status === "missing"),
  };

  const renderAssignmentRow = (assignment: typeof STUDENT_ASSIGNMENTS[0]) => {
    const course = STUDENT_COURSES.find(c => c.id === assignment.course_id);
    const dueDate = new Date(assignment.due_date);

    return (
      <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-muted/30 transition-colors gap-4 border-l-4 border-l-transparent hover:border-l-primary/50">
        {/* Course Code & Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              {course?.code}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {assignment.total_points} pts
            </span>
          </div>
          <h4 className="font-semibold text-base leading-tight text-foreground line-clamp-2 mb-1">
            {assignment.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {assignment.description}
          </p>
        </div>

        {/* Due Date */}
        <div className="sm:w-[140px] shrink-0 flex flex-col items-start sm:items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{format(dueDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Due {format(dueDate, 'h:mm a')}
          </div>
        </div>

        {/* Status */}
        <div className="sm:w-[120px] shrink-0 flex flex-col items-start sm:items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(assignment.status)}
            <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border", getStatusColor(assignment.status))}>
              {getStatusLabel(assignment.status)}
            </span>
          </div>
          {assignment.status === 'graded' && assignment.grade && (
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {assignment.grade}%
            </div>
          )}
          {assignment.status === 'submitted' && assignment.submission_date && (
            <div className="text-xs text-muted-foreground">
              Submitted {format(new Date(assignment.submission_date), 'MMM dd')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sm:w-[120px] shrink-0 flex justify-start sm:justify-center">
          <Button 
            size="sm" 
            variant={assignment.status === 'pending' ? 'default' : 'outline'} 
            className="font-semibold shadow-sm min-w-[100px]" 
            asChild
          >
            <Link href={`/student/assignments/${assignment.id}`}>
              {assignment.status === 'pending' ? (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit
                </>
              ) : assignment.status === 'graded' ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    );
  };

  // Sort assignments: Pending first, then by date. (simplified sorting for demo)
  const sortedAssignments = [...STUDENT_ASSIGNMENTS].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
  });

  return (
    <div>
      <Breadcrumb 
        items={[
          { label: "Assignments" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Assignments"
        description="View and submit your course assignments"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
              <p className="text-xs text-muted-foreground">Total enrolled</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{STUDENT_ASSIGNMENTS.length}</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-xs text-muted-foreground">Need submission</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedAssignments.pending.length}</p>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Under Review</p>
              <p className="text-xs text-muted-foreground">Being graded</p>
            </div>
            <div className="rounded-full p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedAssignments.submitted.length}</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Graded</p>
              <p className="text-xs text-muted-foreground">Results out</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedAssignments.graded.length}</p>
        </Card>

        <Card className="border-red-200 dark:border-red-900 p-3 hover:shadow-md transition-shadow">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Missing</p>
              <p className="text-xs text-muted-foreground">Past deadline</p>
            </div>
            <div className="rounded-full p-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-bold leading-none">{groupedAssignments.missing.length}</p>
        </Card>
      </div>

      <div className="w-full">
        <Card className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
          {/* Table Header */}
          <div className="hidden sm:flex items-center px-6 py-4 bg-muted/50 border-b border-border">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Assignment Details</h3>
            </div>
            <div className="w-[140px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Due Date</h3>
            </div>
            <div className="w-[120px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Status</h3>
            </div>
            <div className="w-[120px] text-center">
              <h3 className="text-sm font-semibold text-foreground">Action</h3>
            </div>
          </div>
          
          {/* List Body */}
          <div className="divide-y divide-border">
            {sortedAssignments.length > 0 ? (
              sortedAssignments.map(renderAssignmentRow)
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No assignments found</h3>
                    <p className="text-sm text-muted-foreground">You're all caught up! No assignments to display.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
