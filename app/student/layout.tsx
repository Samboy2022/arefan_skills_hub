'use client'

import { usePathname } from 'next/navigation'
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentNavbar } from "@/components/student/student-navbar";
import { SidebarProvider, useSidebar } from "@/components/student/sidebar-context";
import { cn } from "@/lib/utils";

/** Routes that get the sidebar but NO top navbar and NO body padding */
const LESSON_PLAYER_PATTERN = /^\/student\/courses\/[^/]+\/lessons\/[^/]+/;

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();
  const pathname = usePathname();
  const isLessonPlayer = LESSON_PLAYER_PATTERN.test(pathname);

  if (isLessonPlayer) {
    return <main className="h-dvh overflow-hidden bg-background">{children}</main>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <StudentSidebar />

      <div
        className={cn(
          "flex h-full min-w-0 flex-1 flex-col transition-all duration-300",
          isMobile ? "ml-0" : isCollapsed ? "md:ml-28" : "md:ml-64",
        )}
      >
        <StudentNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8">{children}</div>
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
