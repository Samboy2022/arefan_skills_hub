"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AttendanceTracker, AttendanceTrackerBar } from "@/components/student/live-classes/AttendanceTracker";
import { SessionEndedScreen } from "@/components/student/live-classes/SessionEndedScreen";
import { useStudentMeeting } from "@/lib/hooks/use-student-meetings";
import { toast } from "sonner";

type Phase = "loading" | "joined" | "ended";

export default function MeetingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { meeting } = useStudentMeeting(id);

  const [phase, setPhase] = useState<Phase>("loading");
  const [joinTimestamp, setJoinTimestamp] = useState<number>(0);
  const [session, setSession] = useState<{ minutesPresent: number; percentage: number } | null>(null);
  const attendancePostedRef = useRef(false);

  // Simulate SDK init — in production, this is where Zoom SDK loads
  useEffect(() => {
    if (!meeting) return;
    // Restore join timestamp from localStorage (handles page refresh mid-session)
    const stored = localStorage.getItem(`join_${id}_student_current`);
    const ts = stored ? parseInt(stored, 10) : Date.now();
    localStorage.setItem(`join_${id}_student_current`, String(ts));

    const timer = setTimeout(() => {
      setJoinTimestamp(ts);
      setPhase("joined");
    }, 2500); // simulated SDK init delay

    return () => clearTimeout(timer);
  }, [meeting, id]);

  const handleThresholdMet = useCallback((elapsedMinutes: number) => {
    if (attendancePostedRef.current || !meeting) return;
    attendancePostedRef.current = true;

    const percentage = Math.round((elapsedMinutes / meeting.duration) * 100);

    // In production: POST /api/attendance
    console.info("[Attendance] POST /api/attendance", {
      meeting_id: id,
      joined_at: new Date(joinTimestamp).toISOString(),
      minutes_present: elapsedMinutes,
      percentage,
      status: "present",
    });

    toast.success("🎉 Attendance recorded! You've met the required time for this session.", {
      duration: 6000,
    });
  }, [meeting, id, joinTimestamp]);

  const handleLeave = useCallback(() => {
    if (!meeting) return;
    const elapsed = Date.now() - joinTimestamp;
    const minutesPresent = Math.floor(elapsed / 60_000);
    const percentage = Math.round((minutesPresent / meeting.duration) * 100);
    setSession({ minutesPresent, percentage });
    setPhase("ended");
    localStorage.removeItem(`join_${id}_student_current`);
  }, [meeting, id, joinTimestamp]);

  if (!meeting) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
      <Video className="h-12 w-12 opacity-30" />
      <p>Meeting not found.</p>
      <Button asChild variant="outline"><Link href="/student/live-classes"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
    </div>
  );

  const startDate = new Date(meeting.start_time);

  // ── Phase: Session Ended ───────────────────────────────────────────────────
  if (phase === "ended" && session) return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Live Classes", href: "/student/live-classes" },
        { label: meeting.name, href: `/student/live-classes/${id}` },
        { label: "Session Ended" },
      ]} />
      <SessionEndedScreen
        meetingName={meeting.name}
        minutesPresent={session.minutesPresent}
        durationMinutes={meeting.duration}
        percentage={session.percentage}
      />
    </div>
  );

  // ── Phase: Loading ─────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Live Classes", href: "/student/live-classes" },
        { label: meeting.name, href: `/student/live-classes/${id}` },
        { label: "Live" },
      ]} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">{meeting.name}</h2>
          <p className="text-sm text-muted-foreground">
            Scheduled: {format(startDate, "MMM dd, yyyy · hh:mm a")} · {meeting.duration} min
          </p>
        </div>
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <div>
          <p className="font-semibold text-foreground">Connecting to your live class…</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your attendance will be tracked automatically once you join.
          </p>
        </div>
      </div>
    </div>
  );

  // ── Phase: Joined (Active Meeting) ─────────────────────────────────────────
  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Live Classes", href: "/student/live-classes" },
        { label: meeting.name, href: `/student/live-classes/${id}` },
        { label: "Live" },
      ]} />

      {/* Room Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[70vh]">
        {/* Zoom Embed Panel */}
        <div className="md:col-span-8 rounded-xl border border-border bg-zinc-950 flex flex-col overflow-hidden min-h-[400px]">
          {/* Simulated Zoom UI */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400 font-medium">Live · {meeting.name}</span>
            </div>
            <span className="text-xs text-zinc-500">Meeting ID: {meeting.zoom.meeting_id}</span>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[400px] bg-black">
            <iframe
              src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&mute=1&controls=1"
              className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Live Class Demonstration"
            />
            {/* Minimal overlay branding */}
            <div className="absolute top-4 left-4 pointer-events-none">
               <span className="bg-black/60 backdrop-blur text-white/90 text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-widest">
                  Live Class Demo
               </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-zinc-800">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLeave}
              className="bg-red-700 hover:bg-red-800"
            >
              Leave Session
            </Button>
          </div>
        </div>

        {/* Attendance Tracker — desktop sidebar */}
        <div className="md:col-span-4 hidden md:block">
          <AttendanceTracker
            joinTimestamp={joinTimestamp}
            durationMinutes={meeting.duration}
            onThresholdMet={handleThresholdMet}
          />
        </div>
      </div>

      {/* Mobile attendance bar */}
      <AttendanceTrackerBar
        joinTimestamp={joinTimestamp}
        durationMinutes={meeting.duration}
      />
    </div>
  );
}
