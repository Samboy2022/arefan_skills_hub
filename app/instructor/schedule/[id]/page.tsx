"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Video, Pencil, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_SCHEDULE_EVENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

const TYPE_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  lecture:        { pill: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",        dot: "bg-blue-500",    label: "Lecture" },
  exam:           { pill: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",              dot: "bg-red-500",     label: "Exam" },
  deadline:       { pill: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",   dot: "bg-amber-500",   label: "Deadline" },
  "office-hours": { pill: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800", dot: "bg-purple-500", label: "Office Hours" },
  meeting:        { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", label: "Meeting" },
};
function typeStyle(type: string) { return TYPE_STYLES[type] ?? TYPE_STYLES["lecture"]; }

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  const event = MOCK_SCHEDULE_EVENTS.find(e => e.id === id);
  const course = event ? MOCK_INSTRUCTOR_COURSES.find(c => c.id === event.courseId) : null;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-4 font-medium">Event not found.</p>
        <Link href="/instructor/schedule">
          <Button variant="outline">Back to Calendar</Button>
        </Link>
      </div>
    );
  }

  const s = typeStyle(event.type);

  const handleDelete = () => {
    // In production: DELETE /api/events/:id
    router.push("/instructor/schedule");
  };

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Schedule & Calendar", href: "/instructor/schedule" },
          { label: event.title },
        ]}
      />

      <div>
        <Link
          href="/instructor/schedule"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Calendar
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${s.pill} mb-2`}>
              {s.label}
            </Badge>
            <h1 className="text-2xl font-bold text-foreground leading-snug">{event.title}</h1>
            {course && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{course.code}</span> — {course.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/instructor/schedule/${id}/edit`}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className={`h-1 w-16 rounded-full ${s.dot}`} />

      <Card className="p-6 border-border space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Event Details</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                {format(new Date(event.startTime), "EEEE, MMMM do, yyyy")}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {format(new Date(event.startTime), "h:mm a")} — {format(new Date(event.endTime), "h:mm a")}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <span className="text-foreground">{event.location}</span>
            </div>
          )}

          {event.meetingLink && (
            <div className="flex items-start gap-3 text-sm">
              <Video className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 flex items-center gap-1 hover:text-primary/80 transition-colors"
              >
                Join Virtual Meeting <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {event.description && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
            <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
          </div>
        )}
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete <span className="font-semibold text-foreground">{event.title}</span>. This cannot be undone.
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
