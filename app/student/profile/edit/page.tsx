"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lock, Save, Upload, Eye, EyeOff, User, Camera, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/student/page-header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formErrorClass, formIconClass, formLabelClass, formSectionClass } from "@/lib/student-ui";
import { FormSection } from "@/components/student/form-section";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=John";
const BIO_MAX = 300;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const inputClass = "h-10 bg-background px-3";

type Errors = Partial<Record<"firstName" | "lastName" | "phone" | "bio" | "currentPassword" | "newPassword" | "confirmPassword" | "avatar", string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className={formErrorClass}>{message}</p>;
}

export default function EditProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    bio: "Computer Science major heavily interested in software engineering and web development.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(DEFAULT_AVATAR);
  const [errors, setErrors] = useState<Errors>({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // "Change Password" links here with #password — bring that section into view
  useEffect(() => {
    if (window.location.hash === "#password") {
      document.getElementById("password")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("currentPassword")?.focus({ preventScroll: true });
    }
  }, []);

  // Free the object URL of an uploaded preview
  useEffect(() => () => {
    if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
  }, [avatarUrl]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (form.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (form.bio.length > BIO_MAX) e.bio = `Bio must be ${BIO_MAX} characters or fewer.`;

    const changingPassword = form.currentPassword || form.newPassword || form.confirmPassword;
    if (changingPassword) {
      if (!form.currentPassword) e.currentPassword = "Enter your current password.";
      if (form.newPassword.length < 8) e.newPassword = "Use at least 8 characters.";
      else if (form.newPassword === form.currentPassword) e.newPassword = "New password must be different from the current one.";
      if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const firstInvalid = Object.keys(e)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
    toast.success(form.newPassword ? "Profile and password updated" : "Profile updated successfully");
    router.push("/student/profile");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(err => ({ ...err, avatar: "Please choose a JPG or PNG image." }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors(err => ({ ...err, avatar: "Image must be 5MB or smaller." }));
      return;
    }
    setErrors(err => ({ ...err, avatar: undefined }));
    setAvatarUrl(URL.createObjectURL(file));
  };

  const passwordType = showPasswords ? "text" : "password";
  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "?";

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumb
        items={[
          { label: "Profile", href: "/student/profile" },
          { label: "Edit Profile" }
        ]}
      />

      <PageHeader
        title="Edit profile"
        description="Update your personal and contact information."
      />

      <form onSubmit={handleSave} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="space-y-6">
          <FormSection icon={Camera} title="Profile picture" hint="JPG or PNG, up to 5MB.">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Avatar className="h-24 w-24 border-2 border-border">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile picture preview" className="object-cover" />}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleAvatarChange} />
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" type="button" className="gap-1.5" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload New
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={!avatarUrl}
                  onClick={() => setAvatarUrl(null)}
                >
                  Remove
                </Button>
              </div>
              <FieldError id="avatar-error" message={errors.avatar} />
            </div>
            </div>
          </FormSection>

          <FormSection icon={User} title="Personal details" hint="Name, phone, and a short bio.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={formLabelClass}>First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={update("firstName")}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName || undefined}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="firstName-error" message={errors.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={update("lastName")}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName || undefined}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="lastName-error" message={errors.lastName} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@university.edu"
                    readOnly
                    aria-describedby="email-hint"
                    className={cn(inputClass, "pr-10")}
                  />
                  <Lock className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p id="email-hint" className="text-xs text-muted-foreground">University email cannot be changed.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone || undefined}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="phone-error" message={errors.phone} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">Bio</Label>
                  <span className={cn("text-xs tabular-nums", form.bio.length > BIO_MAX ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                    {form.bio.length}/{BIO_MAX}
                  </span>
                </div>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={update("bio")}
                  aria-invalid={!!errors.bio || undefined}
                  aria-describedby={errors.bio ? "bio-error" : undefined}
                  className="min-h-[96px] resize-y bg-card px-4 py-3"
                />
                <FieldError id="bio-error" message={errors.bio} />
              </div>
            </div>
          </FormSection>

          <section id="password" className={cn(formSectionClass, "scroll-mt-20")}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className={formIconClass}><Lock className="h-4 w-4" /></span>
                <div>
                  <h2 className="font-semibold">Change password</h2>
                  <p className="text-sm text-muted-foreground">Leave these blank to keep your current password.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(v => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-pressed={showPasswords}
              >
                {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type={passwordType}
                  value={form.currentPassword}
                  onChange={update("currentPassword")}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.currentPassword || undefined}
                  aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="currentPassword-error" message={errors.currentPassword} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={passwordType}
                  value={form.newPassword}
                  onChange={update("newPassword")}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-invalid={!!errors.newPassword || undefined}
                  aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="newPassword-error" message={errors.newPassword} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={passwordType}
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword || undefined}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" asChild className="gap-1.5">
              <Link href="/student/profile"><ArrowLeft className="h-4 w-4" /> Cancel</Link>
            </Button>
            <Button type="submit" className="gap-2" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-primary" /> Tips
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>University email is locked. Open a support ticket if it is wrong.</li>
              <li>Use a photo where your face is clear — it appears next to your forum posts.</li>
              <li>Leave the password fields blank unless you want to change it.</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
