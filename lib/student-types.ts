export type StudentCourse = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  thumbnail: string;
  credits: number;
  enrollment_date: string;
  status: "active" | "completed" | "enrolled" | "dropped";
  progress: number;
  grade: string | null;
  gpa: number;
  due_assignments: number;
  unread_announcements: number;
};

export type StudentLesson = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  type: "video" | "document" | "quiz" | "assignment";
  duration: number;
  is_locked: boolean;
  completed: boolean;
  completed_at: string | null;
  order: number;
};

export type StudentAssignment = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "submitted" | "graded" | "late" | "missing";
  submission_date: string | null;
  grade: number | null;
  feedback: string | null;
  points_earned: number | null;
  total_points: number;
};

export type StudentQuiz = {
  id: string;
  course_id: string;
  title: string;
  type: "graded" | "practice" | "ungraded";
  total_questions: number;
  time_limit: number;
  attempts_allowed: number;
  status: "not_started" | "in_progress" | "submitted";
  attempts: {
    attempt_number: number;
    score: number;
    date_attempted: string;
  }[];
  best_score: number | null;
};

export type StudentGrade = {
  course_id: string;
  course_name: string;
  assignments_grade: number;
  quizzes_grade: number;
  participation_grade: number;
  final_grade: number;
  letter_grade: string;
};

export type DiscussionThread = {
  id: string;
  course_id: string;
  title: string;
  author: string;
  author_avatar: string;
  created_at: string;
  replies_count: number;
  views: number;
  is_pinned: boolean;
  has_unread: boolean;
};

export type CourseAnnouncement = {
  id: string;
  course_id: string;
  title: string;
  content: string;
  instructor: string;
  created_at: string;
  is_read: boolean;
};

export type ScheduleEvent = {
  id: string;
  title: string;
  course_id: string;
  course_name: string;
  type: "class" | "assignment_due" | "quiz" | "exam" | "office_hours";
  start_time: string;
  end_time: string;
  location: string | null;
  description: string | null;
};

export type StudentMessage = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  conversation_id: string;
};

export type StudentMaterial = {
  id: string;
  course_id: string;
  name: string;
  type: "pdf" | "video" | "document" | "link" | "zip";
  size: string;
  uploaded_by: string;
  uploaded_date: string;
  download_count: number;
};

export type StudentProgress = {
  course_id: string;
  course_name: string;
  lessons_completed: number;
  total_lessons: number;
  assignments_completed: number;
  total_assignments: number;
  quizzes_taken: number;
  total_quizzes: number;
  overall_progress: number;
  last_activity: string;
};
