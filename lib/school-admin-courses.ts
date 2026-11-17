import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { mockFaculty } from "@/lib/tenant-mock-data";
import type { Course, Faculty } from "@/lib/tenant-types";

/** Existing school-admin persistence keys. Do not introduce a second store. */
export const COURSES_STORAGE_KEY = "school_admin_courses";
export const INSTRUCTORS_STORAGE_KEY = "school_admin_instructors";

export type SchoolAdminCourse = Course & {
  instructorIds: string[];
};

export type CourseMetadataInput = {
  title: string;
  code: string;
  description: string;
  categoryId: string;
  level: Course["level"];
  language: string;
  status: "draft" | "active" | "archived";
  credits: number;
  durationWeeks?: number;
  maxStudents?: number;
  semester?: string;
  prerequisites?: string;
  instructorIds: string[];
};

const INSTRUCTOR_SEED_ASSIGNMENTS: Record<string, string[]> = {
  "1": ["course-1", "course-2"],
  "2": ["course-2"],
  "3": ["course-3"],
  "4": ["course-1", "course-3"],
};

export const COURSE_CATEGORIES = [
  { id: "science", label: "Science" },
  { id: "engineering", label: "Engineering" },
  { id: "arts", label: "Arts" },
  { id: "business", label: "Business" },
  { id: "cat-1", label: "Computer Science" },
  { id: "cat-2", label: "Business studies" },
  { id: "cat-3", label: "Design" },
] as const;

export function seedFaculty(): Faculty[] {
  return mockFaculty.map((faculty) => ({
    ...faculty,
    assignedCourses: INSTRUCTOR_SEED_ASSIGNMENTS[faculty.id] || [],
  }));
}

export function seedCourses(): SchoolAdminCourse[] {
  return MOCK_INSTRUCTOR_COURSES.map((course) => ({
    id: course.id,
    title: course.title,
    code: course.code,
    categoryId: "cat-1",
    level: "beginner",
    language: "english",
    status: course.status === "archived" ? "archived" : course.status === "inactive" ? "draft" : "active",
    credits: course.credits,
    maxStudents: course.maxStudents,
    enrollmentCount: course.enrollmentCount,
    semester: course.semester,
    thumbnail: course.thumbnail,
    description: course.description,
    createdAt: new Date().toISOString(),
    instructorIds: [],
  }));
}

function readJson(key: string): unknown {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadFaculty(): Faculty[] {
  const parsed = readJson(INSTRUCTORS_STORAGE_KEY);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    const seed = seedFaculty();
    if (typeof window !== "undefined") {
      localStorage.setItem(INSTRUCTORS_STORAGE_KEY, JSON.stringify(seed));
    }
    return seed;
  }
  return parsed as Faculty[];
}

function normalizeStatus(status: unknown): SchoolAdminCourse["status"] {
  if (status === "active" || status === "published") return "active";
  if (status === "archived") return "archived";
  if (status === "inactive") return "inactive";
  return "draft";
}

function normalizeLevel(level: unknown): Course["level"] {
  if (level === "intermediate" || level === "advanced") return level;
  return "beginner";
}

function instructorIdsFor(raw: Record<string, unknown>, faculty: Faculty[], id: string): string[] {
  const stored = Array.isArray(raw.instructorIds) ? raw.instructorIds.map(String) : [];
  const fromFaculty = faculty
    .filter((member) => Array.isArray(member.assignedCourses) && member.assignedCourses.includes(id))
    .map((member) => member.id);
  const legacyName = typeof raw.instructor === "string" ? raw.instructor : "";
  const fromName = legacyName
    ? faculty.filter((member) => member.name === legacyName).map((member) => member.id)
    : [];
  return Array.from(new Set([...stored, ...fromFaculty, ...fromName]));
}

function normalizeCourse(raw: unknown, faculty: Faculty[]): SchoolAdminCourse | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (!record.id) return null;
  const id = String(record.id);
  const instructorIds = instructorIdsFor(record, faculty, id);
  const primary = faculty.find((member) => member.id === instructorIds[0]);
  return {
    id,
    title: String(record.title || record.name || "Untitled course"),
    code: String(record.code || ""),
    categoryId: String(record.categoryId || record.category_id || "science"),
    level: normalizeLevel(record.level),
    language: String(record.language || "english"),
    status: normalizeStatus(record.status),
    credits: Number(record.credits ?? record.creditUnits ?? 0) || 0,
    maxStudents: record.maxStudents == null || record.maxStudents === "" ? undefined : Number(record.maxStudents),
    enrollmentCount: Number(record.enrollmentCount ?? 0) || 0,
    semester: record.semester ? String(record.semester) : "",
    thumbnail: String(record.thumbnail || record.thumbnailUrl || ""),
    description: String(record.description || ""),
    prerequisites: record.prerequisites ? String(record.prerequisites) : "",
    durationWeeks: record.durationWeeks == null || record.durationWeeks === "" ? undefined : Number(record.durationWeeks),
    createdAt: String(record.createdAt || new Date().toISOString()),
    instructorIds,
    instructor: primary?.name,
  };
}

export function loadCourses(): SchoolAdminCourse[] {
  const faculty = loadFaculty();
  const parsed = readJson(COURSES_STORAGE_KEY);
  if (!Array.isArray(parsed)) {
    const seed = seedCourses().map((course) => ({
      ...course,
      instructorIds: faculty
        .filter((member) => member.assignedCourses?.includes(course.id))
        .map((member) => member.id),
    }));
    if (typeof window !== "undefined") {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(seed));
    }
    return seed.map((course) => ({
      ...course,
      instructor: faculty.find((member) => member.id === course.instructorIds[0])?.name,
    }));
  }
  return parsed
    .map((course) => normalizeCourse(course, faculty))
    .filter((course): course is SchoolAdminCourse => course !== null);
}

function syncFaculty(faculty: Faculty[], courses: SchoolAdminCourse[]): Faculty[] {
  const managedIds = new Set(courses.map((course) => course.id));
  return faculty.map((member) => {
    const kept = (member.assignedCourses || []).filter((courseId) => !managedIds.has(courseId));
    const assigned = courses
      .filter((course) => course.instructorIds.includes(member.id))
      .map((course) => course.id);
    return {
      ...member,
      assignedCourses: Array.from(new Set([...assigned, ...kept])),
    };
  });
}

function persist(courses: SchoolAdminCourse[], faculty: Faculty[]): Faculty[] {
  const nextFaculty = syncFaculty(faculty, courses);
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  localStorage.setItem(INSTRUCTORS_STORAGE_KEY, JSON.stringify(nextFaculty));
  return nextFaculty;
}

export function saveCourse(
  courses: SchoolAdminCourse[],
  faculty: Faculty[],
  input: CourseMetadataInput,
  id?: string,
): { courses: SchoolAdminCourse[]; faculty: Faculty[]; course: SchoolAdminCourse } {
  const courseId = id || `course-${Date.now()}`;
  const previous = courses.find((course) => course.id === courseId);
  const instructorIds = Array.from(new Set(input.instructorIds));
  const next: SchoolAdminCourse = {
    id: courseId,
    title: input.title.trim(),
    code: input.code.trim().toUpperCase(),
    description: input.description.trim(),
    categoryId: input.categoryId,
    level: input.level,
    language: input.language,
    status: input.status,
    credits: input.credits,
    durationWeeks: input.durationWeeks,
    maxStudents: input.maxStudents,
    semester: input.semester?.trim() || "",
    prerequisites: input.prerequisites?.trim() || "",
    enrollmentCount: previous?.enrollmentCount ?? 0,
    thumbnail: previous?.thumbnail || "",
    createdAt: previous?.createdAt || new Date().toISOString(),
    instructorIds,
    instructor: faculty.find((member) => member.id === instructorIds[0])?.name,
  };
  const nextCourses = previous
    ? courses.map((course) => (course.id === courseId ? next : course))
    : [next, ...courses];
  const nextFaculty = persist(nextCourses, faculty);
  return { courses: nextCourses, faculty: nextFaculty, course: next };
}

export function removeCourse(
  courses: SchoolAdminCourse[],
  faculty: Faculty[],
  id: string,
): { courses: SchoolAdminCourse[]; faculty: Faculty[] } {
  const nextCourses = courses.filter((course) => course.id !== id);
  const cleared = faculty.map((member) => ({
    ...member,
    assignedCourses: (member.assignedCourses || []).filter((courseId) => courseId !== id),
  }));
  const nextFaculty = persist(nextCourses, cleared);
  return { courses: nextCourses, faculty: nextFaculty };
}

export function instructorLabels(course: SchoolAdminCourse, faculty: Faculty[]): string[] {
  return course.instructorIds
    .map((id) => faculty.find((member) => member.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}
