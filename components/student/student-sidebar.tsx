"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "@/lib/student-constants";
import { COURSE_ANNOUNCEMENTS, STUDENT_MOCK_MEETINGS } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/student/sidebar-context";
import { X } from "lucide-react";

export function StudentSidebar() {
  const { isCollapsed, setIsCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Calculate unread announcements count
  const unreadAnnouncementsCount = COURSE_ANNOUNCEMENTS.filter(announcement => !announcement.is_read).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [pathname, isMobile, setIsMobileOpen]);

  if (!mounted) {
    return (
      <>
        {/* Desktop placeholder */}
        <aside className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar w-28 hidden md:block" />
      </>
    );
  }

  const isActive = (href: string) => {
    // Exact match for the dashboard
    if (href === "/student") {
      return pathname === "/student";
    }
    // For other pages, check exact match or sub-routes
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Badge for live-classes: count all upcoming and live sessions
  const liveClassesBadge = STUDENT_MOCK_MEETINGS.filter(
    (m) => m.status === "upcoming" || m.status === "live"
  ).length;

  const getItemBadge = (href: string) => {
    if (href === "/student/announcements" && unreadAnnouncementsCount > 0) {
      return unreadAnnouncementsCount;
    }
    if (href === "/student/live-classes" && liveClassesBadge > 0) {
      return liveClassesBadge;
    }
    return null;
  };

  // On mobile: render as overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Slide-over sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 flex flex-col w-64 md:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo / Header */}
          <div className="h-16 border-b border-sidebar-border flex items-center px-4 shrink-0 justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center shrink-0">
                <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-10 w-auto" />
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full py-4">
              <nav className="space-y-1 pb-4 flex flex-col">
                {STUDENT_NAV_ITEMS.map((section) => (
                  <div key={section.section} className="flex flex-col space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const badgeCount = getItemBadge(item.href);

                      return (
                        <Link key={item.href} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative",
                              active
                                ? "bg-brand/10 text-brand"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            <div className="relative">
                              <Icon className="h-5 w-5 flex-shrink-0" />
                              {badgeCount && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                  {badgeCount > 9 ? '9+' : badgeCount}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            {badgeCount && (
                              <div className="h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ml-auto">
                                {badgeCount > 9 ? '9+' : badgeCount}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar (unchanged behavior)
  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          isCollapsed ? "w-28" : "w-64"
        )}
      >
        {/* Logo / Header */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-4 shrink-0 transition-all duration-300">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <img src="/fnskillslogo11.png" alt="FN Skills Logo" className="h-8 w-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center shrink-0">
                <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-10 w-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 pb-4 flex flex-col">
              {STUDENT_NAV_ITEMS.map((section) => (
                <div key={section.section} className="flex flex-col space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const badgeCount = getItemBadge(item.href);

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              <Link href={item.href}>
                                <div
                                  className={cn(
                                    "relative flex flex-col items-center justify-center gap-1 h-14 transition-all duration-200 px-0.5",
                                    active
                                      ? "bg-brand/10 text-brand"
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                  )}
                                >
                                  <div className="relative">
                                    <Icon className="h-5 w-5" />
                                    {badgeCount && (
                                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {badgeCount > 9 ? '9+' : badgeCount}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-medium text-center leading-tight line-clamp-2 px-1 break-words">
                                    {item.label}
                                  </span>
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-2">
                              <p className="font-medium">{item.tooltip}</p>
                              {badgeCount && (
                                <p className="text-xs text-muted-foreground">{badgeCount} unread</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return (
                        <Link key={item.href} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative",
                              active
                                ? "bg-brand/10 text-brand"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            <div className="relative">
                              <Icon className="h-5 w-5 flex-shrink-0" />
                              {badgeCount && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                  {badgeCount > 9 ? '9+' : badgeCount}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            {badgeCount && !isCollapsed && (
                              <div className="h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ml-auto">
                                {badgeCount > 9 ? '9+' : badgeCount}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>

      </aside>
    </TooltipProvider>
  );
}
