"use client";

import { useState, useEffect, Suspense } from "react";
import { Bell, LogOut, User, Menu, Mail, ChevronDown, Calendar, BookOpen, Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSidebar } from "@/components/student/sidebar-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function StudentNavbarInner() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mock message count - in real app this would come from API
  const unreadMessageCount = 3;

  // Mock user data - in real app this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@student.edu",
    role: "Student",
    avatar: "/placeholder-user.jpg", // This would be the user's uploaded picture
    initials: "JD"
  };

  const currentSessionId = searchParams.get("session") || "2024-2025";
  const currentSemesterId = searchParams.get("semester") || "sem1";

  // Mock session data - driven by URL params
  const sessions = [
    { id: "2024-2025", label: "2024/2025", isActive: currentSessionId === "2024-2025" },
    { id: "2023-2024", label: "2023/2024", isActive: currentSessionId === "2023-2024" },
    { id: "2025-2026", label: "2025/2026", isActive: currentSessionId === "2025-2026" },
  ];

  // Mock semester data - driven by URL params
  const semesters = [
    { id: "sem1", label: "Semester 1", isActive: currentSemesterId === "sem1" },
    { id: "sem2", label: "Semester 2", isActive: currentSemesterId === "sem2" },
    { id: "sem3", label: "Semester 3", isActive: currentSemesterId === "sem3" },
  ];

  const activeSession = sessions.find(session => session.isActive);
  const activeSemester = semesters.find(semester => semester.isActive);

  const handleSessionChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("session", id);
    router.push(`${pathname}?${params.toString()}`);
    setIsSessionOpen(false);
  };

  const handleSemesterChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("semester", id);
    router.push(`${pathname}?${params.toString()}`);
    setIsSemesterOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6" />
    );
  }

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
        {/* Left: Toggle button */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Session and Semester Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-r border-border pr-1.5 sm:pr-3 mr-0.5 sm:mr-1">
            {/* Session Switcher */}
            <DropdownMenu open={isSessionOpen} onOpenChange={setIsSessionOpen}>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10" aria-label={`Academic session: ${activeSession?.label}`}>
                  <Calendar className="hidden h-3.5 w-3.5 sm:block" />
                  <span className="hidden sm:inline tabular-nums">{activeSession?.label}</span>
                  <span className="sm:hidden tabular-nums">{activeSession?.label.replace(/20(\d\d)\/20(\d\d)/, "$1/$2")}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Academic Session</p>
                </div>
                <DropdownMenuSeparator />
                {sessions.map((session) => (
                  <DropdownMenuItem 
                    key={session.id}
                    className={`cursor-pointer flex items-center justify-between rounded-lg tabular-nums ${session.isActive ? "bg-primary/10 text-primary font-medium focus:bg-primary/15 focus:text-primary" : ""}`}
                    onClick={() => handleSessionChange(session.id)}
                  >
                    <span>{session.label}</span>
                    {session.isActive && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Semester Switcher */}
            <DropdownMenu open={isSemesterOpen} onOpenChange={setIsSemesterOpen}>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400" aria-label={`Semester: ${activeSemester?.label}`}>
                  <BookOpen className="hidden h-3.5 w-3.5 sm:block" />
                  <span className="hidden sm:inline">{activeSemester?.label}</span>
                  <span className="sm:hidden">S{activeSemester?.id.slice(-1)}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Semester</p>
                </div>
                <DropdownMenuSeparator />
                {semesters.map((semester) => (
                  <DropdownMenuItem 
                    key={semester.id}
                    className={`cursor-pointer flex items-center justify-between rounded-lg ${semester.isActive ? "bg-primary/10 text-primary font-medium focus:bg-primary/15 focus:text-primary" : ""}`}
                    onClick={() => handleSemesterChange(semester.id)}
                  >
                    <span>{semester.label}</span>
                    {semester.isActive && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <Link
            href="/student/messages"
            aria-label={`Messages, ${unreadMessageCount} unread`}
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
            {unreadMessageCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
                {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-2 border-b">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <p className="text-sm font-medium">Assignment 2 Due Soon</p>
                  <p className="text-xs text-muted-foreground">CS101 - Due in 2 days</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <p className="text-sm font-medium">New Announcement</p>
                  <p className="text-xs text-muted-foreground">Math201 - Midterm info posted</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <p className="text-sm font-medium">Grade Posted</p>
                  <p className="text-xs text-muted-foreground">CS101 - Assignment 1 graded</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center py-2 text-xs">
                <Link href="/student/announcements">View all updates</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 rounded-lg p-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 sm:py-1.5"
                aria-label="Open profile menu"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="max-w-[140px] truncate text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-52 mt-2 rounded-xl p-1.5"
            >
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/student/profile">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
                onClick={() => router.push("/login/student")}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </nav>
  );
}

export function StudentNavbar() {
  return (
    <Suspense fallback={
      <nav className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur-sm" />
    }>
      <StudentNavbarInner />
    </Suspense>
  );
}
