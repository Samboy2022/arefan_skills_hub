"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { KPICard } from "@/components/tenant/kpi-card";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockFaculty } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2, Eye, Search, GraduationCap, BookOpen, Users } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InstructorsPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredFaculty = useMemo(() => {
    return mockFaculty.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.assignedProgram || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || f.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const counts = useMemo(() => ({
    total: mockFaculty.length,
    instructors: mockFaculty.length,
  }), []);

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };
  const handleDelete = () => setDeleteId(null);

  const columns = [
    {
      header: "Name",
      accessor: "name" as const,
      cell: (v: string) => <span className="font-medium text-foreground">{v}</span>,
    },
    {
      header: "Email",
      accessor: "email" as const,
      cell: (v: string) => <span className="text-sm text-muted-foreground">{v}</span>,
    },
    {
      header: "Role",
      accessor: "role" as const,
      cell: (v: string) => {
        const color = v === "Instructor"
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            : "bg-secondary text-secondary-foreground";
        return (
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${color}`}>
            {v}
          </span>
        );
      },
    },
    {
      header: "Assigned Courses",
      accessor: "assignedCourses" as any,
      cell: (v: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(v || []).map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full whitespace-nowrap"
            >
              {c}
            </span>
          ))}
          {(!v || v.length === 0) && <span className="text-muted-foreground text-sm">—</span>}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          Inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };
        return (
          <span className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${c[v] || "bg-secondary text-secondary-foreground"}`}>
            {v}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id" as const,
      cell: (_v: string, row: typeof mockFaculty[0]) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={() => router.push(`/school-admin/instructors/edit/${row.id}`)}
          >
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
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Instructors" },
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Instructors"
        description="Manage all instructors — assign courses, programs, and track their roles."
        titleAction={
          <Button onClick={() => router.push("/school-admin/instructors/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Total Instructors"
          value={counts.total.toString()}
          hint="All active instructors"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Active Instructors"
          value={counts.instructors.toString()}
          hint="Course and practical instructors"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/20 p-4 border rounded-md">
        <div className="relative flex-1 w-full sm:max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 bg-background">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Instructor">Instructors</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <DataTable
          columns={columns}
          data={filteredFaculty}
          pageSize={10}
          emptyMessage="No instructors found."
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
