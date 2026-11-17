"use client";

import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { Check, Copy, Globe, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/tenant/page-header";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { recheckCustomDomain, requestCustomDomain, subdomainHost } from "@/lib/school-registration";

function copy(value: string, label: string) {
  navigator.clipboard
    ?.writeText(value)
    .then(() => toast.success(`${label} copied`, { description: value }))
    .catch(() => toast.error("Could not copy"));
}

export default function CustomDomainPage() {
  const { application, ready, refresh } = useCurrentApplication();
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [checking, setChecking] = useState(false);

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="connect a custom domain" />;

  const request = application.customDomain;
  const host = subdomainHost(application.subdomain);
  const step = !request ? 0 : request.lastCheckedAt ? 2 : 1;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!application) return;
    const value = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(value) || value.endsWith(".arefanskillshub.com")) {
      setError("Enter a domain you own, such as learn.yourschool.edu.");
      return;
    }
    requestCustomDomain(application.id, value);
    setDomain("");
    setError("");
    setEditing(false);
    refresh();
    toast.success("Domain saved", { description: "Now add the DNS record below." });
  }

  function recheck() {
    if (!application) return;
    setChecking(true);
    window.setTimeout(() => {
      recheckCustomDomain(application.id);
      refresh();
      setChecking(false);
    }, 900);
  }

  const steps = ["Choose a domain", "Add the DNS record", "Verify"];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Custom domain"
        description="Optional. Point a domain you own at Arefan Skills Hub. Until it verifies, your school keeps working at its Arefan Skills Hub address."
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <span className="rounded-xl bg-primary/10 p-3 text-primary">
          <Globe className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Working address</p>
          <p className="font-mono text-lg font-semibold">{host}</p>
          <p className="text-sm text-muted-foreground">
            {application.subdomainStatus === "active" ? "Live now." : "Goes live when the application is approved."}
          </p>
        </div>
        <Button variant="outline" onClick={() => copy(`https://${host}`, "Address")}>
          <Copy className="mr-1.5 h-4 w-4" /> Copy
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <ol className="grid grid-cols-3 border-b border-border">
          {steps.map((label, index) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm",
                index > 0 && "border-l border-border",
                index === step ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  index < step ? "bg-primary text-primary-foreground" : index === step ? "bg-primary/15 text-primary" : "bg-muted",
                )}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="hidden truncate sm:inline">{label}</span>
            </li>
          ))}
        </ol>

        <div className="space-y-6 p-6">
          {!request || editing ? (
            <form onSubmit={submit} className="max-w-lg space-y-3">
              <Label htmlFor="domain">Domain or subdomain you own</Label>
              <div className="flex gap-2">
                <Input
                  id="domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  placeholder="learn.yourschool.edu"
                  className="font-mono"
                  autoFocus={editing}
                />
                <Button type="submit">{request ? "Replace" : "Continue"}</Button>
              </div>
              {error ? (
                <p className="text-xs font-medium text-red-600">{error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Most schools use a subdomain such as learn. or portal.</p>
              )}
              {editing && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Keep {request?.domain}
                </Button>
              )}
            </form>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-semibold">{request.domain}</p>
                  <p className="text-sm text-muted-foreground">Requested {format(new Date(request.requestedAt), "MMM d, yyyy")}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  Change domain
                </Button>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Add this record at your domain host</p>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] gap-3 bg-muted/50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Type</span>
                    <span>Name</span>
                    <span>Value</span>
                  </div>
                  <div className="grid grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 px-4 py-3 font-mono text-sm">
                    <span className="font-semibold">CNAME</span>
                    <CopyValue value={request.cnameHost} label="Name" />
                    <CopyValue value={request.cnameTarget} label="Value" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">DNS changes can take up to 48 hours to spread. You can recheck any time.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/40 p-4">
                <div className="flex-1 text-sm">
                  {request.lastCheckedAt ? (
                    <>
                      <p className="font-semibold">Last checked {format(new Date(request.lastCheckedAt), "MMM d, h:mm a")}</p>
                      <p className="text-muted-foreground">{request.lastCheckMessage}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Once the record is added, check it here.</p>
                  )}
                </div>
                <Button onClick={recheck} disabled={checking}>
                  <RefreshCw className={cn("mr-1.5 h-4 w-4", checking && "animate-spin")} />
                  {checking ? "Checking…" : "Check DNS"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyValue({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => copy(value, label)}
      className="group flex min-w-0 items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-muted"
      title={`Copy ${label.toLowerCase()}`}
    >
      <span className="truncate">{value}</span>
      <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
