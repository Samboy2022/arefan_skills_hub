"use client";

import { use } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { ArrowLeft, Calendar, Clock, User, Video, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useStudentMeeting } from "@/lib/hooks/use-student-meetings";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { meeting, isLoading } = useStudentMeeting(id);

  if (isLoading) return <div className="flex items-center justify-center py-32 text-muted-foreground">Loading…</div>;
  if (!meeting) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
      <Video className="h-12 w-12 opacity-30" />
      <p>Meeting not found.</p>
      <Button asChild variant="outline"><Link href="/student/live-classes"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
    </div>
  );

  const startDate = new Date(meeting.start_time);
  const validDate = isValid(startDate);
  const now = new Date();
  const minsUntilStart = (startDate.getTime() - now.getTime()) / 60_000;
  const canJoin = meeting.status === "live" || (meeting.status === "upcoming" && minsUntilStart <= 15);
  const thresholdMinutes = Math.ceil(meeting.duration * 0.8);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "Live Classes", href: "/student/live-classes" },
        { label: meeting.name },
      ]} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeader
            title={meeting.name}
            description={`Hosted by ${meeting.creator.name}`}
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {meeting.status === "live" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Now
            </span>
          )}
          {canJoin ? (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href={`/student/live-classes/${meeting.id}/join`}>
                <Video className="h-4 w-4 mr-2" />
                Join Now
              </Link>
            </Button>
          ) : meeting.status === "upcoming" ? (
            <Button disabled title={`Class starts in ${Math.round(minsUntilStart)} minutes`}>
              <Clock className="h-4 w-4 mr-2" />
              Starts in {Math.round(minsUntilStart)} min
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card className="border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Session Details</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meeting.creator.avatar_url} />
                      <AvatarFallback className="text-[10px]">
                        {meeting.creator.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{meeting.creator.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled Date</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {validDate ? format(startDate, "MMMM dd, yyyy") : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {validDate ? format(startDate, "hh:mm a") : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{meeting.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Video className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{meeting.status}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Attendance Requirement</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    80% — {thresholdMinutes} min of {meeting.duration} min
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                {meeting.attendance.status === "present" ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : meeting.attendance.status === "absent" ? (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Your Attendance</p>
                  <p className={cn(
                    "text-sm font-semibold mt-0.5",
                    meeting.attendance.status === "present" ? "text-emerald-600 dark:text-emerald-400" :
                    meeting.attendance.status === "absent" ? "text-red-600 dark:text-red-400" :
                    "text-muted-foreground"
                  )}>
                    {meeting.attendance.status === "present"
                      ? `✓ Present (${meeting.attendance.percentage}%)`
                      : meeting.attendance.status === "absent"
                      ? `✗ Absent (${meeting.attendance.percentage}%)`
                      : "Pending —"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          {meeting.description && (
            <Card className="border-border p-5 space-y-2">
              <h2 className="font-semibold text-foreground">About This Session</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{meeting.description}</p>
            </Card>
          )}
        </div>

        {/* Right sidebar — Attendance Policy */}
        <div className="space-y-4">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  Attendance Policy
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                  You must be present in the session for at least{" "}
                  <strong>{thresholdMinutes} minutes</strong> (80% of {meeting.duration} min) to be
                  recorded as <strong>Present</strong>. The app will track this automatically once you
                  join.
                </p>
              </div>
            </div>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/student/live-classes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Live Classes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
