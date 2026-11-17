"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format, isSameDay } from "date-fns";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { RegistrationEmpty, RegistrationLoading } from "@/components/registration/registration-states";
import { TICKET_STATUS } from "@/components/registration/ticket-status";
import { addTicketMessage } from "@/lib/school-registration";

export default function TicketThreadPage() {
  const params = useParams<{ ticketId: string }>();
  const { application, ready, refresh } = useCurrentApplication();
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const ticket = application?.tickets.find((item) => item.id === params.ticketId);
  const messageCount = ticket?.messages.length ?? 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messageCount]);

  if (!ready) return <RegistrationLoading />;
  if (!application) return <RegistrationEmpty what="read support replies" />;
  if (!ticket) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <p className="font-semibold">This ticket is not on your application</p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/registration/support">Back to support</Link>
        </Button>
      </div>
    );
  }

  const applicationId = application.id;
  const ticketId = ticket.id;
  const status = TICKET_STATUS[ticket.status];
  const initial = application.admin.name.charAt(0).toUpperCase();

  function send(event?: FormEvent) {
    event?.preventDefault();
    if (body.trim().length < 2) return;
    addTicketMessage(applicationId, ticketId, body);
    setBody("");
    refresh();
    toast.success("Reply sent");
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link href="/registration/support">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> All tickets
        </Link>
      </Button>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold">{ticket.subject}</h1>
            <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset", status.badge)}>{status.label}</span>
          </div>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {ticket.category} · {ticket.priority} priority · opened {format(new Date(ticket.createdAt), "MMM d, yyyy")}
          </p>
        </div>

        <div className="space-y-5 bg-muted/20 px-4 py-6 sm:px-6">
          {ticket.messages.map((message, index) => {
            const mine = message.author === "school";
            const previous = ticket.messages[index - 1];
            const newDay = !previous || !isSameDay(new Date(previous.createdAt), new Date(message.createdAt));
            return (
              <div key={message.id}>
                {newDay && (
                  <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {format(new Date(message.createdAt), "EEEE, MMM d")}
                  </p>
                )}
                <div className={cn("flex items-end gap-2.5", mine && "flex-row-reverse")}>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      mine ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
                    )}
                  >
                    {mine ? initial : "F"}
                  </span>
                  <div className={cn("max-w-[80%]", mine && "text-right")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed",
                        mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-card",
                      )}
                    >
                      {message.body}
                    </div>
                    <p className="mt-1 px-1 text-[11px] text-muted-foreground">
                      {mine ? "You" : "Fnskills support"} · {format(new Date(message.createdAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="border-t border-border p-4">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") send();
            }}
            placeholder={ticket.status === "resolved" ? "Reply to reopen this ticket" : "Write a reply"}
            rows={3}
            className="resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              <Kbd className="border border-border">⌘</Kbd> <Kbd className="border border-border">Enter</Kbd> to send
            </span>
            <Button type="submit" disabled={body.trim().length < 2}>
              Send <SendHorizontal className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
