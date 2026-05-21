"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Users, UserCheck, UserMinus, Filter, ShieldCheck, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { KPICard } from "@/components/tenant/kpi-card";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockStudents } from "@/lib/tenant-mock-data";

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.regNumber || student.rollNumber).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "All" || student.program === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const statusCounts = useMemo(() => ({
    active: mockStudents.filter((s) => s.status === "Active").length,
    inactive: mockStudents.filter((s) => s.status === "Inactive").length,
  }), []);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRowIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRowIds(newSelected);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Executing ${action} for`, Array.from(selectedRowIds));
    // Implementation for Verify, Activate, etc. would go here
    setSelectedRowIds(new Set());
  };

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
      header: 'Select',
      accessor: 'id_select' as any,
      width: "w-[50px]",
      cell: (_v: any, row: typeof mockStudents[0]) => (
        <Checkbox 
          checked={selectedRowIds.has(row.id)}
          onCheckedChange={() => toggleSelectRow(row.id)}
          aria-label={`Select student ${row.id}`}
        />
      ),
    },
    {
      header: 'Name',
      accessor: 'name' as const,
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    { header: 'Reg. Number', accessor: 'rollNumber' as const, cell: (value: string) => <span className="text-xs font-mono text-muted-foreground">{value}</span> },
    { header: 'Program', accessor: 'program' as any, cell: (value: string) => <span className="text-sm">{value || '—'}</span> },
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
      accessor: 'id_action' as any,
      cell: (_value: any, row: typeof mockStudents[0]) => (
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

  const enhancedColumns = columns.map(col => {
    if (col.header === 'Select') {
      return {
        ...col,
        header: '',
        cell: (_v: any, row: any) => {
           return (
             <Checkbox 
                checked={selectedRowIds.has(row.id)}
                onCheckedChange={() => toggleSelectRow(row.id)}
             />
           )
        }
      }
    }
    return col;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb 
        showHome={false} 
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Users" }
        ]} 
        className="mb-2" 
      />
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/20 p-4 border rounded-md">
        
        {/* Left Side: Bulk Actions (When Items Selected) or Standard Filters */}
        <div className="flex-1 w-full sm:w-auto">
          {selectedRowIds.size > 0 ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium border border-primary/20">
                {selectedRowIds.size} Selected
              </div>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('verify')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                    Suspend Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    Delete Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRowIds(new Set())} className="text-muted-foreground ml-2">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="relative w-full sm:max-w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background"
              />
            </div>
          )}
        </div>
        
        {/* Right Side: Filters */}
        <div className="w-full sm:w-[240px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 bg-background">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by Program" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Programs</SelectItem>
              <SelectItem value="Bachelor of Science in Computer Science">B.Sc. Computer Science</SelectItem>
              <SelectItem value="Diploma in English Literature">Diploma in English Lit.</SelectItem>
              <SelectItem value="Master of Arts in History">M.A. in History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4 border-b bg-muted/20 flex items-center gap-3">
           <Checkbox 
              checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredStudents.length}
              onCheckedChange={toggleSelectAll}
              id="select-all"
           />
           <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
             Select All {filteredStudents.length > 0 ? `(${filteredStudents.length})` : ''}
           </Label>
        </div>
        <DataTable
          columns={enhancedColumns}
          data={filteredStudents}
          pageSize={10}
          emptyMessage="No users found matching your criteria"
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

