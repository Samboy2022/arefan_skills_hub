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
import { mockCommunications } from "@/lib/tenant-mock-data";

export default function CommunicationsPage() {
  return (
    <div>
      <PageHeader
        title="Communications"
        description="Send announcements and messages to students and parents"
        action={{
          label: "New Message",
          onClick: () => {
            // TODO: Implement new message dialog
          },
        }}
      />

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Sent By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommunications.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell>
                    <Badge variant="outline">{comm.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{comm.title}</TableCell>
                  <TableCell>{comm.sentBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(comm.sentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{comm.recipients.join(", ")}</TableCell>
                  <TableCell>
                    <Badge variant="default">{comm.status}</Badge>
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
