export const LESSON_TYPES = [
  { id: "video", label: "Video Lesson", color: "bg-red-100 text-red-700" },
  { id: "pdf", label: "PDF Resource", color: "bg-blue-100 text-blue-700" },
  {
    id: "quiz",
    label: "Quiz",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "live",
    label: "Live Class",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "assignment",
    label: "Assignment",
    color: "bg-orange-100 text-orange-700",
  },
  { id: "text", label: "Text Content", color: "bg-gray-100 text-gray-700" },
];

export const ASSIGNMENT_TYPES = [
  { id: "essay", label: "Essay Assignment" },
  { id: "file", label: "File Submission" },
  { id: "online", label: "Online Quiz" },
  { id: "discussion", label: "Discussion Post" },
];

export const GRADE_RANGES = [
  { min: 90, max: 100, grade: "A", color: "bg-green-100 text-green-700" },
  { min: 80, max: 89, grade: "B", color: "bg-blue-100 text-blue-700" },
  { min: 70, max: 79, grade: "C", color: "bg-yellow-100 text-yellow-700" },
  { min: 60, max: 69, grade: "D", color: "bg-orange-100 text-orange-700" },
  { min: 0, max: 59, grade: "F", color: "bg-red-100 text-red-700" },
];

export const STUDENT_STATUS = [
  { id: "active", label: "Active", color: "bg-green-100 text-green-700" },
  { id: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-700" },
  {
    id: "pending",
    label: "Pending Approval",
    color: "bg-yellow-100 text-yellow-700",
  },
  { id: "dropped", label: "Dropped", color: "bg-red-100 text-red-700" },
];

export const SUBMISSION_STATUS = [
  { id: "submitted", label: "Submitted", color: "bg-green-100 text-green-700" },
  { id: "graded", label: "Graded", color: "bg-blue-100 text-blue-700" },
  { id: "pending", label: "Pending Review", color: "bg-yellow-100 text-yellow-700" },
  { id: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  { id: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
];
