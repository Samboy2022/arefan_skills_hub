"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Plus, Calendar, CalendarDays, CalendarRange, List, MapPin, 
    Clock, Video, Search, ChevronLeft, ChevronRight, Edit, Trash2, 
    Filter, MoreHorizontal
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";
import { toast } from "sonner";

export default function SchedulePage() {
  const [events, setEvents] = useState(MOCK_SCHEDULE_EVENTS);
  const [activeView, setActiveView] = useState<"month" | "week" | "day" | "manage">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getEventTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      lecture: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      exam: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
      deadline: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      "office-hours": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      meeting: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      personal: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    };
    return styles[type.toLowerCase()] || styles["lecture"];
  };

  const confirmDelete = () => {
    if (deleteId) {
      setEvents(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
      try { toast.success("Event successfully deleted."); } catch(e) {}
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(new Date(e.startTime), day));
  };

  const navigatePrevious = () => {
    if (activeView === "month") setCurrentDate(subMonths(currentDate, 1));
    if (activeView === "week") setCurrentDate(addDays(currentDate, -7));
    if (activeView === "day") setCurrentDate(addDays(currentDate, -1));
  };

  const navigateNext = () => {
    if (activeView === "month") setCurrentDate(addMonths(currentDate, 1));
    if (activeView === "week") setCurrentDate(addDays(currentDate, 7));
    if (activeView === "day") setCurrentDate(addDays(currentDate, 1));
  };

  // Views Generators
  const renderMonthView = () => {
    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm animate-in fade-in duration-500">
        <div className="grid grid-cols-7 border-b bg-muted/20">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[120px] p-2 border-r border-b ${idx % 7 === 6 ? 'border-r-0' : ''} ${!isCurrentMonth ? 'bg-muted/5' : ''} hover:bg-muted/10 transition-colors group cursor-pointer relative`}
              >
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : (isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50')}`}>
                    {format(day, 'd')}
                    </span>
                    {activeView === "month" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                </div>
                
                <div className="mt-2 flex flex-col gap-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div 
                        key={event.id} 
                        className={`text-xs px-2 py-1 rounded truncate border ${getEventTypeStyle(event.title.includes("Personal") ? "personal" : event.type)}`}
                        title={event.title}
                    >
                      {format(new Date(event.startTime), 'h:mm a')} - {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground font-medium px-1">
                      +{dayEvents.length - 3} more
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

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm animate-in fade-in duration-500 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b bg-muted/20">
            <div className="p-3 border-r"></div>
            {days.map(day => (
              <div key={day.toISOString()} className={`p-3 text-center border-r last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-primary/5' : ''}`}>
                <div className="text-xs font-semibold text-muted-foreground uppercase">{format(day, 'EEE')}</div>
                <div className={`text-lg font-bold mt-1 ${isSameDay(day, new Date()) ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b last:border-b-0 h-[60px]">
                <div className="p-2 border-r text-xs text-muted-foreground font-medium text-right relative">
                    <span className="-top-3 relative">{hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</span>
                </div>
                {days.map(day => {
                    // Extremely simplified logic to drop items into full hour blocks for visualization
                    const hourEvents = getEventsForDay(day).filter(e => new Date(e.startTime).getHours() === hour);
                    return (
                        <div key={day.toISOString()} className="border-r last:border-r-0 p-1 hover:bg-muted/10 relative">
                            {hourEvents.map(event => (
                                <div key={event.id} className={`text-xs p-1.5 rounded truncate border shadow-sm ${getEventTypeStyle(event.title.includes("Personal") ? "personal" : event.type)} absolute inset-x-1 top-1 z-10`} title={event.title}>
                                    <div className="font-semibold">{event.title}</div>
                                </div>
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

  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
    const dayEvents = getEventsForDay(currentDate);

    return (
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm animate-in fade-in duration-500">
        <div className="p-4 border-b bg-muted/20 text-center">
            <h2 className="text-xl font-bold text-foreground">{format(currentDate, 'EEEE, MMMM do, yyyy')}</h2>
        </div>
        <div className="relative">
            {hours.map(hour => {
                const hourEvents = dayEvents.filter(e => new Date(e.startTime).getHours() === hour);
                return (
                <div key={hour} className="flex border-b last:border-b-0 min-h-[80px] hover:bg-muted/5 transition-colors">
                    <div className="w-24 p-3 border-r text-sm text-muted-foreground font-medium text-right shrink-0">
                        {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    <div className="flex-1 p-2 flex flex-col gap-2">
                        {hourEvents.map(event => (
                            <div key={event.id} className={`p-3 rounded-lg border shadow-sm ${getEventTypeStyle(event.title.includes("Personal") ? "personal" : event.type)}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm">{event.title}</h4>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs font-medium opacity-80">
                                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {format(new Date(event.startTime), 'h:mm a')}</span>
                                            {event.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-sm" asChild>
                                            <Link href={`/instructor/schedule/${event.id}/edit`}><Edit className="h-3.5 w-3.5" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )
            })}
        </div>
      </div>
    );
  };

  const renderManageView = () => {
    let displayEvents = [...events].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    if (searchQuery) {
        displayEvents = displayEvents.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.type.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search all events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/50"
                />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
                <Filter className="h-4 w-4" /> Filter
            </Button>
        </div>

        <div className="grid gap-4">
            {displayEvents.length > 0 ? displayEvents.map(event => (
                <div key={event.id} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <img 
                            src={
                                event.type === "lecture" ? "https://img.icons8.com/color/96/presentation.png" : 
                                event.type === "exam" ? "https://img.icons8.com/color/96/exam.png" :
                                event.type === "deadline" ? "https://img.icons8.com/color/96/alarm-clock.png" :
                                event.type === "meeting" ? "https://img.icons8.com/color/96/group.png" :
                                "https://img.icons8.com/color/96/calendar--v1.png"
                            } 
                            alt={event.type} 
                            className="h-7 w-7 filter drop-shadow-sm" 
                        />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getEventTypeStyle(event.title.includes("Personal") ? "personal" : event.type)}`}>
                                {event.type.replace("-"," ")}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground truncate">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-foreground/70" /> {format(new Date(event.startTime), 'MMM do, yyyy')}</div>
                            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-foreground/70" /> {format(new Date(event.startTime), 'h:mm a')}</div>
                            {event.location && <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-foreground/70" /> {event.location}</div>}
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/instructor/schedule/${event.id}/edit`}><Edit className="h-4 w-4" /> Edit</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => setDeleteId(event.id)}>
                            <Trash2 className="h-4 w-4" /> Remove
                        </Button>
                    </div>
                </div>
            )) : (
                <div className="text-center p-12 border border-dashed rounded-xl bg-card">
                    <p className="text-muted-foreground font-medium">No events found matching your criteria.</p>
                </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Breadcrumb 
            showHome={false}
            items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "Schedule & Calendar" }
            ]} 
        />
        {activeView !== "manage" && (
            <div className="flex items-center gap-2 bg-card border rounded-lg p-1 shadow-sm">
                <Button variant={activeView === "month" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveView("month")} className="gap-2"><CalendarDays className="h-4 w-4" /> <span className="hidden sm:inline">Month</span></Button>
                <Button variant={activeView === "week" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveView("week")} className="gap-2"><CalendarRange className="h-4 w-4" /> <span className="hidden sm:inline">Week</span></Button>
                <Button variant={activeView === "day" ? "secondary" : "ghost"} size="sm" onClick={() => setActiveView("day")} className="gap-2"><Calendar className="h-4 w-4" /> <span className="hidden sm:inline">Day</span></Button>
            </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule & Calendar</h1>
            <p className="text-muted-foreground mt-1 text-sm">Create and organize your appointments, exams, and classes.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={activeView === "manage" ? "secondary" : "outline"} className="gap-2" onClick={() => setActiveView(activeView === "manage" ? "month" : "manage")}>
                {activeView === "manage" ? <><CalendarDays className="h-4 w-4" /> Show Calendar</> : <><List className="h-4 w-4" /> Manage Event(s)</>}
            </Button>
            <Button className="gap-2" asChild>
                <Link href="/instructor/schedule/create">
                    <Plus className="h-4 w-4" />
                    Add a new event
                </Link>
            </Button>
        </div>
      </div>

      {activeView !== "manage" && (
          <div className="flex items-center justify-between bg-card border p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={navigatePrevious}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={navigateNext}><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" className="ml-2" onClick={() => setCurrentDate(new Date())}>Today</Button>
              </div>
              <h2 className="text-xl font-bold px-4">
                  {activeView === "month" && format(currentDate, 'MMMM yyyy')}
                  {activeView === "week" && `${format(startOfWeek(currentDate), 'MMM do')} - ${format(endOfWeek(currentDate), 'MMM do, yyyy')}`}
                  {activeView === "day" && format(currentDate, 'MMMM do, yyyy')}
              </h2>
              <div className="w-[120px] hidden sm:block"></div> {/* Spacer for center alignment */}
          </div>
      )}

      {/* Render the Active Mode */}
      {activeView === "month" && renderMonthView()}
      {activeView === "week" && renderWeekView()}
      {activeView === "day" && renderDayView()}
      {activeView === "manage" && renderManageView()}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action will completely remove it from the schedule and cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
