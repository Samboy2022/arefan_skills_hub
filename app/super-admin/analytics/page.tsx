'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, DollarSign, Users, Building2, BookOpen, Award, UserCheck, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { ChartCard } from '@/components/admin/chart-card'
import { RevenueChart } from '@/components/admin/charts/revenue-chart'
import { TenantGrowthChart } from '@/components/admin/charts/tenant-growth-chart'
import { SimpleDonutChart } from '@/components/admin/charts/pie-charts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  mockRevenueData,
  mockTenantGrowthData,
  mockStudentDistribution,
} from '@/lib/mock-data'

type PeriodKey = '30' | '90' | '365' | 'custom'

type RevenuePoint = (typeof mockRevenueData)[number] & { date: Date }
type TenantPoint = (typeof mockTenantGrowthData)[number] & { date: Date }

function getTodayISO() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getISOFromDaysAgo(days: number) {
  const now = new Date()
  now.setDate(now.getDate() - days)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseISODate(value: string, endOfDay = false) {
  const date = new Date(`${value}T00:00:00`)
  if (endOfDay) {
    date.setHours(23, 59, 59, 999)
  }
  return date
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>('30')
  const [startDate, setStartDate] = useState(getISOFromDaysAgo(29))
  const [endDate, setEndDate] = useState(getTodayISO())

  const revenueSeries = useMemo<RevenuePoint[]>(() => {
    const now = new Date()
    const size = mockRevenueData.length
    return mockRevenueData.map((item, index) => {
      const pointDate = new Date(now)
      pointDate.setMonth(now.getMonth() - (size - 1 - index))
      pointDate.setDate(1)
      return { ...item, date: pointDate }
    })
  }, [])

  const tenantSeries = useMemo<TenantPoint[]>(() => {
    const now = new Date()
    const size = mockTenantGrowthData.length
    return mockTenantGrowthData.map((item, index) => {
      const pointDate = new Date(now)
      pointDate.setDate(now.getDate() - (size - 1 - index) * 7)
      return { ...item, date: pointDate }
    })
  }, [])

  const effectiveRange = useMemo(() => {
    if (period === 'custom') {
      return {
        start: parseISODate(startDate),
        end: parseISODate(endDate, true),
      }
    }

    const days = Number(period)
    return {
      start: parseISODate(getISOFromDaysAgo(days - 1)),
      end: parseISODate(getTodayISO(), true),
    }
  }, [period, startDate, endDate])

  const filteredRevenue = useMemo(
    () =>
      revenueSeries.filter(
        (item) => item.date >= effectiveRange.start && item.date <= effectiveRange.end,
      ),
    [effectiveRange.end, effectiveRange.start, revenueSeries],
  )

  const filteredTenants = useMemo(
    () =>
      tenantSeries.filter(
        (item) => item.date >= effectiveRange.start && item.date <= effectiveRange.end,
      ),
    [effectiveRange.end, effectiveRange.start, tenantSeries],
  )

  const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.value, 0)
  const latestTenantTotal = filteredTenants.length
    ? (filteredTenants[filteredTenants.length - 1].total ?? 0)
    : 0
  const avgRevenuePerTenant = latestTenantTotal > 0 ? Math.round(totalRevenue / latestTenantTotal) : 0
  const avgChurnRate = filteredTenants.length
    ? (
        filteredTenants.reduce((sum, item) => sum + (item.churned ?? 0), 0) /
        filteredTenants.length
      ).toFixed(1)
    : '0.0'

  const totalTenants = latestTenantTotal
  const avgTenantSize = totalTenants > 0 ? Math.round(23850 / totalTenants) : 0
  const enterpriseTenants = Math.max(1, Math.round(totalTenants * 0.33))

  const rangeDays = Math.max(
    1,
    Math.ceil((effectiveRange.end.getTime() - effectiveRange.start.getTime()) / (1000 * 60 * 60 * 24)),
  )
  const monthFactor = rangeDays / 30
  const totalStudents = Math.round(23850 * Math.min(1, monthFactor * 0.95))
  const activeUsers = Math.round(totalStudents * 0.77)
  const newEnrollments = Math.round(1245 * monthFactor)
  const totalCourses = Math.round(241 * Math.min(1, monthFactor * 0.9))
  const avgCourseSize = totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0

  const handlePeriodChange = (value: PeriodKey) => {
    setPeriod(value)
    if (value !== 'custom') {
      const days = Number(value)
      setStartDate(getISOFromDaysAgo(days - 1))
      setEndDate(getTodayISO())
    }
  }

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setPeriod('custom')
    if (field === 'start') {
      setStartDate(value)
      return
    }
    setEndDate(value)
  }

  const resetFilter = () => {
    setPeriod('30')
    setStartDate(getISOFromDaysAgo(29))
    setEndDate(getTodayISO())
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep dive into platform metrics and trends"
      />

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-xs text-muted-foreground">Filtered range</p>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
                <DollarSign className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +28% trend
            </p>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Revenue per Tenant</p>
                <p className="text-xs text-muted-foreground">Filtered range</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                <Building2 className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-xl font-bold">${avgRevenuePerTenant.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% trend
            </p>
          </Card>

          <Card className="border-orange-200 dark:border-orange-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Churn / Week</p>
                <p className="text-xs text-muted-foreground">Tenant activity</p>
              </div>
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{avgChurnRate}%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              -1.5% trend
            </p>
          </Card>

          <Card className="border-purple-200 dark:border-purple-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
                <p className="text-xs text-muted-foreground">Filtered range</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                <Building2 className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{totalTenants}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% trend
            </p>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Tenant Size</p>
                <p className="text-xs text-muted-foreground">Students per tenant</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                <Users className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{avgTenantSize.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% trend
            </p>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enterprise Tenants</p>
                <p className="text-xs text-muted-foreground">Pro+ plans</p>
              </div>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1.5">
                <Award className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{enterpriseTenants}</div>
            <p className="text-xs text-muted-foreground mt-1.5">33% of total tenants</p>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-xs text-muted-foreground">Filtered estimate</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                <Users className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% trend
            </p>
          </Card>

          <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-xs text-muted-foreground">Estimated engagement</p>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
                <UserCheck className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1.5">77% engagement rate</p>
          </Card>

          <Card className="border-purple-200 dark:border-purple-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Enrollments</p>
                <p className="text-xs text-muted-foreground">Filtered estimate</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                <UserPlus className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{newEnrollments.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5% trend
            </p>
          </Card>

          <Card className="border-indigo-200 dark:border-indigo-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-xs text-muted-foreground">Filtered estimate</p>
              </div>
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-1.5">
                <BookOpen className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{totalCourses.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% trend
            </p>
          </Card>

          <Card className="border-cyan-200 dark:border-cyan-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Course Size</p>
                <p className="text-xs text-muted-foreground">Students per course</p>
              </div>
              <div className="rounded-full bg-cyan-100 dark:bg-cyan-900/30 p-1.5">
                <Users className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="text-xl font-bold">{avgCourseSize.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% trend
            </p>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course Completion</p>
                <p className="text-xs text-muted-foreground">Average rate</p>
              </div>
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
                <Award className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-xl font-bold">72%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +3% trend
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label>Period</Label>
              <Select value={period} onValueChange={(value: PeriodKey) => handlePeriodChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="analytics-start-date">Start Date</Label>
              <Input
                id="analytics-start-date"
                type="date"
                value={startDate}
                onChange={(event) => handleDateChange('start', event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="analytics-end-date">End Date</Label>
              <Input
                id="analytics-end-date"
                type="date"
                value={endDate}
                onChange={(event) => handleDateChange('end', event.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilter} className="w-full">
                Reset Filter
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Revenue Trends"
            description="Monthly recurring and one-time revenue breakdown"
          >
            <RevenueChart data={filteredRevenue} type="line" />
          </ChartCard>

          <ChartCard
            title="Tenant Growth"
            description="New vs churned tenants per week"
          >
            <TenantGrowthChart data={filteredTenants} />
          </ChartCard>

          <ChartCard
            title="Student Distribution"
            description="By education segment"
          >
            <SimpleDonutChart data={mockStudentDistribution} />
          </ChartCard>
        </div>
      </section>
    </div>
  )
}
