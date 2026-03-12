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
import { mockCourses } from "@/lib/tenant-mock-data";

export default function CurriculumPage() {
  return (
    <div>
      <PageHeader
        title="Curriculum Management"
        description="Create and manage courses and curriculum"
        action={{
          label: "Create Course",
          onClick: () => {
            // TODO: Implement create course dialog
          },
        }}
      />

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Duration (hrs)</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.grade}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <Badge variant="default">{course.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
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
