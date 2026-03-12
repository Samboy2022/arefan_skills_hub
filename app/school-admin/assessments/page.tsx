"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
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
import { mockAssessments } from "@/lib/tenant-mock-data";

export default function AssessmentsPage() {
  return (
    <div>
      <PageHeader
        title="Assessments"
        description="Create and manage tests, quizzes, and assignments"
        action={{
          label: "Create Assessment",
          onClick: () => {
            // TODO: Implement create assessment dialog
          },
        }}
      />

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{assessment.type}</Badge>
                  </TableCell>
                  <TableCell>{assessment.subject}</TableCell>
                  <TableCell>{assessment.class}</TableCell>
                  <TableCell>
                    {new Date(assessment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{assessment.totalMarks}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.status === "Completed" ? "default" : "secondary"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
