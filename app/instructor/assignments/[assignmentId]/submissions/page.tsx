"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_ASSIGNMENTS, MOCK_STUDENTS } from "@/lib/instructor-mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const assignment = useMemo(
    () => MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  );

  if (!assignment) {
    notFound();
  }

  const submissions = assignment.submissions || [];
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const SubmissionsTable = () => {
    if (submissions.length === 0) {
      return (
        <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card">
          <p className="text-muted-foreground">No submissions have been made yet.</p>
        </div>
      );
    }
    
    return (
      <div className="w-full overflow-x-auto rounded-md border bg-card shadow-sm">
        <Table className="w-full min-w-[max-content]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold whitespace-nowrap">Student</TableHead>
              <TableHead className="font-semibold whitespace-nowrap">Submitted On</TableHead>
              <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
              <TableHead className="font-semibold whitespace-nowrap">Score</TableHead>
              <TableHead className="text-right font-semibold whitespace-nowrap min-w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const student = MOCK_STUDENTS.find(s => s.id === submission.studentId);
              
              return (
                <TableRow key={submission.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student?.avatar} />
                        <AvatarFallback>{student?.name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{student?.name || "Unknown Student"}</span>
                        <span className="text-xs text-muted-foreground">{student?.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(submission.submissionDate)}
                  </TableCell>
                  <TableCell>
                    {submission.status === "graded" ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" /> Graded
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" /> Pending Review
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.score !== undefined ? (
                      <span className="font-medium text-foreground">{submission.score} / {assignment.maxScore}</span>
                    ) : (
                      <span className="text-muted-foreground italic">- / {assignment.maxScore}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/assignments/${assignment.id}/submissions/${submission.id}`}>
                        Review Submission
                      </Link>
                    </Button>
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
            { label: "Assignments", href: "/instructor/assignments" },
            { label: `${assignment.title} Submissions` }
          ]} 
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-4 pb-4">
        <PageHeader
          title={`Submissions: ${assignment.title}`}
          description={assignment.description}
        />
        <div className="flex gap-4 p-4 rounded-lg bg-card border shadow-sm shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total</span>
            <span className="text-2xl font-bold">{submissions.length}</span>
          </div>
          <div className="w-px bg-border my-1" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Graded</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-500">{gradedCount}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <SubmissionsTable />
      </div>
    </div>
  );
}
