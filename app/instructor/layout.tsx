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

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <InstructorNavbar />

        {/* Page Content */}
        <main 
          className={`pt-24 pr-6 pb-6 min-h-screen transition-all duration-300 ${
            isCollapsed ? 'pl-20' : 'pl-64'
          }`}
        >
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
