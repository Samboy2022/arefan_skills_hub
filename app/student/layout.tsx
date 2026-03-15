'use client'

import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentNavbar } from "@/components/student/student-navbar";
import { SidebarProvider, useSidebar } from "@/components/student/sidebar-context";

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'ml-28' : 'ml-64'
        }`}
      >
        <StudentNavbar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </SidebarProvider>
  );
}
