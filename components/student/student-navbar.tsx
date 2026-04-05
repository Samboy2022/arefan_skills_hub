"use client";

import { useState, useEffect } from "react";
import { Bell, Settings, LogOut, User, Menu, Mail, ChevronDown, Calendar, BookOpen, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function StudentNavbar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);

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

  // Mock session data - in real app this would come from API
  const sessions = [
    { id: "2024-2025", label: "2024/2025", isActive: true },
    { id: "2023-2024", label: "2023/2024", isActive: false },
    { id: "2025-2026", label: "2025/2026", isActive: false },
  ];

  // Mock semester data - in real app this would come from API
  const semesters = [
    { id: "sem1", label: "Semester 1", isActive: true },
    { id: "sem2", label: "Semester 2", isActive: false },
    { id: "sem3", label: "Semester 3", isActive: false },
  ];

  const activeSession = sessions.find(session => session.isActive);
  const activeSemester = semesters.find(semester => semester.isActive);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-6" />
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Toggle button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-9 w-9 p-0 text-foreground hover:bg-muted"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Session and Semester Controls */}
          <div className="flex items-center gap-2">
            {/* Combined Session and Semester Badge */}
            <div className="hidden lg:flex">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex flex-col items-center py-2 px-3">
                <span className="text-xs font-semibold">Session: {activeSession?.label}</span>
                <span className="text-xs">{activeSemester?.label}</span>
              </Badge>
            </div>

            {/* Session Switcher */}
            <DropdownMenu open={isSessionOpen} onOpenChange={setIsSessionOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Session: {activeSession?.label}</span>
                  <span className="sm:hidden">{activeSession?.label}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Academic Session</p>
                </div>
                <DropdownMenuSeparator />
                {sessions.map((session) => (
                  <DropdownMenuItem 
                    key={session.id}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <span>{session.label}</span>
                    {session.isActive && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Semester Switcher */}
            <DropdownMenu open={isSemesterOpen} onOpenChange={setIsSemesterOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{activeSemester?.label}</span>
                  <span className="sm:hidden">S{activeSemester?.id.slice(-1)}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Semester</p>
                </div>
                <DropdownMenuSeparator />
                {semesters.map((semester) => (
                  <DropdownMenuItem 
                    key={semester.id}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <span>{semester.label}</span>
                    {semester.isActive && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium dark:bg-blue-900 dark:text-blue-300">
                        Current
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/student/messages">
              <Mail className="h-5 w-5" />
              {unreadMessageCount > 0 && (
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
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
              <DropdownMenuItem className="text-xs text-center justify-center py-2">
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-bold">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              className="w-56 mt-2"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
