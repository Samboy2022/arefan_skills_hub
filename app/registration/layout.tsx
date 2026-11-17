"use client";

import { RegistrationShell } from "@/components/registration/registration-shell";

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return <RegistrationShell>{children}</RegistrationShell>;
}
