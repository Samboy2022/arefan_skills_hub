import { FileText, Headphones, Newspaper, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { FORMAT_LABELS, LibraryItem, coverToneFor, isTimedFormat } from "@/lib/library";

type CoverSize = "xs" | "sm" | "md" | "lg" | "xl";

const TITLE_SIZES: Record<CoverSize, string> = {
  xs: "text-[7px] leading-[1.15]",
  sm: "text-[11px] leading-tight",
  md: "text-sm leading-tight",
  lg: "text-lg leading-tight",
  xl: "text-2xl leading-tight",
};

const META_SIZES: Record<CoverSize, string> = {
  xs: "text-[5px]",
  sm: "text-[8px]",
  md: "text-[9px]",
  lg: "text-[11px]",
  xl: "text-xs",
};

const PAD: Record<CoverSize, string> = {
  xs: "p-1.5 pl-2",
  sm: "p-2.5 pl-3.5",
  md: "p-3 pl-4",
  lg: "p-4 pl-6",
  xl: "p-6 pl-8",
};

type CoverSource = Pick<
  LibraryItem,
  "id" | "title" | "author" | "format" | "subject" | "coverImage" | "coverTone" | "duration"
> & { courseCode?: string };

/**
 * A book-shaped cover. Uses the uploaded image when there is one, otherwise draws
 * a typeset cover from the item's tone so every record looks like a real book.
 */
export function BookCover({
  item,
  size = "md",
  className,
  showBadge = true,
}: {
  item: CoverSource;
  size?: CoverSize;
  className?: string;
  showBadge?: boolean;
}) {
  const tone = coverToneFor(item);
  const FormatIcon = item.format === "video" ? Play : item.format === "audio" ? Headphones : item.format === "article" ? Newspaper : FileText;

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-[2px_6px_6px_2px] bg-muted",
        "shadow-[0_1px_1px_rgba(0,0,0,0.08),0_6px_12px_-4px_rgba(0,0,0,0.25),0_18px_28px_-12px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {item.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div aria-hidden className={cn("absolute inset-0 flex flex-col", tone.face, tone.ink, PAD[size])}>
          {item.courseCode ? (
            <p className={cn("w-fit rounded-sm bg-white/95 px-1 py-px font-bold uppercase tracking-wider text-stone-900", META_SIZES[size])}>
              {item.courseCode}
            </p>
          ) : (
            <p className={cn("truncate font-semibold uppercase tracking-[0.18em] opacity-75", showBadge && item.format !== "book" && "pr-12", META_SIZES[size])}>
              {item.subject}
            </p>
          )}
          <div className={cn("mt-[8%] h-[3px] w-[28%] rounded-full", tone.accent, size === "xs" && "h-px")} />
          <p className={cn("mt-[8%] line-clamp-5 font-serif font-bold", TITLE_SIZES[size])}>{item.title}</p>
          <div className="flex-1" />
          <div className={cn("mb-[6%] h-px w-full opacity-30", tone.accent)} />
          <p className={cn("truncate font-medium uppercase tracking-wider opacity-85", META_SIZES[size])}>
            {item.author}
          </p>
        </div>
      )}

      {/* Spine fold and page sheen, so flat images read as a bound book. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/35 via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/15" />

      {showBadge && item.format !== "book" && size !== "xs" && (
        <span
          className={cn(
            "absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 font-semibold text-white backdrop-blur-sm",
            size === "sm" ? "text-[8px]" : "text-[10px]",
          )}
        >
          <FormatIcon className={size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"} />
          {isTimedFormat(item.format) && item.duration ? `${item.duration}m` : FORMAT_LABELS[item.format]}
        </span>
      )}
    </div>
  );
}
