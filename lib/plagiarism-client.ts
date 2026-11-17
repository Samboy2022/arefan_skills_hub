import { CheckOptions, CheckOrigin, SimilarityReport } from "@/lib/plagiarism";

export interface CheckPayload {
  submissionId?: string;
  fileName: string;
  text?: string;
  studentName?: string;
  assignmentTitle?: string;
  courseTitle?: string;
  origin: CheckOrigin;
  options: CheckOptions;
  reportId?: string;
  idempotencyKey: string;
}

export async function runPlagiarismCheck(payload: CheckPayload): Promise<SimilarityReport> {
  const response = await fetch("/api/plagiarism/checks", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => null)) as { report?: SimilarityReport; error?: string } | null;
  if (!response.ok || !data?.report) {
    throw new Error(data?.error || "The check could not be completed.");
  }
  return data.report;
}

export async function plagiarismServiceStatus(): Promise<"built-in" | "external"> {
  const response = await fetch("/api/plagiarism/checks", { headers: { Accept: "application/json" } });
  if (!response.ok) return "built-in";
  const data = (await response.json()) as { provider?: string };
  return data.provider === "external" ? "external" : "built-in";
}

export function newIdempotencyKey() {
  const random = Math.random().toString(36).slice(2, 10);
  return `PLG${Date.now().toString(36)}${random}`;
}
