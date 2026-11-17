"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, Check, Clock, Copy, Keyboard, LogIn, PartyPopper, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { useRegistrationCommands } from "@/components/registration/registration-commands";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { currentStage, nextStep, setupProgress } from "@/components/registration/registration-progress";
import { planById, subdomainHost } from "@/lib/school-registration";

const STAGES = ["Submitted", "In review", "Approved", "Live"];

const TONES = {
  action: { box: "border-primary/30 bg-primary/5", icon: ArrowRight, iconBox: "bg-primary text-primary-foreground" },
  waiting: { box: "border-amber-300/60 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30", icon: Clock, iconBox: "bg-amber-500 text-white" },
  success: { box: "border-emerald-300/60 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30", icon: PartyPopper, iconBox: "bg-emerald-600 text-white" },
  danger: { box: "border-red-300/60 bg-red-50 dark:border-red-900 dark:bg-red-950/30", icon: TriangleAlert, iconBox: "bg-red-600 text-white" },
};

export default function RegistrationHomePage() {
  const { application, ready } = useCurrentApplication();
  const { openPalette, openShortcuts } = useRegistrationCommands();

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="track the review" />;

  const plan = planById(application.plan);
  const host = subdomainHost(application.subdomain);
  const progress = setupProgress(application);
  const step = nextStep(application);
  const stage = currentStage(application);
  const tone = TONES[step.tone];
  const rejected = application.status === "rejected";
  const openTickets = application.tickets.filter((ticket) => ticket.status !== "resolved").length;

  const events = [
    { at: application.createdAt, text: "Application submitted" },
    ...application.documents.map((document) => ({ at: document.uploadedAt, text: `Added ${document.fileName}` })),
    ...application.tickets.flatMap((ticket) =>
      ticket.messages.map((message) => ({
        at: message.createdAt,
        text: message.author === "support" ? `Support replied: ${ticket.subject}` : `You wrote: ${ticket.subject}`,
      })),
    ),
    ...(application.planChange ? [{ at: application.planChange.requestedAt, text: `Asked to switch to ${planById(application.planChange.plan).name}` }] : []),
    ...(application.customDomain ? [{ at: application.customDomain.requestedAt, text: `Requested ${application.customDomain.domain}` }] : []),
    ...(application.reviewedAt ? [{ at: application.reviewedAt, text: rejected ? "Application reviewed" : "Application approved" }] : []),
  ].sort((a, b) => b.at.localeCompare(a.at));

  function copyHost() {
    navigator.clipboard
      ?.writeText(`https://${host}`)
      .then(() => toast.success("Address copied", { description: host }))
      .catch(() => toast.error("Could not copy"));
  }

  const glance = [
    { label: "Plan", value: plan.name, sub: plan.price, href: "/registration/plan" },
    { label: "Documents", value: `${progress.tasks.filter((task) => ["logo", "accreditation", "admin-id"].includes(task.id) && task.done).length} of 3`, sub: "Logo, accreditation, admin ID", href: "/registration/documents" },
    { label: "Support", value: openTickets ? `${openTickets} open` : "No open tickets", sub: `${application.tickets.length} in total`, href: "/registration/support" },
    { label: "Custom domain", value: application.customDomain?.domain ?? "Not set", sub: application.customDomain ? application.customDomain.status.replace("-", " ") : "Optional", href: "/registration/domain" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {application.admin.name.split(" ")[0]}</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{application.school.name}</h1>
          <button
            type="button"
            onClick={copyHost}
            className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {host}
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Submitted {format(new Date(application.createdAt), "MMMM d, yyyy")}</p>
      </div>

      {/* ── Status ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="px-6 pb-6 pt-7">
          <ol className="grid grid-cols-4">
            {STAGES.map((label, index) => {
              const done = !rejected && index < stage;
              const current = !rejected && index === stage;
              const failed = rejected && index === 1;
              return (
                <li key={label} className="relative flex flex-col items-center text-center">
                  {index > 0 && (
                    <span
                      className={cn(
                        "absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                        !rejected && index <= stage ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                      done && "border-primary bg-primary text-primary-foreground",
                      current && "border-primary bg-background text-primary ring-4 ring-primary/15",
                      failed && "border-red-500 bg-red-500 text-white",
                      !done && !current && !failed && "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : failed ? "!" : index + 1}
                  </span>
                  <span className={cn("mt-2 text-xs font-medium sm:text-sm", current || done ? "text-foreground" : "text-muted-foreground", failed && "text-red-600")}>
                    {failed ? "Not approved" : label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={cn("mx-4 mb-4 flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center", tone.box)}>
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tone.iconBox)}>
            <tone.icon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next step</p>
            <p className="font-semibold text-foreground">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.body}</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href={step.href}>
              {step.tone === "success" && <LogIn className="mr-1.5 h-4 w-4" />}
              {step.cta}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Checklist ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">Setup checklist</h2>
              <p className="text-sm text-muted-foreground">
                {progress.done} of {progress.total} required items done
              </p>
            </div>
            <span className="text-2xl font-extrabold text-primary">{progress.percent}%</span>
          </div>
          <div className="h-1 bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
          <ul className="divide-y divide-border">
            {progress.tasks.map((task) => (
              <li key={task.id}>
                <Link href={task.href} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      task.done ? "bg-emerald-500 text-white" : "border-2 border-dashed border-border",
                    )}
                  >
                    {task.done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-medium", task.done && "text-muted-foreground")}>
                      {task.label}
                      {task.optional && <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{task.hint}</span>
                  </span>
                  {!task.done && (
                    <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {task.optional ? "Set up" : "Add now"}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {/* ── At a glance ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-4 font-semibold">At a glance</h2>
            <dl className="divide-y divide-border">
              {glance.map((row) => (
                <Link key={row.label} href={row.href} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="min-w-0 text-right">
                    <span className="block truncate text-sm font-semibold">{row.value}</span>
                    <span className={cn("block truncate text-xs text-muted-foreground", row.label === "Custom domain" && "capitalize")}>{row.sub}</span>
                  </dd>
                </Link>
              ))}
            </dl>
          </div>

          {/* ── Activity ────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-semibold">Recent activity</h2>
            <ol className="relative space-y-4 border-l border-border pl-5">
              {events.slice(0, 4).map((event) => (
                <li key={`${event.at}-${event.text}`} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                  <p className="text-sm font-medium leading-snug">{event.text}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(event.at), { addSuffix: true })}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ── Shortcut hint ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
        <button type="button" onClick={openPalette} className="inline-flex items-center gap-1.5 hover:text-foreground">
          <Search className="h-3.5 w-3.5" /> Jump anywhere <Kbd className="border border-border">⌘K</Kbd>
        </button>
        <span className="inline-flex items-center gap-1.5">
          Go to a page <Kbd className="border border-border">G</Kbd> then <Kbd className="border border-border">S</Kbd>
          <Kbd className="border border-border">P</Kbd>
          <Kbd className="border border-border">D</Kbd>…
        </span>
        <span className="inline-flex items-center gap-1.5">
          New ticket <Kbd className="border border-border">N</Kbd>
        </span>
        <button type="button" onClick={openShortcuts} className="inline-flex items-center gap-1.5 hover:text-foreground">
          <Keyboard className="h-3.5 w-3.5" /> All shortcuts <Kbd className="border border-border">?</Kbd>
        </button>
      </div>
    </div>
  );
}
