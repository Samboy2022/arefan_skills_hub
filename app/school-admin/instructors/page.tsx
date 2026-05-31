"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Eye, Search, BookOpen, Users,
  Filter, ShieldCheck, BadgeCheck, UserMinus, UserCheck, Trash
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { KPICard } from "@/components/tenant/kpi-card";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockFaculty } from "@/lib/tenant-mock-data";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

// Unified seed data helper mapping courses to CS101, CS201, CS301
const getSeedFaculty = () => {
  const courseMappings: Record<string, string[]> = {
    "1": ["course-1", "course-2"], // Rajesh Sharma: CS101, CS201
    "2": ["course-2"],             // Priya Patel: CS201
    "3": ["course-3"],             // Arun Kumar: CS301
    "4": ["course-1", "course-3"], // Sneha Singh: CS101, CS301
  };
  return mockFaculty.map(f => ({
    ...f,
    assignedCourses: courseMappings[f.id] || ["course-1"],
  }));
};

export default function InstructorsPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_instructors");
    if (saved) {
      try {
        setFaculty(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse faculty, seeding instead", e);
        const seed = getSeedFaculty();
        setFaculty(seed);
        localStorage.setItem("school_admin_instructors", JSON.stringify(seed));
      }
    } else {
      const seed = getSeedFaculty();
      setFaculty(seed);
      localStorage.setItem("school_admin_instructors", JSON.stringify(seed));
    }
  }, []);

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = courseFilter === "All" || f.assignedCourses.includes(courseFilter);
      const matchesStatus = statusFilter === "All" || f.status === statusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [faculty, searchTerm, courseFilter, statusFilter]);

  // KPI Calculations
  const metrics = useMemo(() => {
    const counts = {
      total: faculty.length,
      active: 0,
      inactive: 0,
    };
    faculty.forEach(f => {
      if (f.status === "Active") counts.active++;
      else counts.inactive++;
    });
    return counts;
  }, [faculty]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.size === filteredFaculty.length && filteredFaculty.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredFaculty.map(f => f.id)));
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
    const ids = Array.from(selectedRowIds);
    let updated = [...faculty];

    if (action === "verify" || action === "activate") {
      updated = faculty.map(f => ids.includes(f.id) ? { ...f, status: "Active" } : f);
    } else if (action === "suspend") {
      updated = faculty.map(f => ids.includes(f.id) ? { ...f, status: "Inactive" } : f);
    } else if (action === "delete") {
      updated = faculty.filter(f => !ids.includes(f.id));
    }

    setFaculty(updated);
    localStorage.setItem("school_admin_instructors", JSON.stringify(updated));
    setSelectedRowIds(new Set());
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    if (deleteId) {
      const updated = faculty.filter(f => f.id !== deleteId);
      setFaculty(updated);
      localStorage.setItem("school_admin_instructors", JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Select",
      accessor: "id_select" as any,
      width: "w-[50px]",
      cell: (_v: string, row: any) => (
        <Checkbox 
          checked={selectedRowIds.has(row.id)}
          onCheckedChange={() => toggleSelectRow(row.id)}
          aria-label={`Select instructor ${row.id}`}
        />
      ),
    },
    {
      header: "Instructor",
      accessor: "name" as const,
      cell: (v: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
            {v.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-foreground leading-tight block">{v}</span>
            <span className="text-[11px] text-muted-foreground block">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department" as const,
      cell: (v: string) => <span className="text-sm font-medium text-foreground">{v}</span>,
    },
    {
      header: "Role",
      accessor: "role" as const,
      cell: (v: string) => {
        const color = v === "Lecturer"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200"
          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200";
        return (
          <Badge className={`capitalize px-2 py-0.5 text-[10px] font-bold border ${color}`}>
            {v}
          </Badge>
        );
      },
    },
    {
      header: "Assigned Courses",
      accessor: "assignedCourses" as any,
      cell: (v: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(v || []).map((cId) => {
            const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === cId);
            return (
              <Badge key={cId} variant="secondary" className="text-[10px] px-2 font-semibold font-mono">
                {course ? course.code : cId}
              </Badge>
            );
          })}
          {(!v || v.length === 0) && <span className="text-muted-foreground text-xs">—</span>}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as const,
      cell: (v: string) => {
        const color = v === "Active"
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800";
        return (
          <Badge className={`capitalize px-2 py-0.5 text-[10px] font-bold border ${color}`}>
            {v}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id_action" as any,
      cell: (v: string, row: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile" asChild>
            <Link href={`/school-admin/instructors/${row.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" asChild>
            <Link href={`/school-admin/instructors/edit/${row.id}`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Link>
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
    if (col.header === "Select") {
      return {
        ...col,
        header: "",
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
          { label: "Instructors" },
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Instructors"
        description="Manage all instructors — assign academic courses, specify departments, and track active statuses."
        titleAction={
          <Button onClick={() => router.push("/school-admin/instructors/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Instructor
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Total Instructors"
          value={metrics.total.toString()}
          hint="All registered faculty members"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Active Instructors"
          value={metrics.active.toString()}
          hint="Currently teaching course modules"
          icon={UserCheck}
          color="purple"
        />
        <KPICard
          title="Inactive Instructors"
          value={metrics.inactive.toString()}
          hint="On leave or retired"
          icon={UserMinus}
          color="red"
        />
      </div>

      {/* Bulk Actions Toolbar / Filters */}
      {selectedRowIds.size > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-primary/5 p-4 border border-primary/20 rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
              {selectedRowIds.size} Instructors Selected
            </div>
            <p className="text-xs text-muted-foreground hidden sm:inline">
              Apply a bulk action to all selected instructor accounts
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkAction("verify")} 
              className="text-xs h-10 gap-1.5 px-4 bg-background border-border text-foreground hover:bg-muted transition-colors flex-1 sm:flex-initial"
            >
              <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Verify</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkAction("activate")} 
              className="text-xs h-10 gap-1.5 px-4 bg-background border-border text-foreground hover:bg-muted transition-colors flex-1 sm:flex-initial"
            >
              <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" />
              <span>Activate</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkAction("suspend")} 
              className="text-xs h-10 gap-1.5 px-4 bg-background border-border text-foreground hover:bg-muted transition-colors flex-1 sm:flex-initial"
            >
              <UserMinus className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Suspend</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleBulkAction("delete")} 
              className="text-xs h-10 gap-1.5 px-4 flex-1 sm:flex-initial"
            >
              <Trash className="h-4 w-4 shrink-0" />
              <span>Delete</span>
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
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search instructors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Course filter */}
            <div className="w-full sm:w-[180px]">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Assigned Course" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Courses</SelectItem>
                  {MOCK_INSTRUCTOR_COURSES.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code}
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

      {/* Instructors Data Card */}
      <Card className="hover:shadow-md transition-shadow p-2">
        <div className="p-3 border-b bg-muted/10 rounded-t-lg flex items-center gap-3">
          <Checkbox 
            checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredFaculty.length}
            onCheckedChange={toggleSelectAll}
            id="select-all"
          />
          <Label htmlFor="select-all" className="text-xs font-semibold cursor-pointer text-foreground/80">
            Select All {filteredFaculty.length > 0 ? `(${filteredFaculty.length})` : ""}
          </Label>
        </div>
        <DataTable
          columns={enhancedColumns}
          data={filteredFaculty}
          pageSize={10}
          emptyMessage="No instructors found matching your criteria."
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
