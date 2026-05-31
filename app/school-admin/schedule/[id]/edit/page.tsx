"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, AlignLeft, BookOpen,
  ArrowLeft, CheckCircle, AlertCircle, Save
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MOCK_INSTRUCTOR_COURSES, MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";
import type { ScheduleEvent } from "@/lib/instructor-types";

// Helper to format date as YYYY-MM-DD in local time
const formatDateLocal = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to format time as HH:MM
const formatTimeLocal = (date: Date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [description, setDescription] = useState("");

  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load events and populate
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_schedule_events");
    let loadedEvents: ScheduleEvent[] = [];
    if (saved) {
      try {
        loadedEvents = JSON.parse(saved);
        setEvents(loadedEvents);
      } catch (e) {
        console.error("Failed to parse events", e);
        loadedEvents = MOCK_SCHEDULE_EVENTS;
        setEvents(loadedEvents);
      }
    } else {
      loadedEvents = MOCK_SCHEDULE_EVENTS;
      setEvents(loadedEvents);
    }

    const targetEvent = loadedEvents.find(e => e.id === id);
    if (targetEvent) {
      setTitle(targetEvent.title);
      setType(targetEvent.type);
      setCourseId(targetEvent.courseId);
      setDate(formatDateLocal(targetEvent.startTime));
      setStartTime(formatTimeLocal(targetEvent.startTime));
      setEndTime(formatTimeLocal(targetEvent.endTime));
      setLocation(targetEvent.location || "");
      setMeetingLink(targetEvent.meetingLink || "");
      setDescription(targetEvent.description || "");
    }

    setLoaded(true);
  }, [id]);

  const targetEvent = useMemo(() => {
    return events.find(e => e.id === id);
  }, [events, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!title.trim()) {
      setErrorMsg("Please enter an event title.");
      return;
    }
    if (!type) {
      setErrorMsg("Please select an event type.");
      return;
    }
    if (!date) {
      setErrorMsg("Please select a date.");
      return;
    }
    if (!startTime || !endTime) {
      setErrorMsg("Please specify start and end times.");
      return;
    }

    // Time validation
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    if (startH > endH || (startH === endH && startM >= endM)) {
      setErrorMsg("End time must be after start time.");
      return;
    }

    try {
      // Timezone-safe local date parsing
      const [yr, mo, dy] = date.split("-").map(Number);
      const startDateTime = new Date(yr, mo - 1, dy, startH, startM);
      const endDateTime = new Date(yr, mo - 1, dy, endH, endM);

      const updatedEvents = events.map(evt => {
        if (evt.id === id) {
          return {
            ...evt,
            title: title.trim(),
            type: type as any,
            courseId: courseId,
            startTime: startDateTime,
            endTime: endDateTime,
            location: location.trim() || undefined,
            meetingLink: meetingLink.trim() || undefined,
            description: description.trim() || undefined,
          };
        }
        return evt;
      });

      localStorage.setItem("school_admin_schedule_events", JSON.stringify(updatedEvents));
      setSuccess(true);
      setTimeout(() => {
        router.push(`/school-admin/schedule/${id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save changes. Please verify inputs.");
    }
  };

  if (!loaded) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading event editor...</p>
      </div>
    );
  }

  if (!targetEvent) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-md mx-auto py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mt-4">Event Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">
          The event you are trying to edit doesn't exist.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/school-admin/schedule">Back to Calendar</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
        <h2 className="text-2xl font-bold text-foreground">Changes Saved!</h2>
        <p className="text-muted-foreground text-sm">
          The event was updated successfully. Redirecting back to event details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Schedule", href: "/school-admin/schedule" },
          { label: "Event Details", href: `/school-admin/schedule/${id}` },
          { label: "Edit Event" },
        ]}
      />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
          <Link href={`/school-admin/schedule/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Event</h1>
      </div>

      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold text-foreground">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-background"
            />
          </div>

          {/* Grid: Type & Course */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="font-semibold text-foreground">Event Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="h-11 bg-background">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="office-hours">Office Hours</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="font-semibold text-foreground">Associated Course *</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="course" className="h-11 bg-background">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_INSTRUCTOR_COURSES.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid: Date, Start Time, End Time */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime" className="font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" /> End Time *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          {/* Grid: Physical Location vs Virtual Link */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Physical Location
              </Label>
              <Input
                id="location"
                placeholder="e.g. Room 101, Main Block"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink" className="font-semibold text-foreground flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-muted-foreground" /> Virtual Meeting Link
              </Label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="e.g. https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold text-foreground flex items-center gap-1.5">
              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" /> Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed agenda, prerequisites, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" type="button" className="h-11 px-5" asChild>
              <Link href={`/school-admin/schedule/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" className="h-11 px-6 gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
