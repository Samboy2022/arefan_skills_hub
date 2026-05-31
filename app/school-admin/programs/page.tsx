"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, Search, Filter, BookOpen, Layers, Grid, List, GraduationCap, Calendar
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockPrograms } from "@/lib/tenant-mock-data";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

// Seed programs mapping courseIds to CS101, CS201, CS301
const getSeedPrograms = () => {
  const seedCourseMappings: Record<string, string[]> = {
    "1": ["course-1", "course-3"], // BS Computer Science: CS101, CS301
    "2": ["course-2"],             // Diploma in English: CS201
    "3": ["course-1", "course-2"], // MA History: CS101, CS201
  };
  return mockPrograms.map(p => ({
    ...p,
    courseIds: seedCourseMappings[p.id] || ["course-1"],
  }));
};

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  
  // Filtering & View states
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_programs");
    if (saved) {
      try {
        setPrograms(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse programs, seeding instead", e);
        const seed = getSeedPrograms();
        setPrograms(seed);
        localStorage.setItem("school_admin_programs", JSON.stringify(seed));
      }
    } else {
      const seed = getSeedPrograms();
      setPrograms(seed);
      localStorage.setItem("school_admin_programs", JSON.stringify(seed));
    }
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            program.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "All" || program.level === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [programs, searchTerm, levelFilter]);

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
    const ids = Array.from(selectedRowIds);
    const updated = programs.filter(p => !ids.includes(p.id));
    setPrograms(updated);
    localStorage.setItem("school_admin_programs", JSON.stringify(updated));
    setSelectedRowIds(new Set());
  };

  const openDeleteDialog = (id: string, name: string) => { 
    setDeleteId(id); 
    setDeleteName(name); 
  };
  
  const handleDelete = () => {
    if (deleteId) {
      const updated = programs.filter(p => p.id !== deleteId);
      setPrograms(updated);
      localStorage.setItem("school_admin_programs", JSON.stringify(updated));
      setDeleteId(null);
    }
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
          aria-label={`Select program ${row.id}`}
        />
      ),
    },
    { 
      header: 'Program Name', 
      accessor: 'name' as const, 
      cell: (v: string) => <span className="font-semibold text-foreground">{v}</span> 
    },
    { 
      header: 'Level', 
      accessor: 'level' as const,
      cell: (v: string) => (
        <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary text-[10px]">
          {v}
        </Badge>
      )
    },
    { header: 'Creator', accessor: 'createdBy' as const },
    { 
      header: 'Attached Courses', 
      accessor: 'courseIds' as const,
      cell: (v: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(v || []).map((cId) => {
            const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === cId);
            return (
              <Badge key={cId} variant="secondary" className="text-[10px] font-semibold px-2">
                {course ? course.code : cId}
              </Badge>
            );
          })}
          {(!v || v.length === 0) && <span className="text-muted-foreground text-xs">—</span>}
        </div>
      )
    },
    { 
      header: 'Created', 
      accessor: 'createdAt' as const, 
      cell: (v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    },
    {
      header: 'Actions',
      accessor: 'id_action' as any,
      cell: (_v: any, row: any) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            asChild
          >
            <Link href={`/school-admin/programs/${row.id}/edit`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Link>
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

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
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
        description="Manage all school curriculums, define core structures, and assign teaching modules."
        titleAction={
          <Button onClick={() => router.push("/school-admin/programs/create")} className="gap-2">
            <Plus className="h-4 w-4" />Create New Program
          </Button>
        }
      />
      
      {/* Search & Filters / Stretched Toolbar */}
      {selectedRowIds.size > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-primary/5 p-4 border border-primary/20 rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
              {selectedRowIds.size} Programs Selected
            </div>
            <p className="text-xs text-muted-foreground hidden sm:inline">
              Perform bulk actions on all selected academic program modules
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete} 
              className="text-xs h-10 gap-1.5 px-4 flex-1 sm:flex-initial"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
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
          <div className="flex flex-1 gap-3 w-full md:max-w-[500px] items-center">
            {/* Search query */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search programs by title or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background"
              />
            </div>
            
            {/* Level filter */}
            <div className="w-[160px]">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Level" />
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

          {/* View Toggler (Grid vs Table) */}
          <div className="flex border rounded-lg bg-background p-1 border-border self-stretch md:self-auto shrink-0 shadow-sm">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 gap-1 text-xs"
              title="Grid view"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 gap-1 text-xs"
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>
      )}

      {/* Grid view option ("Data List View" cards) */}
      {viewMode === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed rounded-xl bg-muted/20">
              <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground">No Academic Programs Found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Try refining your search terms or create a new program.</p>
            </div>
          ) : (
            filteredPrograms.map((prog) => (
              <Card key={prog.id} className="border hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-bold text-[10px]">
                      {prog.level}
                    </Badge>
                    <Checkbox
                      checked={selectedRowIds.has(prog.id)}
                      onCheckedChange={() => toggleSelectRow(prog.id)}
                      className="transition-opacity opacity-60 group-hover:opacity-100"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {prog.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {prog.description.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>

                  {/* Assigned Courses */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Curriculum Courses
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(prog.courseIds || []).map((cId: string) => {
                        const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === cId);
                        return (
                          <Badge key={cId} variant="outline" className="text-[9px] font-bold font-mono py-0 px-2 bg-muted/30">
                            {course ? course.code : cId}
                          </Badge>
                        );
                      })}
                      {(!prog.courseIds || prog.courseIds.length === 0) && (
                        <span className="text-muted-foreground text-xs italic">No attached courses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer and Controls */}
                <div className="p-4 bg-muted/20 border-t flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
                  <div className="flex flex-col">
                    <span>By {prog.createdBy}</span>
                    <span className="flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" /> {new Date(prog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <Link href={`/school-admin/programs/${prog.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => openDeleteDialog(prog.id, prog.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Table View option */
        <Card className="hover:shadow-md transition-shadow p-2">
          <div className="p-3 border-b bg-muted/10 rounded-t-lg flex items-center gap-3">
            <Checkbox 
              checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredPrograms.length}
              onCheckedChange={toggleSelectAll}
              id="select-all"
            />
            <Label htmlFor="select-all" className="text-xs font-semibold cursor-pointer text-foreground/80">
              Select All {filteredPrograms.length > 0 ? `(${filteredPrograms.length})` : ""}
            </Label>
          </div>
          <DataTable 
            columns={enhancedColumns} 
            data={filteredPrograms} 
            pageSize={10} 
            emptyMessage="No programs found matching your criteria." 
          />
        </Card>
      )}
      
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
