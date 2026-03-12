import { CheckCircle, Clock, AlertCircle, Upload, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_ASSIGNMENTS } from "@/lib/student-mock-data";

const ASSIGNMENT_STATUS_COLORS: Record<string, string> = {
  pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  graded: "border-green-200 bg-green-50 text-green-700",
  late: "border-orange-200 bg-orange-50 text-orange-700",
  missing: "border-red-200 bg-red-50 text-red-700",
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

  const renderAssignmentCard = (assignment: typeof STUDENT_ASSIGNMENTS[0]) => (
    <Card key={assignment.id} className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getStatusIcon(assignment.status)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{assignment.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded border ${getStatusColor(assignment.status)}`}>
          {getStatusLabel(assignment.status)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="p-3 bg-muted rounded">
          <p className="text-muted-foreground text-xs">Due Date</p>
          <p className="font-semibold">{format(new Date(assignment.due_date), 'MMM dd, yyyy')}</p>
        </div>
        <div className="p-3 bg-muted rounded">
          <p className="text-muted-foreground text-xs">Total Points</p>
          <p className="font-semibold">{assignment.total_points}</p>
        </div>
        {assignment.status === "graded" || assignment.status === "late" ? (
          <div className="p-3 bg-muted rounded">
            <p className="text-muted-foreground text-xs">Your Score</p>
            <p className="font-semibold">
              {assignment.points_earned}/{assignment.total_points}
            </p>
          </div>
        ) : null}
      </div>

      {assignment.feedback && (
        <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Instructor Feedback</p>
          <p className="text-sm text-blue-800">{assignment.feedback}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        {assignment.status === "pending" ? (
          <Button size="sm" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Submit Assignment
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Submission
          </Button>
        )}
        {assignment.status !== "pending" && (
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="View and submit your course assignments"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Assignments</p>
          <p className="text-2xl font-bold">{STUDENT_ASSIGNMENTS.length}</p>
        </Card>
        <Card className="p-4 text-center border-yellow-200 bg-yellow-50">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{groupedAssignments.pending.length}</p>
        </Card>
        <Card className="p-4 text-center border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-700">Under Review</p>
          <p className="text-2xl font-bold text-blue-700">{groupedAssignments.submitted.length}</p>
        </Card>
        <Card className="p-4 text-center border-green-200 bg-green-50">
          <p className="text-sm text-green-700">Graded</p>
          <p className="text-2xl font-bold text-green-700">{groupedAssignments.graded.length}</p>
        </Card>
        <Card className="p-4 text-center border-red-200 bg-red-50">
          <p className="text-sm text-red-700">Missing</p>
          <p className="text-2xl font-bold text-red-700">{groupedAssignments.missing.length}</p>
        </Card>
      </div>

      {/* Pending Assignments */}
      {groupedAssignments.pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Pending Submission
          </h3>
          <div className="space-y-4">
            {groupedAssignments.pending.map(renderAssignmentCard)}
          </div>
        </div>
      )}

      {/* Submitted Assignments */}
      {groupedAssignments.submitted.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Under Review
          </h3>
          <div className="space-y-4">
            {groupedAssignments.submitted.map(renderAssignmentCard)}
          </div>
        </div>
      )}

      {/* Graded Assignments */}
      {groupedAssignments.graded.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Graded
          </h3>
          <div className="space-y-4">
            {groupedAssignments.graded.map(renderAssignmentCard)}
          </div>
        </div>
      )}

      {/* Late Submissions */}
      {groupedAssignments.late.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Submitted Late
          </h3>
          <div className="space-y-4">
            {groupedAssignments.late.map(renderAssignmentCard)}
          </div>
        </div>
      )}
    </div>
  );
}
