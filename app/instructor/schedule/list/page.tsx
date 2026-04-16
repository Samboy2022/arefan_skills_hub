"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Clock, MapPin, Video, Eye, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";
import type { ScheduleEvent } from "@/lib/instructor-types";

const TYPE_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  lecture:        { pill: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",        dot: "bg-blue-500",    label: "Lecture" },
  exam:           { pill: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",              dot: "bg-red-500",     label: "Exam" },
  deadline:       { pill: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",   dot: "bg-amber-500",   label: "Deadline" },
  "office-hours": { pill: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800", dot: "bg-purple-500", label: "Office Hours" },
  meeting:        { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", label: "Meeting" },
};

function typeStyle(type: string) {
  return TYPE_STYLES[type] ?? TYPE_STYLES["lecture"];
}

const ALL_TYPES = ["all", "lecture", "exam", "deadline", "office-hours", "meeting"] as const;
type FilterType = typeof ALL_TYPES[number];

export default function ManageEventsPage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(MOCK_SCHEDULE_EVENTS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEvent | null>(null);

  const filtered = [...events]
    .filter(e => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || e.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleDelete = () => {
    if (!deleteTarget) return;
    setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Schedule & Calendar", href: "/instructor/schedule" },
          { label: "Manage Events" },
        ]}
      />

      <PageHeader
        title="Manage Events"
        description="Search, view, edit or delete any scheduled event"
        action={
          <Link href="/instructor/schedule/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Event
            </Button>
          </Link>
        }
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`h-9 px-3 rounded-md text-xs font-semibold border transition-colors capitalize
                ${filterType === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"}`}
            >
              {t === "all" ? "All" : TYPE_STYLES[t]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="text-xs text-muted-foreground">
        Showing {filtered.length} of {events.length} events
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-muted/20 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No events match your search.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(event => {
            const s = typeStyle(event.type);
            return (
              <Card key={event.id}
                className="border-border hover:border-primary/30 transition-all hover:shadow-md group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  {/* Color dot */}
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${s.pill}`}>
                    <div className={`h-3 w-3 rounded-full ${s.dot}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] uppercase font-bold border ${s.pill}`}>{s.label}</Badge>
                    </div>
                    <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.startTime), "MMM do, yyyy · h:mm a")}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                      )}
                      {event.meetingLink && (
                        <span className="flex items-center gap-1 text-primary">
                          <Video className="h-3 w-3" /> Virtual
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" asChild>
                      <Link href={`/instructor/schedule/${event.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" asChild>
                      <Link href={`/instructor/schedule/${event.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => setDeleteTarget(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.title}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
