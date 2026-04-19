"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INSTRUCTOR_NAV_ITEMS } from "@/lib/instructor-nav";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/instructor/sidebar-context";

export function InstructorSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar w-64" />
    );
  }

  const isActive = (href: string) => {
    if (href === "/instructor") {
      return pathname === "/instructor";
    }
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
              {INSTRUCTOR_NAV_ITEMS.map((section) => (
                <div key={section.section} className="flex flex-col space-y-1">
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
                                  "relative flex flex-col items-center justify-center gap-1 h-14 transition-all duration-200 px-0.5",
                                  active
                                    ? "bg-brand/10 text-brand"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                              >
                                <div className="relative">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-[9px] font-medium text-center leading-tight truncate w-full px-1">
                                  {item.label.split(" ")[0]}
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
                            "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative",
                            active
                              ? "bg-brand/10 text-brand"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          )}
                        >
                          <div className="relative">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                          </div>
                          <span className="text-sm font-medium flex-1">{item.label}</span>
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
