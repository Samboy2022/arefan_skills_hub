"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

interface AttendanceTrackerProps {
  joinTimestamp: number;
  durationMinutes: number;
  onThresholdMet?: (elapsedMinutes: number) => void;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function AttendanceTracker({
  joinTimestamp,
  durationMinutes,
  onThresholdMet,
}: AttendanceTrackerProps) {
  const thresholdMs = durationMinutes * 0.8 * 60_000;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [thresholdMet, setThresholdMet] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const reportedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - joinTimestamp;
      setElapsedMs(elapsed);

      if (elapsed >= thresholdMs && !reportedRef.current) {
        reportedRef.current = true;
        setThresholdMet(true);
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 3000);
        onThresholdMet?.(Math.floor(elapsed / 60_000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [joinTimestamp, thresholdMs, onThresholdMet]);

  const progressPct = Math.min((elapsedMs / thresholdMs) * 100, 100);
  const elapsedMinutes = Math.floor(elapsedMs / 60_000);
  const thresholdMinutes = Math.ceil(durationMinutes * 0.8);

  const barColor =
    thresholdMet
      ? "bg-emerald-500"
      : progressPct >= 50
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Attendance Tracker
        </span>
      </div>

      {/* Elapsed Timer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1">Time in session</p>
        <p className="text-4xl font-bold tabular-nums text-foreground">
          {formatElapsed(elapsedMs)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progressPct)}% of required time</span>
          <span>{elapsedMinutes}m / {thresholdMinutes}m</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              barColor,
              pulseActive && "animate-pulse"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Threshold info */}
      <div className="text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
        <div className="flex justify-between">
          <span>Session length</span>
          <span className="font-medium text-foreground">{durationMinutes} min</span>
        </div>
        <div className="flex justify-between">
          <span>Attendance threshold</span>
          <span className="font-medium text-foreground">{thresholdMinutes} min (80%)</span>
        </div>
      </div>

      {/* Status */}
      <div className="mt-auto">
        {thresholdMet ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-3",
              pulseActive && "animate-pulse"
            )}
          >
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                ✓ Attendance Recorded
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Attendance confirmed. You may leave the session.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Counting your attendance…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact bottom bar for mobile */
export function AttendanceTrackerBar({
  joinTimestamp,
  durationMinutes,
}: {
  joinTimestamp: number;
  durationMinutes: number;
}) {
  const thresholdMs = durationMinutes * 0.8 * 60_000;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [thresholdMet, setThresholdMet] = useState(false);
  const reportedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - joinTimestamp;
      setElapsedMs(elapsed);
      if (elapsed >= thresholdMs && !reportedRef.current) {
        reportedRef.current = true;
        setThresholdMet(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [joinTimestamp, thresholdMs]);

  const progressPct = Math.min((elapsedMs / thresholdMs) * 100, 100);
  const barColor = thresholdMet ? "bg-emerald-500" : progressPct >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center gap-3 border-t border-border bg-background/95 backdrop-blur px-4 py-2 md:hidden">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm tabular-nums font-bold">{formatElapsed(elapsedMs)}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-10 text-right">
        {Math.round(progressPct)}%
      </span>
      <span className={cn(
        "text-xs font-semibold",
        thresholdMet ? "text-emerald-600" : "text-amber-600"
      )}>
        {thresholdMet ? "Present ✓" : "Counting…"}
      </span>
    </div>
  );
}
