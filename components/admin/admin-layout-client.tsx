'use client'

import { Sidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'
import { SidebarProvider, useSidebar } from '@/components/admin/sidebar-context'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-28' : 'ml-64'}`}>
        <AdminNavbar />
        <main>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  )
}