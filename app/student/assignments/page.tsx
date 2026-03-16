"use client";

import { CheckCircle, Clock, AlertCircle, Upload, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { StudentKPICard } from "@/components/student/kpi-card";
import { cn } from "@/lib/utils";
import { STUDENT_ASSIGNMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import Link from "next/link";

const ASSIGNMENT_STATUS_COLORS: Record<string, string> = {
  pending: "border-primary/20 bg-primary/10 text-primary",
  submitted: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  graded: "border-green-500/20 bg-green-500/10 text-green-600",
  late: "border-orange-500/20 bg-orange-500/10 text-orange-600",
  missing: "border-red-500/20 bg-red-500/10 text-red-600",
};

const getStatusColor = (status: string): string => {
  return ASSIGNMENT_STATUS_COLORS[status] || "border-gray-200 bg-gray-50 text-gray-700";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "graded":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "submitted":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "pending":
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case "late":
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    case "missing":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: "Pending Submission",
    submitted: "Submitted - Under Review",
    graded: "Graded",
    late: "Submitted Late",
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

    const strokeColors: Record<string, string> = {
      pending: "text-amber-600 dark:text-amber-500",
      submitted: "text-blue-600 dark:text-blue-500",
      graded: "text-green-600 dark:text-green-500",
      late: "text-orange-600 dark:text-orange-500",
      missing: "text-red-600 dark:text-red-500",
    };
    
    const strokeClass = strokeColors[assignment.status] || "text-gray-500";

    return (
      <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center px-4 py-3 hover:bg-muted/50 transition-colors gap-4">
        {/* Course Code & Title */}
        <div className="min-w-0 flex-1">
          <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-0.5", strokeClass)}>{course?.code}</p>
          <h4 className="font-semibold text-sm leading-tight text-foreground truncate">{assignment.title}</h4>
        </div>

        {/* Due Date & Points */}
        <div className="sm:w-[130px] shrink-0 flex flex-col items-start justify-center">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground whitespace-nowrap">
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{format(dueDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5 ml-5">{assignment.total_points} Points</div>
        </div>

        {/* Status */}
        <div className="sm:w-[140px] shrink-0 flex flex-col items-start justify-center">
          <span className={cn("inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border whitespace-nowrap", getStatusColor(assignment.status))}>
            {getStatusLabel(assignment.status)}
          </span>
          {assignment.status === 'graded' && assignment.grade && (
            <div className="text-[11px] font-bold text-foreground mt-1 ml-1">{assignment.grade}% Score</div>
          )}
        </div>

        {/* Actions */}
        <div className="sm:w-[120px] shrink-0 flex justify-end">
          <Button 
            size="sm" 
            variant={assignment.status === 'pending' ? 'default' : 'secondary'} 
            className="w-full sm:w-[100px] text-xs h-8 font-semibold shadow-sm" 
            asChild
          >
            <Link href={`/student/assignments/${assignment.id}`}>
              {assignment.status === 'pending' ? 'Submit Work' : 'View'}
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
      <PageHeader
        title="Assignments"
        description="View and submit your course assignments"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <StudentKPICard
          title="Total Assignments"
          value={STUDENT_ASSIGNMENTS.length}
          icon={CheckCircle}
          variant="default"
          hint="Total enrolled"
        />
        <StudentKPICard
          title="Pending"
          value={groupedAssignments.pending.length}
          icon={AlertCircle}
          variant="warning"
          hint="Need submission"
        />
        <StudentKPICard
          title="Under Review"
          value={groupedAssignments.submitted.length}
          icon={Clock}
          variant="default"
          hint="Being graded"
        />
        <StudentKPICard
          title="Graded"
          value={groupedAssignments.graded.length}
          icon={CheckCircle}
          variant="success"
          hint="Results out"
        />
        <StudentKPICard
          title="Missing"
          value={groupedAssignments.missing.length}
          icon={AlertCircle}
          variant="danger"
          hint="Past deadline"
        />
      </div>

      <div className="w-full xl:w-[70vw] max-w-full">
        <Card className="overflow-hidden border border-border rounded-md bg-card shadow-none">
          {/* Table Header */}
          <div className="hidden sm:flex items-center px-4 py-3 bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <div className="flex-1">Assignment Details</div>
            <div className="w-[130px]">Due Date</div>
            <div className="w-[140px]">Status</div>
            <div className="w-[120px] text-right">Action</div>
          </div>
          
          {/* List Body */}
          <div className="flex flex-col divide-y divide-border">
            {sortedAssignments.map(renderAssignmentRow)}
          </div>
        </Card>
      </div>
    </div>
  );
}
