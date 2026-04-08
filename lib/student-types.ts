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
  instructor_avatar: string;
};

export type StudentModule = {
  id: string;
  course_id: string;
  title: string;
  week_number: number;
  description: string;
  order: number;
};

export type StudentLesson = {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string;
  type: "video" | "document" | "quiz" | "assignment";
  duration: number;
  is_locked: boolean;
  completed: boolean;
  completed_at: string | null;
  order: number;
  video_url?: string;
};

export type StudentAssignment = {
  id: string;
  course_id: string;
  category: "course" | "module" | "lesson";
  target_name: string;
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "submitted" | "graded" | "late" | "missing";
  submission_date: string | null;
  grade: number | null;
  feedback: string | null;
  points_earned: number | null;
  total_points: number;
  has_attachment: boolean;
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correct_option_index: number;
  points: number;
};

export type StudentQuiz = {
  id: string;
  course_id: string;
  title: string;
  category: "course" | "module" | "lesson";
  target_name: string;
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
  questions?: QuizQuestion[];
};

export type GradeComponent = {
  earned: number;
  total: number;
  weight: number; // percentage weight in final grade
};

export type StudentGrade = {
  course_id: string;
  course_name: string;
  assignments: GradeComponent;
  tests: GradeComponent;
  quizzes: GradeComponent;
  forum_activities: GradeComponent;
  final_points: number;
  total_points: number;
  final_grade: number; // percentage, kept for GPA/letter grade calc
  letter_grade: string;
};

export type DiscussionComment = {
  id: string;
  thread_id: string;
  author: string;
  author_avatar: string;
  is_instructor?: boolean;
  content: string;
  created_at: string;
  is_helpful?: boolean;
  likes: number;
  replies: DiscussionReply[];
};

export type DiscussionReply = {
  id: string;
  comment_id: string;
  author: string;
  author_avatar: string;
  content: string;
  created_at: string;
  likes: number;
};

export type DiscussionThread = {
  id: string;
  course_id: string | null;
  forum_type: "general" | "course";
  title: string;
  description: string;
  author: string;
  author_id: string;
  author_avatar: string;
  created_at: string;
  replies_count: number;
  views: number;
  is_pinned: boolean;
  has_unread: boolean;
  comments?: DiscussionComment[];
};

export type CourseAnnouncement = {
  id: string;
  announcement_type: "general" | "course";
  course_id: string | null;
  title: string;
  content: string;
  instructor: string;
  instructor_avatar?: string;
  created_at: string;
  is_read: boolean;
  priority?: "normal" | "important" | "urgent";
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
  module_id?: string;
  name: string;
  description?: string;
  type: "pdf" | "video" | "document" | "link" | "zip" | "image";
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
