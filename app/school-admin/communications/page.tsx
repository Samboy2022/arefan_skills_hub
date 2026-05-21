"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockCommunications } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function CommunicationsPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const openDeleteDialog = (id: string, name: string) => { setDeleteId(id); setDeleteName(name); };
  const handleDelete = () => setDeleteId(null);

  const columns = [
    { header: 'Type', accessor: 'type' as const, cell: (v: string) => <Badge variant="outline">{v}</Badge> },
    { header: 'Title', accessor: 'title' as const, cell: (v: string) => <span className="font-medium">{v}</span> },
    { header: 'Sent By', accessor: 'sentBy' as const },
    { header: 'Date', accessor: 'sentDate' as const, cell: (v: string) => <span className="text-sm text-muted-foreground">{new Date(v).toLocaleDateString()}</span> },
    { header: 'Recipients', accessor: 'recipients' as const, cell: (v: string[]) => v.join(", ") },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        };
        return <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${c[v] || 'bg-secondary text-secondary-foreground'}`}>{v}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_v: string, row: typeof mockCommunications[0]) => (
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
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Communications" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Communications"
        description="Send announcements and messages to students and parents"
        titleAction={
          <Button onClick={() => router.push("/school-admin/communications/create")}>
            <Plus className="mr-2 h-4 w-4" />New Message
          </Button>
        }
      />
      <Card className="hover:shadow-md transition-shadow">
        <DataTable columns={columns} data={mockCommunications} pageSize={10} emptyMessage="No communications found." />
      </Card>
      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} itemName={deleteName} />
    </div>
  );
}
