"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockClasses } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ClassesPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const openDeleteDialog = (id: string, name: string) => { setDeleteId(id); setDeleteName(name); };
  const handleDelete = () => setDeleteId(null);

  const columns = [
    { header: 'Class', accessor: 'name' as const, cell: (v: string) => <span className="font-medium">{v}</span> },
    { header: 'Grade', accessor: 'grade' as const },
    { header: 'Section', accessor: 'section' as const },
    { header: 'Class Teacher', accessor: 'classTeacher' as const },
    { header: 'Students', accessor: 'totalStudents' as const },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        };
        return <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${c[v] || 'bg-secondary text-secondary-foreground'}`}>{v}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_v: string, row: typeof mockClasses[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => openDeleteDialog(row.id, row.name)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage all classes and sections"
        titleAction={
          <Button onClick={() => router.push("/school-admin/classes/create")}>
            <Plus className="mr-2 h-4 w-4" />Create Class
          </Button>
        }
      />
      <Card className="hover:shadow-md transition-shadow">
        <DataTable columns={columns} data={mockClasses} pageSize={10} emptyMessage="No classes found." />
      </Card>
      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} itemName={deleteName} />
    </div>
  );
}
