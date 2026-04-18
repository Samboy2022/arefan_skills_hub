// lib/hooks/use-meetings.ts
// Instructor meetings data hook — backed by mock data, ready for SWR/API swap.
import { useMemo } from "react";
import { MOCK_MEETINGS, InstructorMeeting } from "@/lib/instructor-mock-data";

export function useMeetings() {
  const meetings = useMemo(() => MOCK_MEETINGS, []);
  return { meetings, isLoading: false, error: null, mutate: () => {} };
}

export function useMeeting(id: string) {
  const meeting = useMemo(
    () => MOCK_MEETINGS.find((m) => m.id === id) ?? null,
    [id]
  );
  return { meeting, isLoading: false, error: null };
}
