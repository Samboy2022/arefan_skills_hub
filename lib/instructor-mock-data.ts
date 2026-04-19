import {
  Course,
  Module,
  Lesson,
  Assignment,
  Student,
  Grade,
  Quiz,
  Announcement,
  DiscussionThread,
  ScheduleEvent,
} from "@/lib/instructor-types";

export const MOCK_INSTRUCTOR_COURSES: Course[] = [
  {
    id: "course-1",
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "Fundamentals of programming and computational thinking",
    semester: "Spring 2024",
    enrollmentCount: 45,
    thumbnail: "/placeholder.svg?height=200&width=300",
    status: "active",
    credits: 3,
    maxStudents: 50,
  },
  {
    id: "course-2",
    code: "CS201",
    title: "Data Structures",
    description: "Advanced concepts in data organization and algorithms",
    semester: "Spring 2024",
    enrollmentCount: 38,
    thumbnail: "/placeholder.svg?height=200&width=300",
    status: "active",
    credits: 4,
    maxStudents: 40,
  },
  {
    id: "course-3",
    code: "CS301",
    title: "Web Development",
    description: "Building modern web applications",
    semester: "Spring 2024",
    enrollmentCount: 52,
    thumbnail: "/placeholder.svg?height=200&width=300",
    status: "active",
    credits: 3,
    maxStudents: 60,
  },
];

export const MOCK_MODULES: Module[] = [
  {
    id: "module-1",
    title: "Week 1: Fundamentals",
    week: 1,
    order: 1,
    lessons: [],
  },
  {
    id: "module-2",
    title: "Week 2: Variables & Control Flow",
    week: 2,
    order: 2,
    lessons: [],
  },
  {
    id: "module-3",
    title: "Week 3: Functions & Methods",
    week: 3,
    order: 3,
    lessons: [],
  },
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "course-1",
    moduleId: "module-1",
    title: "What is Computer Science?",
    description: "Introduction to the field and its applications",
    type: "video",
    duration: 15,
    videoUrl: "https://example.com/video1",
    order: 1,
    published: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "lesson-2",
    courseId: "course-1",
    moduleId: "module-1",
    title: "Setup Your First Program",
    description: "Environment setup and first Hello World",
    type: "pdf",
    resourceUrl: "https://example.com/setup.pdf",
    order: 2,
    published: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "lesson-3",
    courseId: "course-1",
    moduleId: "module-2",
    title: "Variables & Data Types",
    description: "Understanding variables and basic data types",
    type: "video",
    duration: 25,
    videoUrl: "https://example.com/video2",
    order: 1,
    published: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "lesson-4",
    courseId: "course-1",
    moduleId: "module-2",
    title: "Control Flow Quiz",
    description: "Test your understanding",
    type: "quiz",
    order: 2,
    published: true,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    courseId: "course-1",
    title: "Hello World Program",
    description: "Create your first program in Python and demonstrate basic I/O operations",
    type: "file",
    dueDate: new Date("2024-02-15"),
    maxScore: 100,
    status: "active",
    submissions: [
      {
        id: "sub-1",
        assignmentId: "assign-1",
        studentId: "student-1",
        submissionDate: new Date("2024-02-14"),
        score: 95,
        feedback: "Excellent work! Clean code and good comments.",
        status: "graded",
        files: ["hello_world.py"],
      },
      {
        id: "sub-2",
        assignmentId: "assign-1",
        studentId: "student-2",
        submissionDate: new Date("2024-02-13"),
        score: 87,
        feedback: "Good work, minor improvements needed.",
        status: "graded",
      },
      {
        id: "sub-3",
        assignmentId: "assign-1",
        studentId: "student-3",
        submissionDate: new Date("2024-02-15"),
        status: "submitted",
      },
    ],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "assign-2",
    courseId: "course-1",
    title: "Control Flow Assignment",
    description: "Implement if-else branches, for loops, and while loops to solve given problems",
    type: "file",
    dueDate: new Date("2024-02-28"),
    maxScore: 100,
    status: "active",
    submissions: [
      {
        id: "sub-4",
        assignmentId: "assign-2",
        studentId: "student-1",
        submissionDate: new Date("2024-02-27"),
        score: 88,
        feedback: "Good work, the loop logic was well-structured.",
        status: "graded",
        files: ["control_flow.py"],
      },
      {
        id: "sub-5",
        assignmentId: "assign-2",
        studentId: "student-2",
        submissionDate: new Date("2024-03-01"),
        status: "overdue",
      },
    ],
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "assign-3",
    courseId: "course-1",
    title: "Data Structures Practice",
    description: "Practice implementing basic data structures: stacks, queues, and linked lists",
    type: "essay",
    dueDate: new Date("2024-03-15"),
    maxScore: 100,
    status: "active",
    submissions: [
      {
        id: "sub-6",
        assignmentId: "assign-3",
        studentId: "student-1",
        submissionDate: new Date("2024-03-14"),
        score: 76,
        feedback: "Solid effort, but recursion section needs more work.",
        status: "graded",
        files: ["data_structures_essay.pdf"],
      },
    ],
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "assign-4",
    courseId: "course-2",
    title: "Linked List Implementation",
    description: "Implement a doubly linked list with insert, delete, and search operations",
    type: "file",
    dueDate: new Date("2024-03-10"),
    maxScore: 100,
    status: "active",
    submissions: [
      {
        id: "sub-7",
        assignmentId: "assign-4",
        studentId: "student-1",
        submissionDate: new Date("2024-03-09"),
        score: 91,
        feedback: "Great pointer management and edge case handling.",
        status: "graded",
        files: ["linked_list.cpp"],
      },
    ],
    createdAt: new Date("2024-02-25"),
  },
  {
    id: "assign-5",
    courseId: "course-2",
    title: "Binary Tree Traversal",
    description: "Implement in-order, pre-order, and post-order tree traversal algorithms",
    type: "file",
    dueDate: new Date("2024-04-01"),
    maxScore: 100,
    status: "active",
    submissions: [],
    createdAt: new Date("2024-03-15"),
  },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: "student-1",
    name: "Alice Johnson",
    email: "alice.johnson@school.edu",
    studentId: "STU001",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    enrolledCourses: ["course-1", "course-2"],
    joinDate: new Date("2024-01-15"),
    lastActivity: new Date("2024-02-20"),
  },
  {
    id: "student-2",
    name: "Bob Smith",
    email: "bob.smith@school.edu",
    studentId: "STU002",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    enrolledCourses: ["course-1"],
    joinDate: new Date("2024-01-15"),
    lastActivity: new Date("2024-02-18"),
  },
  {
    id: "student-3",
    name: "Carol Davis",
    email: "carol.davis@school.edu",
    studentId: "STU003",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    enrolledCourses: ["course-1", "course-3"],
    joinDate: new Date("2024-01-15"),
    lastActivity: new Date("2024-02-19"),
  },
  {
    id: "student-4",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    studentId: "STU004",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "pending",
    enrolledCourses: ["course-2"],
    joinDate: new Date("2024-02-10"),
  },
  {
    id: "student-5",
    name: "Eve Martinez",
    email: "eve.martinez@school.edu",
    studentId: "STU005",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    enrolledCourses: ["course-1"],
    joinDate: new Date("2024-01-15"),
    lastActivity: new Date("2024-01-30"),
  },
];

export const MOCK_GRADES: Grade[] = [
  // student-1 — course-1 assignments
  {
    id: "grade-1",
    courseId: "course-1",
    studentId: "student-1",
    assignmentId: "assign-1",
    type: "assignment",
    label: "Hello World Program",
    score: 95,
    maxScore: 100,
    gradedAt: new Date("2024-02-15"),
    feedback: "Excellent implementation! Clean code and good comments.",
  },
  {
    id: "grade-1b",
    courseId: "course-1",
    studentId: "student-1",
    assignmentId: "assign-2",
    type: "assignment",
    label: "Control Flow Assignment",
    score: 88,
    maxScore: 100,
    gradedAt: new Date("2024-03-02"),
    feedback: "Good work, the loop logic was well-structured.",
  },
  {
    id: "grade-1c",
    courseId: "course-1",
    studentId: "student-1",
    assignmentId: "assign-3",
    type: "assignment",
    label: "Data Structures Practice",
    score: 76,
    maxScore: 100,
    gradedAt: new Date("2024-03-20"),
    feedback: "Solid effort, but recursion section needs more work.",
  },
  // student-1 — course-2 assignments
  {
    id: "grade-1d",
    courseId: "course-2",
    studentId: "student-1",
    assignmentId: "assign-4",
    type: "assignment",
    label: "Linked List Implementation",
    score: 91,
    maxScore: 100,
    gradedAt: new Date("2024-03-10"),
    feedback: "Great pointer management and edge case handling.",
  },
  // student-1 — quizzes
  {
    id: "grade-1e",
    courseId: "course-1",
    studentId: "student-1",
    quizId: "quiz-1",
    type: "quiz",
    label: "Week 1 Assessment",
    score: 15,
    maxScore: 15,
    gradedAt: new Date("2024-02-18"),
  },
  {
    id: "grade-1f",
    courseId: "course-1",
    studentId: "student-1",
    quizId: "quiz-2",
    type: "quiz",
    label: "Week 3 Variables Quiz",
    score: 18,
    maxScore: 20,
    gradedAt: new Date("2024-03-05"),
  },
  {
    id: "grade-1g",
    courseId: "course-2",
    studentId: "student-1",
    quizId: "quiz-3",
    type: "quiz",
    label: "Data Structures Midterm Quiz",
    score: 22,
    maxScore: 25,
    gradedAt: new Date("2024-03-18"),
  },
  // student-1 — forum participation
  {
    id: "grade-1h",
    courseId: "course-1",
    studentId: "student-1",
    type: "forum",
    label: "CS101 Forum Participation",
    score: 48,
    maxScore: 50,
    gradedAt: new Date("2024-03-30"),
    feedback: "Very active in discussions, helpful replies.",
  },
  {
    id: "grade-1i",
    courseId: "course-2",
    studentId: "student-1",
    type: "forum",
    label: "Data Structures Forum Participation",
    score: 30,
    maxScore: 50,
    gradedAt: new Date("2024-03-30"),
    feedback: "Moderate participation, could engage more.",
  },
  // other students
  {
    id: "grade-2",
    courseId: "course-1",
    studentId: "student-2",
    assignmentId: "assign-1",
    type: "assignment",
    label: "Hello World Program",
    score: 87,
    maxScore: 100,
    gradedAt: new Date("2024-02-16"),
    feedback: "Good work, minor improvements needed",
  },
  {
    id: "grade-3",
    courseId: "course-1",
    studentId: "student-3",
    assignmentId: "assign-1",
    type: "assignment",
    label: "Hello World Program",
    score: 92,
    maxScore: 100,
    gradedAt: new Date("2024-02-15"),
    feedback: "Great job!",
  },
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    courseId: "course-1",
    title: "Week 1 Assessment",
    description: "Test your understanding of week 1 concepts",
    timeLimit: 30,
    passingScore: 70,
    published: true,
    dueDate: new Date("2024-02-18"),
    questions: [
      {
        id: "q1",
        quizId: "quiz-1",
        type: "mcq",
        content: "What is a variable?",
        points: 10,
        options: ["A container for data", "A function", "A loop", "A condition"],
        correctAnswer: "A container for data",
        order: 1,
      },
      {
        id: "q2",
        quizId: "quiz-1",
        type: "true-false",
        content: "Python is a compiled language",
        points: 5,
        correctAnswer: "false",
        order: 2,
      },
    ],
    attempts: [
      {
        id: "attempt-1",
        quizId: "quiz-1",
        studentId: "student-1",
        score: 15,
        maxScore: 15,
        startTime: new Date("2024-02-18 10:00"),
        endTime: new Date("2024-02-18 10:25"),
        answers: { q1: "A container for data", q2: "false" },
      },
    ],
    createdAt: new Date("2024-02-10"),
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "announce-1",
    courseId: "course-1",
    title: "Welcome to CS101",
    content: "Welcome to Introduction to Computer Science. Let's have a great semester!",
    publishedAt: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "announce-2",
    courseId: "course-1",
    title: "Assignment 1 Posted",
    content: "Assignment 1 is now available. Due on February 15th.",
    publishedAt: new Date("2024-02-01"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "announce-3",
    courseId: "course-1",
    title: "Exam Schedule",
    content: "Final exam is scheduled for May 20th from 2-4 PM",
    scheduled: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
];

export const MOCK_DISCUSSIONS: DiscussionThread[] = [
  {
    id: "discuss-1",
    courseId: "course-1",
    title: "How do I install Python?",
    content: "I'm having trouble installing Python on my computer. Can someone help?",
    authorId: "student-2",
    authorName: "Bob Smith",
    isPinned: false,
    views: 24,
    replies: [
      {
        id: "reply-1",
        threadId: "discuss-1",
        content: "Follow this guide: https://example.com/python-install",
        authorId: "instructor-1",
        authorName: "Dr. Jane Smith",
        likes: 8,
        createdAt: new Date("2024-02-12"),
      },
    ],
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "discuss-2",
    courseId: "course-1",
    title: "Can we extend the deadline?",
    content: "The assignment deadline is very tight for those with other projects. Can we get more time?",
    authorId: "student-1",
    authorName: "Alice Johnson",
    isPinned: false,
    views: 18,
    replies: [
      {
        id: "reply-2",
        threadId: "discuss-2",
        content: "The deadline has been extended to February 20th.",
        authorId: "instructor-1",
        authorName: "Dr. Jane Smith",
        likes: 12,
        createdAt: new Date("2024-02-11"),
      },
    ],
    createdAt: new Date("2024-02-10"),
  },
];

// Helper: build a Date at today+offsetDays at a given hour:minute
const _today = new Date();
const _d = (offsetDays: number, hour: number, minute = 0) => {
  const dt = new Date(_today);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, minute, 0, 0);
  return dt;
};

export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "event-1",
    courseId: "course-1",
    title: "CS101 — Variables & Control Flow Lecture",
    type: "lecture",
    startTime: _d(0, 10),
    endTime: _d(0, 11, 30),
    location: "Room 101, Main Building",
    description: "Introduction to variables, data types and conditional statements.",
  },
  {
    id: "event-2",
    courseId: "course-1",
    title: "Assignment 1 Due — Hello World Program",
    type: "deadline",
    startTime: _d(2, 23, 59),
    endTime: _d(2, 23, 59),
    description: "Deadline for submission of Assignment 1 via the course portal.",
  },
  {
    id: "event-3",
    courseId: "course-1",
    title: "CS101 Midterm Exam",
    type: "exam",
    startTime: _d(5, 14),
    endTime: _d(5, 16),
    location: "Exam Hall A",
    description: "Covers weeks 1–6: variables, loops, functions, and basic data structures.",
  },
  {
    id: "event-4",
    courseId: "course-1",
    title: "Office Hours — Open Q&A",
    type: "office-hours",
    startTime: _d(1, 16),
    endTime: _d(1, 18),
    location: "Office 304, Faculty Block",
    description: "Drop-in for any questions about coursework or assignments.",
  },
  {
    id: "event-5",
    courseId: "course-2",
    title: "CS201 — Binary Trees Lecture",
    type: "lecture",
    startTime: _d(1, 9),
    endTime: _d(1, 10, 30),
    location: "Room 202, Engineering Block",
    description: "Deep dive into binary search trees and AVL trees.",
  },
  {
    id: "event-6",
    courseId: "course-2",
    title: "Linked List Assignment Due",
    type: "deadline",
    startTime: _d(3, 23, 59),
    endTime: _d(3, 23, 59),
    description: "Submission deadline for doubly linked list implementation.",
  },
  {
    id: "event-7",
    courseId: "course-3",
    title: "CS301 — React & Component Architecture",
    type: "lecture",
    startTime: _d(2, 11),
    endTime: _d(2, 12, 30),
    location: "Lab 1, CS Department",
    meetingLink: "https://meet.google.com/abc-def-xyz",
    description: "Hands-on session on React hooks and state management.",
  },
  {
    id: "event-8",
    courseId: "course-1",
    title: "Faculty Dept. Meeting",
    type: "meeting",
    startTime: _d(4, 13),
    endTime: _d(4, 14),
    location: "Conference Room B",
    description: "Monthly faculty meeting to discuss curriculum updates.",
  },
  {
    id: "event-9",
    courseId: "course-3",
    title: "Web Dev Final Project Deadline",
    type: "deadline",
    startTime: _d(7, 23, 59),
    endTime: _d(7, 23, 59),
    description: "Final project submission — full-stack web app with React and REST API.",
  },
  {
    id: "event-10",
    courseId: "course-2",
    title: "CS201 Office Hours",
    type: "office-hours",
    startTime: _d(6, 15),
    endTime: _d(6, 17),
    location: "Office 304, Faculty Block",
    description: "Review session for upcoming binary tree exam.",
  },
  {
    id: "event-11",
    courseId: "course-1",
    title: "CS101 — Functions & Methods",
    type: "lecture",
    startTime: _d(-2, 10),
    endTime: _d(-2, 11, 30),
    location: "Room 101, Main Building",
    description: "Function definitions, parameters, return values and scope.",
  },
  {
    id: "event-12",
    courseId: "course-3",
    title: "CS301 Guest Lecture — Industry Expert",
    type: "meeting",
    startTime: _d(10, 14),
    endTime: _d(10, 15, 30),
    meetingLink: "https://zoom.us/j/123456789",
    description: "Guest lecture by a senior engineer on real-world web development.",
  },
];

// ── Course Groups ─────────────────────────────────────────────────────────────

import { CourseGroup } from "./instructor-types";

export const MOCK_COURSE_GROUPS: CourseGroup[] = [
  {
    id: "group-1",
    courseId: "course-1",
    courseTitle: "Introduction to Computer Science",
    courseCode: "CS101",
    name: "Alpha Team",
    description: "First project group focused on Python fundamentals.",
    members: [
      { studentId: "student-1", name: "Alice Johnson", email: "alice.johnson@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
      { studentId: "student-2", name: "Bob Smith", email: "bob.smith@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "group-2",
    courseId: "course-1",
    courseTitle: "Introduction to Computer Science",
    courseCode: "CS101",
    name: "Beta Team",
    description: "Second project group exploring control flow exercises.",
    members: [
      { studentId: "student-3", name: "Carol Davis", email: "carol.davis@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
      { studentId: "student-5", name: "Eve Martinez", email: "eve.martinez@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "group-3",
    courseId: "course-2",
    courseTitle: "Data Structures",
    courseCode: "CS201",
    name: "DS Study Group",
    description: "Collaborative study group covering trees and linked lists.",
    members: [
      { studentId: "student-1", name: "Alice Johnson", email: "alice.johnson@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
      { studentId: "student-4", name: "David Wilson", email: "david.wilson@school.edu", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: new Date("2024-03-10"),
  },
];

// ── Live Classes Mock Data ─────────────────────────────────────────────────────

const _mnow = new Date();
const _md = (daysOffset: number, hour: number) => {
  const d = new Date(_mnow);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export type MeetingStatus = "upcoming" | "live" | "ended";

export interface AttendanceRecord {
  student_id: string;
  student_name: string;
  avatar_url: string;
  joined_at: string;
  left_at: string;
  minutes_present: number;
  percentage: number;
  status: "present" | "partial" | "absent" | "did_not_join";
}

export interface AttendanceSettings {
  tracking_enabled: boolean;
  threshold_percentage: number;
  threshold_minutes: number;
  grace_period_minutes: number;
  allow_partial_credit: boolean;
  notify_students: boolean;
}

export interface InstructorMeeting {
  id: string;
  name: string;
  description: string;
  creator: { id: string; name: string; avatar_url: string };
  attendees: { id: string; name: string; avatar_url: string }[];
  start_time: string;
  duration: number;
  password: string;
  status: MeetingStatus;
  attendance: AttendanceSettings;
  zoom: { meeting_id: string };
  attendance_report?: {
    summary: { present: number; partial: number; absent: number; did_not_join: number };
    records: AttendanceRecord[];
  };
}

export const MOCK_MEETINGS: InstructorMeeting[] = [
  {
    id: "m1",
    name: "Introduction to React Hooks",
    description: "A hands-on session covering useState, useEffect, and custom hooks. We will build a small project together and explore common hook patterns used in production React apps.",
    creator: { id: "3", name: "Dr. Sarah Johnson", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    attendees: [
      { id: "12", name: "Alice Smith", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
      { id: "34", name: "Bob Jones", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
      { id: "56", name: "Carol White", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol" },
      { id: "78", name: "Dan Brown", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan" },
    ],
    start_time: _md(2, 10),
    duration: 60,
    password: "react123",
    status: "upcoming",
    attendance: { tracking_enabled: true, threshold_percentage: 80, threshold_minutes: 48, grace_period_minutes: 5, allow_partial_credit: false, notify_students: true },
    zoom: { meeting_id: "84123456789" },
  },
  {
    id: "m2",
    name: "Advanced CSS Animations",
    description: "Deep dive into keyframes, transitions, and the Web Animations API. Bring your creativity — we will animate real UI components live during the session.",
    creator: { id: "3", name: "Dr. Sarah Johnson", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    attendees: [
      { id: "12", name: "Alice Smith", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
      { id: "34", name: "Bob Jones", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
    ],
    start_time: _md(5, 14),
    duration: 90,
    password: "css456",
    status: "upcoming",
    attendance: { tracking_enabled: true, threshold_percentage: 80, threshold_minutes: 72, grace_period_minutes: 10, allow_partial_credit: true, notify_students: true },
    zoom: { meeting_id: "84987654321" },
  },
  {
    id: "m3",
    name: "Node.js & Express Fundamentals",
    description: "Building REST APIs with Node.js, Express, and MongoDB. We will cover routing, middleware, authentication, and connecting to a database.",
    creator: { id: "3", name: "Dr. Sarah Johnson", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    attendees: [
      { id: "12", name: "Alice Smith", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
      { id: "34", name: "Bob Jones", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
      { id: "56", name: "Carol White", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol" },
    ],
    start_time: _md(-3, 9),
    duration: 60,
    password: "",
    status: "ended",
    attendance: { tracking_enabled: true, threshold_percentage: 80, threshold_minutes: 48, grace_period_minutes: 5, allow_partial_credit: false, notify_students: true },
    zoom: { meeting_id: "84111222333" },
    attendance_report: {
      summary: { present: 2, partial: 0, absent: 1, did_not_join: 0 },
      records: [
        { student_id: "12", student_name: "Alice Smith", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", joined_at: _md(-3, 9), left_at: _md(-3, 10), minutes_present: 52, percentage: 87, status: "present" },
        { student_id: "34", student_name: "Bob Jones", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", joined_at: _md(-3, 9), left_at: _md(-3, 9), minutes_present: 27, percentage: 45, status: "absent" },
        { student_id: "56", student_name: "Carol White", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", joined_at: _md(-3, 9), left_at: _md(-3, 10), minutes_present: 55, percentage: 92, status: "present" },
      ],
    },
  },
];

export interface MessageThread {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "instructor";
  body: string;
  sentAt: Date;
  readAt?: Date;
}

export const MOCK_MESSAGES: Record<string, MessageThread[]> = {
  "student-1": [
    {
      id: "msg-1",
      senderId: "student-1",
      senderName: "Alice Johnson",
      senderRole: "student",
      body: "Hi, can you clarify the deadline for Module 3?",
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "msg-2",
      senderId: "instructor-1",
      senderName: "Jane Doe",
      senderRole: "instructor",
      body: "The deadline is Friday at midnight. Let me know if you need an extension.",
      sentAt: new Date(Date.now() - 1000 * 60 * 90), // 90 min ago
    },
  ],
};


