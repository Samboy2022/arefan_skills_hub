"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SimilarityReportView } from "@/components/plagiarism/similarity-report";
import { useReports } from "@/components/plagiarism/use-reports";

export default function SimilarityReportPage() {
  const params = useParams<{ reportId: string }>();
  const { reports, ready } = useReports();
  const report = reports.find((item) => item.id === params.reportId || item.submissionId === params.reportId);

  return (
    <div>
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Plagiarism checker", href: "/instructor/plagiarism" },
          { label: report ? `${report.studentName} · ${report.assignmentTitle}` : "Report" },
        ]}
        className="mb-6"
      />
      {report ? (
        <SimilarityReportView report={report} reports={reports} basePath="/instructor/plagiarism" />
      ) : !ready ? (
        <p className="py-20 text-center text-sm text-muted-foreground">Loading report…</p>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://img.icons8.com/scribby/96/search.png" alt="" className="mb-4 h-14 w-14" />
          <h1 className="text-lg font-semibold">No report for this submission yet</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Run a check from the plagiarism page. Document submissions can be checked from the file the student uploaded, or you can upload the document yourself.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href={`/instructor/plagiarism?submission=${params.reportId}`}>Run a check</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
