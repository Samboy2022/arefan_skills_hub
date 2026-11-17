import { fileExtension, isDocumentName, MAX_DOCUMENT_BYTES } from "@/lib/plagiarism-documents";

export class DocumentReadError extends Error {}

export async function extractDocumentText(file: File): Promise<string> {
  if (!isDocumentName(file.name)) {
    throw new DocumentReadError("Upload a PDF, Word, text, RTF, or OpenDocument file.");
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new DocumentReadError("That file is over 8 MB. Export a smaller copy and try again.");
  }
  if (file.size === 0) {
    throw new DocumentReadError("That file is empty.");
  }
  const extension = fileExtension(file.name);
  if (extension === "doc") {
    throw new DocumentReadError("Older .doc files cannot be read here. Save the file as .docx and upload that.");
  }
  const buffer = await file.arrayBuffer();
  const text = await textFromBuffer(extension, buffer);
  const cleaned = text.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length < 20) {
    throw new DocumentReadError("No readable text was found. If this is a scan, export it as text or DOCX first.");
  }
  return cleaned;
}

async function textFromBuffer(extension: string, buffer: ArrayBuffer): Promise<string> {
  if (extension === "txt" || extension === "md") {
    return new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  }
  if (extension === "rtf") {
    return rtfToText(new TextDecoder("utf-8", { fatal: false }).decode(buffer));
  }
  if (extension === "docx") {
    const xml = await zipEntryText(buffer, "word/document.xml");
    return docxToText(xml);
  }
  if (extension === "odt") {
    const xml = await zipEntryText(buffer, "content.xml");
    return xml.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  }
  if (extension === "pdf") {
    return pdfToText(buffer);
  }
  throw new DocumentReadError("That file type cannot be checked.");
}

function rtfToText(source: string) {
  return source
    .replace(/\\'[0-9a-fA-F]{2}/g, (token) => {
      const code = Number.parseInt(token.slice(2), 16);
      return Number.isNaN(code) ? "" : String.fromCharCode(code);
    })
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
    .replace(/[{}]/g, "");
}

function docxToText(xml: string) {
  const pieces = Array.from(xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g), (match) => decodeXml(match[1] ?? ""));
  const withBreaks = xml
    .replace(/<w:p[^>]*>/g, "\n")
    .replace(/<w:tab\/>/g, "\t");
  if (pieces.length === 0) {
    return decodeXml(withBreaks.replace(/<[^>]+>/g, " "));
  }
  return withBreaks.replace(/<w:t[^>]*>[^<]*<\/w:t>/g, (node) => {
    const match = node.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
    return match ? decodeXml(match[1] ?? "") : "";
  }).replace(/<[^>]+>/g, "");
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function pdfToText(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("latin1").decode(bytes);
  const chunks: string[] = [];
  const streams = raw.matchAll(/stream\r?\n([\s\S]*?)endstream/g);
  for (const stream of streams) {
    const body = stream[1] ?? "";
    const start = stream.index ?? 0;
    const header = raw.slice(Math.max(0, start - 200), start);
    let decoded = body;
    if (/FlateDecode/.test(header)) {
      const slice = body.endsWith("\n") ? body.slice(0, -1) : body;
      const compressed = Uint8Array.from(slice, (char) => char.charCodeAt(0));
      try {
        decoded = new TextDecoder("latin1").decode(await inflate(compressed));
      } catch {
        continue;
      }
    }
    chunks.push(pdfLiterals(decoded));
  }
  const direct = pdfLiterals(raw);
  return `${chunks.join("\n")}\n${direct}`.trim();
}

function pdfLiterals(source: string) {
  const parts: string[] = [];
  const pattern = /\((?:\\.|[^\\)]){2,}\)/g;
  for (const match of source.matchAll(pattern)) {
    const inner = match[0].slice(1, -1);
    const text = inner
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\t/g, " ")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\")
      .replace(/\\(\d{3})/g, (_, octal: string) => String.fromCharCode(Number.parseInt(octal, 8)));
    if (/[A-Za-z]{3,}/.test(text)) parts.push(text);
  }
  return parts.join(" ");
}

async function zipEntryText(buffer: ArrayBuffer, name: string) {
  const entry = await readZipEntry(buffer, name);
  if (!entry) throw new DocumentReadError("That document could not be opened. Export it again and retry.");
  return new TextDecoder("utf-8", { fatal: false }).decode(entry);
}

async function readZipEntry(buffer: ArrayBuffer, name: string) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  let offset = 0;
  while (offset + 30 < bytes.length) {
    if (view.getUint32(offset, true) !== 0x04034b50) break;
    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const entryName = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength));
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (entryName === name) {
      const slice = bytes.slice(dataStart, dataEnd);
      if (method === 0) return slice;
      if (method === 8) return inflate(slice);
      throw new DocumentReadError("That document uses a compression method this checker cannot read.");
    }
    if (compressedSize === 0) break;
    offset = dataEnd;
  }
  return null;
}

async function inflate(data: Uint8Array) {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
