"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { mockClasses } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2, Trash, Search, Filter, BookOpen } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_classes");
    if (saved) {
      try {
        setClasses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse classes", e);
        setClasses(mockClasses);
        localStorage.setItem("school_admin_classes", JSON.stringify(mockClasses));
      }
    } else {
      setClasses(mockClasses);
      localStorage.setItem("school_admin_classes", JSON.stringify(mockClasses));
    }
  }, []);

  const openDeleteDialog = (id: string, name: string) => { 
    setDeleteId(id); 
    setDeleteName(name); 
  };

  const handleDelete = () => {
    if (deleteId) {
      const updated = classes.filter(c => c.id !== deleteId);
      setClasses(updated);
      localStorage.setItem("school_admin_classes", JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.instructors && c.instructors.some((inst: string) => inst.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesProgram = programFilter === "All" || c.program === programFilter;
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [classes, searchTerm, programFilter, statusFilter]);

  // Bulk Handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.size === filteredClasses.length && filteredClasses.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredClasses.map(c => c.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedRowIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRowIds(next);
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedRowIds);
    const updated = classes.filter(c => !ids.includes(c.id));
    setClasses(updated);
    localStorage.setItem("school_admin_classes", JSON.stringify(updated));
    setSelectedRowIds(new Set());
  };

  const columns = [
    {
      header: 'Select',
      accessor: 'id_select' as any,
      width: "w-[50px]",
      cell: (_v: any, row: any) => (
        <Checkbox 
          checked={selectedRowIds.has(row.id)}
          onCheckedChange={() => toggleSelectRow(row.id)}
          aria-label={`Select class ${row.id}`}
        />
      ),
    },
    { 
      header: 'Course Title', 
      accessor: 'name' as const, 
      cell: (v: string) => <div className="font-semibold text-foreground max-w-[150px] lg:max-w-[200px] truncate" title={v}>{v}</div> 
    },
    { 
      header: 'Program', 
      accessor: 'program' as const, 
      cell: (v: string) => <div className="max-w-[120px] lg:max-w-[160px] truncate text-muted-foreground" title={v}>{v}</div> 
    },
    { 
      header: 'Code', 
      accessor: 'courseCode' as const,
      cell: (v: string) => <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-muted border rounded-md">{v}</span>
    },
    { 
      header: 'Instructors', 
      accessor: 'instructors' as const, 
      cell: (v: string[]) => <div className="max-w-[120px] lg:max-w-[180px] truncate text-sm" title={v.join(", ")}>{v.join(", ")}</div> 
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (v: string) => {
        const c: Record<string, string> = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800',
          Inactive: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800',
        };
        return <span className={`capitalize px-2.5 py-0.5 text-[10px] font-bold border rounded-full ${c[v] || 'bg-secondary text-secondary-foreground'}`}>{v}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: 'id_action' as any,
      cell: (_v: string, row: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit">
            <Link href={`/school-admin/classes/${row.id}/edit`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => openDeleteDialog(row.id, row.name)}
            title="Delete"
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
        cell: (_v: any, row: any) => (
          <Checkbox 
            checked={selectedRowIds.has(row.id)}
            onCheckedChange={() => toggleSelectRow(row.id)}
          />
        )
      };
    }
    return col;
  });

  // Extract unique programs for filter list
  const uniquePrograms = useMemo(() => {
    const list = classes.map(c => c.program).filter(Boolean);
    return Array.from(new Set(list));
  }, [classes]);

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Classes" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Classes"
        description="Manage all sections, schedule structures, and active teaching modules."
        titleAction={
          <Button onClick={() => router.push("/school-admin/classes/create")} className="gap-2">
            <Plus className="h-4 w-4" />Create Class
          </Button>
        }
      />

      {/* Bulk Actions Stretched Toolbar / Filters Bar */}
      {selectedRowIds.size > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-primary/5 p-4 border border-primary/20 rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
              {selectedRowIds.size} Classes Selected
            </div>
            <p className="text-xs text-muted-foreground hidden sm:inline">
              Apply bulk delete updates to selected sections
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete} 
              className="text-xs h-10 gap-1.5 px-4 flex-1 sm:flex-initial"
            >
              <Trash className="h-4 w-4 shrink-0" />
              <span>Delete Selected</span>
            </Button>
            <div className="hidden md:block h-6 w-px bg-border/80 mx-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedRowIds(new Set())} 
              className="text-xs text-muted-foreground hover:text-foreground h-10 flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-muted/20 p-4 border rounded-xl">
          {/* Left: Search Bar */}
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by class name, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          
          {/* Right: Select Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Program filter */}
            <div className="w-full sm:w-[200px]">
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Academic Program" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Programs</SelectItem>
                  {uniquePrograms.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
            <div className="w-full sm:w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <Card className="hover:shadow-md transition-shadow p-2">
        <div className="p-3 border-b bg-muted/10 rounded-t-lg flex items-center gap-3">
          <Checkbox 
            checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredClasses.length}
            onCheckedChange={toggleSelectAll}
            id="select-all"
          />
          <Label htmlFor="select-all" className="text-xs font-semibold cursor-pointer text-foreground/80">
            Select All {filteredClasses.length > 0 ? `(${filteredClasses.length})` : ""}
          </Label>
        </div>
        <DataTable columns={enhancedColumns} data={filteredClasses} pageSize={10} emptyMessage="No classes found." />
      </Card>

      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} itemName={deleteName} />
    </div>
  );
}
