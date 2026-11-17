"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PlagiarismInbox } from "@/components/plagiarism/plagiarism-inbox";

export default function InstructorPlagiarismPage() {
  return (
    <div className="pb-12">
      <Breadcrumb showHome={false} items={[{ label: "Dashboard", href: "/instructor" }, { label: "Plagiarism checker" }]} className="mb-6" />
      <PageHeader
        title="Plagiarism checker"
        description="Run a check on a submitted document or upload one, then review each match and record a decision."
      />
      <Suspense>
        <PlagiarismInbox basePath="/instructor/plagiarism" />
      </Suspense>
    </div>
  );
}
