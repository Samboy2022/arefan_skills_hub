"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { Flame, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/* Mock study data shared by the dashboard and the Goals & Progress page
   (replace with real study-time data when an API exists). */
export const DAILY_GOAL_HOURS = 4;
export const TODAY_HOURS = 2.4;

/** Donut ring showing a percentage with "Done" underneath. */
export function Donut({ value, size = 92, stroke = 9 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums leading-none">{value}%</span>
        <span className="mt-1 text-[10px] font-medium text-muted-foreground">Done</span>
      </div>
    </div>
  );
}

/** Today's study hours against the daily goal. */
export function DailyGoal({ hours = TODAY_HOURS, goal = DAILY_GOAL_HOURS }: { hours?: number; goal?: number }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-semibold">
          <Target className="h-4 w-4 text-amber-600" /> Daily Study Goal
        </span>
        <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
          {hours}h / {goal}h
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
          style={{ width: `${Math.min((hours / goal) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

/** Mon–Sun row; days before today count as studied (mock). */
export function WeeklyStreak() {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(today, { weekStartsOn: 1 }), i));
  return (
    <div>
      <p className="mb-3 flex items-center gap-1 text-sm font-semibold">
        Weekly Streak <Flame className="h-4 w-4 text-orange-500" />
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map(day => {
          const isToday = isSameDay(day, today);
          const done = day < today && !isToday;
          return (
            <div key={day.toISOString()} className="flex flex-col items-center gap-1.5">
              <span className={cn("text-[10px] font-bold uppercase", done ? "text-orange-500" : "text-muted-foreground")}>
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold sm:h-8 sm:w-8",
                  done && "bg-orange-500 text-white shadow-sm shadow-orange-500/40",
                  isToday && "border-2 border-orange-500 text-orange-500",
                  !done && !isToday && "border border-border text-muted-foreground",
                )}
              >
                {done ? <Flame className="h-3.5 w-3.5 fill-current" /> : format(day, "EEEEE")}
              </span>
              <span className="text-xs font-semibold tabular-nums">{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
