"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/tenant/kpi-card";
import { Award, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Attendance" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Attendance Management"
        description="Track and manage student and faculty attendance"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          title="Avg Attendance Rate"
          value="92%"
          hint="School wide daily average"
          icon={Award}
          trend={2}
          color="green"
        />
        <KPICard
          title="Present Today"
          value={165}
          hint="Students marked present today"
          icon={TrendingUp}
          trend={5}
          color="blue"
        />
      </div>

      <Card className="p-12 border border-border hover:shadow-md transition-shadow">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Attendance Interface
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Manage daily attendance, generate reports, and track patterns for your students and faculty members.
          </p>
          <Button>Mark Attendance</Button>
        </div>
      </Card>
    </div>
  );
}
