'use client'

import {
  Building2,
  Users,
  TrendingUp,
  BookOpen,
  CreditCard,
  AlertCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { ChartCard } from '@/components/admin/chart-card'
import { DataTable } from '@/components/admin/data-table'
import { RevenueChart } from '@/components/admin/charts/revenue-chart'
import { TenantGrowthChart } from '@/components/admin/charts/tenant-growth-chart'
import { SimpleDonutChart, BarPieChart } from '@/components/admin/charts/pie-charts'
import { Card } from '@/components/ui/card'
import {
  mockTenants,
  mockRevenueData,
  mockTenantGrowthData,
  mockStudentDistribution,
  mockTopTenantsData,
} from '@/lib/mock-data'
import { format } from 'date-fns'
import Link from 'next/link'

export default function DashboardPage() {
  const totalStudents = mockTenants.reduce((sum, t) => sum + t.students, 0)
  const totalCourses = mockTenants.reduce((sum, t) => sum + t.courses, 0)
  const activeTenants = mockTenants.filter((t) => t.status === 'active').length
  const totalRevenue = mockRevenueData.reduce((sum, d) => sum + (d.value ?? 0), 0)
  const pendingRenewals = 3
  const recentTenants = [...mockTenants].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const dashboardStats = [
    {
      title: 'Total Tenants',
      value: mockTenants.length.toLocaleString(),
      hint: 'All registered schools',
      subtext: '+12% this month',
      icon: Building2,
      borderTone: 'border-sky-200 dark:border-sky-900',
      iconTone: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Platform Students',
      value: totalStudents.toLocaleString(),
      hint: 'Across all tenants',
      subtext: '+18% growth',
      icon: Users,
      borderTone: 'border-indigo-200 dark:border-indigo-900',
      iconTone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Monthly Revenue (MRR)',
      value: `$${totalRevenue.toLocaleString()}`,
      hint: 'Current recurring revenue',
      subtext: '+24% from last period',
      icon: TrendingUp,
      borderTone: 'border-green-200 dark:border-green-900',
      iconTone: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Courses',
      value: totalCourses.toLocaleString(),
      hint: 'Published and draft',
      subtext: '+8% this month',
      icon: BookOpen,
      borderTone: 'border-amber-200 dark:border-amber-900',
      iconTone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Active Subscriptions',
      value: activeTenants.toLocaleString(),
      hint: 'Paid active tenants',
      subtext: '+5% renewal rate',
      icon: CreditCard,
      borderTone: 'border-violet-200 dark:border-violet-900',
      iconTone: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
      subtextTone: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Pending Renewals',
      value: pendingRenewals.toLocaleString(),
      hint: 'Needs follow-up soon',
      subtext: '-15% vs last cycle',
      icon: AlertCircle,
      borderTone: 'border-red-200 dark:border-red-900',
      iconTone: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      subtextTone: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Welcome back, Super Admin"
        description="Here is a quick snapshot of your platform today."
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className={`${stat.borderTone} p-3 hover:shadow-md transition-shadow`}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div className={`rounded-full p-1.5 ${stat.iconTone}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xl font-bold leading-none">{stat.value}</p>
            <p className={`mt-1.5 text-xs ${stat.subtextTone}`}>{stat.subtext}</p>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Revenue Growth"
          description="Monthly recurring and one-time revenue"
          className="border-green-200 dark:border-green-900"
        >
          <RevenueChart data={mockRevenueData as any} type="line" />
        </ChartCard>

        <ChartCard
          title="Tenant Acquisition"
          description="Net new tenants per week"
          className="border-blue-200 dark:border-blue-900"
        >
          <TenantGrowthChart data={mockTenantGrowthData as any} />
        </ChartCard>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Student Distribution"
          description="By education segment"
          className="border-purple-200 dark:border-purple-900"
        >
          <SimpleDonutChart data={mockStudentDistribution as any} />
        </ChartCard>

        <ChartCard
          title="Top 5 Tenants"
          description="By total enrolled students"
          className="border-amber-200 dark:border-amber-900"
        >
          <BarPieChart data={mockTopTenantsData as any} />
        </ChartCard>
      </div>

      {/* Recent Tenants Table */}
      <Card className="border border-border hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-6 py-4">
          <div>
            <h3 className="text-base font-semibold">Recent Tenants</h3>
            <p className="text-sm text-muted-foreground">Latest tenants on the platform</p>
          </div>
          <Link
            href="/super-admin/tenants"
            className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Open Tenants Page
          </Link>
        </div>
        <div className="px-6 py-4">
        <DataTable
          columns={[
            {
              header: 'School Name',
              accessor: 'name',
              cell: (value) => (
                <Link href="/super-admin/tenants" className="font-medium text-primary hover:underline">
                  {value}
                </Link>
              ),
            },
            {
              header: 'Domain',
              accessor: 'domain',
            },
            {
              header: 'Plan',
              accessor: 'plan',
              cell: (value) => (
                <span className="capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  {value}
                </span>
              ),
            },
            {
              header: 'Status',
              accessor: 'status',
              cell: (value) => {
                const colors: Record<string, string> = {
                  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
                  trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
                  suspended:
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
                  pending:
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
                }
                return (
                  <span
                    className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || ''}`}
                  >
                    {value}
                  </span>
                )
              },
            },
            {
              header: 'Students',
              accessor: 'students',
              cell: (value) => (
                <span className="font-medium">{value.toLocaleString()}</span>
              ),
            },
            {
              header: 'Created',
              accessor: 'createdAt',
              cell: (value) => format(new Date(value), 'MMM dd, yyyy'),
            },
          ]}
          data={recentTenants}
          pageSize={10}
        />
        </div>
      </Card>
    </div>
  )
}
