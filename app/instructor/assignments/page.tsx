import { Plus, FileEdit, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { MOCK_ASSIGNMENTS } from "@/lib/instructor-mock-data";

export default function AssignmentsPage() {
  const activeAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "active");
  const draftAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "draft");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>;
    if (status === "draft") return <Badge variant="secondary">Draft</Badge>;
    return <Badge variant="outline">Closed</Badge>;
  }

  const AssignmentsTable = ({ data }: { data: typeof MOCK_ASSIGNMENTS }) => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No assignments found in this category.</p>
        </div>
      );
    }
    
    return (
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[35%] font-semibold">Assignment</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Due</TableHead>
              <TableHead className="font-semibold">Submissions</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((assignment) => {
              const submissionCount = assignment.submissions?.length || 0;
              const gradedCount = assignment.submissions?.filter((s) => s.status === "graded").length || 0;
              
              return (
                <TableRow key={assignment.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{assignment.title}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[250px]">{assignment.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize bg-muted/50">{assignment.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(assignment.dueDate)}
                  </TableCell>
                  <TableCell>
                    {submissionCount > 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{submissionCount} total</span>
                        <span className="text-xs text-muted-foreground">{gradedCount} graded</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">None yet</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild className="h-8 shadow-none text-xs font-medium">
                        <Link href={`/instructor/assignments/edit/${assignment.id}`}>
                          <FileEdit className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="h-8 shadow-none text-xs font-medium">
                        <Link href={`/instructor/assignments/${assignment.id}/submissions`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Grade
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <span className="sr-only">Delete</span>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the assignment 
                              <span className="font-semibold text-foreground"> {assignment.title}</span> 
                              and remove all of its data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "Assignments" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Assignments Database"
          description="Create, manage, and grade student assignments efficiently using the data table."
        >
          <Button asChild className="gap-2 shadow-sm">
            <Link href="/instructor/assignments/create">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Link>
          </Button>
        </PageHeader>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50 p-1">
          <TabsTrigger value="active" className="rounded-sm">Active ({activeAssignments.length})</TabsTrigger>
          <TabsTrigger value="draft" className="rounded-sm">Draft ({draftAssignments.length})</TabsTrigger>
          <TabsTrigger value="closed" className="rounded-sm">Closed (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <AssignmentsTable data={activeAssignments} />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <AssignmentsTable data={draftAssignments} />
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <AssignmentsTable data={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
