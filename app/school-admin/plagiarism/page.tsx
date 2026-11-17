"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/tenant/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PlagiarismInbox } from "@/components/plagiarism/plagiarism-inbox";

export default function SchoolPlagiarismPage() {
  return (
    <div className="pb-12">
      <Breadcrumb showHome={false} items={[{ label: "Dashboard", href: "/school-admin" }, { label: "Plagiarism checker" }]} className="mb-6" />
      <PageHeader
        title="Plagiarism checker"
        description="Run a check on a submitted document or upload one. Open a report to read each match next to its source."
      />
      <Suspense>
        <PlagiarismInbox basePath="/school-admin/plagiarism" />
      </Suspense>
    </div>
  );
}
