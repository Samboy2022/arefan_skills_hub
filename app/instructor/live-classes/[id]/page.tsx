"use client";

import { use, useState } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import {
  Video, Trash2, LogIn, Clock, User, Calendar, Lock,
  CheckCircle, XCircle, AlertCircle, Download, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/instructor/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useMeeting } from "@/lib/hooks/use-meetings";
import { AttendanceRecord } from "@/lib/instructor-mock-data";
import { useRouter } from "next/navigation";

const CURRENT_USER_ID = "3";

function StatusBadge({ status }: { status: string }) {
  if (status === "live") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  );
  if (status === "upcoming") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-2.5 py-1 rounded-full">
      <Clock className="h-3 w-3" />
      Upcoming
    </span>
  );
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">Ended</span>;
}

function AttendanceBadge({ status }: { status: AttendanceRecord["status"] }) {
  const map = {
    present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    did_not_join: "bg-muted text-muted-foreground",
  };
  const labels = { present: "Present ✓", partial: "Partial", absent: "Absent ✗", did_not_join: "Did Not Join" };
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", map[status])}>
      {labels[status]}
    </span>
  );
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { meeting } = useMeeting(id);
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  if (!meeting) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
      <Video className="h-12 w-12 opacity-30" />
      <p>Meeting not found.</p>
      <Button asChild variant="outline"><Link href="/instructor/live-classes"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
    </div>
  );

  const startDate = new Date(meeting.start_time);
  const validDate = isValid(startDate);
  const isCreator = meeting.creator.id === CURRENT_USER_ID;
  const now = new Date();
  const minsUntil = (startDate.getTime() - now.getTime()) / 60_000;
  const canStart = meeting.status === "live" || (meeting.status === "upcoming" && minsUntil <= 15);
  const thresholdMinutes = meeting.attendance.threshold_minutes;

  const handleDelete = () => {
    // In production: DELETE /api/meetings/:id
    router.push("/instructor/live-classes");
  };

  const exportCSV = () => {
    if (!meeting.attendance_report) return;
    const rows = [
      ["Student", "Joined At", "Left At", "Minutes Present", "Percentage", "Status"].join(","),
      ...meeting.attendance_report.records.map(r =>
        [r.student_name, r.joined_at, r.left_at, r.minutes_present, r.percentage + "%", r.status].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${meeting.name.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href="/instructor/live-classes" className="hover:text-foreground transition-colors">Live Classes</Link>
        <span>›</span>
        <span className="text-foreground font-medium line-clamp-1">{meeting.name}</span>
      </nav>

      {/* Header */}
      <PageHeader
        title={meeting.name}
        description={`Hosted by ${meeting.creator.name}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={meeting.status} />
            {meeting.status !== "ended" && (
              isCreator ? (
                <Button
                  asChild
                  className={cn("gap-2", canStart ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "")}
                  disabled={!canStart}
                  title={!canStart ? `Class starts in ${Math.round(minsUntil)} minutes` : undefined}
                >
                  <Link href={`/instructor/live-classes/${meeting.id}/start`}>
                    <Video className="h-4 w-4" />
                    Start Call
                  </Link>
                </Button>
              ) : (
                <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href={`/instructor/live-classes/${meeting.id}/start`}>
                    <LogIn className="h-4 w-4" />
                    Join
                  </Link>
                </Button>
              )
            )}
            {isCreator && (
              <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => setShowDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card className="border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Session Details</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: Calendar, label: "Scheduled Date", value: validDate ? format(startDate, "MMMM dd, yyyy") : "—" },
                { icon: Clock, label: "Start Time", value: validDate ? format(startDate, "hh:mm a") : "—" },
                { icon: Clock, label: "Duration", value: `${meeting.duration} minutes` },
                { icon: Video, label: "Meeting ID", value: meeting.zoom.meeting_id },
                { icon: Lock, label: "Password", value: meeting.password ? "●".repeat(meeting.password.length) : "None" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Creator</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meeting.creator.avatar_url} />
                      <AvatarFallback className="text-[10px]">
                        {meeting.creator.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{meeting.creator.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          {meeting.description && (
            <Card className="border-border p-5 space-y-2">
              <h2 className="font-semibold text-foreground">About this Session</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{meeting.description}</p>
            </Card>
          )}

          {/* Attendees */}
          <Card className="border-border p-5 space-y-3">
            <h2 className="font-semibold text-foreground">Attendees ({meeting.attendees.length})</h2>
            <div className="flex flex-wrap gap-3">
              {meeting.attendees.map(a => (
                <div key={a.id} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={a.avatar_url} />
                    <AvatarFallback className="text-[10px]">{a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{a.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Attendance Report (ended only) */}
          {meeting.status === "ended" && meeting.attendance_report && (
            <Card className="border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Attendance Report</h2>
                <Button size="sm" variant="outline" onClick={exportCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
                {[
                  { label: "Present", count: meeting.attendance_report.summary.present, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Partial", count: meeting.attendance_report.summary.partial, color: "text-amber-600 dark:text-amber-400" },
                  { label: "Absent", count: meeting.attendance_report.summary.absent, color: "text-red-600 dark:text-red-400" },
                  { label: "Did Not Join", count: meeting.attendance_report.summary.did_not_join, color: "text-muted-foreground" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="py-4 text-center">
                    <p className={cn("text-2xl font-bold", color)}>{count}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Joined At</TableHead>
                      <TableHead>Left At</TableHead>
                      <TableHead className="text-center">Time Present</TableHead>
                      <TableHead className="text-center">%</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meeting.attendance_report.records.map(r => {
                      const jd = new Date(r.joined_at);
                      const ld = new Date(r.left_at);
                      return (
                        <TableRow key={r.student_id}>
                          <TableCell className="pl-5 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={r.avatar_url} />
                                <AvatarFallback className="text-[10px]">{r.student_name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{r.student_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {isValid(jd) ? format(jd, "hh:mm a") : "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {isValid(ld) ? format(ld, "hh:mm a") : "—"}
                          </TableCell>
                          <TableCell className="text-center text-sm">{r.minutes_present} min</TableCell>
                          <TableCell className="text-center text-sm font-medium">{r.percentage}%</TableCell>
                          <TableCell className="text-center">
                            <AttendanceBadge status={r.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Attendance Settings */}
          <Card className="border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-l-amber-400">
              <h3 className="text-sm font-semibold text-foreground">Attendance Settings</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {[
                ["Tracking", meeting.attendance.tracking_enabled ? "Enabled" : "Disabled"],
                ["Threshold", `${meeting.attendance.threshold_percentage}%  →  ${thresholdMinutes} min of ${meeting.duration} min`],
                ["Grace Period", meeting.attendance.grace_period_minutes === 0 ? "None" : `${meeting.attendance.grace_period_minutes} min`],
                ["Partial Credit", meeting.attendance.allow_partial_credit ? "Allowed" : "Not allowed"],
                ["Student Notification", meeting.attendance.notify_students ? "Visible to students" : "Hidden"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-medium text-foreground mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/instructor/live-classes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Live Classes
            </Link>
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{meeting.name}&quot; and revoke the Zoom session. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
