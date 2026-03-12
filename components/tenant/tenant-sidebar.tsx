"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { TENANT_NAV_ITEMS } from "@/lib/tenant-constants";
import { cn } from "@/lib/utils";

export function TenantSidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex flex-col border-r border-border bg-background transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
      style={{ height: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        {expanded && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <span className="text-xs font-bold text-white">SA</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">School Admin</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg p-1.5 hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-6">
        {TENANT_NAV_ITEMS.map((section) => (
          <div key={section.section}>
            {expanded && (
              <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={!expanded ? item.tooltip : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {expanded && <span>{item.label}</span>}
                    
                    {!expanded && (
                      <div className="absolute left-20 hidden rounded-lg bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block">
                        {item.tooltip}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
