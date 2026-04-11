import {
  DashboardIcon as LayoutDashboard,
  StudentsIcon as Users,
  ClassesIcon as Classes,
  FacultyIcon as Faculty,
  CoursesIcon as BookOpen,
  LessonsIcon as FileText,
  GradesIcon as BarChart3,
  TransactionsIcon as DollarSign,
  SettingsIcon as Settings,
  BellIcon as Bell,
  RolesIcon as Shield,
  MessageIcon as Inbox,
  ClockIcon as Clock,
  AwardIcon as Award,
  SmartphoneIcon as Smartphone,
} from "@/components/shared/colored-icons";

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
        icon: Classes,
        tooltip: "Manage Classes",
      },
      {
        label: "Users",
        href: "/school-admin/students",
        icon: Users,
        tooltip: "User Management",
      },
      {
        label: "Faculty & Staff",
        href: "/school-admin/faculty",
        icon: Faculty,
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
