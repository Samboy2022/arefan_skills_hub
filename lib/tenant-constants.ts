import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  DollarSign,
  Settings,
  Bell,
  Shield,
  Inbox,
  Clock,
  Award,
  Smartphone,
} from "lucide-react";

export const TENANT_NAV_ITEMS = [
  {
    section: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/school-admin",
        icon: LayoutDashboard,
        tooltip: "School Overview",
      },
      {
        label: "Classes",
        href: "/school-admin/classes",
        icon: Users,
        tooltip: "Manage Classes",
      },
      {
        label: "Students",
        href: "/school-admin/students",
        icon: Users,
        tooltip: "Student Management",
      },
      {
        label: "Faculty & Staff",
        href: "/school-admin/faculty",
        icon: Users,
        tooltip: "Staff Directory",
      },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      {
        label: "Curriculum",
        href: "/school-admin/curriculum",
        icon: BookOpen,
        tooltip: "Course Management",
      },
      {
        label: "Timetable",
        href: "/school-admin/timetable",
        icon: Clock,
        tooltip: "Class Schedule",
      },
      {
        label: "Assessments",
        href: "/school-admin/assessments",
        icon: FileText,
        tooltip: "Tests & Exams",
      },
      {
        label: "Attendance",
        href: "/school-admin/attendance",
        icon: Award,
        tooltip: "Attendance Tracking",
      },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      {
        label: "Finance",
        href: "/school-admin/finance",
        icon: DollarSign,
        tooltip: "Financial Reports",
      },
      {
        label: "Communications",
        href: "/school-admin/communications",
        icon: Inbox,
        tooltip: "Messages & Alerts",
      },
      {
        label: "Reports",
        href: "/school-admin/reports",
        icon: BarChart3,
        tooltip: "Generate Reports",
      },
    ],
  },
  {
    section: "CONFIGURATION",
    items: [
      {
        label: "School Settings",
        href: "/school-admin/settings",
        icon: Settings,
        tooltip: "School Configuration",
      },
      {
        label: "User Roles",
        href: "/school-admin/roles",
        icon: Shield,
        tooltip: "Manage Roles",
      },
      {
        label: "Mobile App",
        href: "/school-admin/mobile",
        icon: Smartphone,
        tooltip: "App Settings",
      },
      {
        label: "Notifications",
        href: "/school-admin/notifications",
        icon: Bell,
        tooltip: "Notification Rules",
      },
    ],
  },
];

export const STUDENT_STATUSES = ["Active", "Inactive", "Suspended", "Graduated"];
export const CLASS_STATUSES = ["Active", "Planned", "Archived"];
export const ASSESSMENT_TYPES = ["Quiz", "Test", "Exam", "Assignment", "Project"];
