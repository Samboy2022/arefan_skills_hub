'use client'

import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantNavbar } from "@/components/tenant/tenant-navbar";
import { SidebarProvider, useSidebar } from "@/components/tenant/sidebar-context";
import { useEffect } from "react";

function SchoolAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    const applyPrimaryColor = () => {
      const savedPrimaryColor = localStorage.getItem("school_color_primary");
      if (savedPrimaryColor) {
        document.documentElement.style.setProperty("--primary", savedPrimaryColor);
        document.documentElement.style.setProperty("--sidebar-primary", savedPrimaryColor);
        document.documentElement.style.setProperty("--ring", savedPrimaryColor);
      }
    };

    // Apply on mount
    applyPrimaryColor();

    // Listen for setting changes
    window.addEventListener("school-settings-updated", applyPrimaryColor);
    return () => {
      window.removeEventListener("school-settings-updated", applyPrimaryColor);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <TenantSidebar />
      {/* min-w-0 stops this flex child from overflowing its parent */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'ml-28' : 'ml-64'}`}>
        <TenantNavbar />
        <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function SchoolAdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SchoolAdminLayoutContent>{children}</SchoolAdminLayoutContent>
    </SidebarProvider>
  );
}