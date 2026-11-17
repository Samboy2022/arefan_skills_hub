/** Binary library files live in IndexedDB so a PDF, audio, video, or document can be opened and downloaded in this browser. */

const DB_NAME = "fnskills-library-files";
const STORE = "files";
export const MAX_LIBRARY_FILE_BYTES = 40 * 1024 * 1024;

export type LibraryFileKind = "pdf" | "video" | "audio" | "text" | "image" | "other";

export interface StoredLibraryFile {
  blob: Blob;
  name: string;
  type: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open file storage"));
  });
}

export function mimeForFile(file: File) {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".m4a")) return "audio/mp4";
  if (name.endsWith(".wav")) return "audio/wav";
  if (name.endsWith(".aac")) return "audio/aac";
  if (name.endsWith(".txt")) return "text/plain";
  if (name.endsWith(".csv")) return "text/csv";
  if (name.endsWith(".md")) return "text/markdown";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (name.endsWith(".epub")) return "application/epub+zip";
  if (name.endsWith(".zip")) return "application/zip";
  return "application/octet-stream";
}

/** Which inline viewer can show this file. Mime wins, then the name, then the catalog format. */
export function libraryFileKind(format: string, mime: string, name: string): LibraryFileKind {
  const fileName = name.toLowerCase();
  if (mime.startsWith("video/") || /\.(mp4|mov|webm)$/.test(fileName)) return "video";
  if (mime.startsWith("audio/") || /\.(mp3|m4a|wav|aac)$/.test(fileName)) return "audio";
  if (mime.includes("pdf") || fileName.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("text/") || /\.(txt|md|csv)$/.test(fileName)) return "text";
  if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/.test(fileName)) return "image";
  if (format === "video") return "video";
  if (format === "audio") return "audio";
  if (format === "pdf") return "pdf";
  return "other";
}

export async function saveLibraryFile(id: string, file: File) {
  const db = await openDb();
  const record: StoredLibraryFile = { blob: file, name: file.name, type: mimeForFile(file) };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not store the file"));
  });
  db.close();
}

export async function loadLibraryFile(id: string): Promise<StoredLibraryFile | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await openDb();
  const record = await new Promise<StoredLibraryFile | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve((request.result as StoredLibraryFile | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Could not read the file"));
  });
  db.close();
  if (!record?.blob) return null;
  return record;
}

export async function removeLibraryFile(id: string) {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not remove the file"));
  });
  db.close();
}

export async function downloadLibraryFile(id: string, fileName: string) {
  const record = await loadLibraryFile(id);
  if (!record) return false;
  const url = URL.createObjectURL(record.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || record.name || "library-file";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
