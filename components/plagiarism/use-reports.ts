"use client";

import { useEffect, useState } from "react";
import { SimilarityReport, allReports, catalogReports } from "@/lib/plagiarism";

export function useReports() {
  const [reports, setReports] = useState<SimilarityReport[]>(catalogReports);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setReports(allReports());
    refresh();
    setReady(true);
    window.addEventListener("fnskills-plagiarism", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("fnskills-plagiarism", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { reports, ready };
}
