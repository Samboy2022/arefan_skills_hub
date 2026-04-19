"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { Video, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStudentMeetings } from "@/lib/hooks/use-student-meetings";
import { StudentMeeting, MeetingStatus } from "@/lib/student-mock-data";

type FilterTab = "all" | "upcoming" | "live" | "ended";

function StatusBadge({ status }: { status: MeetingStatus }) {
  if (status === "live") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  );
  if (status === "upcoming") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-2 py-0.5 rounded-full">
      <Clock className="h-3 w-3" />
      Upcoming
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
      Ended
    </span>
  );
}

function AttendanceBadge({ status, percentage }: { status: string; percentage: number }) {
  if (status === "present") return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      <CheckCircle className="h-3 w-3" /> Present ({percentage}%)
    </span>
  );
  if (status === "absent") return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
      <XCircle className="h-3 w-3" /> Absent ({percentage}%)
    </span>
  );
  return (
    <span className="text-xs text-muted-foreground">—</span>
  );
}

function ActionButton({ meeting }: { meeting: StudentMeeting }) {
  const now = new Date();
  const startTime = new Date(meeting.start_time);
  const minsUntilStart = (startTime.getTime() - now.getTime()) / 60_000;

  if (meeting.status === "ended") return (
    <Button size="sm" variant="ghost" asChild className="text-muted-foreground shadow-none hover:bg-muted font-medium">
      <Link href={`/student/live-classes/${meeting.id}`}>View Summary</Link>
    </Button>
  );
  if (meeting.status === "live" || (meeting.status === "upcoming" && minsUntilStart <= 15)) return (
    <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-colors font-semibold">
      <Link href={`/student/live-classes/${meeting.id}/join`}>
        <span className="h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse" />
        Join Now
      </Link>
    </Button>
  );
  return (
    <Button size="sm" variant="outline" asChild className="shadow-none hover:bg-muted font-medium text-muted-foreground">
      <Link href={`/student/live-classes/${meeting.id}`}>
        View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </Link>
    </Button>
  );
}

export default function LiveClassesPage() {
  const { meetings } = useStudentMeetings();
  const [filter, setFilter] = useState<FilterTab>("all");

  const counts = useMemo(() => ({
    upcoming: meetings.filter(m => m.status === "upcoming").length,
    attended: meetings.filter(m => m.attendance.status === "present").length,
    missed: meetings.filter(m => m.status === "ended" && m.attendance.status !== "present").length,
    total: meetings.length,
  }), [meetings]);

  const filtered = useMemo(() =>
    filter === "all" ? meetings : meetings.filter(m => m.status === filter),
  [meetings, filter]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "live", label: "Live Now" },
    { key: "ended", label: "Ended" },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Live Classes" }]} />
      <PageHeader
        title="Live Classes"
        description="Your scheduled and past live sessions with instructors."
      />

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center px-4 py-4 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/clock.png" alt="Upcoming Sessions" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Upcoming Sessions</p>
            <p className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 leading-none">{counts.upcoming}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/check.png" alt="Attended" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Attended</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{counts.attended}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/error.png" alt="Missed" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Missed</p>
            <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 leading-none">{counts.missed}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/webcam.png" alt="Total Sessions" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Sessions</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{counts.total}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors -mb-px",
                filter === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                filter === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {tab.key === "all" ? counts.total :
                 tab.key === "upcoming" ? counts.upcoming :
                 tab.key === "ended" ? meetings.filter(m => m.status === "ended").length :
                 meetings.filter(m => m.status === "live").length}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Video className="h-10 w-10 opacity-30" />
            <p className="text-sm">No live classes scheduled yet. Your instructor will notify you when a session is created.</p>
          </div>
        ) : (
          <>
            {/* Mobile card layout */}
          <div className="lg:hidden divide-y divide-border">
              {filtered.map(meeting => {
                const startDate = new Date(meeting.start_time);
                const validDate = isValid(startDate);
                return (
                  <div key={meeting.id} className="px-4 py-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/student/live-classes/${meeting.id}`}
                          className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {meeting.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{meeting.creator.name}</p>
                      </div>
                      <StatusBadge status={meeting.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{validDate ? format(startDate, "MMM dd · hh:mm a") : "—"}</span>
                        <span>{meeting.duration} min</span>
                      </div>
                      <AttendanceBadge
                        status={meeting.attendance.status}
                        percentage={meeting.attendance.percentage}
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <ActionButton meeting={meeting} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table layout */}
            <Table className="w-full table-fixed hidden lg:table">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[25%] pl-5">Session Name</TableHead>
                  <TableHead className="w-[15%]">Instructor</TableHead>
                  <TableHead className="w-[15%]">Date & Time</TableHead>
                  <TableHead className="w-[10%] text-center">Duration</TableHead>
                  <TableHead className="w-[10%] text-center">Status</TableHead>
                  <TableHead className="w-[10%] text-center">Attendance</TableHead>
                  <TableHead className="w-[15%] text-right pr-5">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(meeting => {
                  const startDate = new Date(meeting.start_time);
                  const validDate = isValid(startDate);
                  return (
                    <TableRow key={meeting.id} className="hover:bg-muted/20">
                      <TableCell className="pl-5 py-4 font-medium">
                        <Link
                          href={`/student/live-classes/${meeting.id}`}
                          className="hover:text-primary transition-colors hover:underline line-clamp-1"
                        >
                          {meeting.name}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        {meeting.creator.name}
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        {validDate ? format(startDate, "MMM dd, yyyy · hh:mm a") : "—"}
                      </TableCell>
                      <TableCell className="py-4 text-center text-sm text-muted-foreground">
                        {meeting.duration} min
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <StatusBadge status={meeting.status} />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <AttendanceBadge
                          status={meeting.attendance.status}
                          percentage={meeting.attendance.percentage}
                        />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-5">
                        <ActionButton meeting={meeting} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </Card>
    </div>
  );
}
