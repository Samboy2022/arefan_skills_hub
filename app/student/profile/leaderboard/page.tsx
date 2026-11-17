"use client";

import { useMemo, useState } from "react";
import { Crown, Flame, Medal, TrendingDown, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { pageStackClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";

type Period = "week" | "month" | "all";

/* Mock classmates until a leaderboard API exists. `points` per period. */
const STUDENTS = [
  { id: "s1", name: "Amina Yusuf", dept: "Computer Science", streak: 21, points: { week: 940, month: 3820, all: 15200 }, change: 2 },
  { id: "s2", name: "Daniel Okafor", dept: "Mathematics", streak: 14, points: { week: 905, month: 3990, all: 14850 }, change: -1 },
  { id: "me", name: "John Doe", dept: "Computer Science", streak: 6, points: { week: 880, month: 3410, all: 12900 }, change: 3 },
  { id: "s3", name: "Grace Bello", dept: "English", streak: 9, points: { week: 860, month: 3560, all: 13400 }, change: 0 },
  { id: "s4", name: "Ibrahim Musa", dept: "Physics", streak: 5, points: { week: 790, month: 3120, all: 11800 }, change: -2 },
  { id: "s5", name: "Chioma Eze", dept: "Computer Science", streak: 11, points: { week: 760, month: 3300, all: 12100 }, change: 1 },
  { id: "s6", name: "Samuel Adeyemi", dept: "Mathematics", streak: 3, points: { week: 720, month: 2890, all: 10950 }, change: -1 },
  { id: "s7", name: "Fatima Bello", dept: "English", streak: 8, points: { week: 690, month: 2750, all: 10400 }, change: 2 },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All Time" },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);
const avatarUrl = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

const podiumStyles = [
  { ring: "ring-amber-400", badge: "bg-amber-400 text-amber-950", height: "h-24 sm:h-28", icon: Crown },
  { ring: "ring-slate-300", badge: "bg-slate-300 text-slate-900", height: "h-16 sm:h-20", icon: Medal },
  { ring: "ring-orange-400", badge: "bg-orange-400 text-orange-950", height: "h-12 sm:h-14", icon: Medal },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("week");

  const ranked = useMemo(
    () => [...STUDENTS].sort((a, b) => b.points[period] - a.points[period]).map((s, i) => ({ ...s, rank: i + 1 })),
    [period],
  );
  const me = ranked.find(s => s.id === "me")!;
  const top3 = ranked.slice(0, 3);
  // Visual podium order: 2nd, 1st, 3rd
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Profile", href: "/student/profile" }, { label: "Leaderboard" }]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Points from lessons, assignments, quizzes and attendance.</p>
        </div>
        <div className="flex w-fit rounded-lg border border-border bg-card p-1" role="tablist">
          {PERIODS.map(p => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                period === p.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Your rank */}
      <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
          #{me.rank}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Your rank</p>
          <p className="text-xs text-muted-foreground">
            {me.rank === 1
              ? "You're at the top. Keep it up!"
              : `${(ranked[me.rank - 2].points[period] - me.points[period]).toLocaleString()} points behind #${me.rank - 1}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold tabular-nums">{me.points[period].toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">points</p>
        </div>
      </div>

      {/* Podium */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="mx-auto grid max-w-xl grid-cols-3 items-end gap-2 sm:gap-4">
          {podium.map(s => {
            const style = podiumStyles[s.rank - 1];
            const Icon = style.icon;
            return (
              <div key={s.id} className="flex min-w-0 flex-col items-center text-center">
                <Icon className={cn("mb-1 h-5 w-5", s.rank === 1 ? "text-amber-500" : "text-muted-foreground")} />
                <Avatar className={cn("h-12 w-12 ring-4 sm:h-16 sm:w-16", style.ring)}>
                  <AvatarImage src={avatarUrl(s.name)} alt={s.name} />
                  <AvatarFallback>{initials(s.name)}</AvatarFallback>
                </Avatar>
                <p className="mt-2 w-full truncate text-xs font-semibold sm:text-sm">{s.id === "me" ? "You" : s.name}</p>
                <p className="text-[11px] tabular-nums text-muted-foreground">{s.points[period].toLocaleString()} pts</p>
                <div className={cn("mt-2 flex w-full items-start justify-center rounded-t-lg bg-muted pt-2", style.height)}>
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", style.badge)}>
                    {s.rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full ranking */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {ranked.map(s => {
            const isMe = s.id === "me";
            return (
              <li key={s.id} className={cn("flex items-center gap-3 px-4 py-3 sm:px-5", isMe && "bg-primary/5")}>
                <span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-muted-foreground">{s.rank}</span>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={avatarUrl(s.name)} alt="" />
                  <AvatarFallback>{initials(s.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {s.name}
                    {isMe && <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">YOU</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{s.dept}</p>
                </div>
                <span className="hidden items-center gap-1 text-xs font-semibold text-orange-500 sm:inline-flex">
                  <Flame className="h-3.5 w-3.5" /> {s.streak}d
                </span>
                <span
                  className={cn(
                    "hidden w-10 items-center justify-end gap-0.5 text-xs font-semibold sm:inline-flex",
                    s.change > 0 ? "text-emerald-600" : s.change < 0 ? "text-red-500" : "text-muted-foreground",
                  )}
                >
                  {s.change > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : s.change < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                  {s.change === 0 ? "–" : Math.abs(s.change)}
                </span>
                <span className="w-16 shrink-0 text-right text-sm font-bold tabular-nums">{s.points[period].toLocaleString()}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
