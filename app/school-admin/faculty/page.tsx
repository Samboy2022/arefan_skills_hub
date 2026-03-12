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
import { mockFaculty } from "@/lib/tenant-mock-data";

export default function FacultyPage() {
  return (
    <div>
      <PageHeader
        title="Faculty & Staff"
        description="Manage teachers and administrative staff"
        action={{
          label: "Add Faculty",
          onClick: () => {
            // TODO: Implement add faculty dialog
          },
        }}
      />

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFaculty.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {faculty.email}
                  </TableCell>
                  <TableCell>{faculty.department}</TableCell>
                  <TableCell className="text-sm">
                    {faculty.subjects.join(", ")}
                  </TableCell>
                  <TableCell>{faculty.role}</TableCell>
                  <TableCell>
                    <Badge variant="default">{faculty.status}</Badge>
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
