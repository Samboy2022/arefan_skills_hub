import { cn } from "@/lib/utils";

/*
 * Shared class names for the student portal so list tables, status pills,
 * tabs and detail cards match the registration dashboard.
 */

/** Vertical rhythm for a dashboard page. */
export const pageStackClass = "space-y-6 pb-12";

/** Card that wraps a tab row + table. */
export const listCardClass = "gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-none";

/** Header row inside a section card. */
export const sectionHeaderClass = "flex items-center justify-between gap-3 border-b border-border px-5 py-4";

/** Centered single-column detail card (assignment / quiz / session detail). */
export const detailWrapClass = "mx-auto w-full max-w-3xl space-y-6";
export const detailCardClass = "gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-none";
export const detailSectionClass = "px-5 py-6 sm:px-8";
export const detailFooterClass =
  "flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8";
export const sectionTitleClass = "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/** Form section, matching the registration school form. */
export const formSectionClass = "rounded-2xl border border-border bg-card p-5 sm:p-6";
export const formIconClass = "rounded-lg bg-primary/10 p-2 text-primary";
export const formLabelClass = "text-sm font-medium";
export const formErrorClass = "text-xs font-medium text-red-600 dark:text-red-400";
export const formGridClass = "grid gap-4 sm:grid-cols-2";

/** Compact tip under a header or inside a section. */
export const tipBoxClass =
  "flex items-start gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground";

/** Table header row + cells. */
export const tableHeadRowClass = "bg-muted/40 hover:bg-muted/40";
export const tableHeadClass = "text-[11px] font-bold uppercase tracking-wider text-muted-foreground";

/** Segmented filter control. */
export const tabRowClass = "m-3 flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1";
export const tabButtonClass = (active: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
    active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
  );
export const tabCountClass = (active: boolean) =>
  cn(
    "min-w-[18px] rounded-full px-1.5 text-center text-[11px] font-semibold",
    active ? "bg-muted text-foreground" : "bg-muted text-muted-foreground",
  );

/** Status pills. */
export type PillTone = "success" | "info" | "warning" | "orange" | "danger" | "neutral";
const pillTones: Record<PillTone, string> = {
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  info: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  orange: "bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-400",
  danger: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400",
  neutral: "bg-muted text-muted-foreground ring-border",
};
export const pillClass = (tone: PillTone) =>
  cn(
    "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
    pillTones[tone],
  );

/** Small square action buttons used in table rows (pass to Button className). */
export const rowActionClass = "h-8 gap-1.5 px-3 text-xs";

/** Dashed empty state, matching RegistrationEmpty. */
export const emptyStateClass =
  "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center";
export const emptyTitleClass = "text-xl font-semibold";
export const emptyBodyClass = "mt-1 max-w-sm text-sm text-muted-foreground";

/** Stat cards: two per row on mobile/tablet, four in a row on desktop. */
export const statGridClass = "grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4";
