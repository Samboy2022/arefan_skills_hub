"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, AlignLeft, BookOpen,
  ArrowLeft, CheckCircle, AlertCircle, PlusCircle
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
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

function CreateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || "";

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [description, setDescription] = useState("");

  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Set date from query parameter if present
  useEffect(() => {
    if (dateParam) {
      setDate(dateParam);
    } else {
      const today = new Date();
      setDate(today.toISOString().split("T")[0]);
    }
  }, [dateParam]);

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

      // Load existing
      const saved = localStorage.getItem("school_admin_schedule_events");
      const currentEvents: ScheduleEvent[] = saved ? JSON.parse(saved) : MOCK_SCHEDULE_EVENTS;

      // Construct new event
      const newEvent: ScheduleEvent = {
        id: `event-${Date.now()}`,
        courseId: courseId || "course-1", // Default to course-1 if none
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: startDateTime,
        endTime: endDateTime,
        type: type as any,
        location: location.trim() || undefined,
        meetingLink: meetingLink.trim() || undefined,
      };

      // Add to list and save
      const updatedEvents = [...currentEvents, newEvent];
      localStorage.setItem("school_admin_schedule_events", JSON.stringify(updatedEvents));

      setSuccess(true);
      setTimeout(() => {
        // Redirect back to calendar
        router.push("/school-admin/schedule");
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create event. Please verify inputs.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
        <h2 className="text-2xl font-bold text-foreground">Event Created!</h2>
        <p className="text-muted-foreground text-sm">
          The event was added successfully. Synchronizing schedule and redirecting back to your calendar...
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
          { label: "Create Event" },
        ]}
      />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
          <Link href="/school-admin/schedule">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Event</h1>
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
              placeholder="e.g. CS101 — Advanced Recursion Lecture"
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

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" type="button" className="h-11 px-5" asChild>
              <Link href="/school-admin/schedule">Cancel</Link>
            </Button>
            <Button type="submit" className="h-11 px-6 gap-2">
              <PlusCircle className="h-4 w-4" /> Create Event
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading creation wizard...</p>
      </div>
    }>
      <CreateEventForm />
    </Suspense>
  );
}
