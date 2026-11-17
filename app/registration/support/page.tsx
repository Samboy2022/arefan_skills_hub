"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, MessageSquarePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/tenant/page-header";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { TICKET_STATUS } from "@/components/registration/ticket-status";
import { SupportTicket, TicketStatus, addTicket } from "@/lib/school-registration";

const CATEGORIES = ["Onboarding", "Billing", "Technical", "Domain"];
const PRIORITIES: SupportTicket["priority"][] = ["low", "normal", "high"];


const FAQ = [
  {
    q: "How long does review take?",
    a: "Most schools are reviewed within one to two business days once the logo and admin identification are attached.",
  },
  {
    q: "When can instructors and students sign in?",
    a: "As soon as the subdomain is marked live. You'll see the sign-in buttons on the overview.",
  },
  {
    q: "Can I change the subdomain later?",
    a: "Yes, before approval. Open a ticket in the Domain category with the new name you'd like.",
  },
  {
    q: "Is my card charged during review?",
    a: "No. Billing starts after approval, on the plan shown on the Plan page.",
  },
];

export default function RegistrationSupportPage() {
  return (
    <Suspense fallback={<RegistrationLoading />}>
      <SupportContent />
    </Suspense>
  );
}

function SupportContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { application, ready, refresh } = useCurrentApplication();
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [query, setQuery] = useState("");
  const composing = params.get("new") === "1";

  const tickets = useMemo(() => {
    const list = application?.tickets ?? [];
    const q = query.trim().toLowerCase();
    return list
      .filter((ticket) => filter === "all" || ticket.status === filter)
      .filter((ticket) => !q || `${ticket.subject} ${ticket.category} ${ticket.messages.map((message) => message.body).join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => lastActivity(b).localeCompare(lastActivity(a)));
  }, [application, filter, query]);

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="contact support" />;

  const counts: Record<"all" | TicketStatus, number> = {
    all: application.tickets.length,
    open: application.tickets.filter((ticket) => ticket.status === "open").length,
    waiting: application.tickets.filter((ticket) => ticket.status === "waiting").length,
    resolved: application.tickets.filter((ticket) => ticket.status === "resolved").length,
  };

  function setComposing(open: boolean) {
    router.replace(open ? "/registration/support?new=1" : "/registration/support", { scroll: false });
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Support" description="Questions about review, billing, or your domain. Replies arrive here." />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
              {(["all", "waiting", "open", "resolved"] as const).map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setFilter(entry)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    filter === entry ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {entry === "all" ? "All" : entry === "waiting" ? "Replied" : TICKET_STATUS[entry].label}
                  <span className="rounded-full bg-muted px-1.5 text-[11px] font-semibold">{counts[entry]}</span>
                </button>
              ))}
            </div>
            <Button onClick={() => setComposing(true)}>
              <MessageSquarePlus className="mr-1.5 h-4 w-4" /> New ticket
              <Kbd className="ml-2 bg-primary-foreground/20 text-primary-foreground">N</Kbd>
            </Button>
          </div>

          {application.tickets.length > 2 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" className="pl-9" />
            </div>
          )}

          {application.tickets.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.icons8.com/scribby/96/search.png" alt="" className="mb-3 h-12 w-12" />
              <p className="font-semibold">No tickets yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Check the quick answers, or ask us anything.</p>
              <Button className="mt-5" onClick={() => setComposing(true)}>
                Open a ticket
              </Button>
            </div>
          ) : tickets.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No tickets in this view.</p>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-border bg-card">
              {tickets.map((ticket) => {
                const last = ticket.messages[ticket.messages.length - 1];
                const status = TICKET_STATUS[ticket.status];
                return (
                  <li key={ticket.id} className="border-b border-border last:border-b-0">
                    <Link href={`/registration/support/${ticket.id}`} className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/30">
                      <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", status.dot)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold group-hover:text-primary">{ticket.subject}</p>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", status.badge)}>{status.label}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/80">{last.author === "support" ? "Fnskills: " : "You: "}</span>
                          {last.body}
                        </p>
                        <p className="mt-1.5 text-xs capitalize text-muted-foreground">
                          {ticket.category} · {ticket.priority} priority · {ticket.messages.length} message{ticket.messages.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(last.createdAt), { addSuffix: true })}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Typical reply time</p>
            <p className="mt-1 text-2xl font-extrabold">Under 4 hours</p>
            <p className="text-sm text-muted-foreground">Monday to Friday, 8am–6pm WAT</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-5 py-2">
            <p className="pb-1 pt-3 text-sm font-semibold">Quick answers</p>
            <Accordion type="single" collapsible>
              {FAQ.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="last:border-b-0">
                  <AccordionTrigger className="py-3 text-left text-sm">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </aside>
      </div>

      <NewTicketDialog
        open={composing}
        onOpenChange={setComposing}
        onCreate={(input) => {
          const updated = addTicket(application.id, input);
          refresh();
          toast.success("Ticket opened", { description: input.subject });
          const created = updated?.tickets[0];
          router.push(created ? `/registration/support/${created.id}` : "/registration/support");
        }}
      />
    </div>
  );
}

function lastActivity(ticket: SupportTicket) {
  return ticket.messages[ticket.messages.length - 1]?.createdAt ?? ticket.createdAt;
}

function NewTicketDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: { subject: string; category: string; priority: SupportTicket["priority"]; body: string }) => void;
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<SupportTicket["priority"]>("normal");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (subject.trim().length < 4) return setError("Give the ticket a short subject (4+ characters).");
    if (body.trim().length < 8) return setError("Describe the question in a sentence or two.");
    onCreate({ subject, category, priority, body });
    setSubject("");
    setBody("");
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New support ticket</DialogTitle>
          <DialogDescription>We reply on this dashboard and by email.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input id="ticket-subject" value={subject} onChange={(event) => setSubject(event.target.value)} autoFocus placeholder="e.g. Can we change our subdomain?" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCategory(entry)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    category === entry ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40",
                  )}
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="grid grid-cols-3 rounded-lg border border-border p-1">
              {PRIORITIES.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setPriority(entry)}
                  className={cn(
                    "rounded-md py-1.5 text-sm font-medium capitalize transition-all",
                    priority === entry ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-body">Message</Label>
            <Textarea
              id="ticket-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit();
              }}
              rows={5}
              placeholder="What do you need help with?"
            />
          </div>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              <Kbd className="border border-border">⌘</Kbd> <Kbd className="border border-border">Enter</Kbd> to send
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Open ticket</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
