"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Building2, Lock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/tenant/page-header";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { SCHOOL_TYPES, SchoolInfo, updateSchoolProfile } from "@/lib/school-registration";

type FieldKey = keyof SchoolInfo;

function validate(school: SchoolInfo): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  if (school.name.trim().length < 2) errors.name = "Enter the school's name.";
  if (!school.address.trim()) errors.address = "Enter a street address.";
  if (!school.city.trim()) errors.city = "Enter a city.";
  if (!school.country.trim()) errors.country = "Enter a country.";
  if (!/^\S+@\S+\.\S+$/.test(school.email.trim())) errors.email = "Enter an email like office@school.edu.";
  if (school.phone.replace(/\D/g, "").length < 6) errors.phone = "Enter a phone number with at least 6 digits.";
  if (school.website.trim() && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(school.website.trim())) errors.website = "Enter a web address like school.edu.";
  return errors;
}

export default function RegistrationSchoolPage() {
  const { application, ready, refresh } = useCurrentApplication();
  const formRef = useRef<HTMLFormElement>(null);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (application) setSchool(application.school);
  }, [application]);

  const dirty = useMemo(
    () => Boolean(application && school && JSON.stringify(application.school) !== JSON.stringify(school)),
    [application, school],
  );
  const errors = school ? validate(school) : {};
  const locked = application ? application.status !== "pending" : true;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  if (!ready || (application && !school)) return <RegistrationLoading />;
  if (!application || !school) return <RegistrationEmpty what="edit school details" />;

  function setField(key: FieldKey, value: string) {
    setSchool((current) => (current ? { ...current, [key]: value } : current));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!application || !school || locked) return;
    if (!dirty) {
      toast("Nothing to save", { description: "The details already match what was submitted." });
      return;
    }
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      toast.error("Check the highlighted fields", { description: Object.values(errors)[0] });
      return;
    }
    updateSchoolProfile(application.id, school);
    refresh();
    setShowErrors(false);
    toast.success("School details saved");
  }

  const error = (key: FieldKey) => (showErrors ? errors[key] : undefined);

  return (
    <div className="pb-24">
      <PageHeader
        title="School details"
        description={
          locked
            ? "The application has been reviewed, so these details are locked. Open a support ticket to change them."
            : "This is what Arefan Skills Hub reviews. You can edit it until the application is approved."
        }
      />

      {locked && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
          Details are read-only after review.
        </div>
      )}

      <form ref={formRef} onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <FormSection icon={Building2} title="Identity" hint="How the school appears to students and staff.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="School name" error={error("name")} className="sm:col-span-2">
                <Input value={school.name} disabled={locked} aria-invalid={Boolean(error("name"))} onChange={(event) => setField("name", event.target.value)} />
              </Field>
              <Field label="Type">
                <Select value={school.type} onValueChange={(value) => setField("type", value)} disabled={locked}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Website" optional error={error("website")}>
                <Input value={school.website} disabled={locked} placeholder="https://school.edu" onChange={(event) => setField("website", event.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection icon={MapPin} title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street address" error={error("address")} className="sm:col-span-2">
                <Input value={school.address} disabled={locked} aria-invalid={Boolean(error("address"))} onChange={(event) => setField("address", event.target.value)} />
              </Field>
              <Field label="City" error={error("city")}>
                <Input value={school.city} disabled={locked} aria-invalid={Boolean(error("city"))} onChange={(event) => setField("city", event.target.value)} />
              </Field>
              <Field label="Country" error={error("country")}>
                <Input value={school.country} disabled={locked} aria-invalid={Boolean(error("country"))} onChange={(event) => setField("country", event.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection icon={Mail} title="Contact" hint="Where Arefan Skills Hub sends review updates.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="School email" error={error("email")}>
                <Input type="email" value={school.email} disabled={locked} aria-invalid={Boolean(error("email"))} onChange={(event) => setField("email", event.target.value)} />
              </Field>
              <Field label="Phone" error={error("phone")}>
                <Input type="tel" value={school.phone} disabled={locked} aria-invalid={Boolean(error("phone"))} onChange={(event) => setField("phone", event.target.value)} />
              </Field>
            </div>
          </FormSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {application.admin.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{application.admin.name}</p>
                <p className="truncate text-sm text-muted-foreground">{application.admin.email}</p>
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">School admin</p>
            <p className="mt-1 text-sm text-muted-foreground">Signs in once the subdomain is live. The password is never stored with the application.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> What reviewers check
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>The name matches your accreditation letter.</li>
              <li>The email is on the school&apos;s own domain where possible.</li>
              <li>The address is a real campus or office.</li>
            </ul>
          </div>
        </aside>
      </form>

      {/* Sticky save bar only while there are edits. */}
      {!locked && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm transition-transform duration-300 md:left-64",
            dirty ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
            <p className="text-sm">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />
              Unsaved changes
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setSchool(application.school); setShowErrors(false); }}>
                Discard
              </Button>
              <Button onClick={() => formRef.current?.requestSubmit()}>
                Save details <Kbd className="ml-2 bg-primary-foreground/20 text-primary-foreground">⌘S</Kbd>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof Building2;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
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
