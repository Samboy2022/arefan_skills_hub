"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPrograms } from "@/lib/tenant-mock-data";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";

export default function ProgramsPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter((program) => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            program.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "All" || program.level === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, levelFilter]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.size === filteredPrograms.length && filteredPrograms.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredPrograms.map(p => p.id)));
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

  const handleBulkDelete = () => {
    // In a real app, this would delete all selectedRowIds
    setSelectedRowIds(new Set());
  };

  const openDeleteDialog = (id: string, name: string) => { 
    setDeleteId(id); 
    setDeleteName(name); 
  };
  
  const handleDelete = () => {
    // API Call goes here
    setDeleteId(null);
  };

  const columns = [
    {
      header: 'Select',
      accessor: 'id_select' as any, // Using an alias to avoid duplicate keys in DataTable
      width: "w-[50px]",
      cell: (_v: any, row: typeof mockPrograms[0]) => (
        <Checkbox 
          checked={selectedRowIds.has(row.id)}
          onCheckedChange={() => toggleSelectRow(row.id)}
          aria-label={`Select program ${row.id}`}
        />
      ),
    },
    { header: 'Program Name', accessor: 'name' as const, cell: (v: string) => <span className="font-medium">{v}</span> },
    { header: 'Level', accessor: 'level' as const },
    { header: 'Creator', accessor: 'createdBy' as const },
    { 
      header: 'Attached Courses', 
      accessor: 'courseIds' as const,
      cell: (v: string[]) => <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{v.length} Courses</span>
    },
    { header: 'Created', accessor: 'createdAt' as const, cell: (v: string) => new Date(v).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: 'id_action' as any, // Using an alias to avoid duplicate keys in DataTable
      cell: (_v: any, row: typeof mockPrograms[0]) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => router.push(`/school-admin/programs/${row.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => openDeleteDialog(row.id, row.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Modify the first column header dynamically to include the "Select All" checkbox
  // This is a workaround since DataTable takes a string for 'header'
  const enhancedColumns = columns.map(col => {
    if (col.header === 'Select') {
      return {
        ...col,
        header: '', // Hide text header
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
          { label: "Programs" }
        ]} 
        className="mb-2" 
      />
      <PageHeader
        title="Academic Programs"
        description="Manage all programs and attach courses to them."
        titleAction={
          <Button onClick={() => router.push("/school-admin/programs/create")}>
            <Plus className="mr-2 h-4 w-4" />Create New Program
          </Button>
        }
      />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <div className="w-[180px]">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter Level" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Degree">Degree</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedRowIds.size > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedRowIds.size} selected
            </span>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4 border-b bg-muted/20 flex items-center gap-3">
           <Checkbox 
              checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredPrograms.length}
              onCheckedChange={toggleSelectAll}
              id="select-all"
           />
           <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
             Select All {filteredPrograms.length > 0 ? `(${filteredPrograms.length})` : ''}
           </Label>
        </div>
        <DataTable 
          columns={enhancedColumns} 
          data={filteredPrograms} 
          pageSize={10} 
          emptyMessage="No programs found matching your criteria." 
        />
      </Card>
      
      <ConfirmDeleteDialog 
        open={!!deleteId} 
        onOpenChange={(open) => !open && setDeleteId(null)} 
        onConfirm={handleDelete} 
        itemName={deleteName} 
        description={`Are you sure you want to delete "${deleteName}"? Deleting this program will not delete the attached courses. This action cannot be undone.`}
      />
    </div>
  );
}
