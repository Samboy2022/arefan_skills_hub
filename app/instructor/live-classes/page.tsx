"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import {
  Video, Eye, Trash2, Plus, LogIn, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/instructor/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMeetings } from "@/lib/hooks/use-meetings";
import { InstructorMeeting, MeetingStatus } from "@/lib/instructor-mock-data";

const CURRENT_USER_ID = "3"; // mock current user

function StatusBadge({ status }: { status: MeetingStatus }) {
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
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
      Ended
    </span>
  );
}

export default function LiveClassesPage() {
  const { meetings } = useMeetings();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localMeetings, setLocalMeetings] = useState(meetings);

  // Keep local list in sync (would be mutate() with SWR)
  const list = localMeetings.length > 0 ? localMeetings : meetings;

  const handleDelete = () => {
    if (!deleteId) return;
    setLocalMeetings((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
  };

  const counts = useMemo(() => ({
    upcoming: list.filter(m => m.status === "upcoming").length,
    live: list.filter(m => m.status === "live").length,
    ended: list.filter(m => m.status === "ended").length,
    total: list.length,
  }), [list]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Live Classes</span>
      </nav>

      <PageHeader
        title="Live Classes"
        description="Manage and host your virtual live sessions"
        action={
          <Button asChild className="hover:scale-[1.03] transition-transform">
            <Link href="/instructor/live-classes/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Meeting
            </Link>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/video-call.png" alt="Total Sessions" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Sessions</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{counts.total}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4">
            <img src="https://img.icons8.com/scribby/96/clock.png" alt="Upcoming" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Upcoming</p>
              <p className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 leading-none">{counts.upcoming}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/record.png" alt="Live Now" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Live Now</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{counts.live}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center border-l border-border px-4 border-t lg:border-t-0 pt-6 lg:pt-0">
            <img src="https://img.icons8.com/scribby/96/check.png" alt="Completed" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Completed</p>
              <p className="text-3xl font-extrabold text-muted-foreground leading-none">{counts.ended}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border-border overflow-hidden">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center" aria-label="No meetings illustration">
              <Video className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-sm">No live classes yet. Click &apos;+ Create Meeting&apos; to schedule your first session.</p>
            <Button asChild variant="outline">
              <Link href="/instructor/live-classes/create">
                <Plus className="h-4 w-4 mr-2" /> Create Meeting
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[20%] pl-5">Meeting Name</TableHead>
                  <TableHead className="w-[15%]">Description</TableHead>
                  <TableHead className="w-[15%]">Creator</TableHead>
                  <TableHead className="w-[15%]">Date & Time</TableHead>
                  <TableHead className="w-[8%] text-center">Duration</TableHead>
                  <TableHead className="w-[8%] text-center">Threshold</TableHead>
                  <TableHead className="w-[9%] text-center">Status</TableHead>
                  <TableHead className="w-[10%] text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((meeting, i) => {
                  const startDate = new Date(meeting.start_time);
                  const validDate = isValid(startDate);
                  const isCreator = meeting.creator.id === CURRENT_USER_ID;
                  const now = new Date();
                  const minsUntil = (startDate.getTime() - now.getTime()) / 60_000;
                  const canStart = meeting.status === "live" || (meeting.status === "upcoming" && minsUntil <= 15);

                  return (
                    <TableRow
                      key={meeting.id}
                      className={cn(
                        "hover:bg-muted/20 transition-all",
                        i % 2 === 0 ? "" : "bg-muted/5"
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <TableCell className="pl-5 py-4 font-semibold">
                        <Link href={`/instructor/live-classes/${meeting.id}`} className="hover:text-primary transition-colors hover:underline line-clamp-1">
                          {meeting.name}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        <span className="line-clamp-1">
                          {meeting.description.length > 60
                            ? meeting.description.slice(0, 60) + "…"
                            : meeting.description}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={meeting.creator.avatar_url} />
                            <AvatarFallback className="text-[10px]">
                              {meeting.creator.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">{meeting.creator.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        {validDate ? format(startDate, "MMM dd, yyyy · hh:mm a") : "—"}
                      </TableCell>
                      <TableCell className="py-4 text-center text-sm text-muted-foreground">
                        {meeting.duration} min
                      </TableCell>
                      <TableCell className="py-4 text-center text-sm text-muted-foreground">
                        {meeting.attendance.tracking_enabled
                          ? `${meeting.attendance.threshold_percentage}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <StatusBadge status={meeting.status} />
                      </TableCell>
                      <TableCell className="py-4 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          {isCreator && meeting.status !== "ended" && (
                            <Button
                              size="sm"
                              variant={canStart ? "default" : "outline"}
                              asChild
                              className={cn(
                                "h-8 text-xs gap-1",
                                canStart && "bg-emerald-600 hover:bg-emerald-700 text-white"
                              )}
                              title={!canStart ? "Class hasn't started yet" : undefined}
                            >
                              <Link href={`/instructor/live-classes/${meeting.id}/start`}>
                                <Video className="h-3.5 w-3.5" />
                                Start
                              </Link>
                            </Button>
                          )}
                          {!isCreator && meeting.status !== "ended" && (
                            <Button size="sm" variant="outline" asChild className="h-8 text-xs gap-1">
                              <Link href={`/instructor/live-classes/${meeting.id}/start`}>
                                <LogIn className="h-3.5 w-3.5" />
                                Join
                              </Link>
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                            <Link href={`/instructor/live-classes/${meeting.id}`} aria-label="View details">
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          {isCreator && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => setDeleteId(meeting.id)}
                              aria-label="Delete meeting"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meeting and revoke the Zoom session. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
