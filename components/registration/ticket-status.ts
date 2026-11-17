import type { TicketStatus } from "@/lib/school-registration";

export const TICKET_STATUS: Record<TicketStatus, { label: string; badge: string; dot: string }> = {
  open: { label: "Open", badge: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400", dot: "bg-sky-500" },
  waiting: { label: "Reply from support", badge: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400", dot: "bg-amber-500" },
  resolved: { label: "Resolved", badge: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400", dot: "bg-emerald-500" },
};
