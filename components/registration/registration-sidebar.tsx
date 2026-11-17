"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Kbd } from "@/components/ui/kbd";
import {
  DashboardIcon,
  StudentsIcon,
  TransactionsIcon,
  LessonsIcon,
  SettingsIcon,
  MessageIcon,
} from "@/components/shared/colored-icons";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { useRegistrationCommands } from "@/components/registration/registration-commands";
import { setupProgress } from "@/components/registration/registration-progress";
import { DOCUMENT_KINDS } from "@/lib/school-registration";

type BadgeKey = "documents" | "tickets";

const SECTIONS: { section: string; items: { label: string; href: string; icon: typeof DashboardIcon; badge?: BadgeKey }[] }[] = [
  {
    section: "Main",
    items: [{ label: "Overview", href: "/registration", icon: DashboardIcon }],
  },
  {
    section: "Application",
    items: [
      { label: "School details", href: "/registration/school", icon: StudentsIcon },
      { label: "Plan", href: "/registration/plan", icon: TransactionsIcon },
      { label: "Documents", href: "/registration/documents", icon: LessonsIcon, badge: "documents" },
    ],
  },
  {
    section: "Setup",
    items: [
      { label: "Custom domain", href: "/registration/domain", icon: SettingsIcon },
      { label: "Support", href: "/registration/support", icon: MessageIcon, badge: "tickets" },
    ],
  },
];

/** Navigation list, shared by the desktop sidebar and the mobile drawer. */
export function RegistrationNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { application } = useCurrentApplication();
  const { openShortcuts } = useRegistrationCommands();
  const progress = application ? setupProgress(application) : null;
  const badges: Record<BadgeKey, number> = {
    documents: application
      ? DOCUMENT_KINDS.filter(
          (kind) =>
            kind.kind !== "accreditation" &&
            !application.documents.some((document) => document.kind === kind.kind) &&
            !(kind.kind === "logo" && application.school.logoName),
        ).length
      : 0,
    tickets: application?.tickets.filter((ticket) => ticket.status === "waiting").length ?? 0,
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-4 px-2">
          {SECTIONS.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{section.section}</p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    item.href === "/registration" ? pathname === "/registration" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  const count = item.badge ? badges[item.badge] : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        collapsed && "h-14 flex-col justify-center gap-1 px-0.5 py-0 text-center",
                        active ? "bg-primary/10 text-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className={cn(collapsed ? "line-clamp-2 px-1 text-[9px] font-medium leading-tight" : "flex-1 truncate")}>{item.label}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                            item.badge === "tickets" ? "bg-sky-500 text-white" : "bg-amber-500 text-white",
                            collapsed && "absolute right-2 top-1.5 h-4 min-w-4 px-1 text-[9px]",
                          )}
                          aria-label={item.badge === "tickets" ? `${count} replies waiting` : `${count} documents needed`}
                        >
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="space-y-3 border-t border-sidebar-border p-3">
          {progress && (
            <Link href="/registration" className="block rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 transition-colors hover:bg-sidebar-accent">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold">Setup</span>
                <span className="text-sidebar-foreground/60">
                  {progress.done}/{progress.total}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={openShortcuts}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Shortcuts</span>
            <Kbd className="border border-sidebar-border">?</Kbd>
          </button>
        </div>
      )}
    </div>
  );
}

export function RegistrationSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex",
        collapsed ? "w-28" : "w-64",
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link href="/registration" className="flex items-center gap-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fnskillslogo2.png" alt="Fnskills" className="h-8 w-auto" />
          {!collapsed && <span className="truncate text-sm font-semibold">Registration</span>}
        </Link>
      </div>
      <div className="min-h-0 flex-1">
        <RegistrationNav collapsed={collapsed} />
      </div>
    </aside>
  );
}
