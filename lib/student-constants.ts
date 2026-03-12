import {
  BookOpen,
  FileText,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  Download,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

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
        label: "Course Content",
        href: "/student/course-content",
        icon: FileText,
        tooltip: "Lessons & Materials",
      },
      {
        label: "Assignments",
        href: "/student/assignments",
        icon: CheckCircle,
        tooltip: "My Assignments",
      },
      {
        label: "Quizzes & Exams",
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
        icon: BarChart3,
        tooltip: "View Grades",
      },
      {
        label: "Progress",
        href: "/student/progress",
        icon: Clock,
        tooltip: "Track Progress",
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
        label: "Announcements",
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
      {
        label: "Schedule",
        href: "/student/schedule",
        icon: Calendar,
        tooltip: "Calendar",
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "Settings",
        href: "/student/settings",
        icon: Settings,
        tooltip: "Preferences",
      },
      {
        label: "Profile",
        href: "/student/profile",
        icon: User,
        tooltip: "My Profile",
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
