"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { Video, CheckCircle, XCircle, Clock, CalendarClock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStudentMeetings } from "@/lib/hooks/use-student-meetings";
import { StudentMeeting, MeetingStatus } from "@/lib/student-mock-data";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, listCardClass, pageStackClass, pillClass, rowActionClass, statGridClass, tabButtonClass, tabCountClass, tabRowClass, tableHeadClass, tableHeadRowClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";
import { StudentTip } from "@/components/student/tip";

type FilterTab = "all" | "upcoming" | "live" | "ended";

function StatusBadge({ status }: { status: MeetingStatus }) {
  if (status === "live") return (
    <span className={pillClass("success")}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
      Live
    </span>
  );
  if (status === "upcoming") return (
    <span className={pillClass("info")}>
      <Clock className="h-3 w-3" />
      Upcoming
    </span>
  );
  return (
    <span className={pillClass("neutral")}>
      Ended
    </span>
  );
}

function AttendanceBadge({ status, percentage }: { status: string; percentage: number }) {
  if (status === "present") return (
    <span className={pillClass("success")}>
      <CheckCircle className="h-3 w-3" /> Present ({percentage}%)
    </span>
  );
  if (status === "absent") return (
    <span className={pillClass("danger")}>
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
    <Button size="sm" variant="outline" asChild className={rowActionClass}>
      <Link href={`/student/live-classes/${meeting.id}`}>View Summary</Link>
    </Button>
  );
  if (meeting.status === "live" || (meeting.status === "upcoming" && minsUntilStart <= 15)) return (
    <Button size="sm" asChild className={rowActionClass}>
      <Link href={`/student/live-classes/${meeting.id}/join`}>
        <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse motion-reduce:animate-none" />
        Join Now
      </Link>
    </Button>
  );
  return (
    <Button size="sm" variant="outline" asChild className={rowActionClass}>
      <Link href={`/student/live-classes/${meeting.id}`}>
        View Details <ArrowRight className="h-3.5 w-3.5" />
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
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Live Classes" }]} />
      <PageHeader
        title="Live Classes"
        description="Your scheduled and past live sessions with instructors."
      />
      <StudentTip>
        Join up to 15 minutes early. You need 80% of the session to be marked present.
      </StudentTip>

      <div className={statGridClass}>
        <StudentKPICard title="Upcoming Sessions" value={counts.upcoming} icon={CalendarClock} variant="info" />
        <StudentKPICard title="Attended" value={counts.attended} icon={CheckCircle} variant="success" />
        <StudentKPICard title="Missed" value={counts.missed} icon={XCircle} variant="danger" />
        <StudentKPICard title="Total Sessions" value={counts.total} icon={Video} />
      </div>

      {/* Table Card */}
      <Card className={listCardClass}>
        {/* Filter Tabs */}
        <div className={tabRowClass}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={tabButtonClass(filter === tab.key)}
            >
              {tab.label}
              <span className={tabCountClass(filter === tab.key)}>
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
          <div className={emptyStateClass}>
            <Video className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className={emptyTitleClass}>No live classes scheduled yet</h3>
            <p className={emptyBodyClass}>Your instructor will notify you when a session is created.</p>
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
              <TableHeader>
                <TableRow className={tableHeadRowClass}>
                  <TableHead className={cn(tableHeadClass, "w-[24%] pl-5")}>Session Name</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[15%]")}>Instructor</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[17%]")}>Date & Time</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[9%] text-center")}>Duration</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[10%] text-center")}>Status</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[12%] text-center")}>Attendance</TableHead>
                  <TableHead className={cn(tableHeadClass, "w-[13%] text-right pr-5")}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(meeting => {
                  const startDate = new Date(meeting.start_time);
                  const validDate = isValid(startDate);
                  return (
                    <TableRow key={meeting.id} className="hover:bg-muted/30">
                      <TableCell className="pl-5 py-4 font-medium">
                        <Link
                          href={`/student/live-classes/${meeting.id}`}
                          className="hover:text-primary transition-colors hover:underline line-clamp-2 whitespace-normal"
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
