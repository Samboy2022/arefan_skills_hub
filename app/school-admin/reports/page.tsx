"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus } from "lucide-react";

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
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download school reports"
        titleAction={
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-foreground leading-none">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    {report.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {report.type}
                  </span>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-3.5 w-3.5 mr-2" />
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
