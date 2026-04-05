'use client'

import { InstructorSidebar } from "@/components/instructor/instructor-sidebar";
import { InstructorNavbar } from "@/components/instructor/instructor-navbar";
import { SidebarProvider, useSidebar } from "@/components/instructor/sidebar-context";

function InstructorLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-28' : 'ml-64'}`}>
        {/* Navbar */}
        <InstructorNavbar />

        {/* Page Content */}
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <InstructorLayoutContent>{children}</InstructorLayoutContent>
    </SidebarProvider>
  );
}
