"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  FileEdit,
  Trash,
  Eye,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  FileText,
  BookOpen,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { MOCK_ASSIGNMENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { cn } from "@/lib/utils";

type SortField = "dueDate" | "title" | "submissions" | "createdAt";
type SortOrder = "asc" | "desc";
type StatusTab = "all" | "active" | "draft" | "closed";

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "file", label: "File Upload" },
  { value: "essay", label: "Essay" },
  { value: "online", label: "Online Quiz" },
  { value: "discussion", label: "Discussion" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  file: <FileText className="h-3.5 w-3.5" />,
  essay: <BookOpen className="h-3.5 w-3.5" />,
  online: <ClipboardList className="h-3.5 w-3.5" />,
  discussion: <MessageSquare className="h-3.5 w-3.5" />,
};

const COURSE_OPTIONS = [
  { value: "all", label: "All Courses" },
  ...MOCK_INSTRUCTOR_COURSES.map((c) => ({ value: c.id, label: `${c.code} — ${c.title}` })),
];

export default function AssignmentsPage() {
  // --- Data State ---
  const [assignments, setAssignments] = useState<any[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_assignments");
    if (saved) {
      try {
        setAssignments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse assignments, seeding instead", e);
        setAssignments(MOCK_ASSIGNMENTS);
        localStorage.setItem("school_admin_assignments", JSON.stringify(MOCK_ASSIGNMENTS));
      }
    } else {
      setAssignments(MOCK_ASSIGNMENTS);
      localStorage.setItem("school_admin_assignments", JSON.stringify(MOCK_ASSIGNMENTS));
    }
  }, []);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const hasActiveFilters =
    searchQuery !== "" || typeFilter !== "all" || courseFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setCourseFilter("all");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    localStorage.setItem("school_admin_assignments", JSON.stringify(updated));
  };

  // --- Filtered & Sorted Data ---
  const filteredAssignments = useMemo(() => {
    let data = [...assignments];

    // Status tab filter
    if (activeTab !== "all") {
      data = data.filter((a) => a.status === activeTab);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      data = data.filter((a) => a.type === typeFilter);
    }

    // Course filter
    if (courseFilter !== "all") {
      data = data.filter((a) => a.courseId === courseFilter);
    }

    // Sort
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "dueDate":
          cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "submissions":
          cmp = (a.submissions?.length || 0) - (b.submissions?.length || 0);
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return data;
  }, [assignments, searchQuery, typeFilter, courseFilter, activeTab, sortField, sortOrder]);

  // --- Tab Counts ---
  const tabCounts = useMemo(() => {
    const all = assignments.length;
    const active = assignments.filter((a) => a.status === "active").length;
    const draft = assignments.filter((a) => a.status === "draft").length;
    const closed = assignments.filter((a) => a.status === "closed").length;
    return { all, active, draft, closed };
  }, [assignments]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "active")
      return (
        <Badge
          variant="default"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Active
        </Badge>
      );
    if (status === "draft")
      return <Badge variant="secondary">Draft</Badge>;
    return <Badge variant="outline">Closed</Badge>;
  };

  const SortHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "cursor-pointer select-none whitespace-nowrap",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={cn(
            "h-3.5 w-3.5 transition-opacity",
            sortField === field ? "opacity-100 text-primary" : "opacity-30"
          )}
        />
      </div>
    </TableHead>
  );

  const tabs: { key: StatusTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "draft", label: "Draft" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 pb-12 px-4 md:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Assignments" },
        ]}
      />

      {/* Page Header */}
      <div className="pt-2 pb-2">
        <PageHeader
          title="Assignments Database"
          description="Create, manage, and grade student assignments efficiently."
          titleAction={
            <Button asChild className="gap-2 shadow-sm">
              <Link href="/school-admin/assignments/create">
                <Plus className="h-4 w-4" />
                Create Assignment
              </Link>
            </Button>
          }
        />
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="w-full lg:w-44">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Filter */}
          <div className="w-full lg:w-64">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}{" "}
            <span
              className={cn(
                "ml-1 text-xs px-1.5 py-0.5 rounded-full",
                activeTab === tab.key
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredAssignments.length}
          </span>{" "}
          {filteredAssignments.length === 1 ? "assignment" : "assignments"}
          {activeTab !== "all" && (
            <span className="lowercase"> — {activeTab}</span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
        <Table className="w-full min-w-[max-content]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <SortHeader field="title" className="w-[30%]">
                Assignment
              </SortHeader>
              <TableHead className="font-semibold whitespace-nowrap">
                Type
              </TableHead>
              <SortHeader field="dueDate">Due Date</SortHeader>
              <SortHeader field="submissions">Submissions</SortHeader>
              <TableHead className="font-semibold whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold whitespace-nowrap min-w-[150px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-6 w-6 text-muted-foreground opacity-50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        No assignments found
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {hasActiveFilters
                          ? "Try adjusting your filters or search query."
                          : "Get started by creating your first assignment."}
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-1"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((assignment) => {
                const submissionCount = assignment.submissions?.length || 0;
                const gradedCount =
                  assignment.submissions?.filter((s: any) => s.status === "graded")
                    .length || 0;
                const course = MOCK_INSTRUCTOR_COURSES.find(
                  (c) => c.id === assignment.courseId
                );

                return (
                  <TableRow
                    key={assignment.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {assignment.title}
                        </span>
                        <span className="text-sm text-muted-foreground truncate max-w-[280px]">
                          {assignment.description}
                        </span>
                        {course && (
                          <span className="text-xs text-muted-foreground/70">
                            {course.code} — {course.title}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="capitalize bg-muted/50 gap-1.5"
                      >
                        {TYPE_ICONS[assignment.type]}
                        {assignment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(assignment.dueDate)}
                    </TableCell>
                    <TableCell>
                      {submissionCount > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">
                            {submissionCount} total
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {gradedCount} graded
                            {submissionCount > gradedCount && (
                              <span className="text-amber-600 dark:text-amber-400">
                                {" "}
                                — {submissionCount - gradedCount} pending
                              </span>
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          None yet
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
                        >
                          <Link
                            href={`/school-admin/assignments/${assignment.id}/submissions`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 hover:bg-muted"
                        >
                          <Link
                            href={`/school-admin/assignments/edit/${assignment.id}`}
                          >
                            <FileEdit className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Assignment?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the assignment
                                <span className="font-semibold text-foreground">
                                  {" "}
                                  {assignment.title}
                                </span>{" "}
                                and remove all of its data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(assignment.id)} 
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
