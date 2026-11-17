"use client";

import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { Check, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/tenant/page-header";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { SCHOOL_PLANS, SchoolPlanId, planById, requestPlanChange } from "@/lib/school-registration";

export default function RegistrationPlanPage() {
  const { application, ready, refresh } = useCurrentApplication();
  const [requested, setRequested] = useState<SchoolPlanId | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="review your plan" />;

  const current = planById(application.plan);
  const pending = application.planChange;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!application || !requested) return;
    if (note.trim().length < 8) {
      setError("Add a sentence on why the plan should change, so the reviewer has context.");
      return;
    }
    requestPlanChange(application.id, requested, note);
    toast.success("Plan change requested", { description: `${current.name} → ${planById(requested).name}` });
    setNote("");
    setError("");
    setRequested(null);
    refresh();
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Plan"
        description="Your plan is part of the application. You can ask to change it before or after approval."
      />

      {pending && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">
              Change to {planById(pending.plan).name} requested on {format(new Date(pending.requestedAt), "MMM d, yyyy")}
            </p>
            <p className="text-muted-foreground">“{pending.note}”</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {SCHOOL_PLANS.map((plan) => {
          const isCurrent = plan.id === application.plan;
          const isRequested = requested === plan.id;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-all",
                isCurrent ? "border-primary ring-1 ring-primary" : isRequested ? "border-primary/60 shadow-lg" : "border-border hover:shadow-md",
              )}
            >
              {plan.popular && !isCurrent && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                  <Sparkles className="h-3 w-3" /> Most chosen
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 left-6 rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-bold text-background">Your plan</span>
              )}
              <p className="text-lg font-bold">{plan.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.fit}</p>
              <p className="mt-4 text-3xl font-extrabold tracking-tight">
                {plan.price.split(" / ")[0]}
                {plan.price.includes("/") && <span className="text-base font-medium text-muted-foreground"> / month</span>}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={isCurrent ? "secondary" : isRequested ? "default" : "outline"}
                disabled={isCurrent || pending?.plan === plan.id}
                onClick={() => setRequested(isRequested ? null : plan.id)}
              >
                {isCurrent ? "Current plan" : pending?.plan === plan.id ? "Requested" : isRequested ? "Selected" : `Switch to ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>

      {requested && (
        <form onSubmit={submit} className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="font-semibold">
            Request {current.name} → {planById(requested).name}
          </h2>
          <p className="text-sm text-muted-foreground">Billing does not change until Arefan Skills Hub confirms the request.</p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="plan-note">Note for the reviewer</Label>
            <Textarea
              id="plan-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              autoFocus
              placeholder="e.g. We expect 400 students next term and want live classes."
              className="bg-background"
            />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Send request</Button>
            <Button type="button" variant="ghost" onClick={() => setRequested(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
