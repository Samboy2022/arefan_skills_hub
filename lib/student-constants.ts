import {
  GradesIcon as BarChart3,
  CoursesIcon as BookOpen,
  LessonsIcon as FileText,
  CheckCircleIcon as CheckCircle,
  ZapIcon as Zap,
  GradesIcon as Grades,
  ClockIcon as Clock,
  MessageIcon as MessageSquare,
  BellIcon as Bell,
  DownloadIcon as Download,
  ScheduleIcon as Calendar,
  SettingsIcon as Settings,
  UserIcon as User,
} from "@/components/shared/colored-icons";

export const STUDENT_NAV_ITEMS = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/student",
        icon: BarChart3,
        tooltip: "Home & Overview",
      },
      {
        label: "My Courses",
        href: "/student/courses",
        icon: BookOpen,
        tooltip: "View Courses",
      },
    ],
  },
  {
    section: "Learning",
    items: [
      {
        label: "Assignments",
        href: "/student/assignments",
        icon: CheckCircle,
        tooltip: "My Assignments",
      },
      {
        label: "Quizzes",
        href: "/student/quizzes",
        icon: Zap,
        tooltip: "Tests & Assessments",
      },
    ],
  },
  {
    section: "Academic",
    items: [
      {
        label: "Grades",
        href: "/student/grades",
        icon: Grades,
        tooltip: "View Grades",
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        label: "Discussions",
        href: "/student/discussions",
        icon: MessageSquare,
        tooltip: "Forums & Discussions",
      },
      {
        label: "Updates",
        href: "/student/announcements",
        icon: Bell,
        tooltip: "Course Updates",
      },
      {
        label: "Messages",
        href: "/student/messages",
        icon: MessageSquare,
        tooltip: "Inbox",
      },
    ],
  },
  {
    section: "Resources",
    items: [
      {
        label: "Materials",
        href: "/student/materials",
        icon: Download,
        tooltip: "Course Materials",
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "Profile",
        href: "/student/profile",
        icon: User,
        tooltip: "My Profile & Settings",
      },
    ],
  },
];

export const ASSIGNMENT_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  GRADED: "graded",
  LATE: "late",
  MISSING: "missing",
} as const;

export const ASSIGNMENT_STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  graded: "bg-green-50 text-green-700 border-green-200",
  late: "bg-orange-50 text-orange-700 border-orange-200",
  missing: "bg-red-50 text-red-700 border-red-200",
} as const;

export const GRADE_SCALE = {
  A: { min: 90, max: 100, label: "A" },
  B: { min: 80, max: 89, label: "B" },
  C: { min: 70, max: 79, label: "C" },
  D: { min: 60, max: 69, label: "D" },
  F: { min: 0, max: 59, label: "F" },
} as const;

export const QUIZ_TYPE = {
  GRADED: "graded",
  PRACTICE: "practice",
  UNGRADED: "ungraded",
} as const;

export const COURSE_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ENROLLED: "enrolled",
  DROPPED: "dropped",
} as const;
