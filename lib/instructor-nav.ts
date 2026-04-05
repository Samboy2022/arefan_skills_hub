import type { LucideIcon } from "lucide-react";
import {
  DashboardIcon,
  CoursesIcon,
  CurriculumIcon,
  LessonsIcon,
  AssignmentsIcon,
  TrophyIcon,
  StudentsIcon,
  GradesIcon,
  DiscussionsIcon,
  AnnouncementsIcon,
  ScheduleIcon,
  ResourcesIcon,
  SettingsIcon,
} from "@/components/shared/colored-icons";

export type InstructorNavItem = {
  label: string;
  href: string;
  icon: any; // Changed from LucideIcon to any to support colored icons
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
        icon: DashboardIcon,
        tooltip: "Overview and quick stats",
      },
      {
        label: "My Courses",
        href: "/instructor/courses",
        icon: CoursesIcon,
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
        icon: CurriculumIcon,
        tooltip: "Build course structure",
      },
      {
        label: "Lessons & Content",
        href: "/instructor/lessons",
        icon: LessonsIcon,
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
        icon: AssignmentsIcon,
        tooltip: "Create and grade assignments",
      },
      {
        label: "Quizzes & Exams",
        href: "/instructor/quizzes",
        icon: TrophyIcon,
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
        icon: StudentsIcon,
        tooltip: "Manage enrolled students",
      },
      {
        label: "Gradebook",
        href: "/instructor/gradebook",
        icon: GradesIcon,
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
        icon: DiscussionsIcon,
        tooltip: "Course discussions & Q&A",
      },
      {
        label: "Announcements",
        href: "/instructor/announcements",
        icon: AnnouncementsIcon,
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
        icon: ScheduleIcon,
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
        icon: GradesIcon, // Using GradesIcon for analytics
        tooltip: "Student analytics and reports",
      },
      {
        label: "Resources",
        href: "/instructor/resources",
        icon: ResourcesIcon,
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
        icon: SettingsIcon,
        tooltip: "Profile and preferences",
      },
    ],
  },
];
