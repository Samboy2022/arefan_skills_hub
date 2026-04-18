// lib/hooks/use-student-meetings.ts
// Data hook — wraps mock data now, will swap to SWR/real API later.
import { useMemo } from "react";
import { STUDENT_MOCK_MEETINGS, StudentMeeting } from "@/lib/student-mock-data";

export function useStudentMeetings() {
  const meetings = useMemo(() => STUDENT_MOCK_MEETINGS, []);
  return { meetings, isLoading: false, error: null };
}

export function useStudentMeeting(id: string) {
  const meeting = useMemo(
    () => STUDENT_MOCK_MEETINGS.find((m) => m.id === id) ?? null,
    [id]
  );
  return { meeting, isLoading: false, error: null };
}
