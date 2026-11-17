"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LibraryItem, ReadingProgress } from "@/lib/library";
import { BookCard } from "@/components/library/book-card";

/**
 * A horizontal shelf: covers stand on a wooden ledge, with titles underneath.
 * Scrolls with the arrow buttons, a trackpad, or touch.
 */
export function BookShelf({
  title,
  subtitle,
  icon,
  items,
  basePath,
  shelf,
  progress,
  showSave = true,
  onSeeAll,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  items: LibraryItem[];
  basePath: string;
  shelf?: string[];
  progress?: Record<string, ReadingProgress>;
  showSave?: boolean;
  onSeeAll?: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    setEdges({
      start: element.scrollLeft <= 4,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items.length]);

  function scrollBy(direction: 1 | -1) {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" className="h-9 w-9 shrink-0" />
          )}
          <div className="min-w-0">
            <h2 className="flex items-baseline gap-2 text-lg font-semibold text-foreground">
              {title}
              <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
            </h2>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {onSeeAll && (
            <button
              type="button"
              onClick={onSeeAll}
              className="mr-1 text-sm font-medium text-primary hover:underline"
            >
              See all
            </button>
          )}
          <ShelfArrow direction="left" disabled={edges.start} onClick={() => scrollBy(-1)} />
          <ShelfArrow direction="right" disabled={edges.end} onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={measure}
        className="-mx-2 overflow-x-auto overscroll-x-contain px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex w-max min-w-full snap-x snap-mandatory">
          {/* The ledge sits exactly under the covers (cover width × 3/2 + top padding). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[calc(1rem+192px)] h-3.5 rounded-[3px] bg-gradient-to-b from-[#b07a48] via-[#8a5a32] to-[#5e3b1f] shadow-[0_10px_14px_-6px_rgba(60,35,15,0.55)] sm:top-[calc(1rem+216px)] dark:from-[#7a5233] dark:via-[#5c3c22] dark:to-[#3a2413]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[calc(1rem+192px)] h-px bg-white/30 sm:top-[calc(1rem+216px)]"
          />
          {items.map((item) => (
            <div key={item.id} className="w-[148px] shrink-0 snap-start px-2.5 pt-4 sm:w-[164px] [&>a>div:last-child]:mt-6">
              <BookCard
                item={item}
                href={`${basePath}/${item.id}`}
                saved={shelf?.includes(item.id)}
                progress={progress?.[item.id]}
                showSave={showSave}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShelfArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll shelf left" : "Scroll shelf right"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background transition-colors",
        disabled ? "cursor-not-allowed opacity-40" : "hover:border-primary/40 hover:bg-muted",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
