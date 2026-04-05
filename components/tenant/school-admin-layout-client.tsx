'use client'

import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantNavbar } from "@/components/tenant/tenant-navbar";
import { SidebarProvider, useSidebar } from "@/components/tenant/sidebar-context";

function SchoolAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <TenantSidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-28' : 'ml-64'}`}>
        <TenantNavbar />
        <main className="pb-6 px-6">
          {children}
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