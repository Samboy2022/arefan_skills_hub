"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ROOT_DOMAIN,
  SCHOOL_PLANS,
  SCHOOL_TYPES,
  SchoolInfo,
  SchoolPlanId,
  createApplication,
  isSubdomainAvailable,
  planById,
  subdomainHost,
  suggestSubdomain,
  validateSubdomain,
} from "@/lib/school-registration";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "fnskills:register-draft";

const EMPTY_SCHOOL: SchoolInfo = {
  name: "",
  type: SCHOOL_TYPES[0],
  address: "",
  city: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  logoName: "",
};

const STEPS = [
  { id: "school", label: "School", hint: "Name, location, contact", icon: Building2 },
  { id: "admin", label: "Administrator", hint: "Who signs in first", icon: UserRound },
  { id: "plan", label: "Plan", hint: "Pick what fits", icon: CreditCard },
  { id: "address", label: "Web address", hint: "Your subdomain", icon: Globe },
  { id: "review", label: "Review", hint: "Check and submit", icon: ShieldCheck },
] as const;

type Errors = Record<string, string>;

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const level = Math.min(4, score);
  return {
    level,
    label: ["Too short", "Weak", "Fair", "Good", "Strong"][level],
    color: ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"][level],
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});
  const [school, setSchool] = useState<SchoolInfo>(EMPTY_SCHOOL);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [plan, setPlan] = useState<SchoolPlanId>("professional");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Restore a saved draft. Passwords are never saved.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.school) setSchool({ ...EMPTY_SCHOOL, ...draft.school });
        if (draft.adminName) setAdminName(draft.adminName);
        if (draft.adminEmail) setAdminEmail(draft.adminEmail);
        if (draft.plan) setPlan(draft.plan);
        if (draft.subdomain) {
          setSubdomain(draft.subdomain);
          setSubdomainTouched(true);
        }
      }
    } catch {
      // Start fresh.
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ school, adminName, adminEmail, plan, subdomain }));
    } catch {
      // Draft saving is a convenience only.
    }
  }, [draftLoaded, school, adminName, adminEmail, plan, subdomain]);

  // Suggest a subdomain from the school name until the person edits it.
  useEffect(() => {
    if (draftLoaded && !subdomainTouched) setSubdomain(suggestSubdomain(school.name));
  }, [draftLoaded, school.name, subdomainTouched]);

  const slug = subdomain.trim().toLowerCase();
  const subdomainFormatError = slug ? validateSubdomain(slug) : "Choose a web address.";
  const subdomainFree = !subdomainFormatError && isSubdomainAvailable(slug);
  const strength = passwordStrength(password);
  const selected = planById(plan);

  const suggestions = useMemo(() => {
    const base = suggestSubdomain(school.name);
    const initials = school.name
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toLowerCase();
    const city = suggestSubdomain(school.city);
    return Array.from(
      new Set([base, city && base ? `${base}-${city}` : "", initials.length >= 3 ? initials : "", base ? `${base}-learn` : ""].filter(Boolean)),
    )
      .filter((entry) => entry !== slug && !validateSubdomain(entry) && isSubdomainAvailable(entry))
      .slice(0, 3);
  }, [school.name, school.city, slug]);

  function errorsFor(index: number): Errors {
    const errors: Errors = {};
    if (index === 0) {
      if (school.name.trim().length < 2) errors.name = "Enter the school's name.";
      if (!school.address.trim()) errors.address = "Enter a street address.";
      if (!school.city.trim()) errors.city = "Enter a city.";
      if (!school.country.trim()) errors.country = "Enter a country.";
      if (!/^\S+@\S+\.\S+$/.test(school.email.trim())) errors.email = "Enter an email like office@school.edu.";
      if (school.phone.replace(/\D/g, "").length < 6) errors.phone = "Enter a phone number.";
    }
    if (index === 1) {
      if (adminName.trim().length < 2) errors.adminName = "Enter the administrator's full name.";
      if (!/^\S+@\S+\.\S+$/.test(adminEmail.trim())) errors.adminEmail = "Enter a valid email.";
      if (password.length < 8) errors.password = "Use at least 8 characters.";
      if (confirmPassword !== password) errors.confirmPassword = "The passwords don't match.";
    }
    if (index === 3) {
      if (subdomainFormatError) errors.subdomain = subdomainFormatError;
      else if (!subdomainFree) errors.subdomain = `${subdomainHost(slug)} is already taken.`;
    }
    if (index === 4 && !agreed) errors.agreed = "Confirm the details to submit.";
    return errors;
  }

  const errors = attempted[step] ? errorsFor(step) : {};
  const stepComplete = (index: number) => Object.keys(errorsFor(index)).length === 0;

  function goTo(index: number) {
    setStep(index);
    setReached((value) => Math.max(value, index));
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next(event?: FormEvent) {
    event?.preventDefault();
    setAttempted((current) => ({ ...current, [step]: true }));
    if (!stepComplete(step)) {
      window.setTimeout(() => {
        (contentRef.current?.querySelector("[aria-invalid='true']") as HTMLElement | null)?.focus();
      }, 0);
      return;
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    // Final step: re-check everything, then submit.
    const firstBroken = [0, 1, 3].find((index) => !stepComplete(index));
    if (firstBroken !== undefined) {
      setAttempted((current) => ({ ...current, [firstBroken]: true }));
      goTo(firstBroken);
      return;
    }
    setSubmitting(true);
    createApplication({
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
      admin: { name: adminName.trim(), email: adminEmail.trim() },
      plan,
      subdomain: slug,
    });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Nothing to clear.
    }
    router.push("/registration");
  }

  function setSchoolField(key: keyof SchoolInfo, value: string) {
    setSchool((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-primary">Register a school</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Bring your school to Fnskills</h1>
          <p className="mt-2 text-muted-foreground">Five short steps. We review every school, then switch on your web address so staff and students can sign in.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* ── Stepper ─────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24">
            <div className="mb-4 lg:hidden">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{STEPS[step].label}</span>
                <span className="text-muted-foreground">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
            <ol className="hidden space-y-1 lg:block">
              {STEPS.map((entry, index) => {
                const done = index < step || (index <= reached && index !== step && stepComplete(index));
                const current = index === step;
                const reachable = index <= reached;
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => reachable && goTo(index)}
                      disabled={!reachable}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                        current ? "bg-card shadow-sm ring-1 ring-border" : reachable ? "hover:bg-card/60" : "cursor-not-allowed opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                          done ? "border-primary bg-primary text-primary-foreground" : current ? "border-primary text-primary" : "border-border text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : <entry.icon className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className={cn("block text-sm font-semibold", !current && "text-foreground/80")}>{entry.label}</span>
                        <span className="block text-xs text-muted-foreground">{entry.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 hidden rounded-xl border border-border bg-card p-4 text-sm lg:block">
              <p className="font-semibold">Already registered?</p>
              <p className="mt-1 text-muted-foreground">
                <Link href="/registration" className="font-medium text-primary hover:underline">
                  Open your registration dashboard
                </Link>{" "}
                or{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  sign in
                </Link>
                .
              </p>
            </div>
          </aside>

          {/* ── Step content ───────────────────────────────────────── */}
          <form ref={contentRef} onSubmit={next} noValidate className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {
                  [
                    "Tell us about your school",
                    "Create the administrator account",
                    "Choose a plan",
                    "Pick your web address",
                    "Review and submit",
                  ][step]
                }
              </h2>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="School name" error={errors.name} className="sm:col-span-2">
                    <Input value={school.name} onChange={(event) => setSchoolField("name", event.target.value)} aria-invalid={Boolean(errors.name)} autoFocus placeholder="Northwind Collegiate" />
                  </Field>
                  <Field label="Type of school">
                    <Select value={school.type} onValueChange={(value) => setSchoolField("type", value)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SCHOOL_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Website" optional>
                    <Input value={school.website} onChange={(event) => setSchoolField("website", event.target.value)} placeholder="https://school.edu" />
                  </Field>
                  <Field label="Street address" error={errors.address} className="sm:col-span-2">
                    <Input value={school.address} onChange={(event) => setSchoolField("address", event.target.value)} aria-invalid={Boolean(errors.address)} placeholder="18 Harbor Street" />
                  </Field>
                  <Field label="City" error={errors.city}>
                    <Input value={school.city} onChange={(event) => setSchoolField("city", event.target.value)} aria-invalid={Boolean(errors.city)} placeholder="Lagos" />
                  </Field>
                  <Field label="Country" error={errors.country}>
                    <Input value={school.country} onChange={(event) => setSchoolField("country", event.target.value)} aria-invalid={Boolean(errors.country)} placeholder="Nigeria" />
                  </Field>
                  <Field label="School email" error={errors.email}>
                    <Input type="email" value={school.email} onChange={(event) => setSchoolField("email", event.target.value)} aria-invalid={Boolean(errors.email)} placeholder="office@school.edu" />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <Input type="tel" value={school.phone} onChange={(event) => setSchoolField("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} placeholder="+234 800 000 0000" />
                  </Field>
                  <Field label="Logo" optional className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-border px-4 py-4 transition-colors hover:border-primary/50 hover:bg-muted/30">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => setSchoolField("logoName", event.target.files?.[0]?.name ?? school.logoName)}
                      />
                      <span className="rounded-lg bg-muted p-2.5 text-muted-foreground">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <span className="flex-1 text-sm">
                        {school.logoName ? (
                          <span className="font-medium">{school.logoName}</span>
                        ) : (
                          <>
                            <span className="font-medium">Upload your crest or logo</span>
                            <span className="block text-xs text-muted-foreground">PNG or SVG. You can also add it later.</span>
                          </>
                        )}
                      </span>
                      {school.logoName && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setSchoolField("logoName", "");
                          }}
                          className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Remove logo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </label>
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.adminName}>
                    <Input value={adminName} onChange={(event) => setAdminName(event.target.value)} aria-invalid={Boolean(errors.adminName)} autoFocus placeholder="Adaeze Okonkwo" />
                  </Field>
                  <Field label="Email" error={errors.adminEmail}>
                    <Input type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} aria-invalid={Boolean(errors.adminEmail)} placeholder="you@school.edu" />
                    {!adminEmail && school.email && (
                      <button type="button" onClick={() => setAdminEmail(school.email)} className="mt-1.5 text-xs font-medium text-primary hover:underline">
                        Use {school.email}
                      </button>
                    )}
                  </Field>
                  <Field label="Password" error={errors.password}>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="grid flex-1 grid-cols-4 gap-1">
                          {[1, 2, 3, 4].map((bar) => (
                            <span key={bar} className={cn("h-1 rounded-full", strength.level >= bar ? strength.color : "bg-muted")} />
                          ))}
                        </div>
                        <span className="w-16 text-right text-xs text-muted-foreground">{strength.label}</span>
                      </div>
                    )}
                  </Field>
                  <Field label="Confirm password" error={errors.confirmPassword}>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      autoComplete="new-password"
                    />
                    {confirmPassword && confirmPassword === password && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Check className="h-3.5 w-3.5" /> Passwords match
                      </p>
                    )}
                  </Field>
                  <p className="text-sm text-muted-foreground sm:col-span-2">
                    This person signs in as the school admin once the school is live. The password is checked here and never stored with the application.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {SCHOOL_PLANS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPlan(item.id)}
                      className={cn(
                        "relative flex flex-col rounded-2xl border p-5 text-left transition-all",
                        plan === item.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:shadow-sm",
                      )}
                    >
                      {item.popular && (
                        <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                          <Sparkles className="h-3 w-3" /> Most chosen
                        </span>
                      )}
                      <span className="flex items-center justify-between">
                        <span className="font-bold">{item.name}</span>
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border-2",
                            plan === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border",
                          )}
                        >
                          {plan === item.id && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                      <span className="mt-2 text-2xl font-extrabold">{item.price}</span>
                      <span className="mt-1 text-xs text-muted-foreground">{item.fit}</span>
                      <ul className="mt-4 space-y-2 text-sm">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                  <p className="text-sm text-muted-foreground md:col-span-3">No charge during review. You can change plans later from the registration dashboard.</p>
                </div>
              )}

              {step === 3 && (
                <div className="max-w-xl space-y-5">
                  <Field label="Web address" error={errors.subdomain}>
                    <div
                      className={cn(
                        "flex items-center overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring/50",
                        errors.subdomain ? "border-red-400" : "border-input",
                      )}
                    >
                      <span className="pl-3 text-sm text-muted-foreground">https://</span>
                      <input
                        value={subdomain}
                        onChange={(event) => {
                          setSubdomainTouched(true);
                          setSubdomain(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        }}
                        aria-invalid={Boolean(errors.subdomain)}
                        autoFocus
                        placeholder="northwind"
                        className="h-11 min-w-0 flex-1 bg-transparent px-1 font-mono text-sm outline-none"
                      />
                      <span className="border-l border-border bg-muted px-3 py-3 font-mono text-sm text-muted-foreground">.{ROOT_DOMAIN}</span>
                    </div>
                  </Field>
                  {slug && !errors.subdomain && (
                    <p className={cn("flex items-center gap-1.5 text-sm font-medium", subdomainFree ? "text-emerald-600" : "text-red-600")}>
                      {subdomainFree ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {subdomainFree ? `${subdomainHost(slug)} is available` : subdomainFormatError ?? `${subdomainHost(slug)} is taken`}
                    </p>
                  )}
                  {suggestions.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Available suggestions</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((entry) => (
                          <button
                            key={entry}
                            type="button"
                            onClick={() => {
                              setSubdomainTouched(true);
                              setSubdomain(entry);
                            }}
                            className="rounded-full border border-border px-3 py-1 font-mono text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
                          >
                            {entry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                    Lowercase letters, numbers, and hyphens, 3–30 characters. You can connect your own domain (like learn.yourschool.edu) after approval.
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <ReviewBlock title="School" onEdit={() => goTo(0)}>
                    <ReviewRow label="Name" value={school.name} />
                    <ReviewRow label="Type" value={school.type} />
                    <ReviewRow label="Address" value={[school.address, school.city, school.country].filter(Boolean).join(", ")} />
                    <ReviewRow label="Contact" value={`${school.email} · ${school.phone}`} />
                    {school.website && <ReviewRow label="Website" value={school.website} />}
                    {school.logoName && <ReviewRow label="Logo" value={school.logoName} />}
                  </ReviewBlock>
                  <ReviewBlock title="Administrator" onEdit={() => goTo(1)}>
                    <ReviewRow label="Name" value={adminName} />
                    <ReviewRow label="Email" value={adminEmail} />
                    <ReviewRow label="Password" value="••••••••" />
                  </ReviewBlock>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewBlock title="Plan" onEdit={() => goTo(2)}>
                      <ReviewRow label={selected.name} value={selected.price} />
                    </ReviewBlock>
                    <ReviewBlock title="Web address" onEdit={() => goTo(3)}>
                      <p className="font-mono text-sm font-semibold">{subdomainHost(slug)}</p>
                    </ReviewBlock>
                  </div>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm",
                      errors.agreed ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-border",
                    )}
                  >
                    <Checkbox checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} className="mt-0.5" aria-invalid={Boolean(errors.agreed)} />
                    <span>
                      I confirm these details are correct and I can register this school. I agree to the{" "}
                      <Link href="/terms" className="font-medium text-primary hover:underline" target="_blank">terms</Link> and{" "}
                      <Link href="/privacy" className="font-medium text-primary hover:underline" target="_blank">privacy policy</Link>.
                    </span>
                  </label>
                  {errors.agreed && <p className="text-xs font-medium text-red-600">{errors.agreed}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:px-8">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Your progress saves on this device.</span>
              )}
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : step === STEPS.length - 1 ? (
                  "Submit application"
                ) : (
                  <>
                    Continue <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {optional && <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-primary hover:underline">
          Edit
        </button>
      </div>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value || "—"}</dd>
    </div>
  );
}
