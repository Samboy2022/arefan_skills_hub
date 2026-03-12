export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  semester: string;
  enrollmentCount: number;
  thumbnail: string;
  status: "active" | "inactive" | "archived";
  credits: number;
  maxStudents: number;
}

export interface Module {
  id: string;
  title: string;
  week: number;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  type: "video" | "pdf" | "quiz" | "live" | "assignment" | "text";
  duration?: number;
  content?: string;
  videoUrl?: string;
  resourceUrl?: string;
  order: number;
  published: boolean;
  dripScheduled?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: "essay" | "file" | "online" | "discussion";
  dueDate: Date;
  maxScore: number;
  submissions: Submission[];
  status: "active" | "draft" | "closed";
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: Date;
  score?: number;
  feedback?: string;
  files?: string[];
  status: "submitted" | "graded" | "pending" | "overdue" | "draft";
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  attempts: QuizAttempt[];
  published: boolean;
  dueDate?: Date;
  createdAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  type: "mcq" | "essay" | "true-false" | "file";
  content: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  startTime: Date;
  endTime: Date;
  answers: Record<string, any>;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  status: "active" | "inactive" | "pending" | "dropped";
  enrolledCourses: string[];
  joinDate: Date;
  lastActivity?: Date;
}

export interface Grade {
  id: string;
  courseId: string;
  studentId: string;
  assignmentId?: string;
  score: number;
  maxScore: number;
  gradedAt: Date;
  feedback?: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  scheduled?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  replies: DiscussionReply[];
  createdAt: Date;
  isPinned: boolean;
  views: number;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  likes: number;
  createdAt: Date;
}

export interface ScheduleEvent {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: "lecture" | "exam" | "deadline" | "office-hours" | "meeting";
  location?: string;
  meetingLink?: string;
}

export interface InstructorProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  bio?: string;
  officeHours?: string[];
  profileImage?: string;
  contactPhone?: string;
}
