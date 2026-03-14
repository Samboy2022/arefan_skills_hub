import { format } from "date-fns";
import { PageHeader } from "@/components/tenant/page-header";
import { KPICard } from "@/components/tenant/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ChartCard } from "@/components/admin/chart-card";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { TenantGrowthChart } from "@/components/admin/charts/tenant-growth-chart";
import { SimpleDonutChart, BarPieChart } from "@/components/admin/charts/pie-charts";
import { mockDashboardMetrics, mockStudents, mockCommunications } from "@/lib/tenant-mock-data";
import { mockRevenueData, mockTenantGrowthData, mockStudentDistribution, mockTopTenantsData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { StudentsIcon, CoursesIcon, CurriculumIcon, AwardIcon, TransactionsIcon, AlertCircleIcon } from "@/components/shared/colored-icons";

export default function SchoolAdminDashboard() {
  const metrics = mockDashboardMetrics;
  const recentStudents = mockStudents.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Dashboard"
        description="Welcome back! Here is a quick snapshot of your school's activities today."
      />

      {/* KPI Cards Grid (Matches Super Admin) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <KPICard
          title="Total Students"
          value={metrics.totalStudents.toLocaleString()}
          hint="Enrolled students across classes"
          icon={(props) => <StudentsIcon {...props} color="0369a1" />}
          trend={5.2}
          color="blue"
        />
        <KPICard
          title="Total Faculty"
          value={metrics.totalFaculty.toLocaleString()}
          hint="Active teaching staff"
          icon={(props) => <StudentsIcon {...props} color="22C55E" />}
          trend={2}
          color="green"
        />
        <KPICard
          title="Active Classes"
          value={metrics.activeClasses.toLocaleString()}
          hint="Currently ongoing classes"
          icon={(props) => <CoursesIcon {...props} color="a855f7" />}
          trend={0}
          color="purple"
        />
        <KPICard
          title="Total Courses"
          value={metrics.totalCourses.toLocaleString()}
          hint="Published and active courses"
          icon={(props) => <CurriculumIcon {...props} color="f97316" />}
          trend={8}
          color="orange"
        />
        <KPICard
          title="Avg Attendance"
          value={`${metrics.averageAttendance}%`}
          hint="Throughout the school"
          icon={(props) => <AwardIcon {...props} color="22C55E" />}
          trend={3}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value={metrics.pendingFees.toLocaleString()}
          hint="Needs follow-up soon"
          icon={(props) => <TransactionsIcon {...props} color="ef4444" />}
          trend={-2}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Fee Collection"
          description="Monthly collected and pending fees"
          className="border-green-200 dark:border-green-900"
        >
          <RevenueChart data={mockRevenueData} type="line" />
        </ChartCard>

        <ChartCard
          title="Student Enrollment"
          description="Net new enrollments per week"
          className="border-blue-200 dark:border-blue-900"
        >
          <TenantGrowthChart data={mockTenantGrowthData} />
        </ChartCard>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Students by Grade"
          description="Distribution across grades"
          className="border-purple-200 dark:border-purple-900"
        >
          <SimpleDonutChart data={mockStudentDistribution} />
        </ChartCard>

        <ChartCard
          title="Top Performing Classes"
          description="By average attendance rate"
          className="border-amber-200 dark:border-amber-900"
        >
          <BarPieChart data={mockTopTenantsData} />
        </ChartCard>
      </div>

      {/* Main Content Grid for Tables and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table (Uses DataTable) */}
        <Card className="lg:col-span-2 border border-border border-t-brand/40 border-t-4 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b px-6 py-4">
            <div>
              <h3 className="text-base font-semibold">Recent Students</h3>
              <p className="text-sm text-muted-foreground">Latest students enrolled</p>
            </div>
            <Link
              href="/school-admin/students"
              className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Open Students Page
            </Link>
          </div>
          <div className="px-6 py-4 flex-1">
            <DataTable
              columns={[
                {
                  header: 'Name',
                  accessor: 'name',
                  cell: (value) => (
                    <Link href="/school-admin/students" className="font-medium text-primary hover:underline">
                      {value}
                    </Link>
                  ),
                },
                {
                  header: 'Roll No.',
                  accessor: 'rollNumber',
                },
                {
                  header: 'Class',
                  accessor: 'class',
                },
                {
                  header: 'Status',
                  accessor: 'status',
                  cell: (value) => {
                    const colors: Record<string, string> = {
                      Active: 'bg-brand/10 text-brand-dark dark:bg-brand/20 dark:text-brand',
                      Inactive: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    }
                    return (
                      <span
                        className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || 'bg-secondary text-secondary-foreground'}`}
                      >
                        {value}
                      </span>
                    )
                  },
                },
              ]}
              data={recentStudents}
              pageSize={5}
            />
          </div>
        </Card>

        <div className="space-y-6 flex flex-col">
          {/* Announcements */}
          <Card className="border border-border border-t-amber-500/40 border-t-4 hover:shadow-md transition-shadow p-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Announcements</h3>
            <div className="space-y-4">
              {mockCommunications.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="pb-3 border-b border-border last:border-b-0">
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full p-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 mt-0.5 flex-shrink-0">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(announcement.sentDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-border border-l-brand/40 border-l-4 hover:shadow-md transition-shadow p-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/school-admin/students">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Add Student
                </Button>
              </Link>
              <Link href="/school-admin/faculty">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Add Faculty
                </Button>
              </Link>
              <Link href="/school-admin/curriculum">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  New Course
                </Button>
              </Link>
              <Link href="/school-admin/finance">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Finance
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
