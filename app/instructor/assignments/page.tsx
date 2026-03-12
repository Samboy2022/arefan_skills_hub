import { Plus, Calendar, FileText, Users, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_ASSIGNMENTS } from "@/lib/instructor-mock-data";

export default function AssignmentsPage() {
  const activeAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "active");
  const draftAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "draft");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const AssignmentCard = ({ assignment }: { assignment: typeof MOCK_ASSIGNMENTS[0] }) => {
    const submissionCount = assignment.submissions?.length || 0;
    const gradedCount = assignment.submissions?.filter((s) => s.status === "graded").length || 0;

    return (
      <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
              <DropdownMenuItem>View Submissions</DropdownMenuItem>
              <DropdownMenuItem>Download Submissions</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3 py-4 border-t border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due: {formatDate(assignment.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground capitalize">{assignment.type} Assignment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {submissionCount > 0 ? `${gradedCount} graded, ${submissionCount - gradedCount} pending` : "No submissions yet"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button className="flex-1">Grade Submissions</Button>
          <Button variant="outline" className="flex-1">
            Edit
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignments"
        description="Create, manage, and grade student assignments"
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </PageHeader>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Active ({activeAssignments.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftAssignments.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed (2)</TabsTrigger>
        </TabsList>

        {/* Active Assignments */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeAssignments.length > 0 ? (
            <div className="grid gap-6">
              {activeAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No active assignments</p>
            </div>
          )}
        </TabsContent>

        {/* Draft Assignments */}
        <TabsContent value="draft" className="space-y-4 mt-6">
          {draftAssignments.length > 0 ? (
            <div className="grid gap-6">
              {draftAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No draft assignments</p>
            </div>
          )}
        </TabsContent>

        {/* Closed Assignments */}
        <TabsContent value="closed" className="space-y-4 mt-6">
          <div className="text-center py-12 rounded-lg border border-dashed border-border">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No closed assignments</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
