"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockAssessments } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

export default function AssessmentsPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const openDeleteDialog = (id: string, name: string) => { setDeleteId(id); setDeleteName(name); };
  const handleDelete = () => setDeleteId(null);

  const columns = [
    { header: 'Title', accessor: 'title' as const, cell: (v: string) => <span className="font-medium">{v}</span> },
    { header: 'Type', accessor: 'type' as const, cell: (v: string) => <Badge variant="outline">{v}</Badge> },
    { header: 'Subject', accessor: 'subject' as const },
    { header: 'Class', accessor: 'class' as const },
    { header: 'Date', accessor: 'date' as const, cell: (v: string) => new Date(v).toLocaleDateString() },
    { header: 'Total Marks', accessor: 'totalMarks' as const },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
          Active: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
        };
        return <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${c[v] || 'bg-secondary text-secondary-foreground'}`}>{v}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_v: string, row: typeof mockAssessments[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => openDeleteDialog(row.id, row.title)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Create and manage tests, quizzes, and assignments"
        titleAction={
          <Button onClick={() => router.push("/school-admin/assessments/create")}>
            <Plus className="mr-2 h-4 w-4" />Create Assessment
          </Button>
        }
      />
      <Card className="hover:shadow-md transition-shadow">
        <DataTable columns={columns} data={mockAssessments} pageSize={10} emptyMessage="No assessments found." />
      </Card>
      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} itemName={deleteName} />
    </div>
  );
}

