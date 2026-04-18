"use client";

import Link from "next/link";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SessionEndedScreenProps {
  meetingName: string;
  minutesPresent: number;
  durationMinutes: number;
  percentage: number;
}

export function SessionEndedScreen({
  meetingName,
  minutesPresent,
  durationMinutes,
  percentage,
}: SessionEndedScreenProps) {
  const isPresent = percentage >= 80;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border-border">
        {/* Icon */}
        <div className="flex justify-center">
          {isPresent ? (
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Session Ended</h2>
          <p className="text-sm text-muted-foreground mt-1">{meetingName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Duration Attended</p>
            <p className="text-lg font-bold text-foreground">{minutesPresent} min</p>
            <p className="text-xs text-muted-foreground">of {durationMinutes} min</p>
          </div>
          <div className={cn(
            "rounded-lg p-3",
            isPresent ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"
          )}>
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p className={cn(
              "text-lg font-bold",
              isPresent ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
            )}>
              {isPresent ? "✓ Present" : "✗ Absent"}
            </p>
            <p className={cn(
              "text-xs font-medium",
              isPresent ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
            )}>
              {percentage}%
            </p>
          </div>
        </div>

        {/* Message */}
        {!isPresent && (
          <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">
            You did not meet the 80% attendance requirement ({Math.ceil(durationMinutes * 0.8)} min needed).
          </p>
        )}

        {/* CTA */}
        <Button asChild className="w-full">
          <Link href="/student/live-classes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Live Classes
          </Link>
        </Button>
      </Card>
    </div>
  );
}
