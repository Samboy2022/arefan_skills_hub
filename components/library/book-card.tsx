"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Bookmark, BookmarkCheck, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  LibraryItem,
  ReadingProgress,
  collectionById,
  lengthLabel,
  publisherLabel,
  toggleShelf,
} from "@/lib/library";
import { BookCover } from "@/components/library/book-cover";

export function RatingStars({ rating, count, className }: { rating?: number; count?: number; className?: string }) {
  if (!rating) return <span className={cn("text-xs text-muted-foreground", className)}>Not rated yet</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", className)} aria-label={`Rated ${rating} out of 5`}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              rating >= star - 0.25
                ? "fill-amber-400 text-amber-400"
                : rating >= star - 0.75
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </span>
  );
}

export function SaveToShelfButton({
  item,
  saved,
  variant = "icon",
  className,
}: {
  item: LibraryItem;
  saved: boolean;
  variant?: "icon" | "full";
  className?: string;
}) {
  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const now = toggleShelf(item.id);
    toast.success(now ? "Saved to My shelf" : "Removed from My shelf", { description: item.title });
  }
  const Icon = saved ? BookmarkCheck : Bookmark;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors",
          saved
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
            : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
          className,
        )}
      >
        <Icon className="h-4 w-4" />
        {saved ? "On my shelf" : "Save to my shelf"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Remove from my shelf" : "Save to my shelf"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all",
        saved ? "bg-primary text-primary-foreground" : "bg-white/90 text-stone-800 hover:bg-white",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function ProgressLine({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}

/** Cover-first card used on shelves and in result grids. */
export function BookCard({
  item,
  href,
  saved,
  progress,
  showSave = true,
  className,
}: {
  item: LibraryItem;
  href: string;
  saved?: boolean;
  progress?: ReadingProgress;
  showSave?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        className,
      )}
    >
      <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-1">
        <BookCover item={item} size="sm" />
        {showSave && (
          <SaveToShelfButton
            item={item}
            saved={Boolean(saved)}
            className={cn(
              "absolute bottom-2 right-2",
              saved ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            )}
          />
        )}
        {item.courseCode && item.coverImage && (
          <span className="absolute left-2.5 top-2 rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-stone-900 shadow-sm">
            {item.courseCode}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h4>
        <p className="truncate text-xs text-muted-foreground">{item.author}</p>
        <p className="truncate text-[11px] text-muted-foreground">{publisherLabel(item.uploadedBy)}</p>
        <RatingStars rating={item.rating} />
        {progress && progress.percent > 0 && (
          <div className="pt-1">
            <ProgressLine percent={progress.percent} />
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">
              {progress.percent >= 100 ? "Finished" : `${progress.percent}% read`}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

/** Wide row used by the list view and by search results that need more detail. */
export function BookListRow({
  item,
  href,
  saved,
  showSave = true,
  showViews,
  actions,
}: {
  item: LibraryItem;
  href: string;
  saved?: boolean;
  showSave?: boolean;
  showViews?: boolean;
  actions?: React.ReactNode;
}) {
  const collection = collectionById(item.collectionId);
  return (
    <div className="group flex gap-4 rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md sm:gap-5">
      <Link href={href} className="w-20 shrink-0 sm:w-24">
        <BookCover item={item} size="xs" className="sm:hidden" />
        <BookCover item={item} size="sm" className="hidden sm:block" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary ring-1 ring-inset ring-primary/20">
            {FORMAT_LABELS[item.format]}
          </span>
          <span className="text-xs text-muted-foreground">{item.subject}</span>
          {item.courseCode && (
            <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-400">
              Reserved · {item.courseCode}
            </span>
          )}
        </div>
        <Link href={href} className="mt-1.5">
          <h4 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h4>
        </Link>
        <p className="text-sm text-muted-foreground">
          {item.author} · {item.year} · {lengthLabel(item)} · {publisherLabel(item.uploadedBy)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{item.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
          <RatingStars rating={item.rating} count={item.ratingCount} />
          <span className="text-xs text-muted-foreground">{collection?.name}</span>
          {showViews && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" /> {item.views}
            </span>
          )}
          <span className="text-xs text-muted-foreground">Added {format(new Date(item.addedAt), "MMM d, yyyy")}</span>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            {showSave && (
              <SaveToShelfButton
                item={item}
                saved={Boolean(saved)}
                className="h-8 w-8 border border-border bg-background shadow-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
