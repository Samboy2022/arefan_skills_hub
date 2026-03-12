"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: "Student Performance Report",
      description: "Grade-wise performance analysis",
      type: "PDF",
    },
    {
      id: 2,
      name: "Attendance Summary",
      description: "Monthly attendance records",
      type: "Excel",
    },
    {
      id: 3,
      name: "Financial Report",
      description: "Fee collection and pending details",
      type: "PDF",
    },
    {
      id: 4,
      name: "Enrollment Statistics",
      description: "Class and section enrollment data",
      type: "Excel",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and download school reports"
        action={{
          label: "Custom Report",
          onClick: () => {
            // TODO: Implement custom report generator
          },
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{report.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs px-2 py-1 bg-muted rounded">
                    {report.type}
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
