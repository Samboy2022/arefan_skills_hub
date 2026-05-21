"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TENANT_NAV_ITEMS } from "@/lib/tenant-constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "./sidebar-context";

export function TenantSidebar() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const [schoolName, setSchoolName] = useState("Bright Academy");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#0d9f58");

  useEffect(() => {
    const loadBranding = () => {
      const savedName = localStorage.getItem("school_name");
      const savedLogo = localStorage.getItem("school_logo");
      const savedPrimary = localStorage.getItem("school_color_primary");

      if (savedName) setSchoolName(savedName);
      if (savedLogo) {
        setLogoUrl(savedLogo);
      } else {
        setLogoUrl(null);
      }
      if (savedPrimary) setPrimaryColor(savedPrimary);
    };

    loadBranding();

    window.addEventListener("school-settings-updated", loadBranding);
    return () => {
      window.removeEventListener("school-settings-updated", loadBranding);
    };
  }, []);

  const isActive = (href: string) => {
    // Exact match for the dashboard
    if (href === "/school-admin") {
      return pathname === "/school-admin";
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
            <div className="flex items-center justify-center w-full">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="h-8 w-8 object-contain rounded-md bg-white/5 p-0.5" />
              ) : (
                <img src="/fnskillslogo11.png" alt="FN Skills Logo" className="h-8 w-auto" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full overflow-hidden">
              {logoUrl ? (
                <div className="flex items-center gap-2.5 w-full">
                  <img src={logoUrl} alt={schoolName} className="h-9 w-9 object-contain rounded-md bg-white/5 p-1 shrink-0" />
                  <span className="font-bold text-sm text-sidebar-foreground truncate tracking-wide leading-tight">
                    {schoolName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center shrink-0">
                    <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-10 w-auto" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 pb-4">
              {TENANT_NAV_ITEMS.map((section) => (
                <div key={section.section}>
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
                                    "relative flex flex-col items-center justify-center gap-1 h-14 transition-all duration-200 px-0.5",
                                    active
                                      ? ""
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                  )}
                                  style={active ? { color: primaryColor, backgroundColor: `${primaryColor}1a` } : undefined}
                                >
                                  <div className="relative">
                                    <Icon className="h-5 w-5" />
                                  </div>
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
                              "flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative",
                              active
                                ? ""
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                            style={active ? { color: primaryColor, backgroundColor: `${primaryColor}1a` } : undefined}
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
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </TooltipProvider>
  );
}
