"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { STUDENT_NAV_ITEMS } from "@/lib/student-constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/student/sidebar-context";

export function StudentSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsCollapsed]);

  const isActive = (href: string) => {
    // Exact match for the dashboard
    if (href === "/student") {
      return pathname === "/student";
    }
    // For other pages, check exact match or sub-routes
    return pathname === href || pathname.startsWith(href + "/");
  };

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
            <div className="flex items-center justify-center w-full scale-90">
              <img src="/placeholder-logo.svg" alt="Logo" className="h-8 w-8" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center h-9 w-9 bg-brand/10 rounded-lg shrink-0">
                <img src="/placeholder-logo.svg" alt="Logo" className="h-6 w-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold leading-none truncate">Student</span>
                <span className="text-xs text-muted-foreground mt-0.5">Learning Portal</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-20 right-[-16px] h-8 w-8 rounded-full border shadow-sm z-50 bg-background hover:bg-accent text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-1.5 py-4">
            <nav className="space-y-6 pb-4">
              {STUDENT_NAV_ITEMS.map((section) => (
                <div key={section.section}>
                  {!isCollapsed && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.section}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              <Link href={item.href}>
                                <div
                                  className={cn(
                                    "relative flex flex-col items-center justify-center gap-1 h-14 rounded-lg transition-all duration-200 px-0.5",
                                    active
                                      ? "bg-brand/10 text-brand"
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                  )}
                                >
                                  {active && (
                                    <div className="absolute right-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-l-full bg-brand" />
                                  )}
                                  <Icon className="h-5 w-5" />
                                  <span className="text-[9px] font-medium text-center leading-tight line-clamp-2 px-1 break-words">
                                    {item.label}
                                  </span>
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-2">
                              <p className="font-medium">{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return (
                        <Link key={item.href} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                              active
                                ? "bg-brand/10 text-brand"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            {active && (
                              <div className="absolute right-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-l-full bg-brand" />
                            )}
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>

        {/* Logout Button */}
        <div className="border-t border-border p-2 shrink-0">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => { window.location.href = "/login/student"; }}
                  className="flex flex-col items-center justify-center gap-1 h-12 w-full rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-[9px] font-medium">Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p className="font-medium">Logout</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => { window.location.href = "/login/student"; }}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium flex-1 text-left">Logout</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
