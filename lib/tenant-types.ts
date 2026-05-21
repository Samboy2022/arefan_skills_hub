export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  regNumber?: string;
  class: string;
  program?: string;
  dateOfBirth: string;
  parentEmail: string;
  status: "Active" | "Inactive" | "Suspended" | "Graduated";
  joinDate: string;
  avatar?: string;
}

export interface Class {
  id: string;
  name: string;
  program: string;
  courseCode: string;
  semester: string;
  instructors: string[];
  totalStudents: number;
  capacity: number;
  status: "Active" | "Planned" | "Archived";
  academicYear: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  department: string;
  joinDate: string;
  role: "Teacher" | "Staff" | "Admin" | "Lecturer" | "Instructor";
  status: "Active" | "Inactive";
  avatar?: string;
  assignedCourses?: string[];
  assignedProgram?: string;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  durationMinutes: number;
  order: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export type ProgramLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD';

export interface Program {
  id: string;
  name: string;
  description: string;
  level: ProgramLevel;
  createdBy: string;
  createdAt: string;
  courseIds: string[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  categoryId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  status: 'draft' | 'active' | 'archived' | 'inactive';
  credits: number;
  maxStudents?: number;
  enrollmentCount: number;
  semester?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  description: string;
  prerequisites?: string;
  learningOutcomes?: string[];
  targetAudience?: string;
  durationWeeks?: number;
  createdAt: string;
  modules?: CourseModule[];
  grade?: string;
  instructor?: string;
  duration?: number;
  students?: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: "Quiz" | "Test" | "Exam" | "Assignment" | "Project";
  subject: string;
  class: string;
  date: string;
  totalMarks: number;
  passMarks: number;
  status: "Scheduled" | "Active" | "Completed";
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  remarks?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  paymentMethod?: string;
  paidDate?: string;
}

export interface Communication {
  id: string;
  type: "Announcement" | "Alert" | "Message" | "Circular";
  title: string;
  content: string;
  sentBy: string;
  sentDate: string;
  recipients: string[];
  status: "Draft" | "Published" | "Archived";
}

export interface DashboardMetrics {
  totalStudents: number;
  totalFaculty: number;
  activeClasses: number;
  totalCourses: number;
  averageAttendance: number;
  pendingFees: number;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface RolePermission {
  feature: string;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  usersCount: number;
  permissions: RolePermission[];
  scope?: "system" | "campus" | "department";
  mfaRequired?: boolean;
  ipRestricted?: boolean;
  sessionTimeout?: string;
  defaultDashboard?: string;
  allowedDepartments?: string[];
}
