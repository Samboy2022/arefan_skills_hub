import {
  CheckOptions,
  CheckOrigin,
  DEFAULT_CHECK_OPTIONS,
  SIMILARITY_REPORTS,
  SimilarityReport,
  SimilaritySource,
  adjustedSimilarity,
} from "@/lib/plagiarism";

interface IndexedSource {
  id: string;
  title: string;
  type: SimilaritySource["type"];
  text: string;
}

const INDEX: IndexedSource[] = [
  { id: "src-1", title: "The Python Tutorial — Output", type: "internet", text: "The print function writes text to the standard output stream." },
  { id: "src-2", title: "Student paper — Intro notes, 2023", type: "student-paper", text: "A variable is a name that refers to a value." },
  { id: "src-6", title: "The Python Tutorial — Input", type: "internet", text: "The input function always returns a string." },
  { id: "src-4", title: "Lab handout — First program", type: "publication", text: "To begin, open a new file and save it before you type the first line. Comments should explain why the line exists, not what the syntax already says." },
  { id: "src-5", title: "Course reader, week 3", type: "publication", text: "A while loop repeats while its condition is true. Choose the structure that matches the order you need the data back in." },
  { id: "src-7", title: "GeeksforGeeks — Stack Data Structure", type: "internet", text: "A stack is a linear data structure that follows the Last In, First Out principle, which means the last element inserted is the first one to be removed. The push operation adds an element to the top of the stack, while the pop operation removes the topmost element." },
  { id: "src-8", title: "Student paper — Northwind Collegiate, 2025", type: "student-paper", text: "A queue, on the other hand, follows the First In, First Out principle and is commonly used in scheduling and buffering." },
  { id: "src-9", title: "Introduction to Data Structures, 3rd ed.", type: "publication", text: "Linked lists allow constant-time insertion and deletion at any position if a reference to the node is available." },
  { id: "src-10", title: "cplusplus.com forum — Doubly linked list delete", type: "internet", text: "When deleting a node from a doubly linked list, update the next pointer of the previous node and the previous pointer of the next node. Always handle the case where the list becomes empty after a deletion." },
  { id: "src-11", title: "Student paper — CS201, 2024", type: "student-paper", text: "Edge cases include the head and tail." },
  { id: "src-12", title: "Wikipedia — Sorting algorithm", type: "internet", text: "Merge sort is a stable divide and conquer algorithm that splits the list in half, sorts each half, and then merges the sorted halves." },
  { id: "src-13", title: "Course notes — Complexity", type: "publication", text: "Big-O notation describes an upper bound on how the running time grows as the input gets larger." },
];

const EXTRA_SUBMISSIONS: Record<string, string> = {
  "sub-5":
    "I finished the loop exercises after the deadline. A while loop repeats while its condition is true. I used that for the password prompt and a for loop for the multiplication table. The rest of the cases are my own examples.",
  "sub-9":
    "Merge sort is a stable divide and conquer algorithm that splits the list in half, sorts each half, and then merges the sorted halves. I timed it against quick sort on one thousand integers and the gap was small. My chart is in the appendix.",
  "sub-10":
    "Big-O notation describes an upper bound on how the running time grows as the input gets larger. I measured insertion sort and heap sort on the same random lists. Insertion sort won on the tiny lists and lost once the list passed a few hundred items.",
};

export interface CheckRequest {
  submissionId?: string;
  fileName: string;
  text?: string;
  studentName?: string;
  assignmentTitle?: string;
  courseTitle?: string;
  origin: CheckOrigin;
  options: CheckOptions;
  reportId?: string;
}

export function textForSubmission(submissionId: string) {
  const known = SIMILARITY_REPORTS.find((report) => report.submissionId === submissionId);
  if (known) return known.segments.map((segment) => segment.text).join("");
  return EXTRA_SUBMISSIONS[submissionId] ?? null;
}

export function analyzeDocument(request: CheckRequest, meta: { studentName: string; assignmentTitle: string; courseTitle: string; submittedAt: string }): SimilarityReport {
  const text = (request.text?.trim() || (request.submissionId ? textForSubmission(request.submissionId) : "") || "").trim();
  if (!text) {
    throw new Error("This submission has no document text on file. Upload the document to run the check.");
  }
  const words = wordCount(text);
  if (words < 20) {
    throw new Error("The document needs at least 20 words before a similarity check is useful.");
  }
  if (words > 20000) {
    throw new Error("This document is over 20,000 words. Split it and check each part.");
  }

  const options = { ...DEFAULT_CHECK_OPTIONS, ...request.options };
  const enabled = new Set<SimilaritySource["type"]>();
  if (options.internet) enabled.add("internet");
  if (options.studentPapers) enabled.add("student-paper");
  if (options.publications) enabled.add("publication");
  const sources = INDEX.filter((source) => enabled.has(source.type));

  const bibliographyAt = bibliographyIndex(text);
  const pieces = text.split(/(\n+|(?<=[.!?])\s+)/);
  const segments: SimilarityReport["segments"] = [];
  const hits = new Map<string, { words: number; snippet: string }>();
  let cursor = 0;

  pieces.forEach((piece, index) => {
    const at = cursor;
    cursor += piece.length;
    if (!piece) return;
    if (!piece.trim()) {
      segments.push({ id: `p-${index}`, kind: "plain", text: piece });
      return;
    }
    const pieceWords = tokenize(piece);
    const inBibliography = bibliographyAt >= 0 && at >= bibliographyAt;
    const quoted = /["“”]/.test(piece);
    const match = bestMatch(pieceWords, sources);
    const small = options.smallMatchWords > 0 && pieceWords.length <= options.smallMatchWords;
    let kind: SimilarityReport["segments"][number]["kind"] = "plain";
    let sourceId: string | undefined;
    if (inBibliography) kind = "bibliography";
    else if (match) {
      sourceId = match.id;
      kind = quoted ? "quote" : small ? "small" : "match";
      const current = hits.get(match.id) ?? { words: 0, snippet: piece.trim().slice(0, 180) };
      current.words += pieceWords.length;
      hits.set(match.id, current);
    }
    segments.push({ id: `p-${index}`, kind, text: piece, sourceId });
  });

  const total = Math.max(1, wordCount(text));
  const reportSources: SimilaritySource[] = INDEX.filter((source) => hits.has(source.id))
    .map((source) => {
      const hit = hits.get(source.id)!;
      return {
        id: source.id,
        rank: 0,
        title: source.title,
        type: source.type,
        matchPercent: Math.max(1, Math.round((hit.words / total) * 100)),
        words: hit.words,
        snippet: hit.snippet,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .map((source, index) => ({ ...source, rank: index + 1 }));

  const draft: SimilarityReport = {
    id: request.reportId || request.submissionId || `chk-${Date.now()}`,
    submissionId: request.submissionId || request.reportId || "upload",
    studentName: request.studentName?.trim() || meta.studentName,
    assignmentTitle: request.assignmentTitle?.trim() || meta.assignmentTitle,
    courseTitle: request.courseTitle?.trim() || meta.courseTitle,
    submittedAt: meta.submittedAt,
    similarity: 0,
    segments,
    sources: reportSources,
    origin: request.origin,
    fileName: request.fileName,
    language: detectLanguage(text),
    aiWriting: writingPattern(text),
    checkedAt: new Date().toISOString(),
    provider: "fnskills",
    options,
  };
  draft.similarity = adjustedSimilarity(draft, {
    bibliography: options.excludeBibliography,
    quotes: options.excludeQuotes,
    small: options.smallMatchWords > 0,
  });
  return draft;
}

function bestMatch(words: string[], sources: IndexedSource[]) {
  if (words.length < 5) return null;
  let winner: IndexedSource | null = null;
  let best = 0;
  for (const source of sources) {
    const sourceWords = tokenize(source.text);
    const shared = longestRun(words, sourceWords);
    if (shared >= 5 && shared > best) {
      best = shared;
      winner = source;
    }
  }
  return winner;
}

function longestRun(left: string[], right: string[]) {
  const grams = new Set<string>();
  for (let i = 0; i <= right.length - 5; i += 1) grams.add(right.slice(i, i + 5).join(" "));
  let best = 0;
  for (let i = 0; i <= left.length - 5; i += 1) {
    if (grams.has(left.slice(i, i + 5).join(" "))) best = Math.max(best, 5);
  }
  return best;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function wordCount(value: string) {
  return tokenize(value).length;
}

function bibliographyIndex(text: string) {
  const match = text.search(/\b(bibliography|references|works cited)\b/i);
  return match;
}

function detectLanguage(text: string) {
  const words = tokenize(text);
  const stops = new Set(["the", "and", "a", "of", "to", "in", "is", "that", "for", "it", "on", "with"]);
  const hits = words.filter((word) => stops.has(word)).length;
  return words.length > 0 && hits / words.length >= 0.08 ? "English" : "Undetected";
}

function writingPattern(text: string) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => tokenize(sentence).length)
    .filter((count) => count > 0);
  if (sentences.length < 2) return 0;
  const mean = sentences.reduce((sum, count) => sum + count, 0) / sentences.length;
  const variance = sentences.reduce((sum, count) => sum + (count - mean) ** 2, 0) / sentences.length;
  const spread = Math.sqrt(variance) / Math.max(1, mean);
  const unique = new Set(tokenize(text)).size / Math.max(1, wordCount(text));
  const uniform = 1 - Math.min(spread, 1);
  const repetitive = 1 - Math.min(unique * 1.8, 1);
  return Math.max(0, Math.min(99, Math.round(uniform * 60 + repetitive * 40)));
}
