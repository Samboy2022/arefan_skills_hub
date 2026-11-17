"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, FileText, IdCard, Image as ImageIcon, Info, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/tenant/page-header";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { DOCUMENT_KINDS, DocumentKind, saveRegistrationDocument } from "@/lib/school-registration";

const DOCUMENT_META: Record<DocumentKind, { icon: typeof FileText; accept: string; formats: string; required: boolean }> = {
  logo: { icon: ImageIcon, accept: "image/png,image/svg+xml,image/jpeg,image/webp", formats: "PNG, SVG, JPG", required: true },
  accreditation: { icon: FileText, accept: ".pdf,image/*", formats: "PDF or image", required: false },
  "admin-id": { icon: IdCard, accept: ".pdf,image/*", formats: "PDF or image", required: true },
};

const MAX_BYTES = 10 * 1024 * 1024;

export default function RegistrationDocumentsPage() {
  const { application, ready, refresh } = useCurrentApplication();
  const [dragging, setDragging] = useState<DocumentKind | null>(null);

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="add documents" />;

  function saved(kind: DocumentKind) {
    if (!application) return null;
    return (
      application.documents.find((document) => document.kind === kind) ??
      (kind === "logo" && application.school.logoName ? { fileName: application.school.logoName, uploadedAt: application.createdAt } : null)
    );
  }

  function take(kind: DocumentKind, file?: File | null) {
    if (!application || !file) return;
    if (file.size > MAX_BYTES) {
      toast.error("That file is over 10 MB", { description: "Compress it or export a smaller PDF." });
      return;
    }
    saveRegistrationDocument(application.id, kind, file.name);
    refresh();
    toast.success(`${DOCUMENT_KINDS.find((entry) => entry.kind === kind)?.label} added`, { description: file.name });
  }

  const required = DOCUMENT_KINDS.filter((kind) => DOCUMENT_META[kind.kind].required);
  const requiredDone = required.filter((kind) => saved(kind.kind)).length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Documents" description="Attach what the reviewer needs. Drop a file on a card or click it to browse." />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-semibold">
            {requiredDone} of {required.length} required documents added
          </p>
          <p className="text-sm text-muted-foreground">
            {requiredDone === required.length ? "You're set. The accreditation letter is optional but speeds up review." : "Required items are marked below."}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted sm:w-48">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(requiredDone / required.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {DOCUMENT_KINDS.map((kind) => {
          const meta = DOCUMENT_META[kind.kind];
          const file = saved(kind.kind);
          return (
            <label
              key={kind.kind}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(kind.kind);
              }}
              onDragLeave={() => setDragging(null)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(null);
                take(kind.kind, event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "group flex cursor-pointer flex-col rounded-2xl border-2 bg-card p-5 transition-all",
                dragging === kind.kind
                  ? "border-solid border-primary bg-primary/5"
                  : file
                    ? "border-solid border-emerald-300/70 dark:border-emerald-900"
                    : "border-dashed border-border hover:border-primary/50",
              )}
            >
              <input type="file" accept={meta.accept} className="sr-only" onChange={(event) => take(kind.kind, event.target.files?.[0])} />
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "rounded-xl p-2.5",
                    file ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                  )}
                >
                  <meta.icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                    file
                      ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400"
                      : meta.required
                        ? "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400"
                        : "bg-muted text-muted-foreground ring-border",
                  )}
                >
                  {file ? "Added" : meta.required ? "Required" : "Optional"}
                </span>
              </div>
              <p className="mt-4 font-semibold">{kind.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{kind.hint}</p>
              <div className="mt-5 flex-1" />
              {file ? (
                <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(file.uploadedAt), "MMM d, yyyy")}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">Replace</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-foreground">
                  <UploadCloud className="h-4 w-4" />
                  Drop or browse · {meta.formats}
                </div>
              )}
            </label>
          );
        })}
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Up to 10 MB each. Only the file name is stored with the application for now; the file itself is sent once secure file storage is connected.
      </p>
    </div>
  );
}
