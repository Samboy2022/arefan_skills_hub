export interface SimilaritySource {
  id: string;
  rank: number;
  title: string;
  type: "internet" | "student-paper" | "publication";
  matchPercent: number;
  words: number;
  snippet: string;
}

export interface ReportSegment {
  id: string;
  text: string;
  kind: "plain" | "match" | "quote" | "bibliography" | "small";
  sourceId?: string;
}

export interface CheckOptions {
  internet: boolean;
  studentPapers: boolean;
  publications: boolean;
  excludeBibliography: boolean;
  excludeQuotes: boolean;
  /** Matches at or under this many words are tagged as small and left out of the score. */
  smallMatchWords: number;
}

export type CheckOrigin = "submission" | "upload";

export interface SimilarityReport {
  id: string;
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  courseTitle: string;
  submittedAt: string;
  similarity: number;
  segments: ReportSegment[];
  sources: SimilaritySource[];
  origin?: CheckOrigin;
  fileName?: string;
  language?: string;
  /** 0–100 writing-pattern score returned by the checker. It is not proof of authorship. */
  aiWriting?: number;
  checkedAt?: string;
  provider?: "fnskills" | "external";
  options?: CheckOptions;
}

export const SIMILARITY_REPORTS: SimilarityReport[] = [
  {
    id: "sub-1",
    submissionId: "sub-1",
    studentName: "Alice Johnson",
    assignmentTitle: "Hello World Program",
    courseTitle: "Introduction to Computer Science",
    submittedAt: "2024-02-14T16:10:00.000Z",
    similarity: 18,
    segments: [
      {
        id: "s1",
        kind: "plain",
        text: "This program asks for a name and prints a greeting. I wrote the input line myself. ",
      },
      {
        id: "s2",
        kind: "match",
        sourceId: "src-1",
        text: "The print function writes text to the standard output stream.",
      },
      {
        id: "s3",
        kind: "plain",
        text: " I then stored the name in a variable called student_name. ",
      },
      {
        id: "s4",
        kind: "quote",
        sourceId: "src-2",
        text: "\"A variable is a name that refers to a value.\"",
      },
      {
        id: "s5",
        kind: "small",
        sourceId: "src-3",
        text: " See also Python.",
      },
      {
        id: "s6",
        kind: "bibliography",
        text: " Bibliography: Python Software Foundation. The Python Tutorial. 2024.",
      },
    ],
    sources: [
      {
        id: "src-1",
        rank: 1,
        title: "The Python Tutorial — Output",
        type: "internet",
        matchPercent: 9,
        words: 11,
        snippet: "The print function writes text to the standard output stream.",
      },
      {
        id: "src-2",
        rank: 2,
        title: "Student paper — Intro notes, 2023",
        type: "student-paper",
        matchPercent: 6,
        words: 9,
        snippet: "A variable is a name that refers to a value.",
      },
      {
        id: "src-3",
        rank: 3,
        title: "Course glossary",
        type: "publication",
        matchPercent: 3,
        words: 3,
        snippet: "See also Python.",
      },
    ],
  },
  {
    id: "sub-3",
    submissionId: "sub-3",
    studentName: "Carol Davis",
    assignmentTitle: "Hello World Program",
    courseTitle: "Introduction to Computer Science",
    submittedAt: "2024-02-15T09:40:00.000Z",
    similarity: 42,
    segments: [
      {
        id: "a1",
        kind: "match",
        sourceId: "src-4",
        text: "To begin, open a new file and save it before you type the first line.",
      },
      {
        id: "a2",
        kind: "plain",
        text: " My file is called greeting.py. ",
      },
      {
        id: "a3",
        kind: "match",
        sourceId: "src-4",
        text: "Comments should explain why the line exists, not what the syntax already says.",
      },
      {
        id: "a4",
        kind: "plain",
        text: " I used one comment above the input call.",
      },
    ],
    sources: [
      {
        id: "src-4",
        rank: 1,
        title: "Lab handout — First program",
        type: "publication",
        matchPercent: 42,
        words: 28,
        snippet: "To begin, open a new file and save it before you type the first line.",
      },
    ],
  },
  {
    id: "sub-4",
    submissionId: "sub-4",
    studentName: "Alice Johnson",
    assignmentTitle: "Control Flow Assignment",
    courseTitle: "Introduction to Computer Science",
    submittedAt: "2024-02-27T18:05:00.000Z",
    similarity: 11,
    segments: [
      {
        id: "b1",
        kind: "plain",
        text: "The loop stops when the counter reaches ten. ",
      },
      {
        id: "b2",
        kind: "quote",
        sourceId: "src-5",
        text: "\"A while loop repeats while its condition is true.\"",
      },
      {
        id: "b3",
        kind: "bibliography",
        text: " Bibliography: Course reader, week 3.",
      },
    ],
    sources: [
      {
        id: "src-5",
        rank: 1,
        title: "Course reader, week 3",
        type: "publication",
        matchPercent: 11,
        words: 10,
        snippet: "A while loop repeats while its condition is true.",
      },
    ],
  },
  {
    id: "sub-2",
    submissionId: "sub-2",
    studentName: "Bob Smith",
    assignmentTitle: "Hello World Program",
    courseTitle: "Introduction to Computer Science",
    submittedAt: "2024-02-13T12:20:00.000Z",
    similarity: 6,
    segments: [
      {
        id: "c1",
        kind: "plain",
        text: "My program greets the user twice: once by name and once with the date. I kept the logic in one function so it is easy to test. ",
      },
      {
        id: "c2",
        kind: "match",
        sourceId: "src-6",
        text: "The input function always returns a string.",
      },
      {
        id: "c3",
        kind: "plain",
        text: " Because of that I convert the age before adding one to it, otherwise Python joins the two values instead of adding them.",
      },
    ],
    sources: [
      {
        id: "src-6",
        rank: 1,
        title: "The Python Tutorial — Input",
        type: "internet",
        matchPercent: 6,
        words: 7,
        snippet: "The input function always returns a string.",
      },
    ],
  },
  {
    id: "sub-6",
    submissionId: "sub-6",
    studentName: "Alice Johnson",
    assignmentTitle: "Data Structures Practice",
    courseTitle: "Introduction to Computer Science",
    submittedAt: "2024-03-14T21:45:00.000Z",
    similarity: 63,
    segments: [
      {
        id: "d1",
        kind: "match",
        sourceId: "src-7",
        text: "A stack is a linear data structure that follows the Last In, First Out principle, which means the last element inserted is the first one to be removed.",
      },
      {
        id: "d2",
        kind: "plain",
        text: " In my implementation I used a Python list. ",
      },
      {
        id: "d3",
        kind: "match",
        sourceId: "src-7",
        text: "The push operation adds an element to the top of the stack, while the pop operation removes the topmost element.",
      },
      {
        id: "d4",
        kind: "plain",
        text: " ",
      },
      {
        id: "d5",
        kind: "match",
        sourceId: "src-8",
        text: "A queue, on the other hand, follows the First In, First Out principle and is commonly used in scheduling and buffering.",
      },
      {
        id: "d6",
        kind: "plain",
        text: " I tested both with ten items. ",
      },
      {
        id: "d7",
        kind: "match",
        sourceId: "src-9",
        text: "Linked lists allow constant-time insertion and deletion at any position if a reference to the node is available.",
      },
      {
        id: "d8",
        kind: "quote",
        sourceId: "src-5",
        text: " \"Choose the structure that matches the order you need the data back in.\"",
      },
      {
        id: "d9",
        kind: "bibliography",
        text: " References: Course reader, week 5. GeeksforGeeks, Stack Data Structure.",
      },
    ],
    sources: [
      {
        id: "src-7",
        rank: 1,
        title: "GeeksforGeeks — Stack Data Structure",
        type: "internet",
        matchPercent: 31,
        words: 48,
        snippet: "A stack is a linear data structure that follows the Last In, First Out principle…",
      },
      {
        id: "src-8",
        rank: 2,
        title: "Student paper — Northwind Collegiate, 2025",
        type: "student-paper",
        matchPercent: 17,
        words: 21,
        snippet: "A queue, on the other hand, follows the First In, First Out principle…",
      },
      {
        id: "src-9",
        rank: 3,
        title: "Introduction to Data Structures, 3rd ed.",
        type: "publication",
        matchPercent: 11,
        words: 19,
        snippet: "Linked lists allow constant-time insertion and deletion at any position…",
      },
      {
        id: "src-5",
        rank: 4,
        title: "Course reader, week 5",
        type: "publication",
        matchPercent: 4,
        words: 12,
        snippet: "Choose the structure that matches the order you need the data back in.",
      },
    ],
  },
  {
    id: "sub-7",
    submissionId: "sub-7",
    studentName: "Alice Johnson",
    assignmentTitle: "Linked List Implementation",
    courseTitle: "Data Structures",
    submittedAt: "2024-03-09T15:10:00.000Z",
    similarity: 24,
    segments: [
      {
        id: "e1",
        kind: "plain",
        text: "Each node stores a value and two pointers. I wrote the insert method first and tested the empty-list case before anything else. ",
      },
      {
        id: "e2",
        kind: "match",
        sourceId: "src-10",
        text: "When deleting a node from a doubly linked list, update the next pointer of the previous node and the previous pointer of the next node.",
      },
      {
        id: "e3",
        kind: "plain",
        text: " The search method walks forward from the head. ",
      },
      {
        id: "e4",
        kind: "small",
        sourceId: "src-11",
        text: "Edge cases include the head and tail.",
      },
      {
        id: "e5",
        kind: "match",
        sourceId: "src-10",
        text: " Always handle the case where the list becomes empty after a deletion.",
      },
    ],
    sources: [
      {
        id: "src-10",
        rank: 1,
        title: "cplusplus.com forum — Doubly linked list delete",
        type: "internet",
        matchPercent: 20,
        words: 34,
        snippet: "When deleting a node from a doubly linked list, update the next pointer…",
      },
      {
        id: "src-11",
        rank: 2,
        title: "Student paper — CS201, 2024",
        type: "student-paper",
        matchPercent: 4,
        words: 7,
        snippet: "Edge cases include the head and tail.",
      },
    ],
  },
];

export function reportForSubmission(submissionId: string) {
  return SIMILARITY_REPORTS.find((report) => report.submissionId === submissionId) ?? null;
}

export function adjustedSimilarity(
  report: SimilarityReport,
  filters: { bibliography: boolean; quotes: boolean; small: boolean },
) {
  const hidden = new Set<string>();
  if (filters.bibliography) hidden.add("bibliography");
  if (filters.quotes) hidden.add("quote");
  if (filters.small) hidden.add("small");
  const visibleSources = report.sources.filter((source) =>
    report.segments.some(
      (segment) => segment.sourceId === source.id && !hidden.has(segment.kind),
    ),
  );
  const score = visibleSources.reduce((sum, source) => sum + source.matchPercent, 0);
  return Math.min(score, 100);
}

/* ── Bands, colours, and counts ─────────────────────────────────────────── */

export type RiskBand = "low" | "moderate" | "high";

export function riskBand(score: number): RiskBand {
  if (score >= 40) return "high";
  if (score >= 15) return "moderate";
  return "low";
}

export const RISK_STYLES: Record<RiskBand, { label: string; text: string; badge: string; ring: string; stroke: string }> = {
  low: {
    label: "Low",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
    ring: "ring-emerald-500/30",
    stroke: "stroke-emerald-500",
  },
  moderate: {
    label: "Moderate",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
    ring: "ring-amber-500/30",
    stroke: "stroke-amber-500",
  },
  high: {
    label: "High",
    text: "text-red-600 dark:text-red-400",
    badge: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400",
    ring: "ring-red-500/30",
    stroke: "stroke-red-500",
  },
};

/** One colour per source, by rank, used for the highlight and the matching source card. */
export const SOURCE_COLORS = [
  { dot: "bg-rose-500", mark: "bg-rose-100 text-rose-950 decoration-rose-500 dark:bg-rose-500/25 dark:text-rose-50", bar: "bg-rose-500", border: "border-l-rose-500" },
  { dot: "bg-sky-500", mark: "bg-sky-100 text-sky-950 decoration-sky-500 dark:bg-sky-500/25 dark:text-sky-50", bar: "bg-sky-500", border: "border-l-sky-500" },
  { dot: "bg-violet-500", mark: "bg-violet-100 text-violet-950 decoration-violet-500 dark:bg-violet-500/25 dark:text-violet-50", bar: "bg-violet-500", border: "border-l-violet-500" },
  { dot: "bg-amber-500", mark: "bg-amber-100 text-amber-950 decoration-amber-500 dark:bg-amber-500/25 dark:text-amber-50", bar: "bg-amber-500", border: "border-l-amber-500" },
  { dot: "bg-teal-500", mark: "bg-teal-100 text-teal-950 decoration-teal-500 dark:bg-teal-500/25 dark:text-teal-50", bar: "bg-teal-500", border: "border-l-teal-500" },
];

export function sourceColor(report: SimilarityReport, sourceId?: string) {
  const index = report.sources.findIndex((source) => source.id === sourceId);
  return SOURCE_COLORS[(index < 0 ? 0 : index) % SOURCE_COLORS.length];
}

export const SOURCE_TYPE_LABELS: Record<SimilaritySource["type"], string> = {
  internet: "Internet",
  "student-paper": "Student paper",
  publication: "Publication",
};

export function reportWordCount(report: SimilarityReport) {
  return report.segments.reduce((sum, segment) => sum + segment.text.trim().split(/\s+/).filter(Boolean).length, 0);
}

/* ── Review decisions (kept on this browser until the checker is connected) ── */

const REVIEWS_KEY = "fnskills:plagiarism-reviews";

export type ReviewStatus = "needs-review" | "cleared" | "flagged";

export interface ReviewDecision {
  status: ReviewStatus;
  note: string;
  reviewedAt?: string;
}

export const REVIEW_LABELS: Record<ReviewStatus, string> = {
  "needs-review": "Needs review",
  cleared: "Cleared",
  flagged: "Flagged",
};

export function loadReviews(): Record<string, ReviewDecision> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewDecision>) : {};
  } catch {
    return {};
  }
}

export function saveReview(reportId: string, decision: ReviewDecision) {
  if (typeof window === "undefined") return;
  const next = { ...loadReviews(), [reportId]: decision };
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked; the decision lives for this page view only.
  }
  window.dispatchEvent(new Event("fnskills-plagiarism"));
}

export function reviewFor(reviews: Record<string, ReviewDecision>, reportId: string): ReviewDecision {
  return reviews[reportId] ?? { status: "needs-review", note: "" };
}

export const DEFAULT_CHECK_OPTIONS: CheckOptions = {
  internet: true,
  studentPapers: true,
  publications: true,
  excludeBibliography: false,
  excludeQuotes: false,
  smallMatchWords: 8,
};

const REPORT_FILES: Record<string, { fileName: string; aiWriting: number }> = {
  "sub-1": { fileName: "hello_world_writeup.docx", aiWriting: 11 },
  "sub-2": { fileName: "hello_world_notes.pdf", aiWriting: 8 },
  "sub-3": { fileName: "lab_reflection.docx", aiWriting: 19 },
  "sub-4": { fileName: "control_flow_explanation.pdf", aiWriting: 14 },
  "sub-6": { fileName: "data_structures_essay.pdf", aiWriting: 34 },
  "sub-7": { fileName: "linked_list_report.docx", aiWriting: 16 },
};

/** Sample reports plus the fields a completed check always carries. */
export function catalogReports(): SimilarityReport[] {
  return SIMILARITY_REPORTS.map((report) => {
    const extra = REPORT_FILES[report.id];
    return {
      ...report,
      origin: report.origin ?? "submission",
      fileName: report.fileName ?? extra?.fileName,
      language: report.language ?? "English",
      aiWriting: report.aiWriting ?? extra?.aiWriting,
      checkedAt: report.checkedAt ?? report.submittedAt,
      provider: report.provider ?? "fnskills",
      options: report.options ?? DEFAULT_CHECK_OPTIONS,
    };
  });
}

const CHECKS_KEY = "fnskills:plagiarism-checks";

export function loadStoredReports(): SimilarityReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHECKS_KEY);
    const parsed = raw ? (JSON.parse(raw) as SimilarityReport[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredReport(report: SimilarityReport) {
  if (typeof window === "undefined") return;
  const next = loadStoredReports().filter((entry) => entry.id !== report.id);
  next.unshift(report);
  try {
    localStorage.setItem(CHECKS_KEY, JSON.stringify(next.slice(0, 80)));
  } catch {
    // Storage full or blocked. The report still opens for this visit via navigation state.
  }
  window.dispatchEvent(new Event("fnskills-plagiarism"));
}

export function allReports(): SimilarityReport[] {
  const merged = new Map<string, SimilarityReport>();
  catalogReports().forEach((report) => merged.set(report.id, report));
  loadStoredReports().forEach((report) => merged.set(report.id, report));
  return Array.from(merged.values());
}
