"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockCourses } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CurriculumPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const openDeleteDialog = (id: string, name: string) => { setDeleteId(id); setDeleteName(name); };
  const handleDelete = () => setDeleteId(null);

  const columns = [
    { header: 'Course Name', accessor: 'name' as const, cell: (v: string) => <span className="font-medium">{v}</span> },
    { header: 'Code', accessor: 'code' as const },
    { header: 'Grade', accessor: 'grade' as const },
    { header: 'Instructor', accessor: 'instructor' as const },
    { header: 'Duration (hrs)', accessor: 'duration' as const },
    { header: 'Students', accessor: 'students' as const },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        };
        return <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${c[v] || 'bg-secondary text-secondary-foreground'}`}>{v}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_v: string, row: typeof mockCourses[0]) => (
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
        title="Curriculum Management"
        description="Create and manage courses and curriculum"
        titleAction={
          <Button onClick={() => router.push("/school-admin/curriculum/create")}>
            <Plus className="mr-2 h-4 w-4" />Create Course
          </Button>
        }
      />
      <Card className="hover:shadow-md transition-shadow">
        <DataTable columns={columns} data={mockCourses} pageSize={10} emptyMessage="No courses found." />
      </Card>
      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} itemName={deleteName} />
    </div>
  );
}
