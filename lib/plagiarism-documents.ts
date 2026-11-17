import { MOCK_ASSIGNMENTS, MOCK_INSTRUCTOR_COURSES, MOCK_STUDENTS } from "@/lib/instructor-mock-data";
import { Assignment, Submission } from "@/lib/instructor-types";

export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx", "txt", "rtf", "odt", "md"] as const;

export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;

export function fileExtension(name: string) {
  const clean = name.trim().toLowerCase().split("?")[0] ?? "";
  const dot = clean.lastIndexOf(".");
  return dot >= 0 ? clean.slice(dot + 1) : "";
}

export function isDocumentName(name: string) {
  return (DOCUMENT_EXTENSIONS as readonly string[]).includes(fileExtension(name));
}

export function documentFiles(files: string[] | undefined) {
  return (files ?? []).filter(isDocumentName);
}

export interface SubmissionCandidate {
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentType: Assignment["type"];
  courseTitle: string;
  studentName: string;
  submittedAt: string;
  documentFiles: string[];
  otherFiles: string[];
  checkable: boolean;
  reason: string;
}

function courseTitle(courseId: string) {
  return MOCK_INSTRUCTOR_COURSES.find((course) => course.id === courseId)?.title ?? "Course";
}

function describe(submission: Submission, assignment: Assignment): Pick<SubmissionCandidate, "checkable" | "reason" | "documentFiles" | "otherFiles"> {
  const documents = documentFiles(submission.files);
  const otherFiles = (submission.files ?? []).filter((file) => !documents.includes(file));
  if (documents.length > 0) {
    return {
      documentFiles: documents,
      otherFiles,
      checkable: true,
      reason: documents.length === 1 ? documents[0] : `${documents.length} documents`,
    };
  }
  if (otherFiles.length > 0) {
    return {
      documentFiles: [],
      otherFiles,
      checkable: false,
      reason: "Code or other files only. Upload the write-up as a document.",
    };
  }
  if (assignment.type === "discussion" || assignment.type === "online") {
    return {
      documentFiles: [],
      otherFiles: [],
      checkable: false,
      reason: "This submission is not a document.",
    };
  }
  return {
    documentFiles: [],
    otherFiles: [],
    checkable: false,
    reason: "No file was attached. Upload the document to check it.",
  };
}

export function submissionCandidates(): SubmissionCandidate[] {
  const rows: SubmissionCandidate[] = [];
  MOCK_ASSIGNMENTS.forEach((assignment) => {
    assignment.submissions.forEach((submission) => {
      const student = MOCK_STUDENTS.find((entry) => entry.id === submission.studentId);
      const files = describe(submission, assignment);
      rows.push({
        submissionId: submission.id,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        assignmentType: assignment.type,
        courseTitle: courseTitle(assignment.courseId),
        studentName: student?.name ?? "Student",
        submittedAt: submission.submissionDate.toISOString(),
        ...files,
      });
    });
  });
  return rows.sort((a, b) => Number(b.checkable) - Number(a.checkable) || b.submittedAt.localeCompare(a.submittedAt));
}

export function candidateById(submissionId: string) {
  return submissionCandidates().find((row) => row.submissionId === submissionId) ?? null;
}
