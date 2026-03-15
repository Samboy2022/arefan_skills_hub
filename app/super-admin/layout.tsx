import { Sidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'

export const metadata = {
  title: 'Super Admin Dashboard',
  description: 'Platform administration and monitoring',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        <AdminNavbar />
        <main>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
