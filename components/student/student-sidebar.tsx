"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "@/lib/student-constants";
import { COURSE_ANNOUNCEMENTS, STUDENT_COURSES, STUDENT_MOCK_MEETINGS } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/student/sidebar-context";
import { GraduationCap, X } from "lucide-react";

function badgeTone(href: string) {
  if (href === "/student/live-classes") return "bg-sky-500 text-white";
  return "bg-amber-500 text-white";
}

const SEMESTER_INFO: Record<string, { label: string; ordinal: string; period: string }> = {
  sem1: { label: "Semester 1", ordinal: "First semester", period: "Sep – Jan" },
  sem2: { label: "Semester 2", ordinal: "Second semester", period: "Feb – Jun" },
  sem3: { label: "Semester 3", ordinal: "Summer semester", period: "Jul – Aug" },
};

/** Pinned footer card describing the semester selected in the navbar (defaults to Semester 1). */
function SemesterCard({ progress, courses, credits }: { progress: number; courses: number; credits: number }) {
  const searchParams = useSearchParams();
  const semester = SEMESTER_INFO[searchParams.get("semester") ?? "sem1"] ?? SEMESTER_INFO.sem1;
  const session = (searchParams.get("session") ?? "2024-2025").replace("-", "/");

  return (
    <Link
      href="/student/courses"
      className="block rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 transition-colors hover:bg-sidebar-accent"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{semester.label}</p>
          <p className="truncate text-[11px] text-sidebar-foreground/60 tabular-nums">{session} · {semester.period}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-sidebar-foreground/60">
        {semester.ordinal} · {courses} courses, {credits} credits
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sidebar-border">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-sidebar-foreground/70">{progress}%</span>
      </div>
    </Link>
  );
}

export function StudentSidebar() {
  const { isCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const unreadAnnouncementsCount = COURSE_ANNOUNCEMENTS.filter((announcement) => !announcement.is_read).length;
  const liveClassesBadge = STUDENT_MOCK_MEETINGS.filter((m) => m.status === "upcoming" || m.status === "live").length;
  const activeCourses = STUDENT_COURSES.filter((course) => course.status === "active");
  const progress =
    activeCourses.length === 0
      ? 0
      : Math.round(activeCourses.reduce((sum, course) => sum + course.progress, 0) / activeCourses.length);
  const totalCredits = activeCourses.reduce((sum, course) => sum + course.credits, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile) setIsMobileOpen(false);
  }, [pathname, isMobile, setIsMobileOpen]);

  const isActive = (href: string) => {
    if (href === "/student") return pathname === "/student";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getItemBadge = (href: string) => {
    if (href === "/student/announcements" && unreadAnnouncementsCount > 0) return unreadAnnouncementsCount;
    if (href === "/student/live-classes" && liveClassesBadge > 0) return liveClassesBadge;
    return null;
  };

  const nav = (collapsed: boolean) => (
    <nav className="space-y-1 px-2">
      {STUDENT_NAV_ITEMS.map((section) => (
        <div key={section.section} className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const badgeCount = getItemBadge(item.href);
              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "h-14 flex-col justify-center gap-1 px-0.5 py-0 text-center",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={cn(collapsed ? "line-clamp-2 px-1 text-[9px] font-medium leading-tight" : "flex-1 truncate")}>
                    {item.label}
                  </span>
                  {badgeCount ? (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        badgeTone(item.href),
                        collapsed && "absolute right-2 top-1.5 h-4 min-w-4 px-1 text-[9px]",
                      )}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  ) : null}
                </Link>
              );

              if (!collapsed) return <div key={item.href}>{link}</div>;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p className="font-medium">{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
        </div>
      ))}
    </nav>
  );

  const brand = (collapsed: boolean) => (
    <Link href="/student" className="flex items-center gap-2 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/arefanskillshub_white.png" alt="Arefan Skills Hub" className="h-8 w-auto" />
      {!collapsed && <span className="truncate text-sm font-semibold">Student</span>}
    </Link>
  );

  const footer = (
    <div className="shrink-0 border-t border-sidebar-border p-3">
      <Suspense fallback={null}>
        <SemesterCard progress={progress} courses={activeCourses.length} credits={totalCredits} />
      </Suspense>
    </div>
  );

  if (!mounted) {
    return <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar md:block" />;
  }

  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
            {brand(false)}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ScrollArea className="min-h-0 flex-1 py-4">{nav(false)}</ScrollArea>
          {footer}
        </aside>
      </>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex",
          isCollapsed ? "w-28" : "w-64",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center border-b border-sidebar-border px-4", isCollapsed && "justify-center")}>
          {brand(isCollapsed)}
        </div>
        <ScrollArea className="min-h-0 flex-1 py-4">{nav(isCollapsed)}</ScrollArea>
        {!isCollapsed && footer}
      </aside>
    </TooltipProvider>
  );
}
