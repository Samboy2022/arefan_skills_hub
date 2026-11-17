"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Settings, Target, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE_TABS = [
  { href: "/student/profile", label: "Overview", icon: User },
  { href: "/student/profile/goals", label: "Goals & Progress", icon: Target },
  { href: "/student/profile/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/student/profile/certificates", label: "Certificates", icon: Award },
  { href: "/student/profile/edit", label: "Settings", icon: Settings },
];

/** Shared tab bar for every page under the student profile. */
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <nav
        aria-label="Profile sections"
        className="-mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 [scrollbar-width:none]"
      >
        {PROFILE_TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/student/profile" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
