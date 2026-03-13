"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/tenant/kpi-card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { mockStudents } from "@/lib/tenant-mock-data";
import { useMemo } from "react";

export default function FinancePage() {
  // Mock financial data
  const financialMetrics = {
    totalCollected: 450000,
    pending: 85000,
    overdue: 25000,
    collectionRate: 94.2,
  };

  const tableData = useMemo(() => {
    return mockStudents.slice(0, 5).map((student, idx) => {
      const annualFee = 50000;
      const paid = idx % 2 === 0 ? annualFee : annualFee * 0.75;
      const pending = annualFee - paid;
      const status = pending === 0 ? "Paid" : pending > 20000 ? "Overdue" : "Pending";
      
      return {
        ...student,
        annualFee,
        paid,
        pending,
        feeStatus: status
      };
    });
  }, []);

  const columns = [
    {
      header: 'Student Name',
      accessor: 'name' as const,
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: 'Roll No.',
      accessor: 'rollNumber' as const,
    },
    {
      header: 'Class',
      accessor: 'class' as const,
    },
    {
      header: 'Annual Fee',
      accessor: 'annualFee' as const,
      cell: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      header: 'Paid Amount',
      accessor: 'paid' as const,
      cell: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      header: 'Pending',
      accessor: 'pending' as const,
      cell: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: 'feeStatus' as const,
      cell: (value: string) => {
        const colors: Record<string, string> = {
          Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
          Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
        };
        return (
          <span
            className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || 'bg-secondary text-secondary-foreground'}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: () => (
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Management"
        description="Track fees, payments, and financial reports"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Collected"
          value={`₹${(financialMetrics.totalCollected / 1000).toFixed(0)}K`}
          hint="Total fees collected"
          icon={DollarSign}
          trend={12}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value={`₹${(financialMetrics.pending / 1000).toFixed(0)}K`}
          hint="Fees due but not overdue"
          icon={DollarSign}
          trend={-5}
          color="orange"
        />
        <KPICard
          title="Overdue Fees"
          value={`₹${(financialMetrics.overdue / 1000).toFixed(0)}K`}
          hint="Past due date"
          icon={AlertCircle}
          trend={2}
          color="red"
        />
        <KPICard
          title="Collection Rate"
          value={`${financialMetrics.collectionRate}%`}
          hint="Of total expected"
          icon={TrendingUp}
          trend={1.5}
          color="blue"
        />
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-6 pb-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Fee Status by Student</h2>
          <Button variant="outline" size="sm">Export Report</Button>
        </div>
        <div className="p-6 pt-4">
          <DataTable
            columns={columns}
            data={tableData}
            pageSize={10}
            emptyMessage="No financial records found."
          />
        </div>
      </Card>
    </div>
  );
}
