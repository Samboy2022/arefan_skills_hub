import { DOCUMENT_KINDS, SchoolApplication, planById } from "@/lib/school-registration";

export interface SetupTask {
  id: string;
  label: string;
  hint: string;
  done: boolean;
  optional?: boolean;
  href: string;
}

export interface NextStep {
  title: string;
  body: string;
  href: string;
  cta: string;
  tone: "action" | "waiting" | "success" | "danger";
}

export function hasDocument(application: SchoolApplication, kind: string) {
  return (
    application.documents.some((document) => document.kind === kind) ||
    (kind === "logo" && Boolean(application.school.logoName))
  );
}

/** The setup to-do list, in the order a school should work through it. */
export function setupTasks(application: SchoolApplication): SetupTask[] {
  const plan = planById(application.plan);
  return [
    {
      id: "school",
      label: "School details",
      hint: `${application.school.name} · ${application.school.city || "city not set"}`,
      done: true,
      href: "/registration/school",
    },
    {
      id: "plan",
      label: "Choose a plan",
      hint: `${plan.name} · ${plan.price}`,
      done: true,
      href: "/registration/plan",
    },
    ...DOCUMENT_KINDS.map((document) => ({
      id: document.kind,
      label: document.label,
      hint: document.hint,
      done: hasDocument(application, document.kind),
      optional: document.kind === "accreditation",
      href: "/registration/documents",
    })),
    {
      id: "domain",
      label: "Custom domain",
      hint: application.customDomain?.domain ?? "Optional. Your Arefan Skills Hub subdomain works without it.",
      done: Boolean(application.customDomain),
      optional: true,
      href: "/registration/domain",
    },
  ];
}

export function setupProgress(application: SchoolApplication) {
  const tasks = setupTasks(application);
  const required = tasks.filter((task) => !task.optional);
  const done = required.filter((task) => task.done).length;
  return { tasks, done, total: required.length, percent: Math.round((done / Math.max(1, required.length)) * 100) };
}

/** The one thing the school should do next. */
export function nextStep(application: SchoolApplication): NextStep {
  if (application.status === "rejected") {
    return {
      title: "The application was not approved",
      body: application.rejectionReason ?? "Open a support ticket to find out what to change.",
      href: "/registration/support?new=1",
      cta: "Contact support",
      tone: "danger",
    };
  }
  if (application.subdomainStatus === "active") {
    return {
      title: "Your school is live",
      body: "Sign in as the school admin to add instructors, courses, and students.",
      href: "/login/school-admin",
      cta: "Sign in as school admin",
      tone: "success",
    };
  }
  const missing = setupTasks(application).find((task) => !task.done && !task.optional);
  if (missing) {
    return {
      title: `Add your ${missing.label.toLowerCase()}`,
      body: "Reviews move faster when every required document is attached.",
      href: missing.href,
      cta: `Add ${missing.label.toLowerCase()}`,
      tone: "action",
    };
  }
  return {
    title: "Waiting for review",
    body: "Everything required is in. Arefan Skills Hub reviews new schools within one to two business days.",
    href: "/registration/support",
    cta: "Ask a question",
    tone: "waiting",
  };
}

export type Stage = "submitted" | "review" | "approved" | "live";

export function currentStage(application: SchoolApplication): number {
  if (application.subdomainStatus === "active") return 3;
  if (application.status === "approved") return 2;
  if (setupProgress(application).done === setupProgress(application).total) return 1;
  return 0;
}
