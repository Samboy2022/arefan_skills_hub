"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, FileText, MessageCircle } from "lucide-react";

interface StudentTabStripProps {
  studentId: string;
}

export function StudentTabStrip({ studentId }: StudentTabStripProps) {
  const pathname = usePathname();
  
  const tabs = [
    { id: "overview", label: "Overview", icon: Home, href: `/instructor/students/${studentId}` },
    { id: "grades", label: "Grades", icon: TrendingUp, href: `/instructor/students/${studentId}/grades` },
    { id: "submissions", label: "Submissions", icon: FileText, href: `/instructor/students/${studentId}/submissions` },
    { id: "message", label: "Message", icon: MessageCircle, href: `/instructor/students/${studentId}/message` },
  ];

  return (
    <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className={`h-4 w-4 ${
              isActive && tab.id === "overview" ? "text-violet-600" :
              isActive && tab.id === "grades" ? "text-amber-600" :
              isActive && tab.id === "submissions" ? "text-purple-600" :
              isActive && tab.id === "message" ? "text-emerald-600" : ""
            }`} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
