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
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <Sidebar />
      <main className="pt-16 pl-20 transition-all duration-300 md:pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
