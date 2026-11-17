import { NextResponse } from "next/server";
import { z } from "zod";
import { candidateById } from "@/lib/plagiarism-documents";
import { analyzeDocument, textForSubmission } from "@/lib/plagiarism-engine";
import { SimilarityReport } from "@/lib/plagiarism";

export const runtime = "nodejs";

const optionsSchema = z.object({
  internet: z.boolean(),
  studentPapers: z.boolean(),
  publications: z.boolean(),
  excludeBibliography: z.boolean(),
  excludeQuotes: z.boolean(),
  smallMatchWords: z.number().int().min(0).max(40),
});

const bodySchema = z.object({
  submissionId: z.string().trim().max(80).optional(),
  fileName: z.string().trim().min(1).max(180),
  text: z.string().max(250_000).optional(),
  studentName: z.string().trim().max(120).optional(),
  assignmentTitle: z.string().trim().max(180).optional(),
  courseTitle: z.string().trim().max(180).optional(),
  origin: z.enum(["submission", "upload"]),
  options: optionsSchema,
  reportId: z.string().trim().max(80).optional(),
  idempotencyKey: z.string().trim().min(8).max(80),
});

const completed = new Map<string, SimilarityReport>();

export async function GET() {
  return NextResponse.json({
    provider: process.env.PLAGIARISM_PROVIDER_URL ? "external" : "built-in",
    maxBytes: 8 * 1024 * 1024,
    extensions: ["pdf", "docx", "txt", "rtf", "odt", "md"],
  });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "The check request could not be read." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the document and the options, then try again." }, { status: 400 });
  }

  const body = parsed.data;
  if (!body.options.internet && !body.options.studentPapers && !body.options.publications) {
    return NextResponse.json({ error: "Choose at least one place to search." }, { status: 400 });
  }

  const cached = completed.get(body.idempotencyKey);
  if (cached) return NextResponse.json({ report: cached });

  const candidate = body.submissionId ? candidateById(body.submissionId) : null;
  if (body.origin === "submission") {
    if (!candidate?.checkable) {
      return NextResponse.json(
        { error: "That submission has no document. Upload a PDF, Word, or text file instead." },
        { status: 400 },
      );
    }
  }

  const text = body.text?.trim() || (body.submissionId ? textForSubmission(body.submissionId) ?? "" : "");
  if (!text) {
    return NextResponse.json(
      { error: "This submission has no document text on file. Upload the document to run the check." },
      { status: 422 },
    );
  }

  const provider = process.env.PLAGIARISM_PROVIDER_URL;
  try {
    const report = provider
      ? await fromProvider(provider, { ...body, text })
      : analyzeDocument(
          { ...body, text },
          {
            studentName: candidate?.studentName ?? "Uploaded document",
            assignmentTitle: candidate?.assignmentTitle ?? "Direct upload",
            courseTitle: candidate?.courseTitle ?? "Unassigned",
            submittedAt: candidate?.submittedAt ?? new Date().toISOString(),
          },
        );
    report.provider = provider ? "external" : "fnskills";
    report.fileName = report.fileName || body.fileName;
    report.origin = body.origin;
    report.checkedAt = report.checkedAt || new Date().toISOString();
    if (!report.id) report.id = body.reportId || body.submissionId || `chk-${body.idempotencyKey.slice(0, 12)}`;
    completed.set(body.idempotencyKey, report);
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The check could not be completed.";
    const status = provider ? 502 : 422;
    return NextResponse.json(
      { error: provider ? "The plagiarism service did not accept this check. Try again in a moment." : message },
      { status },
    );
  }
}

async function fromProvider(url: string, body: unknown): Promise<SimilarityReport> {
  const key = process.env.PLAGIARISM_PROVIDER_KEY;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error("Provider rejected the check");
  }
  const data = (await response.json()) as { report?: SimilarityReport } & Partial<SimilarityReport>;
  const report = data.report ?? (data as SimilarityReport);
  if (!report || typeof report.similarity !== "number" || !Array.isArray(report.segments) || !Array.isArray(report.sources)) {
    throw new Error("Provider response is missing a similarity report");
  }
  return report;
}
