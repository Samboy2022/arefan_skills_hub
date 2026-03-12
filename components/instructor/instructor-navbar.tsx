"use client";

import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function InstructorNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Navbar container with sidebar offset */}
      <div className="ml-20 lg:ml-64 px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Search */}
        <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses, students, assignments..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Create Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New Lesson</DropdownMenuItem>
              <DropdownMenuItem>New Assignment</DropdownMenuItem>
              <DropdownMenuItem>New Quiz</DropdownMenuItem>
              <DropdownMenuItem>New Announcement</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="px-2 py-2 text-sm hover:bg-muted rounded cursor-pointer">
                  <p className="font-medium">New Submission</p>
                  <p className="text-xs text-muted-foreground">Alice submitted Assignment 1</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
                <div className="px-2 py-2 text-sm hover:bg-muted rounded cursor-pointer">
                  <p className="font-medium">Question Posted</p>
                  <p className="text-xs text-muted-foreground">Bob asked in Discussions</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
                <div className="px-2 py-2 text-sm hover:bg-muted rounded cursor-pointer">
                  <p className="font-medium">Student Enrolled</p>
                  <p className="text-xs text-muted-foreground">Eve Martinez enrolled in CS101</p>
                  <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-xs">View All</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Course Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <span className="hidden sm:inline">CS101</span>
                <span className="text-xs">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Course</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>CS101 - Intro to CS (45 students)</DropdownMenuItem>
              <DropdownMenuItem>CS201 - Data Structures (38 students)</DropdownMenuItem>
              <DropdownMenuItem>CS301 - Web Dev (52 students)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All Courses</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  JS
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Dr. Jane Smith</DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                jane.smith@school.edu
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
