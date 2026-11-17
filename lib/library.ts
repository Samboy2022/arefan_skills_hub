export const LIBRARY_KEY = "fnskills:library-items:v2";
const LEGACY_LIBRARY_KEY = "fnskills:library-items";
const SHELF_KEY = "fnskills:library-shelf";
const PROGRESS_KEY = "fnskills:library-progress";
const COLLECTIONS_KEY = "fnskills:library-collections";
const SLIDER_KEY = "fnskills:library-slider";

export type LibraryFormat = "book" | "article" | "video" | "document" | "pdf" | "file" | "audio";
export type LibraryUploader = "school-admin" | "instructor";

export interface LibraryCollection {
  id: string;
  name: string;
  description: string;
  /** Set when this is a subcategory of another category. */
  parentId?: string;
}

export interface LibraryChapter {
  title: string;
  page?: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  description: string;
  format: LibraryFormat;
  subject: string;
  collectionId: string;
  courseId?: string;
  courseCode?: string;
  courseTitle?: string;
  uploadedBy: LibraryUploader;
  fileName: string;
  /** Present when the original file is stored and can be opened or downloaded. */
  hasFile?: boolean;
  fileMime?: string;
  year: number;
  pages?: number;
  addedAt: string;
  views: number;
  previewText: string;
  /** Data URL of an uploaded cover. When missing, a cover is drawn from `coverTone`. */
  coverImage?: string;
  coverTone?: CoverToneId;
  publisher?: string;
  language?: string;
  isbn?: string;
  tags?: string[];
  rating?: number;
  ratingCount?: number;
  chapters?: LibraryChapter[];
  fileSize?: number;
  featured?: boolean;
  /** Hidden titles stay in the admin catalog and leave the public and student shelves. */
  hidden?: boolean;
  /** Minutes, for video items. */
  duration?: number;
}

export const LIBRARY_COLLECTIONS: LibraryCollection[] = [
  {
    id: "col-foundations",
    name: "Foundations",
    description: "Core texts used across the school.",
  },
  {
    id: "col-research",
    name: "Research and journals",
    description: "Articles and papers for coursework.",
  },
  {
    id: "col-media",
    name: "Lectures and media",
    description: "Recorded explainers and short films.",
  },
  {
    id: "col-reserves",
    name: "Course reserves",
    description: "Readings a lecturer attached to one course.",
  },
  {
    id: "col-foundations-textbooks",
    name: "Textbooks",
    description: "Full-length titles inside Foundations.",
    parentId: "col-foundations",
  },
];

export const LIBRARY_SUBJECTS = [
  "Computer science",
  "Mathematics",
  "Science",
  "Engineering",
  "Business",
  "Writing",
  "Humanities",
];

export const SUBJECT_ICONS: Record<string, string> = {
  "Computer science": "https://img.icons8.com/scribby/96/code.png",
  Mathematics: "https://img.icons8.com/scribby/96/calculator.png",
  Science: "https://img.icons8.com/scribby/96/test-tube.png",
  Engineering: "https://img.icons8.com/scribby/96/maintenance.png",
  Business: "https://img.icons8.com/scribby/96/briefcase.png",
  Writing: "https://img.icons8.com/scribby/96/pen.png",
  Humanities: "https://img.icons8.com/scribby/96/globe-earth.png",
};

export const LIBRARY_FORMATS: LibraryFormat[] = ["pdf", "book", "article", "file", "document", "video", "audio"];

export const FORMAT_LABELS: Record<LibraryFormat, string> = {
  book: "Book",
  article: "Article",
  video: "Video",
  document: "File",
  pdf: "PDF",
  file: "File",
  audio: "Audio",
};

export function publisherLabel(uploadedBy: LibraryUploader) {
  return uploadedBy === "instructor" ? "Instructor" : "School admin";
}

export function isTimedFormat(format: LibraryFormat) {
  return format === "video" || format === "audio";
}

export const LIBRARY_LANGUAGES = ["English", "French", "Arabic", "Spanish", "Hausa", "Yoruba"];

/* ── Covers ─────────────────────────────────────────────────────────────── */

export type CoverToneId =
  | "forest"
  | "ocean"
  | "plum"
  | "ember"
  | "slate"
  | "sand"
  | "teal"
  | "rose";

export interface CoverTone {
  id: CoverToneId;
  label: string;
  /** Tailwind classes for the cover face. Kept literal so Tailwind can see them. */
  face: string;
  ink: string;
  accent: string;
}

export const COVER_TONES: CoverTone[] = [
  { id: "forest", label: "Forest", face: "bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950", ink: "text-emerald-50", accent: "bg-amber-300" },
  { id: "ocean", label: "Ocean", face: "bg-gradient-to-br from-sky-600 via-blue-800 to-indigo-950", ink: "text-sky-50", accent: "bg-sky-200" },
  { id: "plum", label: "Plum", face: "bg-gradient-to-br from-fuchsia-700 via-purple-800 to-purple-950", ink: "text-purple-50", accent: "bg-pink-200" },
  { id: "ember", label: "Ember", face: "bg-gradient-to-br from-orange-500 via-red-600 to-red-900", ink: "text-orange-50", accent: "bg-yellow-200" },
  { id: "slate", label: "Slate", face: "bg-gradient-to-br from-slate-600 via-slate-800 to-slate-950", ink: "text-slate-50", accent: "bg-emerald-300" },
  { id: "sand", label: "Sand", face: "bg-gradient-to-br from-amber-100 via-amber-200 to-orange-300", ink: "text-stone-900", accent: "bg-stone-900" },
  { id: "teal", label: "Teal", face: "bg-gradient-to-br from-teal-500 via-teal-700 to-cyan-950", ink: "text-teal-50", accent: "bg-lime-200" },
  { id: "rose", label: "Rose", face: "bg-gradient-to-br from-rose-200 via-rose-300 to-rose-500", ink: "text-rose-950", accent: "bg-rose-950" },
];

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(result);
}

export function coverToneFor(item: Pick<LibraryItem, "id" | "coverTone">): CoverTone {
  return (
    COVER_TONES.find((tone) => tone.id === item.coverTone) ??
    COVER_TONES[hash(item.id) % COVER_TONES.length]
  );
}

/* ── Seed catalog ───────────────────────────────────────────────────────── */

const SEED: LibraryItem[] = [
  {
    id: "lib-1",
    title: "Structures of Programs",
    author: "Mina Adeyemi",
    description:
      "A school textbook on functions, data, and how programs are organized. Each chapter builds one small program, then asks you to change it so you can see which parts carry the design.",
    format: "book",
    subject: "Computer science",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "structures-of-programs.pdf",
    year: 2024,
    pages: 286,
    addedAt: "2026-09-02T10:00:00.000Z",
    views: 128,
    coverTone: "forest",
    publisher: "Fnskills Press",
    language: "English",
    isbn: "978-1-4028-9462-6",
    tags: ["programming", "fundamentals", "python"],
    rating: 4.7,
    ratingCount: 64,
    featured: true,
    fileSize: 8_400_000,
    chapters: [
      { title: "Names and values", page: 1 },
      { title: "Functions as building blocks", page: 34 },
      { title: "Lists, records, and shape", page: 78 },
      { title: "Control flow you can read", page: 121 },
      { title: "Modules and boundaries", page: 170 },
      { title: "Testing what you wrote", page: 228 },
    ],
    previewText:
      "A program is a set of instructions a computer can follow. This chapter starts with names, values, and the small decisions that make a larger system. Read the worked example before the exercises.\n\nEvery value in a program has a type, and every name points at exactly one value at a time. When you change what a name points at, nothing else moves. That rule is the first thing to hold on to: most confusing bugs come from forgetting which name points where.",
  },
  {
    id: "lib-2",
    title: "Notes on Algorithms",
    author: "School Library",
    description: "Short articles on sorting, search, and why running time matters.",
    format: "article",
    subject: "Computer science",
    collectionId: "col-research",
    uploadedBy: "school-admin",
    fileName: "notes-on-algorithms.pdf",
    year: 2025,
    pages: 42,
    addedAt: "2026-09-18T10:00:00.000Z",
    views: 86,
    coverTone: "slate",
    language: "English",
    tags: ["algorithms", "complexity"],
    rating: 4.3,
    ratingCount: 21,
    fileSize: 1_200_000,
    chapters: [
      { title: "Counting steps", page: 1 },
      { title: "Linear and binary search", page: 9 },
      { title: "Sorting, three ways", page: 21 },
    ],
    previewText:
      "An algorithm is a finite list of steps. Two lists can solve the same problem and still differ in the work they ask of the machine. Count the steps before you pick one.",
  },
  {
    id: "lib-3",
    title: "Discrete Mathematics for First Year",
    author: "Helen Cho",
    description: "Sets, logic, and counting, written for students who are new to proofs.",
    format: "book",
    subject: "Mathematics",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "discrete-mathematics.pdf",
    year: 2023,
    pages: 410,
    addedAt: "2026-08-11T10:00:00.000Z",
    views: 203,
    coverTone: "ocean",
    publisher: "Meridian Academic",
    language: "English",
    isbn: "978-0-262-03384-8",
    tags: ["proofs", "logic", "sets"],
    rating: 4.8,
    ratingCount: 112,
    featured: true,
    fileSize: 12_600_000,
    chapters: [
      { title: "Statements and truth", page: 1 },
      { title: "Sets and functions", page: 52 },
      { title: "Induction", page: 118 },
      { title: "Counting", page: 176 },
      { title: "Graphs", page: 260 },
      { title: "Relations", page: 334 },
    ],
    previewText:
      "A proof is an argument that leaves no gap a careful reader can fall through. Begin with the definitions on this page, then try the first three exercises without looking ahead.\n\nWe will write every statement so that it is either true or false, never both. Once that habit is in place, the rules of logic stop feeling like rules and start feeling like common sense written down carefully.",
  },
  {
    id: "lib-4",
    title: "CS101 Week 1: How a program runs",
    author: "Dr. Jane Smith",
    description: "Course reserve for Introduction to Computer Science.",
    format: "video",
    subject: "Computer science",
    collectionId: "col-reserves",
    courseId: "course-1",
    courseCode: "CS101",
    courseTitle: "Introduction to Computer Science",
    uploadedBy: "instructor",
    fileName: "cs101-week-1.mp4",
    year: 2026,
    addedAt: "2026-10-01T10:00:00.000Z",
    views: 64,
    coverTone: "teal",
    language: "English",
    tags: ["lecture", "week 1"],
    rating: 4.5,
    ratingCount: 18,
    duration: 42,
    fileSize: 310_000_000,
    previewText:
      "This recording walks through a first program from the file on disk to the result on screen. Pause at the memory diagram and name each box before you continue.",
  },
  {
    id: "lib-5",
    title: "Data Structures Reading Packet",
    author: "Dr. Jane Smith",
    description: "Stacks, queues, and the problems they make easier.",
    format: "document",
    subject: "Computer science",
    collectionId: "col-reserves",
    courseId: "course-2",
    courseCode: "CS201",
    courseTitle: "Data Structures",
    uploadedBy: "instructor",
    fileName: "cs201-reading-packet.pdf",
    year: 2026,
    pages: 28,
    addedAt: "2026-10-04T10:00:00.000Z",
    views: 41,
    coverTone: "plum",
    language: "English",
    tags: ["stacks", "queues"],
    rating: 4.2,
    ratingCount: 9,
    fileSize: 2_100_000,
    chapters: [
      { title: "Stacks", page: 1 },
      { title: "Queues", page: 11 },
      { title: "Choosing between them", page: 22 },
    ],
    previewText:
      "A stack returns the last item you put in. A queue returns the first. The packet uses both to show why the shape of the data changes the shape of the code.",
  },
  {
    id: "lib-6",
    title: "Writing for Technical Courses",
    author: "School Library",
    description: "How to cite a source and how to mark a quotation.",
    format: "book",
    subject: "Writing",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "writing-for-technical-courses.pdf",
    year: 2022,
    pages: 156,
    addedAt: "2026-07-20T10:00:00.000Z",
    views: 97,
    coverTone: "sand",
    publisher: "Fnskills Press",
    language: "English",
    isbn: "978-1-84467-012-3",
    tags: ["citation", "academic writing"],
    rating: 4.4,
    ratingCount: 37,
    fileSize: 3_800_000,
    chapters: [
      { title: "Why we cite", page: 1 },
      { title: "Quoting and paraphrasing", page: 24 },
      { title: "Reference styles", page: 61 },
      { title: "Writing a lab report", page: 102 },
    ],
    previewText:
      "Quote only the words you need. Name the source in the sentence, and put the rest of the citation where your course asks for it. A quotation without a name is not a citation.",
  },
  {
    id: "lib-7",
    title: "Web Platforms, a short history",
    author: "Ibrahim Sanni",
    description: "An article reserved for the web development course.",
    format: "article",
    subject: "Computer science",
    collectionId: "col-reserves",
    courseId: "course-3",
    courseCode: "CS301",
    courseTitle: "Web Development",
    uploadedBy: "instructor",
    fileName: "web-platforms.pdf",
    year: 2025,
    pages: 16,
    addedAt: "2026-10-08T10:00:00.000Z",
    views: 33,
    coverTone: "ember",
    language: "English",
    tags: ["web", "history"],
    rating: 4.0,
    ratingCount: 6,
    fileSize: 900_000,
    previewText:
      "A page is a document the browser paints. A platform is the set of rules that document has to live inside. This article separates the two before the first assignment.",
  },
  {
    id: "lib-8",
    title: "Laboratory Safety Film",
    author: "School Library",
    description: "A short film required before practical science sessions.",
    format: "video",
    subject: "Science",
    collectionId: "col-media",
    uploadedBy: "school-admin",
    fileName: "lab-safety.mp4",
    year: 2024,
    addedAt: "2026-09-28T10:00:00.000Z",
    views: 150,
    coverTone: "ember",
    language: "English",
    tags: ["safety", "required"],
    rating: 4.6,
    ratingCount: 48,
    duration: 18,
    fileSize: 140_000_000,
    previewText:
      "The film opens with the three rules posted at the lab door: eye protection, labeled containers, and a clear walkway. Watch it once before your first practical.",
  },
  {
    id: "lib-audio-1",
    title: "Listening notes: how a proof sounds",
    author: "Helen Cho",
    description: "A short audio walkthrough of the first proof in Discrete Mathematics.",
    format: "audio",
    subject: "Mathematics",
    collectionId: "col-media",
    uploadedBy: "instructor",
    fileName: "proof-walkthrough.mp3",
    year: 2026,
    addedAt: "2026-10-08T10:00:00.000Z",
    views: 37,
    coverTone: "sand",
    language: "English",
    tags: ["audio", "proofs"],
    rating: 4.4,
    ratingCount: 11,
    duration: 16,
    fileSize: 18_000_000,
    previewText:
      "This recording reads the first proof aloud and pauses after each sentence so you can say what the sentence just claimed.",
  },
  {
    id: "lib-9",
    title: "Calculus, Gently",
    author: "Tomás Ferreira",
    description:
      "Limits, derivatives, and integrals introduced through motion and area, with every new idea tied to a picture first.",
    format: "book",
    subject: "Mathematics",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "calculus-gently.pdf",
    year: 2021,
    pages: 368,
    addedAt: "2026-06-14T10:00:00.000Z",
    views: 241,
    coverTone: "rose",
    publisher: "Meridian Academic",
    language: "English",
    isbn: "978-0-13-468599-1",
    tags: ["calculus", "derivatives", "integrals"],
    rating: 4.9,
    ratingCount: 156,
    featured: true,
    fileSize: 15_200_000,
    chapters: [
      { title: "Speed at an instant", page: 1 },
      { title: "Limits without fear", page: 40 },
      { title: "The derivative", page: 92 },
      { title: "Area and accumulation", page: 188 },
      { title: "The fundamental theorem", page: 251 },
    ],
    previewText:
      "Drive a car for an hour and the speedometer shows a different number at every moment. The average speed is easy: distance over time. The speed at one instant is harder, and the whole of this book grows out of that one question.",
  },
  {
    id: "lib-10",
    title: "Linear Algebra Workbook",
    author: "Helen Cho",
    description: "Practice problems on vectors, matrices, and transformations with worked solutions.",
    format: "document",
    subject: "Mathematics",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "linear-algebra-workbook.pdf",
    year: 2025,
    pages: 120,
    addedAt: "2026-09-30T10:00:00.000Z",
    views: 72,
    coverTone: "teal",
    language: "English",
    tags: ["matrices", "vectors", "practice"],
    rating: 4.3,
    ratingCount: 22,
    fileSize: 4_400_000,
    previewText:
      "Each section opens with three short problems. Solve them before reading the explanation. If you get all three, skip ahead; if not, the worked solution shows exactly where the usual mistake happens.",
  },
  {
    id: "lib-11",
    title: "The Living Cell",
    author: "Dr. Amara Nwosu",
    description: "An illustrated introduction to cell structure, membranes, and how energy moves inside a cell.",
    format: "book",
    subject: "Science",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "the-living-cell.pdf",
    year: 2023,
    pages: 298,
    addedAt: "2026-08-25T10:00:00.000Z",
    views: 119,
    coverTone: "forest",
    publisher: "Greenleaf Education",
    language: "English",
    isbn: "978-0-19-881124-0",
    tags: ["biology", "cells"],
    rating: 4.6,
    ratingCount: 51,
    featured: true,
    fileSize: 22_000_000,
    chapters: [
      { title: "What counts as alive", page: 1 },
      { title: "Membranes", page: 46 },
      { title: "Energy and the mitochondrion", page: 112 },
      { title: "Copying the instructions", page: 190 },
    ],
    previewText:
      "Every living thing you have ever seen is built from cells, and every cell came from another cell. That sentence took biologists two centuries to be sure of. This chapter shows you the evidence they used.",
  },
  {
    id: "lib-12",
    title: "Statics and Structures",
    author: "Kwame Mensah",
    description: "Forces, moments, and how bridges and frames carry load without moving.",
    format: "book",
    subject: "Engineering",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "statics-and-structures.pdf",
    year: 2022,
    pages: 340,
    addedAt: "2026-07-02T10:00:00.000Z",
    views: 88,
    coverTone: "slate",
    publisher: "Ironbridge Books",
    language: "English",
    isbn: "978-1-118-91694-5",
    tags: ["mechanics", "structures"],
    rating: 4.5,
    ratingCount: 30,
    fileSize: 18_500_000,
    chapters: [
      { title: "Forces as arrows", page: 1 },
      { title: "Equilibrium", page: 58 },
      { title: "Trusses", page: 140 },
      { title: "Beams and bending", page: 222 },
    ],
    previewText:
      "A structure that stands still is not doing nothing. Every member is pushing or pulling against its neighbours, and those forces balance exactly. Statics is the habit of drawing those arrows before you calculate anything.",
  },
  {
    id: "lib-13",
    title: "Starting a Small Business",
    author: "Grace Oduya",
    description: "From an idea to a first customer: costs, pricing, and keeping simple accounts.",
    format: "book",
    subject: "Business",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "starting-a-small-business.pdf",
    year: 2024,
    pages: 212,
    addedAt: "2026-09-10T10:00:00.000Z",
    views: 104,
    coverTone: "sand",
    publisher: "Harbor Street Press",
    language: "English",
    isbn: "978-0-307-88789-4",
    tags: ["entrepreneurship", "accounting"],
    rating: 4.4,
    ratingCount: 40,
    fileSize: 6_700_000,
    chapters: [
      { title: "Is it a business yet?", page: 1 },
      { title: "Costs you can see and costs you can't", page: 38 },
      { title: "Setting a price", page: 87 },
      { title: "Keeping the books", page: 140 },
    ],
    previewText:
      "Before you spend anything, write down who will pay you and why. If you cannot name the first ten customers, you have an idea, not a business. That is fine; this chapter is about turning one into the other.",
  },
  {
    id: "lib-14",
    title: "Markets and Prices",
    author: "School Library",
    description: "A journal digest on supply, demand, and how prices carry information.",
    format: "article",
    subject: "Business",
    collectionId: "col-research",
    uploadedBy: "school-admin",
    fileName: "markets-and-prices.pdf",
    year: 2025,
    pages: 24,
    addedAt: "2026-10-06T10:00:00.000Z",
    views: 29,
    coverTone: "ocean",
    language: "English",
    tags: ["economics"],
    rating: 4.1,
    ratingCount: 8,
    fileSize: 1_000_000,
    previewText:
      "A price is a message. When it rises, it tells buyers to use less and sellers to make more, without anyone writing a memo. These short papers trace that message through four real markets.",
  },
  {
    id: "lib-15",
    title: "A History of Ideas in Africa",
    author: "Chinedu Obi",
    description: "Philosophers, scholars, and traditions of thought from Timbuktu to the present day.",
    format: "book",
    subject: "Humanities",
    collectionId: "col-foundations",
    uploadedBy: "school-admin",
    fileName: "history-of-ideas-in-africa.pdf",
    year: 2020,
    pages: 452,
    addedAt: "2026-05-30T10:00:00.000Z",
    views: 77,
    coverTone: "ember",
    publisher: "Sahel House",
    language: "English",
    isbn: "978-0-253-01745-2",
    tags: ["history", "philosophy"],
    rating: 4.7,
    ratingCount: 26,
    fileSize: 9_800_000,
    chapters: [
      { title: "The libraries of Timbuktu", page: 1 },
      { title: "Oral traditions as archives", page: 88 },
      { title: "Colonial encounters", page: 190 },
      { title: "Independence and new thought", page: 310 },
    ],
    previewText:
      "In the fifteenth century, scholars in Timbuktu copied, argued over, and annotated thousands of manuscripts. Many of those pages survive. This book begins with them, because they show that the history of ideas was never written in one place.",
  },
  {
    id: "lib-16",
    title: "Clear Sentences",
    author: "Fatima Bello",
    description: "Short lessons on writing sentences that say one thing at a time.",
    format: "video",
    subject: "Writing",
    collectionId: "col-media",
    uploadedBy: "school-admin",
    fileName: "clear-sentences.mp4",
    year: 2025,
    addedAt: "2026-10-10T10:00:00.000Z",
    views: 58,
    coverTone: "plum",
    language: "English",
    tags: ["style", "grammar"],
    rating: 4.5,
    ratingCount: 14,
    duration: 26,
    fileSize: 210_000_000,
    previewText:
      "Find the subject. Find the verb. Put them close together. The first lesson rewrites five real sentences from student essays using only that rule.",
  },
];

const SEED_IDS = new Set(SEED.map((item) => item.id));

function browser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!browser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!browser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked; the in-memory state still updates for this session.
  }
}

/** Keeps anything a person uploaded under the old key, and replaces the old seed with the new one. */
function migrateLegacy(): LibraryItem[] {
  const legacy = readJson<LibraryItem[]>(LEGACY_LIBRARY_KEY, []);
  const uploads = Array.isArray(legacy) ? legacy.filter((item) => !SEED_IDS.has(item.id)) : [];
  return [...uploads, ...SEED];
}

export function loadLibrary(): LibraryItem[] {
  if (!browser()) return SEED;
  const stored = readJson<LibraryItem[] | null>(LIBRARY_KEY, null);
  if (!stored || !Array.isArray(stored)) {
    const initial = migrateLegacy();
    writeJson(LIBRARY_KEY, initial);
    return initial;
  }
  return stored;
}

export function saveLibrary(items: LibraryItem[]) {
  if (!browser()) return;
  writeJson(LIBRARY_KEY, items);
  window.dispatchEvent(new Event("fnskills-library"));
}

export function collectionById(id: string) {
  return loadCollections().find((collection) => collection.id === id);
}

export function orderedCollections(collections: LibraryCollection[]) {
  const parents = collections.filter((collection) => !collection.parentId);
  const ordered: LibraryCollection[] = [];
  parents.forEach((parent) => {
    ordered.push(parent);
    ordered.push(...collections.filter((collection) => collection.parentId === parent.id));
  });
  const listed = new Set(ordered.map((collection) => collection.id));
  ordered.push(...collections.filter((collection) => !listed.has(collection.id)));
  return ordered;
}

export function collectionLabel(collection: LibraryCollection, collections: LibraryCollection[]) {
  const parent = collections.find((entry) => entry.id === collection.parentId);
  return parent ? `${parent.name} / ${collection.name}` : collection.name;
}

export function loadCollections(): LibraryCollection[] {
  if (!browser()) return LIBRARY_COLLECTIONS;
  const stored = readJson<LibraryCollection[] | null>(COLLECTIONS_KEY, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    writeJson(COLLECTIONS_KEY, LIBRARY_COLLECTIONS);
    return LIBRARY_COLLECTIONS;
  }
  return stored;
}

export function saveCollections(collections: LibraryCollection[]) {
  writeJson(COLLECTIONS_KEY, collections);
  if (browser()) window.dispatchEvent(new Event("fnskills-library"));
}

export function addCollection(input: { name: string; description: string; parentId?: string }) {
  const collection: LibraryCollection = {
    id: `col-${Date.now()}`,
    name: input.name.trim(),
    description: input.description.trim(),
    parentId: input.parentId || undefined,
  };
  saveCollections([...loadCollections(), collection]);
  return collection;
}

export function updateCollection(id: string, patch: Partial<Pick<LibraryCollection, "name" | "description" | "parentId">>) {
  saveCollections(loadCollections().map((collection) => (collection.id === id ? { ...collection, ...patch, id } : collection)));
}

export function removeCollection(id: string) {
  const collections = loadCollections();
  if (collections.some((collection) => collection.parentId === id)) {
    return { ok: false as const, reason: "Remove its subcategories first." };
  }
  if (loadLibrary().some((item) => item.collectionId === id)) {
    return { ok: false as const, reason: "Move the titles in this category first." };
  }
  saveCollections(collections.filter((collection) => collection.id !== id));
  return { ok: true as const };
}

export function loadSlider(): string[] {
  if (!browser()) return SEED.filter((item) => item.featured).map((item) => item.id);
  const stored = readJson<string[] | null>(SLIDER_KEY, null);
  if (!stored || !Array.isArray(stored)) {
    const seeded = loadLibrary().filter((item) => item.featured && !item.hidden).map((item) => item.id).slice(0, 6);
    writeJson(SLIDER_KEY, seeded);
    return seeded;
  }
  return stored;
}

export function saveSlider(ids: string[]) {
  writeJson(SLIDER_KEY, ids.filter((id, index, list) => list.indexOf(id) === index).slice(0, 8));
  if (browser()) window.dispatchEvent(new Event("fnskills-library"));
}

export function setSliderMembership(id: string, on: boolean) {
  const current = loadSlider().filter((entry) => entry !== id);
  saveSlider(on ? [id, ...current] : current);
  updateLibraryItem(id, { featured: on });
}

export function addLibraryItem(input: Omit<LibraryItem, "id" | "addedAt" | "views">) {
  const item: LibraryItem = {
    ...input,
    id: `lib-${Date.now()}`,
    addedAt: new Date().toISOString(),
    views: 0,
  };
  saveLibrary([item, ...loadLibrary()]);
  return item;
}

export function updateLibraryItem(id: string, patch: Partial<LibraryItem>) {
  const next = loadLibrary().map((item) => (item.id === id ? { ...item, ...patch, id } : item));
  saveLibrary(next);
  return next.find((item) => item.id === id) ?? null;
}

export function removeLibraryItem(id: string) {
  saveLibrary(loadLibrary().filter((item) => item.id !== id));
  void import("@/lib/library-files").then(({ removeLibraryFile }) => removeLibraryFile(id));
}

export function recordLibraryView(id: string) {
  const items = loadLibrary();
  const item = items.find((entry) => entry.id === id);
  if (!item || !browser()) return item ?? null;
  const seenKey = `fnskills:library-seen:${id}`;
  try {
    if (sessionStorage.getItem(seenKey)) return item;
    sessionStorage.setItem(seenKey, "1");
  } catch {
    return item;
  }
  return updateLibraryItem(id, { views: item.views + 1 });
}

/* ── Per-reader state: saved shelf and reading progress ─────────────────── */

export function loadShelf(): string[] {
  const value = readJson<string[]>(SHELF_KEY, []);
  return Array.isArray(value) ? value : [];
}

export function toggleShelf(id: string) {
  const current = loadShelf();
  const next = current.includes(id) ? current.filter((entry) => entry !== id) : [id, ...current];
  writeJson(SHELF_KEY, next);
  if (browser()) window.dispatchEvent(new Event("fnskills-library"));
  return next.includes(id);
}

export interface ReadingProgress {
  percent: number;
  at: string;
}

export function loadProgress(): Record<string, ReadingProgress> {
  return readJson<Record<string, ReadingProgress>>(PROGRESS_KEY, {});
}

export function saveProgress(id: string, percent: number) {
  const current = loadProgress();
  const previous = current[id]?.percent ?? 0;
  current[id] = { percent: Math.max(previous, Math.min(100, Math.round(percent))), at: new Date().toISOString() };
  writeJson(PROGRESS_KEY, current);
  if (browser()) window.dispatchEvent(new Event("fnskills-library"));
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

export function formatFileSize(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
}

export function lengthLabel(item: LibraryItem) {
  if (isTimedFormat(item.format)) return item.duration ? `${item.duration} min` : FORMAT_LABELS[item.format];
  return item.pages ? `${item.pages} pages` : FORMAT_LABELS[item.format];
}

export function readingMinutes(item: LibraryItem) {
  if (isTimedFormat(item.format)) return item.duration ?? 0;
  return Math.max(5, Math.round((item.pages ?? 10) * 1.5));
}

/** "About 25 min to read", "About 10 hours to read". */
export function readingTimeLabel(item: LibraryItem) {
  const minutes = readingMinutes(item);
  const verb = item.format === "video" ? "to watch" : item.format === "audio" ? "to listen" : "to read";
  if (minutes < 60) return `About ${minutes} min ${verb}`;
  const hours = Math.round(minutes / 60);
  return `About ${hours} hour${hours === 1 ? "" : "s"} ${verb}`;
}

export type LibrarySort = "relevance" | "newest" | "popular" | "rating" | "title" | "year";

export const SORT_LABELS: Record<LibrarySort, string> = {
  relevance: "Best match",
  newest: "Newest arrivals",
  popular: "Most read",
  rating: "Highest rated",
  title: "Title A–Z",
  year: "Publication year",
};

export function sortItems(items: LibraryItem[], sort: LibrarySort) {
  const list = [...items];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "popular":
      return list.sort((a, b) => b.views - a.views);
    case "rating":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "year":
      return list.sort((a, b) => b.year - a.year);
    default:
      return list;
  }
}

export function searchScore(item: LibraryItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  let score = 0;
  if (item.title.toLowerCase().includes(q)) score += 5;
  if (item.author.toLowerCase().includes(q)) score += 3;
  if (item.tags?.some((tag) => tag.toLowerCase().includes(q))) score += 2;
  if (item.subject.toLowerCase().includes(q)) score += 2;
  if (`${item.courseCode ?? ""} ${item.courseTitle ?? ""}`.toLowerCase().includes(q)) score += 2;
  if (item.description.toLowerCase().includes(q)) score += 1;
  if (item.isbn?.replace(/-/g, "").includes(q.replace(/-/g, ""))) score += 4;
  return score;
}

/** Shrinks an uploaded cover so it fits comfortably in browser storage. */
export function compressCover(file: File, maxWidth = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("That file is not an image the browser can open."));
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(String(reader.result));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
