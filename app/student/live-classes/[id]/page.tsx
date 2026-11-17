"use client";

import { use } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { ArrowLeft, Calendar, Clock, User, Video, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useStudentMeeting } from "@/lib/hooks/use-student-meetings";
import { detailCardClass, detailFooterClass, detailSectionClass, detailWrapClass, emptyBodyClass, emptyStateClass, emptyTitleClass, pillClass, sectionTitleClass } from "@/lib/student-ui";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { meeting, isLoading } = useStudentMeeting(id);

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading">
        <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }
  if (!meeting) {
    return (
      <div className={emptyStateClass}>
        <Video className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className={emptyTitleClass}>Live class not found</h2>
        <p className={emptyBodyClass}>This session may have been cancelled, or the link is incorrect.</p>
        <Button asChild variant="outline" className="mt-6 gap-1.5">
          <Link href="/student/live-classes"><ArrowLeft className="h-4 w-4" /> Back to live classes</Link>
        </Button>
      </div>
    );
  }

  const startDate = new Date(meeting.start_time);
  const validDate = isValid(startDate);
  const now = new Date();
  const minsUntilStart = (startDate.getTime() - now.getTime()) / 60_000;
  const canJoin = meeting.status === "live" || (meeting.status === "upcoming" && minsUntilStart <= 15);
  const thresholdMinutes = Math.ceil(meeting.duration * 0.8);

  const statusPill =
    meeting.status === "live" ? (
      <span className={pillClass("success")}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" /> Live Now
      </span>
    ) : meeting.status === "upcoming" ? (
      <span className={pillClass("info")}><Clock className="h-3 w-3" /> Upcoming</span>
    ) : (
      <span className={pillClass("neutral")}>Ended</span>
    );

  const attendancePill =
    meeting.attendance.status === "present" ? (
      <span className={pillClass("success")}><CheckCircle className="h-3 w-3" /> Present ({meeting.attendance.percentage}%)</span>
    ) : meeting.attendance.status === "absent" ? (
      <span className={pillClass("danger")}><XCircle className="h-3 w-3" /> Absent ({meeting.attendance.percentage}%)</span>
    ) : (
      <span className={pillClass("neutral")}>Pending</span>
    );

  return (
    <div className={detailWrapClass}>
      <Breadcrumb items={[
        { label: "Live Classes", href: "/student/live-classes" },
        { label: meeting.name },
      ]} />

      <Card className={detailCardClass}>
        {/* ── Header ── */}
        <div className={cn(detailSectionClass, "border-b border-border")}>
          <div className="mb-3">{statusPill}</div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">{meeting.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={meeting.creator.avatar_url} alt="" />
              <AvatarFallback className="text-[10px]">
                {meeting.creator.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            Hosted by <span className="font-medium text-foreground">{meeting.creator.name}</span>
          </div>
        </div>

        {/* ── Key details ── */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-muted/30 [&>div]:px-5 [&>div]:py-4 sm:[&>div]:px-6 [&>div]:border-border [&>div:nth-child(odd)]:border-r sm:[&>div:not(:last-child)]:border-r [&>div:nth-child(-n+2)]:border-b sm:[&>div:nth-child(-n+2)]:border-b-0">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Calendar className="h-3.5 w-3.5" /> Date</dt>
            <dd className="text-sm font-semibold text-foreground">{validDate ? format(startDate, "MMM dd, yyyy") : "—"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Clock className="h-3.5 w-3.5" /> Start Time</dt>
            <dd className="text-sm font-semibold text-foreground">{validDate ? format(startDate, "hh:mm a") : "—"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Video className="h-3.5 w-3.5" /> Duration</dt>
            <dd className="text-sm font-semibold text-foreground">{meeting.duration} minutes</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><User className="h-3.5 w-3.5" /> Your Attendance</dt>
            <dd>{attendancePill}</dd>
          </div>
        </dl>

        {/* ── Body ── */}
        <div className={cn(detailSectionClass, "space-y-7")}>
          {meeting.description && (
            <section>
              <h2 className={sectionTitleClass}>About This Session</h2>
              <p className="text-sm text-foreground leading-relaxed">{meeting.description}</p>
            </section>
          )}

          <section>
            <h2 className={sectionTitleClass}>Attendance Requirement</h2>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-950/30">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Attendance Policy · 80% — {thresholdMinutes} min of {meeting.duration} min
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400/90 leading-relaxed">
                  You must be present in the session for at least{" "}
                  <strong>{thresholdMinutes} minutes</strong> (80% of {meeting.duration} min) to be
                  recorded as <strong>Present</strong>. The app will track this automatically once you
                  join.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Footer actions ── */}
        <div className={detailFooterClass}>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/student/live-classes">
              <ArrowLeft className="h-4 w-4" />
              Back to Live Classes
            </Link>
          </Button>
          {canJoin ? (
            <Button asChild className="gap-2 px-6">
              <Link href={`/student/live-classes/${meeting.id}/join`}>
                <Video className="h-4 w-4" />
                Join Now
              </Link>
            </Button>
          ) : meeting.status === "upcoming" ? (
            <Button disabled className="gap-2 px-6" title={`Class starts in ${Math.round(minsUntilStart)} minutes`}>
              <Clock className="h-4 w-4" />
              Starts in {Math.round(minsUntilStart)} min
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
