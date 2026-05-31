"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Edit, Trash2, BookOpen, Calendar, MapPin, Video,
  Clock, Award, Sparkles, ExternalLink, HelpCircle
} from "lucide-react";
import { format } from "date-fns";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { KPICard } from "@/components/tenant/kpi-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MOCK_SCHEDULE_EVENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { ScheduleEvent } from "@/lib/instructor-types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  lecture:      { pill: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",      dot: "bg-blue-500",    label: "Lecture" },
  exam:         { pill: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",            dot: "bg-red-500",     label: "Exam" },
  deadline:     { pill: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800", dot: "bg-amber-500",   label: "Deadline" },
  "office-hours": { pill: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800", dot: "bg-purple-500", label: "Office Hours" },
  meeting:      { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", label: "Meeting" },
};

function typeStyle(type: string) {
  return TYPE_STYLES[type] ?? TYPE_STYLES["lecture"];
}

export default function ScheduleListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_schedule_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events from localStorage", e);
        setEvents(MOCK_SCHEDULE_EVENTS);
      }
    } else {
      setEvents(MOCK_SCHEDULE_EVENTS);
      localStorage.setItem("school_admin_schedule_events", JSON.stringify(MOCK_SCHEDULE_EVENTS));
    }
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === "All" || event.type === typeFilter;
      const matchCourse = courseFilter === "All" || event.courseId === courseFilter;

      return matchSearch && matchType && matchCourse;
    });
  }, [events, searchTerm, typeFilter, courseFilter]);

  // KPI calculations
  const metrics = useMemo(() => {
    const counts = {
      total: events.length,
      lectures: 0,
      exams: 0,
      others: 0,
    };
    events.forEach(e => {
      if (e.type === "lecture") counts.lectures++;
      else if (e.type === "exam") counts.exams++;
      else counts.others++;
    });
    return counts;
  }, [events]);

  const confirmDelete = () => {
    if (deleteId) {
      const updated = events.filter(e => e.id !== deleteId);
      setEvents(updated);
      localStorage.setItem("school_admin_schedule_events", JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  const getCourseCode = (courseId: string) => {
    const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === courseId);
    return course ? course.code : "—";
  };

  const columns = [
    {
      header: "Title",
      accessor: "title" as const,
      cell: (v: string, row: ScheduleEvent) => (
        <div className="max-w-[280px]">
          <Link
            href={`/school-admin/schedule/${row.id}`}
            className="font-semibold text-foreground hover:text-primary hover:underline transition-colors block truncate"
            title={v}
          >
            {v}
          </Link>
          {row.description && (
            <p className="text-[11px] text-muted-foreground truncate max-w-[250px] mt-0.5">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type" as const,
      cell: (v: string) => {
        const s = typeStyle(v);
        return (
          <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${s.pill}`}>
            {s.label}
          </Badge>
        );
      },
    },
    {
      header: "Course",
      accessor: "courseId" as const,
      cell: (v: string) => (
        <span className="font-mono text-xs font-semibold px-2 py-1 bg-muted rounded-md text-foreground">
          {getCourseCode(v)}
        </span>
      ),
    },
    {
      header: "Date & Time",
      accessor: "startTime" as const,
      cell: (v: Date, row: ScheduleEvent) => {
        const start = new Date(row.startTime);
        const end = new Date(row.endTime);
        return (
          <div className="text-xs text-foreground space-y-0.5">
            <div className="font-medium">{format(start, "EEE, MMM d, yyyy")}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span>
                {format(start, "h:mm a")} – {format(end, "h:mm a")}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Location",
      accessor: "location" as const,
      cell: (v: string, row: ScheduleEvent) => {
        if (row.meetingLink) {
          return (
            <a
              href={row.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline font-medium"
            >
              <Video className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>Virtual Meeting</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          );
        }
        if (v) {
          return (
            <div className="text-xs text-foreground flex items-center gap-1 max-w-[150px] truncate" title={v}>
              <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
              <span>{v}</span>
            </div>
          );
        }
        return <span className="text-muted-foreground text-xs">—</span>;
      },
    },
    {
      header: "Actions",
      accessor: "id" as const,
      cell: (v: string, row: ScheduleEvent) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Details">
            <Link href={`/school-admin/schedule/${row.id}`}>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit">
            <Link href={`/school-admin/schedule/${row.id}/edit`}>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Schedule", href: "/school-admin/schedule" },
          { label: "Manage Events" },
        ]}
      />

      <PageHeader
        title="Schedule Event Manager"
        description="Search, filter, and organize all school schedules, class sessions, and deadlines."
        titleAction={
          <div className="flex items-center gap-2">
            <Link href="/school-admin/schedule">
              <Button variant="outline" className="gap-2 border-border text-foreground">
                <Calendar className="h-4 w-4" /> Calendar View
              </Button>
            </Link>
            <Link href="/school-admin/schedule/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Event
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Events"
          value={metrics.total.toString()}
          hint="All scheduled sessions & milestones"
          icon={Calendar}
          color="blue"
        />
        <KPICard
          title="Lectures"
          value={metrics.lectures.toString()}
          hint="Active educational lectures"
          icon={BookOpen}
          color="purple"
        />
        <KPICard
          title="Exams"
          value={metrics.exams.toString()}
          hint="Tests, quizzes, and midterm exams"
          icon={Award}
          color="red"
        />
        <KPICard
          title="Other Sessions"
          value={metrics.others.toString()}
          hint="Office hours, deadines & meetings"
          icon={Sparkles}
          color="green"
        />
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-muted/20 p-4 border rounded-xl">
        <div className="relative flex-1 w-full md:max-w-[360px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Filter by Type */}
          <div className="w-full sm:w-[160px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="lecture">Lectures</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="office-hours">Office Hours</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Course */}
          <div className="w-full sm:w-[180px]">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="Course Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Courses</SelectItem>
                {MOCK_INSTRUCTOR_COURSES.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} — {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <Card className="hover:shadow-md transition-shadow p-2">
        <DataTable
          columns={columns}
          data={filteredEvents}
          pageSize={10}
          emptyMessage="No schedule events match your query."
        />
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the event from your schedule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
