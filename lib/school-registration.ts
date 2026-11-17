import { mockTenants } from "@/lib/mock-data";
import type { Tenant } from "@/lib/types";

export const REGISTRATIONS_KEY = "fnskills:school-registrations";
export const CURRENT_REGISTRATION_KEY = "fnskills:current-registration-id";
export const TENANTS_STORAGE_KEY = "arefan-skills-hub:super-admin:tenants";

export const ROOT_DOMAIN = "fnskills.com";

export type SchoolPlanId = "starter" | "professional" | "enterprise";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type SubdomainStatus = "not-active" | "active";
export type TicketStatus = "open" | "waiting" | "resolved";
export type DomainCheckStatus = "requested" | "dns-pending";

export interface SchoolPlan {
  id: SchoolPlanId;
  name: string;
  price: string;
  fit: string;
  features: string[];
  popular?: boolean;
}

export const SCHOOL_PLANS: SchoolPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$49 / month",
    fit: "Up to 100 students and 5 instructors",
    features: ["Courses, lessons, and quizzes", "Assignments and grading", "School library", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$199 / month",
    fit: "Up to 1,000 students, live classes, and gradebook",
    features: ["Everything in Starter", "Live classes and attendance", "Gradebook and reports", "Plagiarism checker", "Priority support"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    fit: "Unlimited people, SSO, and white-label",
    features: ["Everything in Professional", "Unlimited students and staff", "Single sign-on (SSO)", "White-label branding", "Dedicated success manager"],
  },
];

export const SCHOOL_TYPES = [
  "K-12 school",
  "College or university",
  "Training academy",
  "Private tutor",
];

export interface SchoolInfo {
  name: string;
  type: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logoName: string;
}

export interface SchoolAdminAccount {
  name: string;
  email: string;
}

export interface TicketMessage {
  id: string;
  author: "school" | "support";
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "normal" | "high";
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export interface CustomDomainRequest {
  domain: string;
  status: DomainCheckStatus;
  cnameHost: string;
  cnameTarget: string;
  requestedAt: string;
  lastCheckedAt?: string;
  lastCheckMessage?: string;
}

export type DocumentKind = "logo" | "accreditation" | "admin-id";

export interface RegistrationDocument {
  id: string;
  kind: DocumentKind;
  fileName: string;
  uploadedAt: string;
}

export interface PlanChangeRequest {
  plan: SchoolPlanId;
  note: string;
  requestedAt: string;
}

export const DOCUMENT_KINDS: { kind: DocumentKind; label: string; hint: string }[] = [
  { kind: "logo", label: "School logo", hint: "PNG or SVG, used on the subdomain once it is active." },
  { kind: "accreditation", label: "Accreditation letter", hint: "Optional proof that the school is registered." },
  { kind: "admin-id", label: "Admin identification", hint: "A file name for the person who will sign in as school admin." },
];

export interface SchoolApplication {
  id: string;
  school: SchoolInfo;
  admin: SchoolAdminAccount;
  plan: SchoolPlanId;
  subdomain: string;
  status: ApplicationStatus;
  subdomainStatus: SubdomainStatus;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  tickets: SupportTicket[];
  documents: RegistrationDocument[];
  planChange?: PlanChangeRequest;
  customDomain?: CustomDomainRequest;
}

const RESERVED_SLUGS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "mail",
  "support",
  "login",
  "register",
  "student",
  "instructor",
  "billing",
  "fnskills",
]);

const SEED: SchoolApplication[] = [
  {
    id: "app-northwind",
    school: {
      name: "Northwind Collegiate",
      type: "K-12 school",
      address: "18 Harbor Street",
      city: "Lagos",
      country: "Nigeria",
      phone: "+234 800 000 0000",
      email: "office@northwind.edu",
      website: "https://northwind.edu",
      logoName: "northwind-mark.png",
    },
    admin: {
      name: "Adaeze Okonkwo",
      email: "adaeze@northwind.edu",
    },
    plan: "professional",
    subdomain: "northwind",
    status: "pending",
    subdomainStatus: "not-active",
    createdAt: "2026-10-12T09:30:00.000Z",
    documents: [
      {
        id: "doc-northwind-logo",
        kind: "logo",
        fileName: "northwind-mark.png",
        uploadedAt: "2026-10-12T10:00:00.000Z",
      },
    ],
    tickets: [
      {
        id: "ticket-northwind-1",
        subject: "When will our subdomain go live?",
        category: "Onboarding",
        priority: "normal",
        status: "waiting",
        createdAt: "2026-10-13T11:00:00.000Z",
        messages: [
          {
            id: "msg-1",
            author: "school",
            body: "We submitted yesterday and still see the subdomain as not active. Can you confirm the review queue?",
            createdAt: "2026-10-13T11:00:00.000Z",
          },
          {
            id: "msg-2",
            author: "support",
            body: "Your application is in the Super Admin queue. School, instructor, and student logins open after the subdomain is marked active.",
            createdAt: "2026-10-13T14:20:00.000Z",
          },
        ],
      },
    ],
  },
];

function browser() {
  return typeof window !== "undefined";
}

export function subdomainHost(slug: string) {
  return `${slug}.${ROOT_DOMAIN}`;
}

/** Turns a school name into a subdomain suggestion, e.g. "St. Mary's College" → "st-marys-college". */
export function suggestSubdomain(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)
    .replace(/-+$/g, "");
}

export function planById(id: SchoolPlanId) {
  return SCHOOL_PLANS.find((plan) => plan.id === id) ?? SCHOOL_PLANS[0];
}

export function validateSubdomain(slug: string): string | null {
  const value = slug.trim().toLowerCase();
  if (value.length < 3 || value.length > 30) {
    return "Use 3 to 30 characters.";
  }
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/.test(value)) {
    return "Use lowercase letters, numbers, and hyphens. Do not start or end with a hyphen.";
  }
  if (RESERVED_SLUGS.has(value)) {
    return "That subdomain is reserved.";
  }
  return null;
}

export function loadApplications(): SchoolApplication[] {
  if (!browser()) return SEED;
  const raw = localStorage.getItem(REGISTRATIONS_KEY);
  if (!raw) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    const parsed = JSON.parse(raw) as SchoolApplication[];
    if (!Array.isArray(parsed)) return SEED;
    return parsed.map((application) => ({
      ...application,
      tickets: application.tickets ?? [],
      documents: application.documents ?? [],
    }));
  } catch {
    return SEED;
  }
}

export function saveApplications(applications: SchoolApplication[]) {
  if (!browser()) return;
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(applications));
  window.dispatchEvent(new Event("fnskills-registrations"));
}

export function getCurrentRegistrationId() {
  if (!browser()) return null;
  return localStorage.getItem(CURRENT_REGISTRATION_KEY);
}

export function setCurrentRegistrationId(id: string) {
  if (!browser()) return;
  localStorage.setItem(CURRENT_REGISTRATION_KEY, id);
}

export function isSubdomainAvailable(slug: string, exceptId?: string) {
  const value = slug.trim().toLowerCase();
  if (validateSubdomain(value)) return false;
  return !loadApplications().some(
    (application) =>
      application.id !== exceptId &&
      application.status !== "rejected" &&
      application.subdomain === value,
  );
}

export function createApplication(input: {
  school: SchoolInfo;
  admin: SchoolAdminAccount;
  plan: SchoolPlanId;
  subdomain: string;
}): SchoolApplication {
  const applications = loadApplications();
  const application: SchoolApplication = {
    id: `app-${Date.now()}`,
    school: input.school,
    admin: input.admin,
    plan: input.plan,
    subdomain: input.subdomain.trim().toLowerCase(),
    status: "pending",
    subdomainStatus: "not-active",
    createdAt: new Date().toISOString(),
    tickets: [],
    documents: [],
  };
  saveApplications([application, ...applications]);
  setCurrentRegistrationId(application.id);
  return application;
}

export function updateApplication(
  id: string,
  updater: (application: SchoolApplication) => SchoolApplication,
) {
  const applications = loadApplications();
  const next = applications.map((application) =>
    application.id === id ? updater(application) : application,
  );
  saveApplications(next);
  return next.find((application) => application.id === id) ?? null;
}

function tenantPlan(plan: SchoolPlanId): Tenant["plan"] {
  if (plan === "professional") return "pro";
  return plan;
}

function writeApprovedTenant(application: SchoolApplication) {
  if (!browser()) return;
  const raw = localStorage.getItem(TENANTS_STORAGE_KEY);
  let tenants: Tenant[] = mockTenants;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Tenant[];
      if (Array.isArray(parsed) && parsed.length > 0) tenants = parsed;
    } catch {
      tenants = mockTenants;
    }
  }
  const domain = subdomainHost(application.subdomain);
  if (tenants.some((tenant) => tenant.domain === domain)) {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    return;
  }
  const tenant: Tenant = {
    id: application.id,
    name: application.school.name,
    domain,
    plan: tenantPlan(application.plan),
    status: "active",
    students: 0,
    courses: 0,
    createdAt: new Date(),
  };
  localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify([tenant, ...tenants]));
}

export function approveApplication(id: string) {
  const updated = updateApplication(id, (application) => ({
    ...application,
    status: "approved",
    subdomainStatus: "active",
    rejectionReason: undefined,
    reviewedAt: new Date().toISOString(),
  }));
  if (updated) writeApprovedTenant(updated);
  return updated;
}

export function rejectApplication(id: string, reason: string) {
  return updateApplication(id, (application) => ({
    ...application,
    status: "rejected",
    subdomainStatus: "not-active",
    rejectionReason: reason.trim() || "The application was not approved.",
    reviewedAt: new Date().toISOString(),
  }));
}

export function addTicket(
  applicationId: string,
  input: { subject: string; category: string; priority: SupportTicket["priority"]; body: string },
) {
  const ticket: SupportTicket = {
    id: `ticket-${Date.now()}`,
    subject: input.subject.trim(),
    category: input.category,
    priority: input.priority,
    status: "open",
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Date.now()}`,
        author: "school",
        body: input.body.trim(),
        createdAt: new Date().toISOString(),
      },
    ],
  };
  return updateApplication(applicationId, (application) => ({
    ...application,
    tickets: [ticket, ...application.tickets],
  }));
}

export function addTicketMessage(applicationId: string, ticketId: string, body: string) {
  return updateApplication(applicationId, (application) => ({
    ...application,
    tickets: application.tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            status: "open",
            messages: [
              ...ticket.messages,
              {
                id: `msg-${Date.now()}`,
                author: "school",
                body: body.trim(),
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : ticket,
    ),
  }));
}

export function requestCustomDomain(applicationId: string, domain: string) {
  const host = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const request: CustomDomainRequest = {
    domain: host,
    status: "requested",
    cnameHost: host,
    cnameTarget: `schools.${ROOT_DOMAIN}`,
    requestedAt: new Date().toISOString(),
  };
  return updateApplication(applicationId, (application) => ({
    ...application,
    customDomain: request,
  }));
}

export function updateSchoolProfile(applicationId: string, school: SchoolInfo) {
  return updateApplication(applicationId, (application) => ({
    ...application,
    school: {
      ...school,
      name: school.name.trim(),
      address: school.address.trim(),
      city: school.city.trim(),
      country: school.country.trim(),
      phone: school.phone.trim(),
      email: school.email.trim(),
      website: school.website.trim(),
      logoName: school.logoName.trim(),
    },
  }));
}

export function saveRegistrationDocument(applicationId: string, kind: DocumentKind, fileName: string) {
  const document: RegistrationDocument = {
    id: `doc-${Date.now()}`,
    kind,
    fileName: fileName.trim(),
    uploadedAt: new Date().toISOString(),
  };
  return updateApplication(applicationId, (application) => ({
    ...application,
    documents: [document, ...application.documents.filter((item) => item.kind !== kind)],
    school:
      kind === "logo"
        ? { ...application.school, logoName: document.fileName }
        : application.school,
  }));
}

export function requestPlanChange(applicationId: string, plan: SchoolPlanId, note: string) {
  return updateApplication(applicationId, (application) => ({
    ...application,
    planChange: {
      plan,
      note: note.trim(),
      requestedAt: new Date().toISOString(),
    },
  }));
}

export function recheckCustomDomain(applicationId: string) {
  return updateApplication(applicationId, (application) => {
    if (!application.customDomain) return application;
    return {
      ...application,
      customDomain: {
        ...application.customDomain,
        status: "dns-pending",
        lastCheckedAt: new Date().toISOString(),
        lastCheckMessage:
          "The CNAME was not found yet. The Fnskills subdomain stays the working address.",
      },
    };
  });
}
