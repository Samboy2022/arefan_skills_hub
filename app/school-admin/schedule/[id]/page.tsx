"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, AlignLeft, BookOpen,
  ArrowLeft, Edit, Trash2, ExternalLink, AlertTriangle, CheckSquare
} from "lucide-react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_schedule_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events", e);
        setEvents(MOCK_SCHEDULE_EVENTS);
      }
    } else {
      setEvents(MOCK_SCHEDULE_EVENTS);
    }
    setLoaded(true);
  }, []);

  // Find target event
  const event = useMemo(() => {
    return events.find(e => e.id === id);
  }, [events, id]);

  // Find course details
  const course = useMemo(() => {
    if (!event) return null;
    return MOCK_INSTRUCTOR_COURSES.find(c => c.id === event.courseId);
  }, [event]);

  const handleDelete = () => {
    const updated = events.filter(e => e.id !== id);
    localStorage.setItem("school_admin_schedule_events", JSON.stringify(updated));
    router.push("/school-admin/schedule");
  };

  if (!loaded) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-md mx-auto py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mt-4">Event Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">
          The event with ID "{id}" doesn't exist or has been deleted.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/school-admin/schedule">Back to Calendar</Link>
        </Button>
      </div>
    );
  }

  const s = typeStyle(event.type);
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Schedule", href: "/school-admin/schedule" },
          { label: "Event Details" },
        ]}
      />

      {/* Header back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
            <Link href="/school-admin/schedule">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Event Overview</h1>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/school-admin/schedule/${id}/edit`}>
              <Edit className="h-4 w-4" /> Edit Event
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-t-4 shadow-sm" style={{ borderTopColor: `var(--${event.type === 'lecture' ? 'blue' : event.type === 'exam' ? 'red' : 'primary'})` }}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={`text-xs uppercase font-bold px-2.5 py-0.5 border ${s.pill}`}>
                  {s.label}
                </Badge>
                {course && (
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-muted rounded text-foreground">
                    {course.code}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-foreground leading-snug">{event.title}</h2>

              {course && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{course.title}</span>
                    <span className="text-xs block text-muted-foreground mt-0.5">Semester: {course.semester} · Credits: {course.credits}</span>
                  </div>
                </div>
              )}

              {event.description ? (
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Agenda & Details
                  </h3>
                  <div className="bg-card text-foreground/80 text-sm leading-relaxed p-4 rounded-xl border border-dashed whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic pt-2">No description provided for this session.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          {/* Scheduling Sidebar Card */}
          <Card className="p-5 space-y-4 border rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b pb-2">
              <Calendar className="h-4 w-4 text-primary" /> Scheduling Details
            </h3>

            {/* Time */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Date & Time
              </span>
              <p className="text-sm font-semibold text-foreground">{format(start, "EEEE, MMMM do, yyyy")}</p>
              <p className="text-xs text-muted-foreground">
                {format(start, "h:mm a")} – {format(end, "h:mm a")}
              </p>
            </div>

            {/* Location (Physical) */}
            {event.location && (
              <div className="space-y-1 pt-2 border-t">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" /> Physical Venue
                </span>
                <p className="text-sm font-semibold text-foreground">{event.location}</p>
              </div>
            )}

            {/* Virtual Meeting Link */}
            {event.meetingLink && (
              <div className="space-y-2 pt-2 border-t">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-emerald-500" /> Virtual Classroom
                </span>
                <p className="text-xs text-muted-foreground leading-normal">
                  This is a live virtual session. Click below to join the meeting room directly.
                </p>
                <Button className="w-full gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                  <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
                    Join Live Session <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Actions / Navigation Card */}
          <Card className="p-4 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Navigation</h4>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs" asChild>
                <Link href="/school-admin/schedule">
                  <Calendar className="h-3.5 w-3.5 mr-2" /> Calendar View
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs" asChild>
                <Link href="/school-admin/schedule/list">
                  <CheckSquare className="h-3.5 w-3.5 mr-2" /> List Events
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the event "{event.title}"? This will permanently remove it from all calendars and tables.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
