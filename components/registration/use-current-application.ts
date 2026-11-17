"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SchoolApplication,
  getCurrentRegistrationId,
  loadApplications,
} from "@/lib/school-registration";

export function useCurrentApplication() {
  const [application, setApplication] = useState<SchoolApplication | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const id = getCurrentRegistrationId();
    const found = id ? loadApplications().find((item) => item.id === id) ?? null : null;
    setApplication(found);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("fnskills-registrations", refresh);
    return () => window.removeEventListener("fnskills-registrations", refresh);
  }, [refresh]);

  return { application, ready, refresh };
}
