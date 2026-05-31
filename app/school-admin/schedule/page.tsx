"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Calendar, CalendarDays, CalendarRange, List, MapPin,
  Clock, Video, Search, ChevronLeft, ChevronRight, Edit, Trash2,
  X, ExternalLink, BookOpen
} from "lucide-react";
import {
  format, addDays, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths, startOfMonth,
  endOfMonth
} from "date-fns";

import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";
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

// ─── Event Preview Popover ────────────────────────────────────────────────────

interface EventPreviewProps {
  event: ScheduleEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function EventPreview({ event, onClose, onDelete }: EventPreviewProps) {
  const s = typeStyle(event.type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <Card
        className="relative z-10 w-full max-w-sm border-border bg-card shadow-2xl rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Color bar */}
        <div className={`h-1.5 w-full ${s.dot}`} />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${s.pill} mb-2`}>
                {s.label}
              </Badge>
              <h3 className="font-bold text-base text-foreground leading-snug">{event.title}</h3>
            </div>
            <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Meta */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
              <span>
                {format(new Date(event.startTime), "EEEE, MMM do · h:mm a")}
                {" — "}
                {format(new Date(event.endTime), "h:mm a")}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                <span>{event.location}</span>
              </div>
            )}
            {event.meetingLink && (
              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                <a href={event.meetingLink} target="_blank" rel="noopener noreferrer"
                   className="text-primary underline underline-offset-2 flex items-center gap-1 hover:text-primary/80 transition-colors">
                  Join Virtual Meeting <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {event.description && (
              <p className="text-foreground/70 text-xs leading-relaxed border-t border-border pt-2 mt-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 border-t border-border">
            <Button size="sm" variant="outline" className="flex-1 gap-1.5" asChild>
              <Link href={`/school-admin/schedule/${event.id}`}>
                <BookOpen className="h-3.5 w-3.5" /> Details
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 px-3" asChild>
              <Link href={`/school-admin/schedule/${event.id}/edit`}>
                <Edit className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="sm" variant="outline"
              className="gap-1.5 px-3 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
              onClick={() => { onDelete(event.id); onClose(); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [activeView, setActiveView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewEvent, setPreviewEvent] = useState<ScheduleEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_schedule_events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events, falling back to mock", e);
        setEvents(MOCK_SCHEDULE_EVENTS);
      }
    } else {
      setEvents(MOCK_SCHEDULE_EVENTS);
      localStorage.setItem("school_admin_schedule_events", JSON.stringify(MOCK_SCHEDULE_EVENTS));
    }
  }, []);

  // Live clock for current-time indicator
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const getEventsForDay = useCallback((day: Date) =>
    events.filter(e => isSameDay(new Date(e.startTime), day)),
  [events]);

  const confirmDelete = () => {
    if (deleteId) {
      const updated = events.filter(e => e.id !== deleteId);
      setEvents(updated);
      localStorage.setItem("school_admin_schedule_events", JSON.stringify(updated));
      setDeleteId(null);
    }
  };

  const navigate = (dir: -1 | 1) => {
    if (activeView === "month") setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    if (activeView === "week") setCurrentDate(addDays(currentDate, dir * 7));
    if (activeView === "day")  setCurrentDate(addDays(currentDate, dir));
  };

  // ── Header label ────────────────────────────────────────────────────────────
  const headerLabel = (() => {
    if (activeView === "month") return format(currentDate, "MMMM yyyy");
    if (activeView === "week") return `${format(startOfWeek(currentDate), "MMM d")} – ${format(endOfWeek(currentDate), "MMM d, yyyy")}`;
    return format(currentDate, "EEEE, MMMM do, yyyy");
  })();

  // ── MONTH VIEW ──────────────────────────────────────────────────────────────
  const renderMonthView = () => {
    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate   = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayEvents   = getEventsForDay(day);
            const inMonth     = isSameMonth(day, currentDate);
            const isToday     = isSameDay(day, new Date());
            const showEvents  = dayEvents.slice(0, 2);
            const overflow    = dayEvents.length - showEvents.length;

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[110px] p-1.5 border-r border-b transition-colors group cursor-pointer
                  ${idx % 7 === 6 ? "border-r-0" : ""}
                  ${!inMonth ? "bg-muted/5" : "hover:bg-muted/10"}`}
                onClick={() => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  router.push(`/school-admin/schedule/create?date=${dateStr}`);
                }}
              >
                {/* Date number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? "bg-primary text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground/40"}`}>
                    {format(day, "d")}
                  </span>
                  <Plus className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Event pills */}
                <div className="flex flex-col gap-0.5">
                  {showEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={e => { e.stopPropagation(); setPreviewEvent(event); }}
                      className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded truncate border font-medium
                        leading-4 transition-opacity hover:opacity-80 ${typeStyle(event.type).pill}`}
                      title={event.title}
                    >
                      {format(new Date(event.startTime), "h:mm")} {event.title}
                    </button>
                  ))}
                  {overflow > 0 && (
                    <span className="text-[10px] text-muted-foreground font-medium px-1 leading-4">
                      +{overflow} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── WEEK VIEW ───────────────────────────────────────────────────────────────
  const renderWeekView = () => {
    const days = eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) });
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM – 8 PM
    const CELL_H = 64; // px per hour
    const todayIdx = days.findIndex(d => isSameDay(d, new Date()));
    const nowPct = (currentTime.getHours() - 7 + currentTime.getMinutes() / 60) * CELL_H;

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Day header row */}
          <div className="grid border-b bg-muted/30" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div className="p-2 border-r" />
            {days.map(day => (
              <div key={day.toISOString()}
                className={`p-2 text-center border-r last:border-r-0 ${isSameDay(day, new Date()) ? "bg-primary/5" : ""}`}>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{format(day, "EEE")}</div>
                <div
                  className={`text-lg font-bold mt-0.5 cursor-pointer hover:text-primary transition-colors
                    ${isSameDay(day, new Date()) ? "text-primary" : "text-foreground"}`}
                  onClick={() => { setCurrentDate(day); setActiveView("day"); }}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative">
            {/* Current-time red line */}
            {todayIdx >= 0 && (
              <div
                className="absolute z-20 flex items-center pointer-events-none"
                style={{
                  top: `${nowPct}px`,
                  left: `calc(60px + ${todayIdx} * (100% - 60px) / 7)`,
                  width: `calc((100% - 60px) / 7)`,
                }}
              >
                <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                <div className="h-px flex-1 bg-red-500" />
              </div>
            )}

            {hours.map(hour => (
              <div key={hour} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: "60px repeat(7, 1fr)", height: `${CELL_H}px` }}>
                <div className="border-r px-2 flex items-start pt-1">
                  <span className="text-[10px] text-muted-foreground font-medium -mt-2 relative">
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
                {days.map(day => {
                  const slotEvents = getEventsForDay(day).filter(e => new Date(e.startTime).getHours() === hour);
                  return (
                    <div key={day.toISOString()}
                      className="border-r last:border-r-0 relative hover:bg-muted/10 transition-colors cursor-pointer"
                      onClick={() => {
                        const d2 = new Date(day);
                        d2.setHours(hour, 0, 0, 0);
                        router.push(`/school-admin/schedule/create?date=${format(d2, "yyyy-MM-dd")}`);
                      }}
                    >
                      {slotEvents.map(event => (
                        <button
                          key={event.id}
                          onClick={e => { e.stopPropagation(); setPreviewEvent(event); }}
                          className={`absolute inset-x-0.5 top-0.5 z-10 text-left text-[10px] px-1.5 py-1 rounded border
                            shadow-sm leading-tight overflow-hidden font-medium transition-opacity hover:opacity-80
                            ${typeStyle(event.type).pill}`}
                          title={event.title}
                        >
                          <div className="font-bold truncate">{event.title}</div>
                          <div className="opacity-70">{format(new Date(event.startTime), "h:mm a")}</div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── DAY VIEW ────────────────────────────────────────────────────────────────
  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7);
    const dayEvents = getEventsForDay(currentDate);

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/30 text-center">
          <h2 className="text-lg font-bold text-foreground">{format(currentDate, "EEEE, MMMM do, yyyy")}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} scheduled</p>
        </div>
        <div>
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(e => new Date(e.startTime).getHours() === hour);
            const isCurrentHour = isSameDay(currentDate, new Date()) && currentTime.getHours() === hour;
            return (
              <div key={hour}
                className={`flex border-b last:border-b-0 min-h-[72px] group cursor-pointer
                  ${isCurrentHour ? "bg-primary/5" : "hover:bg-muted/5"} transition-colors`}
                onClick={() => {
                  const d2 = new Date(currentDate);
                  d2.setHours(hour, 0, 0, 0);
                  router.push(`/school-admin/schedule/create?date=${format(d2, "yyyy-MM-dd")}`);
                }}
              >
                <div className="w-20 shrink-0 p-3 border-r text-xs font-medium text-muted-foreground text-right">
                  <span className={isCurrentHour ? "text-primary font-bold" : ""}>
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
                <div className="flex-1 p-2 flex flex-col gap-2">
                  {hourEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={e => { e.stopPropagation(); setPreviewEvent(event); }}
                      className={`w-full text-left p-3 rounded-lg border shadow-sm transition-opacity hover:opacity-80
                        ${typeStyle(event.type).pill}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm truncate">{event.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs opacity-80">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(event.startTime), "h:mm a")} – {format(new Date(event.endTime), "h:mm a")}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {event.location}
                              </span>
                            )}
                            {event.meetingLink && (
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" /> Virtual
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={`text-[10px] uppercase shrink-0 ${typeStyle(event.type).pill} border`}>
                          {typeStyle(event.type).label}
                        </Badge>
                      </div>
                    </button>
                  ))}
                  {hourEvents.length === 0 && (
                    <div className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground transition-opacity flex items-center gap-1 h-full pt-1">
                      <Plus className="h-3 w-3" /> Add event
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Legend ───────────────────────────────────────────────────────────────────
  const renderLegend = () => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2">
      {Object.entries(TYPE_STYLES).map(([key, val]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${val.dot}`} />
          <span className="text-xs text-muted-foreground">{val.label}</span>
        </div>
      ))}
    </div>
  );

  // ── Upcoming sidebar list ────────────────────────────────────────────────────
  const upcoming = [...events]
    .filter(e => new Date(e.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Schedule & Calendar" },
        ]}
      />

      <PageHeader
        title="Schedule & Calendar"
        description="Create and organize appointments, exams, and class schedules."
        titleAction={
          <div className="flex items-center gap-2">
            <Link href="/school-admin/schedule/list">
              <Button variant="outline" className="gap-2 border-border text-foreground">
                <List className="h-4 w-4" /> Manage Events
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Main calendar column ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <h2 className="text-lg font-bold text-foreground px-2">{headerLabel}</h2>
            </div>

            {/* View switcher */}
            <div className="flex items-center border border-border rounded-lg bg-card p-0.5 gap-0.5 self-start sm:self-auto">
              {(["month", "week", "day"] as const).map(v => (
                <Button
                  key={v}
                  variant={activeView === v ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(v)}
                  className="gap-1.5 capitalize"
                >
                  {v === "month" && <CalendarDays className="h-3.5 w-3.5" />}
                  {v === "week" && <CalendarRange className="h-3.5 w-3.5" />}
                  {v === "day" && <Calendar className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          {activeView === "month" && renderMonthView()}
          {activeView === "week" && renderWeekView()}
          {activeView === "day" && renderDayView()}

          {/* Legend */}
          {renderLegend()}
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <Card className="p-4 border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Events
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-2.5">
                {upcoming.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setPreviewEvent(event)}
                    className="w-full text-left flex items-start gap-2.5 group"
                  >
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${typeStyle(event.type).dot}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(event.startTime), "MMM do · h:mm a")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-border">
              <Link href="/school-admin/schedule/list" className="text-xs text-primary hover:underline">
                View all events →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Event Preview Modal */}
      {previewEvent && (
        <EventPreview
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
          onDelete={id => { setDeleteId(id); setPreviewEvent(null); }}
        />
      )}

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
