"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { INSTRUCTOR_NAV_ITEMS } from "@/lib/instructor-nav";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/instructor/sidebar-context";

export function InstructorSidebar() {
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
    if (href === "/instructor") {
      return pathname === "/instructor";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = INSTRUCTOR_NAV_ITEMS.flatMap((section) => section.items);

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-zinc-800 px-4">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <img src="/fnskillslogo11.png" alt="FN Skills Logo" className="h-8 w-auto" />
            </div>
          ) : (
            <div className="flex w-full items-center gap-3">
              <div className="flex items-center justify-center shrink-0">
                <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-10 w-auto" />
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-[-16px] top-20 z-50 h-8 w-8 rounded-full border-zinc-700 bg-zinc-900 text-zinc-200 transition-all duration-300 hover:bg-zinc-800 hover:text-zinc-50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          ) : (
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          )}
        </Button>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full px-3 py-4 [&_[data-slot=scroll-area-thumb]]:bg-zinc-600">
            <nav className="space-y-1 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <div
                            className={cn(
                              "relative flex h-11 items-center justify-center rounded-lg transition-all duration-200",
                              active
                                ? "bg-zinc-800 text-zinc-50"
                                : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                            )}
                          >
                            {active && (
                              <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary" />
                            )}
                            <Icon
                              className="h-5 w-5 shrink-0 text-current"
                              strokeWidth={2}
                              aria-hidden
                            />
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
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                        active
                          ? "bg-zinc-800 text-zinc-50"
                          : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                      )}
                    >
                      {active && (
                        <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary" />
                      )}
                      <Icon
                        className="h-5 w-5 shrink-0 text-current"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        <div className="shrink-0 border-t border-zinc-800 p-3">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/login/instructor";
                  }}
                  className="flex h-11 w-full items-center justify-center rounded-lg text-zinc-400 transition-all duration-200 hover:bg-red-950/40 hover:text-red-400"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-current" strokeWidth={2} aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p className="font-medium">Logout</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.location.href = "/login/instructor";
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 transition-all duration-200 hover:bg-red-950/40 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 shrink-0 text-current" strokeWidth={2} aria-hidden />
              <span className="flex-1 text-left text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
