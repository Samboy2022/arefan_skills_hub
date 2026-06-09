"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, Eye, Users, UserCheck, UserMinus,
  Filter, ShieldCheck, CheckCircle2, MoreHorizontal, GraduationCap,
  BookOpen, Clock, BadgeCheck, AlertCircle
} from "lucide-react";
import { format } from "date-fns";

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
import { Badge } from "@/components/ui/badge";
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

import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { Student } from "@/lib/instructor-types";

export default function StudentsPage() {
  const router = useRouter();
  
  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Bulk Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_students");
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse students, falling back to mock", e);
        setStudents(MOCK_STUDENTS);
      }
    } else {
      setStudents(MOCK_STUDENTS);
      localStorage.setItem("school_admin_students", JSON.stringify(MOCK_STUDENTS));
    }
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = courseFilter === "All" || student.enrolledCourses.includes(courseFilter);
      const matchesStatus = statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, searchTerm, courseFilter, statusFilter]);

  // KPI Calculations
  const metrics = useMemo(() => {
    const counts = {
      total: students.length,
      active: 0,
      others: 0,
    };
    students.forEach(s => {
      if (s.status === "active") counts.active++;
      else counts.others++;
    });
    return counts;
  }, [students]);

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
    const ids = Array.from(selectedRowIds);
    let updated = [...students];

    if (action === "verify" || action === "activate") {
      updated = students.map(s => ids.includes(s.id) ? { ...s, status: "active" as const } : s);
    } else if (action === "suspend") {
      updated = students.map(s => ids.includes(s.id) ? { ...s, status: "inactive" as const } : s);
    } else if (action === "delete") {
      updated = students.filter(s => !ids.includes(s.id));
    }

    setStudents(updated);
    localStorage.setItem("school_admin_students", JSON.stringify(updated));
    setSelectedRowIds(new Set());
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    if (deleteId) {
      const updated = students.filter(s => s.id !== deleteId);
      setStudents(updated);
      localStorage.setItem("school_admin_students", JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Select",
      accessor: "id_select" as any,
      width: "w-[50px]",
      cell: (_v: string, row: Student) => (
        <Checkbox 
          checked={selectedRowIds.has(row.id)}
          onCheckedChange={() => toggleSelectRow(row.id)}
          aria-label={`Select student ${row.id}`}
        />
      ),
    },
    {
      header: "Student",
      accessor: "name" as const,
      cell: (v: string, row: Student) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} alt={v} className="h-8 w-8 rounded-full border shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {v.charAt(0)}
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground leading-tight block">
              {v}
            </span>
            <span className="text-[11px] text-muted-foreground block">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Student ID",
      accessor: "studentId" as const,
      cell: (v: string) => (
        <span className="text-xs font-mono font-semibold px-2 py-1 bg-muted rounded-md text-foreground">
          {v}
        </span>
      ),
    },
    {
      header: "Enrolled Courses",
      accessor: "enrolledCourses" as const,
      cell: (v: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(v || []).map((cId) => {
            const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === cId);
            return (
              <Badge key={cId} variant="secondary" className="text-[10px] px-2 font-semibold">
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
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
          pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          inactive: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
          dropped: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
        };
        return (
          <Badge className={`capitalize px-2 py-0.5 text-[10px] font-bold border ${colors[v] || "bg-secondary text-secondary-foreground"}`}>
            {v}
          </Badge>
        );
      },
    },
    {
      header: "Join Date",
      accessor: "joinDate" as const,
      cell: (v: Date) => format(new Date(v), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessor: "id_action" as any,
      cell: (v: string, row: Student) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile" asChild>
            <Link href={`/school-admin/students/${row.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" asChild>
            <Link href={`/school-admin/students/${row.id}/edit`}>
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
        cell: (_v: any, row: Student) => (
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
          { label: "Students" }
        ]} 
        className="mb-2" 
      />
      
      <PageHeader
        title="Students"
        description="Manage registered students, track active course enrollments, verify credentials, and manage profile records."
        titleAction={
          <Button onClick={() => router.push("/school-admin/students/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Total Students"
          value={metrics.total.toLocaleString()}
          hint="All registered students"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Active Students"
          value={metrics.active.toLocaleString()}
          hint="Attending scheduled courses"
          icon={UserCheck}
          color="purple"
        />
        <KPICard
          title="Pending / Inactive"
          value={metrics.others.toLocaleString()}
          hint="Awaiting verification or suspended"
          icon={UserMinus}
          color="red"
        />
      </div>

      {/* Search & Filters / Bulk Actions Toolbar */}
      {selectedRowIds.size > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-primary/5 p-4 border border-primary/20 rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
              {selectedRowIds.size} Students Selected
            </div>
            <p className="text-xs text-muted-foreground hidden sm:inline">
              Apply a bulk action to all selected student accounts
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
              <Trash2 className="h-4 w-4 shrink-0" />
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
          {/* Left: Search Bar */}
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          
          {/* Right: Select Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Course filter */}
            <div className="w-full sm:w-[180px]">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Enrolled Course" />
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Students Data Card */}
      <Card className="hover:shadow-md transition-shadow p-2">
        <div className="p-3 border-b bg-muted/10 rounded-t-lg flex items-center gap-3">
          <Checkbox 
            checked={selectedRowIds.size > 0 && selectedRowIds.size === filteredStudents.length}
            onCheckedChange={toggleSelectAll}
            id="select-all"
          />
          <Label htmlFor="select-all" className="text-xs font-semibold cursor-pointer text-foreground/80">
            Select All {filteredStudents.length > 0 ? `(${filteredStudents.length})` : ""}
          </Label>
        </div>
        <DataTable
          columns={enhancedColumns}
          data={filteredStudents}
          pageSize={10}
          emptyMessage="No students found matching your query."
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
