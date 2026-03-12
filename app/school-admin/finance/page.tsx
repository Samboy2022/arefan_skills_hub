"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/tenant/kpi-card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockStudents } from "@/lib/tenant-mock-data";

export default function FinancePage() {
  // Mock financial data
  const financialMetrics = {
    totalCollected: 450000,
    pending: 85000,
    overdue: 25000,
    collectionRate: 94.2,
  };

  return (
    <div>
      <PageHeader
        title="Finance Management"
        description="Track fees, payments, and financial reports"
      />

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Collected"
          value={`₹${(financialMetrics.totalCollected / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={12}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value={`₹${(financialMetrics.pending / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={-5}
          color="orange"
        />
        <KPICard
          title="Overdue Fees"
          value={`₹${(financialMetrics.overdue / 1000).toFixed(0)}K`}
          icon={AlertCircle}
          trend={2}
          color="red"
        />
        <KPICard
          title="Collection Rate"
          value={`${financialMetrics.collectionRate}%`}
          icon={TrendingUp}
          trend={1.5}
          color="blue"
        />
      </div>

      {/* Fee Collection Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Fee Status by Student</h2>
          <Button>Export Report</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Annual Fee</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.slice(0, 5).map((student, idx) => {
                const annualFee = 50000;
                const paid = idx % 2 === 0 ? annualFee : annualFee * 0.75;
                const pending = annualFee - paid;
                const status = pending === 0 ? "Paid" : pending > 20000 ? "Overdue" : "Pending";

                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>₹{annualFee.toLocaleString()}</TableCell>
                    <TableCell>₹{paid.toLocaleString()}</TableCell>
                    <TableCell>₹{pending.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "Paid"
                            ? "default"
                            : status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
