"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Users, UserCheck, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/admin/data-table";
import { KPICard } from "@/components/tenant/kpi-card";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockStudents } from "@/lib/tenant-mock-data";

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeTab === "All" || student.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeTab]);

  const statusCounts = useMemo(() => ({
    active: mockStudents.filter((s) => s.status === "Active").length,
    inactive: mockStudents.filter((s) => s.status === "Inactive").length,
  }), []);

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    // TODO: call API to delete student with deleteId
    setDeleteId(null);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    { header: 'Roll No.', accessor: 'rollNumber' as const },
    { header: 'Class', accessor: 'class' as const },
    {
      header: 'Email',
      accessor: 'email' as const,
      cell: (value: string) => <span className="text-sm text-muted-foreground">{value}</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const colors: Record<string, string> = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        };
        return (
          <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || 'bg-secondary text-secondary-foreground'}`}>
            {value}
          </span>
        );
      },
    },
    {
      header: 'Join Date',
      accessor: 'joinDate' as const,
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_value: string, row: typeof mockStudents[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete"
            onClick={() => openDeleteDialog(row.id, row.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage all users in your platform"
        titleAction={
          <Button onClick={() => router.push("/school-admin/students/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Users
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard title="Total Students" value={mockStudents.length.toLocaleString()} hint="All registered students" icon={Users} color="blue" />
        <KPICard title="Active Students" value={statusCounts.active.toLocaleString()} hint="Currently attending classes" icon={UserCheck} color="green" />
        <KPICard title="Inactive Students" value={statusCounts.inactive.toLocaleString()} hint="Suspended or left" icon={UserMinus} color="red" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="All">All ({mockStudents.length})</TabsTrigger>
            <TabsTrigger value="Active">Active ({statusCounts.active})</TabsTrigger>
            <TabsTrigger value="Inactive">Inactive ({statusCounts.inactive})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <DataTable
          columns={columns}
          data={filteredStudents}
          pageSize={10}
          emptyMessage="No students found matching your criteria"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName={deleteName}
      />
    </div>
  );
}

