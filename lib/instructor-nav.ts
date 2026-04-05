import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  ClipboardList,
  Trophy,
  Users,
  BarChart3,
  MessageSquare,
  Megaphone,
  Calendar,
  FolderOpen,
  Settings,
  LineChart,
} from "lucide-react";

export type InstructorNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  tooltip: string;
};

export type InstructorNavSection = {
  section: string;
  items: InstructorNavItem[];
};

export const INSTRUCTOR_NAV_ITEMS: InstructorNavSection[] = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
        tooltip: "Overview and quick stats",
      },
      {
        label: "My Courses",
        href: "/instructor/courses",
        icon: BookOpen,
        tooltip: "Manage your courses",
      },
    ],
  },
  {
    section: "Curriculum & Content",
    items: [
      {
        label: "Curriculum Builder",
        href: "/instructor/curriculum",
        icon: GraduationCap,
        tooltip: "Build course structure",
      },
      {
        label: "Lessons & Content",
        href: "/instructor/lessons",
        icon: FileText,
        tooltip: "Manage lessons and resources",
      },
    ],
  },
  {
    section: "Assessments",
    items: [
      {
        label: "Assignments",
        href: "/instructor/assignments",
        icon: ClipboardList,
        tooltip: "Create and grade assignments",
      },
      {
        label: "Quizzes & Exams",
        href: "/instructor/quizzes",
        icon: Trophy,
        tooltip: "Create and manage quizzes",
      },
    ],
  },
  {
    section: "Students & Grades",
    items: [
      {
        label: "Students",
        href: "/instructor/students",
        icon: Users,
        tooltip: "Manage enrolled students",
      },
      {
        label: "Gradebook",
        href: "/instructor/gradebook",
        icon: BarChart3,
        tooltip: "Track and manage grades",
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        label: "Discussions",
        href: "/instructor/discussions",
        icon: MessageSquare,
        tooltip: "Course discussions & Q&A",
      },
      {
        label: "Announcements",
        href: "/instructor/announcements",
        icon: Megaphone,
        tooltip: "Create announcements",
      },
    ],
  },
  {
    section: "Planning",
    items: [
      {
        label: "Schedule & Calendar",
        href: "/instructor/schedule",
        icon: Calendar,
        tooltip: "View and manage schedule",
      },
    ],
  },
  {
    section: "Learning",
    items: [
      {
        label: "Analytics",
        href: "/instructor/analytics",
        icon: LineChart,
        tooltip: "Student analytics and reports",
      },
      {
        label: "Resources",
        href: "/instructor/resources",
        icon: FolderOpen,
        tooltip: "File library and resources",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        label: "Settings",
        href: "/instructor/settings",
        icon: Settings,
        tooltip: "Profile and preferences",
      },
    ],
  },
];
