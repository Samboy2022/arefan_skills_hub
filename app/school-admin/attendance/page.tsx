"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/tenant/kpi-card";
import { Award, TrendingUp } from "lucide-react";

export default function AttendancePage() {
  return (
    <div>
      <PageHeader
        title="Attendance Management"
        description="Track and manage student and faculty attendance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <KPICard
          title="Avg Attendance Rate"
          value="92%"
          icon={Award}
          trend={2}
          color="green"
        />
        <KPICard
          title="Present Today"
          value={165}
          icon={TrendingUp}
          trend={5}
          color="blue"
        />
      </div>

      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Attendance Interface
          </h3>
          <p className="text-muted-foreground mb-6">
            Manage daily attendance, generate reports, and track patterns
          </p>
          <Button>Mark Attendance</Button>
        </div>
      </Card>
    </div>
  );
}
