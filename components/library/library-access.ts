import { LibraryItem } from "@/lib/library";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { CourseOption } from "@/components/library/library-editor";

const INSTRUCTOR_COURSE_IDS = new Set(MOCK_INSTRUCTOR_COURSES.map((course) => course.id));

export const INSTRUCTOR_COURSE_CODES = MOCK_INSTRUCTOR_COURSES.map((course) => course.code);

export const COURSE_OPTIONS: CourseOption[] = MOCK_INSTRUCTOR_COURSES.map((course) => ({
  id: course.id,
  code: course.code,
  title: course.title,
}));

/** A lecturer edits what they uploaded for a course they teach. */
export function instructorOwns(item: LibraryItem) {
  return item.uploadedBy === "instructor" && Boolean(item.courseId && INSTRUCTOR_COURSE_IDS.has(item.courseId));
}

/** School admins can edit every record in the catalog. */
export function schoolAdminOwns() {
  return true;
}
