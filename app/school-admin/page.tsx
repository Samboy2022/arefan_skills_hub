"use client";

import { Users, BookOpen, DollarSign, ClipboardList, Award, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/tenant/page-header";
import { KPICard } from "@/components/tenant/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDashboardMetrics, mockStudents, mockCommunications } from "@/lib/tenant-mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SchoolAdminDashboard() {
  const metrics = mockDashboardMetrics;
  const recentStudents = mockStudents.slice(0, 5);
  const announcements = mockCommunications.slice(0, 3);

  return (
    <div>
      <PageHeader
        title="School Dashboard"
        description="Welcome back! Here's an overview of your school's activities."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Students"
          value={metrics.totalStudents}
          icon={Users}
          trend={5.2}
          color="blue"
        />
        <KPICard
          title="Total Faculty"
          value={metrics.totalFaculty}
          icon={Users}
          trend={2}
          color="green"
        />
        <KPICard
          title="Active Classes"
          value={metrics.activeClasses}
          icon={BookOpen}
          trend={0}
          color="purple"
        />
        <KPICard
          title="Total Courses"
          value={metrics.totalCourses}
          icon={ClipboardList}
          trend={8}
          color="orange"
        />
        <KPICard
          title="Avg Attendance"
          value={`${metrics.averageAttendance}%`}
          icon={Award}
          trend={3}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value={metrics.pendingFees}
          icon={DollarSign}
          trend={-2}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Students</h2>
            <Link href="/school-admin/students">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "Active" ? "default" : "secondary"}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Announcements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Announcements</h2>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="pb-3 border-b border-border last:border-b-0">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
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
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/school-admin/students">
            <Button variant="outline" className="w-full" size="sm">
              Add Student
            </Button>
          </Link>
          <Link href="/school-admin/faculty">
            <Button variant="outline" className="w-full" size="sm">
              Add Faculty
            </Button>
          </Link>
          <Link href="/school-admin/curriculum">
            <Button variant="outline" className="w-full" size="sm">
              New Course
            </Button>
          </Link>
          <Link href="/school-admin/finance">
            <Button variant="outline" className="w-full" size="sm">
              View Finance
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
