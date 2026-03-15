import Image from 'next/image'

interface ColoredIconProps {
  className?: string
}

const ICON_STYLE = "material-outlined"
const ICON_COLOR = "FFFFFF" // Default White for sidebar

const IconFactory = (iconName: string, alt: string) => ({ className, color }: ColoredIconProps & { color?: string }) => (
  <Image
    src={`https://img.icons8.com/${ICON_STYLE}/48/${color || ICON_COLOR}/${iconName}.png`}
    alt={alt}
    width={20}
    height={20}
    className={className}
    unoptimized
  />
)

export const DashboardIcon = IconFactory("dashboard", "Dashboard")
export const CoursesIcon = IconFactory("book", "Courses")
export const CurriculumIcon = IconFactory("graduation-cap", "Curriculum")
export const LessonsIcon = IconFactory("document", "Lessons")
export const AssignmentsIcon = IconFactory("list", "Assignments")
export const QuizzesIcon = IconFactory("flash-on", "Quizzes")
export const TrophyIcon = IconFactory("trophy", "Trophy")
export const StudentsIcon = IconFactory("school", "Students")
export const ClassesIcon = IconFactory("classroom", "Classes")
export const FacultyIcon = IconFactory("teacher", "Faculty")
export const GradesIcon = IconFactory("bar-chart", "Grades")
export const DiscussionsIcon = IconFactory("speech-bubble", "Discussions")
export const AnnouncementsIcon = IconFactory("megaphone", "Announcements")
export const BellIcon = IconFactory("appointment-reminders", "Notifications")
export const ScheduleIcon = IconFactory("calendar", "Schedule")
export const TimetableIcon = IconFactory("timetable", "Timetable")
export const ClockIcon = IconFactory("time-machine", "Progress")
export const ResourcesIcon = IconFactory("folder-invoices", "Resources")
export const DownloadIcon = IconFactory("download", "Download")
export const SettingsIcon = IconFactory("settings", "Settings")
export const UserIcon = IconFactory("user-male", "Profile")
export const AwardIcon = IconFactory("medal", "Attendance")
export const InboxIcon = IconFactory("inbox", "Inbox")
export const MessageIcon = IconFactory("speech-bubble", "Messages")
export const LogoutIcon = IconFactory("logout-rounded", "Logout")
export const SmartphoneIcon = IconFactory("touchscreen-smartphone", "Mobile")
export const RolesIcon = IconFactory("security-checked", "Roles")
export const CheckCircleIcon = IconFactory("checked-checkbox", "Completed")
export const ZapIcon = IconFactory("flash-on", "Zap")
export const ShieldIcon = IconFactory("shield", "Shield")
export const TransactionsIcon = IconFactory("wallet", "Transactions")
export const AlertCircleIcon = IconFactory("info", "Alert")
export const ErrorIcon = IconFactory("error", "Error")
