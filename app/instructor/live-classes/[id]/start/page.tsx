"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Video, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeeting } from "@/lib/hooks/use-meetings";

const CURRENT_USER_ID = "3";

type Phase = "loading" | "joined" | "ended";

export default function MeetingStartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { meeting } = useMeeting(id);
  const [phase, setPhase] = useState<Phase>("loading");
  const cleanupRef = useRef(false);

  // Simulate SDK initialisation
  useEffect(() => {
    if (!meeting) return;
    const timer = setTimeout(() => {
      if (!cleanupRef.current) setPhase("joined");
    }, 2500);
    return () => {
      cleanupRef.current = true;
      clearTimeout(timer);
      // In production: ZoomMtg.endMeeting({}) or ZoomMtg.leaveMeeting({})
    };
  }, [meeting]);

  if (!meeting) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
      <Video className="h-12 w-12 opacity-30" />
      <p>Meeting not found.</p>
      <Button asChild variant="outline"><Link href="/instructor/live-classes"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
    </div>
  );

  const isHost = meeting.creator.id === CURRENT_USER_ID;
  const startDate = new Date(meeting.start_time);

  // ── Ended ──────────────────────────────────────────────────────────────────
  if (phase === "ended") return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href="/instructor/live-classes" className="hover:text-foreground transition-colors">Live Classes</Link>
        <span>›</span>
        <Link href={`/instructor/live-classes/${id}`} className="hover:text-foreground transition-colors line-clamp-1">{meeting.name}</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Session Ended</span>
      </nav>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-5 px-4">
          <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Video className="h-10 w-10 text-muted-foreground opacity-40" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">The live class has ended.</h2>
          <p className="text-muted-foreground text-sm">
            The session for <strong>{meeting.name}</strong> has concluded. You can view the attendance report on the meeting detail page.
          </p>
          <Button asChild className="gap-2">
            <Link href="/instructor/live-classes">
              <ArrowLeft className="h-4 w-4" />
              Back to Live Classes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div className="space-y-4">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href="/instructor/live-classes" className="hover:text-foreground transition-colors">Live Classes</Link>
        <span>›</span>
        <Link href={`/instructor/live-classes/${id}`} className="hover:text-foreground transition-colors line-clamp-1">{meeting.name}</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Live Session</span>
      </nav>

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
            {isHost ? "You are joining as Host." : "You are joining as Participant."}
          </p>
        </div>
      </div>
    </div>
  );

  // ── Joined ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href="/instructor/live-classes" className="hover:text-foreground transition-colors">Live Classes</Link>
        <span>›</span>
        <Link href={`/instructor/live-classes/${id}`} className="hover:text-foreground transition-colors line-clamp-1">{meeting.name}</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Live Session</span>
      </nav>

      {/* Meeting title bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-bold text-lg text-foreground">{meeting.name}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold">
            {isHost ? "Host" : "Participant"}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setPhase("ended")}
          className="bg-red-600 hover:bg-red-700 gap-2"
        >
          {isHost ? "End for All" : "Leave Session"}
        </Button>
      </div>

      {/* Zoom SDK Container (simulated) */}
      <div
        id="zoom-meeting-root"
        className="rounded-xl border border-border bg-zinc-950 overflow-hidden flex flex-col"
        style={{ height: "80vh" }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-400 font-medium">Live · {meeting.name}</span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Meeting #{meeting.zoom.meeting_id}</span>
        </div>

        {/* Simulated Zoom UI */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <Video className="h-16 w-16 text-zinc-600" />
          <div>
            <p className="text-zinc-300 font-semibold text-lg">Zoom Meeting SDK</p>
            <p className="text-zinc-500 text-sm mt-2 max-w-md">
              In production, the full Zoom meeting experience is embedded here using{" "}
              <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-xs">@zoom/meetingsdk</code>.
              The instructor joins as <strong className="text-zinc-400">host (role=1)</strong> and can manage the session,
              share screen, use whiteboard, and manage participants.
            </p>
          </div>
          <div className="text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3 font-mono text-left space-y-1">
            <div>Role: <span className="text-zinc-400">{isHost ? "1 (host)" : "0 (participant)"}</span></div>
            <div>Meeting ID: <span className="text-zinc-400">{meeting.zoom.meeting_id}</span></div>
            <div>SDK Key: <span className="text-zinc-400">NEXT_PUBLIC_ZOOM_SDK_KEY</span></div>
            <div>Signature: <span className="text-zinc-400">fetched from /api/meetings/{id}/signature</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
