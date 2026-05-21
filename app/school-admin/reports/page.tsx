"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Download,
  FileText,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  School,
  TrendingUp,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const ENROLLMENT_DATA = [
  { name: "Comp. Science", enrolled: 87, capacity: 100 },
  { name: "Civil Eng.", enrolled: 95, capacity: 100 },
  { name: "Political Sci.", enrolled: 80, capacity: 80 },
  { name: "Business Admin", enrolled: 45, capacity: 60 },
  { name: "Mathematics", enrolled: 60, capacity: 80 },
  { name: "Physics", enrolled: 42, capacity: 50 },
];

const FACULTY_DATA = [
  { name: "Academics", value: 12, percentage: "50%" },
  { name: "Science", value: 6, percentage: "25%" },
  { name: "Language", value: 4, percentage: "16.7%" },
  { name: "Social Studies", value: 2, percentage: "8.3%" },
];

export default function ReportsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: "178",
      change: "+12.5% vs last sem",
      icon: Users,
      color:
        "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30",
    },
    {
      title: "Faculty Members",
      value: "24",
      change: "100% active status",
      icon: GraduationCap,
      color:
        "text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30",
    },
    {
      title: "Active Classes",
      value: "8",
      change: "Across 4 departments",
      icon: School,
      color:
        "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
    },
    {
      title: "Courses Offered",
      value: "12",
      change: "3 new this semester",
      icon: BookOpen,
      color:
        "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
    },
  ];

  const reports = [
    {
      id: 1,
      name: "Student Performance Report",
      description: "Grade-wise performance analysis and exam statistics.",
      type: "PDF",
    },
    {
      id: 2,
      name: "Attendance Summary",
      description: "Monthly attendance records, absences, and leaves.",
      type: "Excel",
    },
    {
      id: 3,
      name: "Financial Report",
      description: "Fee collection, outstanding balances, and collections.",
      type: "PDF",
    },
    {
      id: 4,
      name: "Enrollment Statistics",
      description: "Class and section enrollment trends and demographics.",
      type: "Excel",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Reports" },
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Reports & System Analytics"
        description="Monitor system-wide performance indicators, active student enrollments, and staff allocations."
        titleAction={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => {}}
              className="shadow-xs hover:bg-secondary/40"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Analytics
            </Button>
            <Button onClick={() => {}} className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Custom Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="p-5 border border-border hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg border ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </span>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart — spans 2 cols on xl */}
        <Card className="p-6 xl:col-span-2 border border-border hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Course Enrollment vs Capacity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comparing active enrollments and maximum capacity for top courses
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
              92.3% Fill Rate
            </div>
          </div>

          {isMounted ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={ENROLLMENT_DATA}
                margin={{ top: 10, right: 10, left: -10, bottom: 44 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={48}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="enrolled"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  name="Active Enrollments"
                />
                <Bar
                  dataKey="capacity"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                  name="Maximum Capacity"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] w-full flex items-center justify-center bg-secondary/10 rounded-md animate-pulse">
              <span className="text-sm text-muted-foreground">
                Loading Analytics Chart...
              </span>
            </div>
          )}
        </Card>

        {/* Pie Chart — spans 1 col on xl */}
        <Card className="p-6 border border-border hover:shadow-md transition-shadow">
          <h3 className="text-base font-semibold text-foreground">
            Faculty Allocation
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">
            Staff resource distribution across academic divisions
          </p>

          {/* Fixed-height container so absolute overlay centers correctly */}
          {isMounted ? (
            <div className="relative h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FACULTY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {FACULTY_DATA.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text — absolute over the fixed-height div, not the SVG */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground leading-none">
                  24
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Total Staff
                </span>
              </div>
            </div>
          ) : (
            <div className="h-[220px] w-full flex items-center justify-center bg-secondary/10 rounded-md animate-pulse">
              <span className="text-sm text-muted-foreground">
                Loading Distribution...
              </span>
            </div>
          )}

          {/* Department breakdown legend */}
          <div className="space-y-2.5 pt-4 mt-2 border-t border-border">
            {FACULTY_DATA.map((dept, index) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-foreground">
                    {dept.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {dept.value} Staff
                  </span>
                  <span className="font-semibold text-foreground w-10 text-right">
                    {dept.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Downloadable Reports */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Downloadable Report Archives
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select and download complete tabular reports generated by the system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="flex flex-col hover:shadow-md transition-all duration-200 border border-border overflow-hidden"
            >
              {/* Card top accent stripe */}
              <div
                className={`h-1 w-full ${
                  report.type === "Excel"
                    ? "bg-emerald-400 dark:bg-emerald-600"
                    : "bg-red-400 dark:bg-red-600"
                }`}
              />

              <div className="flex flex-col flex-1 p-5 gap-4">
                {/* Icon + Badge row */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary">
                    {report.type === "Excel" ? (
                      <FileSpreadsheet className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      report.type === "Excel"
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {report.type}
                  </span>
                </div>

                {/* Text — flex-grow so it fills remaining height */}
                <div className="flex-1 space-y-1.5">
                  <h4 className="font-semibold text-sm text-foreground leading-snug">
                    {report.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* Action — always at the bottom */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs gap-1.5 hover:bg-secondary/40"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
