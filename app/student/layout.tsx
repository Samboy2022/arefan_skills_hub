'use client'

import { usePathname } from 'next/navigation'
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentNavbar } from "@/components/student/student-navbar";
import { SidebarProvider, useSidebar } from "@/components/student/sidebar-context";

/** Routes that get the sidebar but NO top navbar and NO body padding */
const LESSON_PLAYER_PATTERN = /^\/student\/courses\/[^/]+\/lessons\/[^/]+/;

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();
  const pathname = usePathname();
  const isLessonPlayer = LESSON_PLAYER_PATTERN.test(pathname);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Global left sidebar — always present */}
      <StudentSidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : isCollapsed ? 'ml-28' : 'ml-64'
        }`}
      >
        {/* Top navbar — hidden on lesson player pages */}
        {!isLessonPlayer && <StudentNavbar />}

        {/* Main content — no padding on lesson pages so player fills the space */}
        <main className={
          isLessonPlayer
            ? 'flex-1 flex flex-col overflow-hidden'
            : 'flex-1 p-3 sm:p-4 md:p-6'
        }>
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
