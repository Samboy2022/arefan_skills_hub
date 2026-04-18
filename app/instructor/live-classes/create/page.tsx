"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addMinutes } from "date-fns";
import { ArrowLeft, Info, Users, Calendar, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/instructor/page-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock student pool for Attendees selector
const MOCK_STUDENTS = [
  { id: "12", name: "Alice Smith", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: "34", name: "Bob Jones", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: "56", name: "Carol White", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol" },
  { id: "78", name: "Dan Brown", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan" },
  { id: "90", name: "Emma Davis", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
];

const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hrs", value: 90 },
  { label: "2 hrs", value: 120 },
];

const GRACE_OPTIONS = [
  { label: "None", value: 0 },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
];

interface FormData {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration: number;
  password: string;
  attendee_ids: string[];
  tracking_enabled: boolean;
  threshold_percentage: number;
  grace_period_minutes: number;
  allow_partial_credit: boolean;
  notify_students: boolean;
}

interface FormErrors {
  name?: string;
  start_date?: string;
  start_time?: string;
  attendees?: string;
  threshold?: string;
}

export default function CreateMeetingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    start_date: "",
    start_time: "",
    duration: 60,
    password: "",
    attendee_ids: [],
    tracking_enabled: true,
    threshold_percentage: 80,
    grace_period_minutes: 5,
    allow_partial_credit: false,
    notify_students: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Live preview
  const thresholdMinutes = useMemo(
    () => Math.floor((form.duration * form.threshold_percentage) / 100),
    [form.duration, form.threshold_percentage]
  );

  const set = (field: keyof FormData, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleAttendee = (id: string) => {
    set("attendee_ids", form.attendee_ids.includes(id)
      ? form.attendee_ids.filter(x => x !== id)
      : [...form.attendee_ids, id]
    );
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "Meeting name must be at least 3 characters.";
    if (!form.start_date) e.start_date = "Start date is required.";
    if (!form.start_time) e.start_time = "Start time is required.";
    if (form.attendee_ids.length === 0) e.attendees = "Select at least one attendee.";
    if (form.tracking_enabled && (form.threshold_percentage < 1 || form.threshold_percentage > 99))
      e.threshold = "Threshold must be between 1 and 99.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // In production: POST /api/meetings
    await new Promise(r => setTimeout(r, 1200));
    toast.success("Meeting created! Attendees have been notified.");
    router.push("/instructor/live-classes");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link href="/instructor" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href="/instructor/live-classes" className="hover:text-foreground transition-colors">Live Classes</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Create Meeting</span>
      </nav>

      <PageHeader title="Create Meeting" description="Schedule a new Zoom live session for your students." />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Section 1: Meeting Details ── */}
        <Card className="border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-muted/20">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Meeting Details</h2>
          </div>
          <div className="p-5 space-y-5">
            {/* Meeting Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Meeting Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Introduction to React Hooks"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                onBlur={validate}
                className={cn(errors.name && "border-red-400 focus-visible:ring-red-400")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label>
                Attendees <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  ({form.attendee_ids.length} selected)
                </span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOCK_STUDENTS.map(student => {
                  const selected = form.attendee_ids.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => toggleAttendee(student.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors cursor-pointer text-left",
                        selected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback className="text-[10px]">
                          {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                      {selected && <span className="ml-auto text-primary text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
              {errors.attendees && <p className="text-xs text-red-500">{errors.attendees}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this session will cover…"
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={3}
                maxLength={1000}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{form.description.length}/1000</p>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={e => set("start_date", e.target.value)}
                  className={cn(errors.start_date && "border-red-400")}
                />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="start_time">Start Time <span className="text-red-500">*</span></Label>
                <Input
                  id="start_time"
                  type="time"
                  step="900"
                  value={form.start_time}
                  onChange={e => set("start_time", e.target.value)}
                  className={cn(errors.start_time && "border-red-400")}
                />
                {errors.start_time && <p className="text-xs text-red-500">{errors.start_time}</p>}
              </div>
            </div>

            {/* Duration + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duration <span className="text-red-500">*</span></Label>
                <Select value={String(form.duration)} onValueChange={v => set("duration", Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password (optional)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="text"
                    placeholder="Meeting password"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Section 2: Attendance Settings ── */}
        <Card className={cn("border-border overflow-hidden", !form.tracking_enabled && "opacity-75")}>
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-l-amber-400">
            <Info className="h-4 w-4 text-amber-600" />
            <h2 className="font-semibold text-foreground flex-1">Attendance Settings</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="tracking_toggle" className="text-sm font-normal text-muted-foreground">
                {form.tracking_enabled ? "Tracking On" : "Tracking Off"}
              </Label>
              <Switch
                id="tracking_toggle"
                checked={form.tracking_enabled}
                onCheckedChange={v => set("tracking_enabled", v)}
              />
            </div>
          </div>

          <div className={cn("p-5 space-y-5", !form.tracking_enabled && "pointer-events-none opacity-50")}>
            {!form.tracking_enabled && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                Attendance will not be tracked for this session.
              </div>
            )}

            {/* Threshold */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <Label>Attendance Threshold</Label>
                <span className="text-sm font-bold text-foreground">{form.threshold_percentage}%</span>
              </div>
              <Slider
                min={1} max={99} step={1}
                value={[form.threshold_percentage]}
                onValueChange={([v]) => set("threshold_percentage", v)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Student must attend at least <strong>{form.threshold_percentage}%</strong> of the session
                {" "}(<strong>{thresholdMinutes} min</strong> out of <strong>{form.duration} min</strong>)
              </p>
              {errors.threshold && <p className="text-xs text-red-500">{errors.threshold}</p>}
            </div>

            {/* Grace Period */}
            <div className="space-y-1.5">
              <Label>
                Late Join Grace Period
                <span className="ml-2 text-xs text-muted-foreground font-normal" title="Students who join within this window are counted from session start, not their actual join time.">ⓘ</span>
              </Label>
              <Select value={String(form.grace_period_minutes)} onValueChange={v => set("grace_period_minutes", Number(v))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRACE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-border">
              {[
                { id: "partial", label: "Allow Partial Credit", desc: "Students at 50–79% get 'Partial' instead of 'Absent'", field: "allow_partial_credit" as const },
                { id: "notify", label: "Notify Students of Attendance", desc: "Students see the real-time tracker during the session", field: "notify_students" as const },
              ].map(({ id, label, desc, field }) => (
                <div key={id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={form[field] as boolean}
                    onCheckedChange={v => set(field, v)}
                  />
                </div>
              ))}
            </div>

            {/* Live Preview */}
            <div className="rounded-lg bg-muted/40 border border-border p-4 space-y-1 text-sm">
              <p className="font-semibold text-foreground flex items-center gap-1.5 mb-2">
                📋 Attendance Summary
              </p>
              {[
                ["Session Length", `${form.duration} min`],
                ["Threshold", `${form.threshold_percentage}%`],
                ["Required Time", `${thresholdMinutes} min`],
                ["Grace Period", form.grace_period_minutes === 0 ? "None" : `${form.grace_period_minutes} min`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-muted-foreground">
                  <span>{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/instructor/live-classes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-32">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating…
              </span>
            ) : "Create Meeting"}
          </Button>
        </div>
      </form>
    </div>
  );
}
