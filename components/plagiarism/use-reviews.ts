"use client";

import { useEffect, useState } from "react";
import { ReviewDecision, loadReviews } from "@/lib/plagiarism";

export function useReviews() {
  const [reviews, setReviews] = useState<Record<string, ReviewDecision>>({});

  useEffect(() => {
    const refresh = () => setReviews(loadReviews());
    refresh();
    window.addEventListener("fnskills-plagiarism", refresh);
    return () => window.removeEventListener("fnskills-plagiarism", refresh);
  }, []);

  return reviews;
}
