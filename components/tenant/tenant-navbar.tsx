"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun, LogOut, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSidebar } from "./sidebar-context";

export function TenantNavbar() {
  const { theme, setTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [schoolName, setSchoolName] = useState("Bright Academy");
  const [schoolEmail, setSchoolEmail] = useState("admin@brightacademy.edu");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#0d9f58");

  useEffect(() => {
    setMounted(true);
    const loadBranding = () => {
      const savedName = localStorage.getItem("school_name");
      const savedEmail = localStorage.getItem("school_email");
      const savedLogo = localStorage.getItem("school_logo");
      const savedPrimary = localStorage.getItem("school_color_primary");

      if (savedName) setSchoolName(savedName);
      if (savedEmail) setSchoolEmail(savedEmail);
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

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6">
      {/* Left: Toggle button and Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-9 w-9 p-0 text-foreground hover:bg-muted"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students, classes..."
              className="pl-10 bg-muted"
            />
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {/* Profile Dropdown */}
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8 border border-border">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt={schoolName} className="object-contain" />
                  ) : null}
                  <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: primaryColor }}>
                    {schoolName ? schoolName.charAt(0).toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{schoolName}</p>
                  <p className="text-xs text-muted-foreground">School Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground truncate">{schoolName}</p>
                <p className="text-xs text-muted-foreground truncate">{schoolEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuItem>School Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 cursor-pointer"
                onClick={() => router.push("/login/school-admin")}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-50">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="hidden sm:block text-left">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded mt-1" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
