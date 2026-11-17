"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Globe,
  Hash,
  Layers,
  Link2,
  Minus,
  Pencil,
  Play,
  Plus,
  Headphones,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FORMAT_LABELS,
  LibraryItem,
  ReadingProgress,
  collectionById,
  formatFileSize,
  isTimedFormat,
  lengthLabel,
  publisherLabel,
  readingTimeLabel,
  removeLibraryItem,
  saveProgress,
} from "@/lib/library";
import { downloadLibraryFile } from "@/lib/library-files";
import { LibraryFileViewer } from "@/components/library/library-file-viewer";
import { BookCover } from "@/components/library/book-cover";
import { ProgressLine, RatingStars, SaveToShelfButton } from "@/components/library/book-card";
import { BookShelf } from "@/components/library/book-shelf";

type Role = "student" | "instructor" | "school-admin" | "public";

const DASHBOARDS: Record<Exclude<Role, "public">, string> = {
  student: "/student",
  instructor: "/instructor",
  "school-admin": "/school-admin",
};

export function LibraryItemDetail({
  item,
  items,
  role,
  basePath,
  canEdit = false,
  saved = false,
  progress,
  shelf = [],
  showStats = false,
}: {
  item: LibraryItem;
  items: LibraryItem[];
  role: Role;
  basePath: string;
  canEdit?: boolean;
  saved?: boolean;
  progress?: ReadingProgress;
  shelf?: string[];
  /** Staff view: reads, uploader, and record id above the page. */
  showStats?: boolean;
}) {
  const router = useRouter();
  const readerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState("overview");
  const isReader = role === "student" || role === "public";
  const isVideo = item.format === "video";
  const isAudio = item.format === "audio";
  const isTimed = isTimedFormat(item.format);
  const hasFile = Boolean(item.hasFile);
  const collection = collectionById(item.collectionId);
  const percent = progress?.percent ?? 0;

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("read")) {
      openReader();
    }
    // Only on first load of this item.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  function openReader() {
    setTab("read");
    if (isReader) saveProgress(item.id, Math.max(percent, 20));
    window.setTimeout(() => readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function copyLink() {
    const url = `${window.location.origin}${basePath}/${item.id}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Link copied", { description: "Share it with classmates in the same school." }))
      .catch(() => toast.error("Could not copy the link"));
  }

  async function download() {
    if (!item.hasFile) {
      toast.info("No file is attached yet", { description: "This title only has a written preview. An admin or instructor can upload the PDF, audio, video, or document." });
      return;
    }
    const saved = await downloadLibraryFile(item.id, item.fileName);
    if (!saved) {
      toast.error("This file is not on this browser", { description: "Open the library on the computer where it was uploaded, or upload it again." });
    }
  }

  function remove() {
    removeLibraryItem(item.id);
    toast.success("Removed from the library", { description: item.title });
    router.push(basePath);
  }

  const related = useMemo(
    () =>
      items
        .filter((entry) => entry.id !== item.id && (entry.subject === item.subject || entry.author === item.author))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
    [items, item],
  );

  const facts = [
    { icon: isAudio ? Headphones : isVideo ? Clock : FileText, label: isTimed ? "Length" : "Pages", value: lengthLabel(item) },
    { icon: Calendar, label: "Published", value: String(item.year) },
    { icon: Globe, label: "Language", value: item.language ?? "English" },
    { icon: Eye, label: "Reads", value: item.views.toLocaleString() },
  ];

  const details: [string, React.ReactNode][] = [
    ["Format", FORMAT_LABELS[item.format]],
    ["Subject", item.subject],
    ["Collection", collection?.name ?? "—"],
    ["Course", item.courseCode ? `${item.courseCode} · ${item.courseTitle}` : "School-wide"],
    ["Author", item.author],
    ["Publisher", item.publisher ?? "—"],
    ["ISBN", item.isbn ?? "—"],
    ["File", `${item.fileName} · ${formatFileSize(item.fileSize)}`],
    ["Added", format(new Date(item.addedAt), "MMMM d, yyyy")],
    ["Published by", publisherLabel(item.uploadedBy)],
  ];

  return (
    <div className="space-y-10 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: role === "public" ? "Home" : "Dashboard", href: role === "public" ? "/" : DASHBOARDS[role] },
          { label: "Library", href: basePath },
          { label: item.title },
        ]}
      />

      {showStats && <LibraryItemStats item={item} />}

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        {/* ── Cover and actions ─────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="mx-auto w-[200px] sm:w-[240px] lg:w-full">
            <BookCover item={item} size="xl" />
          </div>
          <div className="mx-auto grid max-w-[320px] gap-2.5 lg:max-w-none">
            <Button size="lg" onClick={openReader} className="w-full">
              {isVideo ? <Play className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
              {isReader && percent > 0 && percent < 100
                ? isAudio
                  ? "Continue listening"
                  : isVideo
                    ? "Continue watching"
                    : "Continue reading"
                : isAudio
                  ? "Listen"
                  : isVideo
                    ? hasFile
                      ? "Watch"
                      : "Watch preview"
                    : hasFile
                      ? "Read"
                      : "Read preview"}
            </Button>
            {isReader && <SaveToShelfButton item={item} saved={saved} variant="full" className="w-full" />}
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" onClick={download}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline" onClick={copyLink}>
                <Link2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
            {canEdit && (
              <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-3">
                <Button asChild variant="secondary">
                  <Link href={`${basePath}/${item.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove “{item.title}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Students will no longer see it in the library or on course shelves. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep it</AlertDialogCancel>
                      <AlertDialogAction onClick={remove} className="bg-red-600 text-white hover:bg-red-700">
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          {isReader && percent > 0 && (
            <div className="mx-auto max-w-[320px] rounded-xl border border-border bg-card p-4 lg:max-w-none">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Your progress</span>
                <span className="text-muted-foreground">{percent >= 100 ? "Finished" : `${percent}%`}</span>
              </div>
              <ProgressLine percent={percent} className="h-1.5" />
            </div>
          )}
        </div>

        {/* ── Title, facts, and tabs ────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-inset ring-primary/20">
                {FORMAT_LABELS[item.format]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{item.subject}</span>
              {item.courseCode && (
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-400">
                  Reserved for {item.courseCode}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">{item.title}</h1>
            <p className="mt-2 text-base text-muted-foreground">
              by <span className="font-semibold text-foreground">{item.author}</span>
              {item.publisher && <> · {item.publisher}</>}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <RatingStars rating={item.rating} count={item.ratingCount} className="text-sm [&_svg]:h-4 [&_svg]:w-4" />
              <span className="text-sm text-muted-foreground">
                {readingTimeLabel(item)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-muted/20 sm:grid-cols-4">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-4 text-center",
                  index > 0 && "sm:border-l sm:border-border",
                  index % 2 === 1 && "border-l border-border",
                  index >= 2 && "border-t border-border sm:border-t-0",
                )}
              >
                <fact.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{fact.label}</p>
                <p className="text-sm font-bold text-foreground">{fact.value}</p>
              </div>
            ))}
          </div>

          <Tabs value={tab} onValueChange={(value) => (value === "read" ? openReader() : setTab(value))}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {item.chapters && item.chapters.length > 0 && <TabsTrigger value="contents">Contents</TabsTrigger>}
              <TabsTrigger value="read">{isVideo ? "Watch" : "Read"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h2 className="mb-2 text-base font-semibold text-foreground">About this {FORMAT_LABELS[item.format].toLowerCase()}</h2>
                <p className="max-w-prose leading-7 text-foreground/85">{item.description}</p>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-border">
                <dl className="divide-y divide-border">
                  {details.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-2.5 text-sm odd:bg-muted/20">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="truncate font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TabsContent>

            {item.chapters && item.chapters.length > 0 && (
              <TabsContent value="contents" className="mt-6">
                <ol className="overflow-hidden rounded-xl border border-border">
                  {item.chapters.map((chapter, index) => (
                    <li key={`${chapter.title}-${index}`} className="border-b border-border last:border-b-0">
                      <button
                        type="button"
                        onClick={openReader}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium text-foreground">{chapter.title}</span>
                        {chapter.page !== undefined && (
                          <span className="font-mono text-xs text-muted-foreground">p. {chapter.page}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            )}

            <TabsContent value="read" className="mt-6">
              <div ref={readerRef} className="scroll-mt-6">
                {hasFile ? (
                  <div className="space-y-4">
                    <LibraryFileViewer item={item} />
                    {isReader && <FinishButton item={item} percent={percent} label="Mark as finished" />}
                  </div>
                ) : (
                  <LibraryReader item={item} canTrack={isReader} percent={percent} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border pt-10">
          <BookShelf
            title={`More in ${item.subject}`}
            subtitle="Titles on the same subject or by the same author"
            items={related}
            basePath={basePath}
            shelf={shelf}
            showSave={isReader}
          />
        </div>
      )}
    </div>
  );
}

/* ── Reader ─────────────────────────────────────────────────────────────── */

const FONT_SIZES = ["text-base", "text-[17px]", "text-lg", "text-xl"];

function LibraryReader({ item, canTrack, percent }: { item: LibraryItem; canTrack: boolean; percent: number }) {
  const [size, setSize] = useState(1);
  const paragraphs = item.previewText.split(/\n{2,}/).filter(Boolean);
  const chapter = item.chapters?.[0];

  if (item.format === "video" || item.format === "audio") {
    const listening = item.format === "audio";
    return (
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-950">
          <div className="absolute inset-0 opacity-40">
            <BookCover item={item} size="xl" showBadge={false} className="h-full rounded-none [aspect-ratio:auto]" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-xl">
              {listening ? <Headphones className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
            </span>
            <p className="text-sm font-medium">{item.fileName}</p>
            <p className="text-xs text-white/70">{listening ? "Upload the audio file to play it here." : "Upload the video file to play it here."}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Summary</p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7 text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>
        {canTrack && <FinishButton item={item} percent={percent} label="Mark as watched" />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Written preview. Upload the PDF or document to open the original file.</p>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => setSize((value) => Math.max(0, value - 1))}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            disabled={size === 0}
            aria-label="Smaller text"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-1 text-xs font-semibold">Aa</span>
          <button
            type="button"
            onClick={() => setSize((value) => Math.min(FONT_SIZES.length - 1, value + 1))}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            disabled={size === FONT_SIZES.length - 1}
            aria-label="Larger text"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* A paper page: warm stock, generous margins, serif body. */}
      <article className="relative mx-auto max-w-2xl rounded-sm bg-[#fbf8f1] px-8 py-10 text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_32px_-12px_rgba(0,0,0,0.25)] ring-1 ring-stone-200 sm:px-14 sm:py-14 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800">
        <div className="mb-8 flex items-center justify-between border-b border-stone-300/70 pb-3 text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700">
          <span className="truncate">{item.title}</span>
          <span className="shrink-0 pl-4">{item.author}</span>
        </div>
        {chapter && (
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Chapter 1</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">{chapter.title}</h2>
          </header>
        )}
        <div className={cn("space-y-5 font-serif leading-[1.85]", FONT_SIZES[size])}>
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={cn(
                index === 0 &&
                  "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-primary",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-center gap-3 text-xs text-stone-400">
          <span className="h-px w-10 bg-stone-300 dark:bg-stone-700" />
          <span className="font-serif">{chapter?.page ?? 1}</span>
          <span className="h-px w-10 bg-stone-300 dark:bg-stone-700" />
        </div>
      </article>

      {canTrack && <FinishButton item={item} percent={percent} label="Mark as finished" />}
    </div>
  );
}

function FinishButton({ item, percent, label }: { item: LibraryItem; percent: number; label: string }) {
  const done = percent >= 100;
  return (
    <div className="flex justify-center">
      <Button
        variant={done ? "secondary" : "outline"}
        disabled={done}
        onClick={() => {
          saveProgress(item.id, 100);
          toast.success("Nice work", { description: `${item.title} is marked as finished.` });
        }}
      >
        <CheckCircle2 className={cn("mr-2 h-4 w-4", done && "text-emerald-600")} />
        {done ? "Finished" : label}
      </Button>
    </div>
  );
}

/** Small admin-only panel with numbers for one record. */
export function LibraryItemStats({ item }: { item: LibraryItem }) {
  const rows = [
    { icon: Eye, label: "Reads", value: item.views.toLocaleString() },
    { icon: User, label: "Uploaded by", value: item.uploadedBy === "instructor" ? "Lecturer" : "School admin" },
    { icon: Layers, label: "Collection", value: collectionById(item.collectionId)?.name ?? "—" },
    { icon: Hash, label: "Record", value: item.id },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="rounded-md bg-muted p-2">
            <row.icon className="h-4 w-4 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{row.label}</p>
            <p className="truncate text-sm font-semibold">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]" aria-busy="true">
      <div className="mx-auto aspect-[2/3] w-[240px] animate-pulse rounded-md bg-muted lg:w-full" />
      <div className="space-y-4">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export function LibraryMissingItem({ href }: { href: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://img.icons8.com/scribby/96/search.png" alt="" className="mb-4 h-14 w-14" />
      <h1 className="text-lg font-semibold">This title is not in the library</h1>
      <p className="mt-1 text-sm text-muted-foreground">It may have been removed by the school or your lecturer.</p>
      <Button asChild className="mt-6">
        <Link href={href}>Back to the library</Link>
      </Button>
    </div>
  );
}
