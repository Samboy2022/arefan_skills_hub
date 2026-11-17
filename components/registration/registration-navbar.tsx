"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Keyboard, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { useRegistrationCommands } from "@/components/registration/registration-commands";

export function RegistrationNavbar({ onToggle }: { onToggle: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { application } = useCurrentApplication();
  const { openPalette, openShortcuts } = useRegistrationCommands();
  const schoolName = application?.school.name ?? "School registration";
  const email = application?.admin.email ?? "Waiting for an application";
  const waitingReplies = application?.tickets.filter((ticket) => ticket.status === "waiting").length ?? 0;
  const status = !application
    ? null
    : application.subdomainStatus === "active"
      ? { label: "Live", className: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400" }
      : application.status === "rejected"
        ? { label: "Not approved", className: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400" }
        : { label: "In review", className: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400" };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-9 w-9 p-0 text-foreground hover:bg-muted" aria-label="Toggle sidebar">
          <Menu className="h-4 w-4" />
        </Button>
        <button
          type="button"
          onClick={openPalette}
          className="flex h-10 max-w-md flex-1 items-center gap-3 rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">Search or jump to…</span>
          <Kbd className="hidden border border-border bg-background sm:inline-flex">⌘K</Kbd>
        </button>
        {status && (
          <span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset lg:inline-flex ${status.className}`}>
            {status.label}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={openShortcuts}
          className="hidden rounded-lg p-2 transition-colors hover:bg-muted sm:block"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="h-5 w-5 text-muted-foreground" />
        </button>
        <Link href="/registration/support" className="relative rounded-lg p-2 transition-colors hover:bg-muted" aria-label={waitingReplies ? `${waitingReplies} support replies waiting` : "Open support"}>
          <Bell className="h-5 w-5 text-muted-foreground" />
          {waitingReplies > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
        </Link>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
        </button>
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {schoolName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="max-w-[140px] truncate text-sm font-medium text-foreground">{schoolName}</p>
                  <p className="text-xs text-muted-foreground">Applicant</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{schoolName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/registration/school")}>School details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/registration/support")}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950" onClick={() => router.push("/")}>
                <LogOut className="mr-2 h-4 w-4" />
                Leave
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-50">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="hidden text-left sm:block">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
