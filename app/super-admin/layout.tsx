import { AdminLayoutClient } from '@/components/admin/admin-layout-client'

export const metadata = {
  title: 'Super Admin Dashboard',
  description: 'Platform administration and monitoring',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
