"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar as CalendarIcon, Clock, Link as LinkIcon, MapPin } from "lucide-react";
import { format } from "date-fns";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";
import { toast } from "sonner";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  
  const event = MOCK_SCHEDULE_EVENTS.find(e => e.id === unwrappedParams.id);

  const [eventType, setEventType] = useState("course");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
        setEventType(event.title.includes("Personal") ? "personal" : event.type === "lecture" ? "course" : "group");
        setTitle(event.title);
        
        const start = new Date(event.startTime);
        setStartDate(format(start, "yyyy-MM-dd"));
        setStartTime(format(start, "HH:mm"));

        if (event.endTime) {
            const end = new Date(event.endTime);
            setEndDate(format(end, "yyyy-MM-dd"));
            setEndTime(format(end, "HH:mm"));
        } else {
            setEndDate(format(start, "yyyy-MM-dd"));
            setEndTime(format(new Date(start.getTime() + 60*60*1000), "HH:mm")); // add 1 hour default
        }

        setIsAllDay(false);
        setLocation(event.location || "");
        setMeetingUrl(event.meetingLink || "");
        setDescription(event.description || "");
    }
  }, [event]);

  if (!event) {
    return (
        <div className="p-8 text-center text-red-500 max-w-2xl mx-auto mt-12 bg-red-50 rounded-xl border border-red-100">
            Resource not found. The event may have been deleted or does not exist.
            <div className="mt-4">
                <Button variant="outline" asChild><Link href="/instructor/schedule">Go Back</Link></Button>
            </div>
        </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || (!isAllDay && !startTime) || (!isAllDay && !endTime)) {
        toast.error("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
        try { toast.success("Event successfully updated!"); } catch(e) {}
        router.push("/instructor/schedule");
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
          <Breadcrumb 
            showHome={false}
            items={[
              { label: "Dashboard", href: "/instructor" },
              { label: "Schedule", href: "/instructor/schedule" },
              { label: "Edit Event" }
            ]} 
          />
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/instructor/schedule">
              <ChevronLeft className="h-4 w-4" /> Back to Calendar
            </Link>
          </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* PREMIUM CARD HEADER */}
        <div className="p-6 md:p-8 border-b bg-gradient-to-b from-background to-muted/10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 shadow-sm">
                <img src="https://img.icons8.com/color/96/planner.png" alt="Edit Event" className="h-7 w-7 filter drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">Edit Event</h1>
              <p className="text-muted-foreground mt-1 text-sm">Update the details of your scheduled occurrence below.</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
            <form onSubmit={handleUpdate} className="space-y-8">
                
                {/* Event Type Configuration */}
                <div className="space-y-4 bg-muted/20 p-5 rounded-lg border">
                    <Label className="text-base font-semibold block border-b pb-2">1. Event Type Category <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                        value={eventType} 
                        onValueChange={setEventType} 
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <Label 
                            className={`flex flex-col items-center justify-center border-2 rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors ${eventType === "personal" ? "border-primary bg-primary/5" : "border-muted"}`}
                        >
                            <RadioGroupItem value="personal" className="sr-only" />
                            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <img src="https://img.icons8.com/color/96/user-male-circle--v1.png" className="h-6 w-6" alt="Personal" />
                            </div>
                            <span className="font-semibold text-sm">Personal Event</span>
                            <span className="text-xs text-muted-foreground text-center mt-1">Only visible to you</span>
                        </Label>
                        
                        <Label 
                            className={`flex flex-col items-center justify-center border-2 rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors ${eventType === "course" ? "border-primary bg-primary/5" : "border-muted"}`}
                        >
                            <RadioGroupItem value="course" className="sr-only" />
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                                <img src="https://img.icons8.com/color/96/books.png" className="h-6 w-6" alt="Course" />
                            </div>
                            <span className="font-semibold text-sm">Course Event</span>
                            <span className="text-xs text-muted-foreground text-center mt-1">Visible to enrolled students</span>
                        </Label>

                        <Label 
                            className={`flex flex-col items-center justify-center border-2 rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors ${eventType === "group" ? "border-primary bg-primary/5" : "border-muted"}`}
                        >
                            <RadioGroupItem value="group" className="sr-only" />
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                                <img src="https://img.icons8.com/color/96/user-group-man-man.png" className="h-6 w-6" alt="Group" />
                            </div>
                            <span className="font-semibold text-sm">Group Event</span>
                            <span className="text-xs text-muted-foreground text-center mt-1">For specific assigned groups</span>
                        </Label>
                    </RadioGroup>
                </div>

                {/* Core Details */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-semibold">Event Title <span className="text-red-500">*</span></Label>
                        <Input 
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Midterm Exam Prep Session"
                            className="text-lg bg-muted/50 h-12"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border">
                                <Label className="text-sm font-semibold mb-0">All Day Event</Label>
                                <Switch checked={isAllDay} onCheckedChange={setIsAllDay} />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Starts <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="date" className="pl-9" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                    </div>
                                    {!isAllDay && (
                                        <div className="relative w-[140px]">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="time" className="pl-9" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Ends {isAllDay ? "" : <span className="text-red-500">*</span>}</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="date" className="pl-9" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                    </div>
                                    {!isAllDay && (
                                        <div className="relative w-[140px]">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="time" className="pl-9" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-semibold">Physical Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Room 402, Science Building" className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meetingUrl" className="text-sm font-semibold">Virtual Meeting URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="meetingUrl" type="url" value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="pl-9" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold">Event Description</Label>
                    <p className="text-xs text-muted-foreground mb-2">Provide any required instructions, agendas, or pre-requisite reading materials for your attendees.</p>
                    <ForumRichEditor content={description} onChange={setDescription} placeholder="Let participants know what to expect..." />
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t mt-8">
                    <Button type="button" variant="ghost" asChild>
                        <Link href="/instructor/schedule">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[140px] shadow-sm">
                        {isSubmitting ? "Updating..." : "Update Event"}
                    </Button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
