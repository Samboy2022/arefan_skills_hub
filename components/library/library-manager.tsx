"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, EyeOff, ImagePlus, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FORMAT_LABELS,
  LIBRARY_FORMATS,
  LibraryItem,
  LibrarySort,
  collectionById,
  lengthLabel,
  loadSlider,
  removeLibraryItem,
  searchScore,
  setSliderMembership,
  sortItems,
  updateLibraryItem,
} from "@/lib/library";
import { BookCover } from "@/components/library/book-cover";
import { LibraryBrowser } from "@/components/library/library-browser";

export function LibraryManager({
  items,
  basePath,
  uploadHref,
  canManage,
  manageLabel,
  myCourseCodes,
  catalogAdmin = false,
  organizeHref,
}: {
  items: LibraryItem[];
  basePath: string;
  uploadHref: string;
  /** Which records this person may edit. */
  canManage: (item: LibraryItem) => boolean;
  manageLabel: string;
  myCourseCodes?: string[];
  /** School admin: slider, hide, and the rest of the catalog tools. */
  catalogAdmin?: boolean;
  organizeHref?: string;
}) {
  const [query, setQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [sort, setSort] = useState<LibrarySort>("newest");
  const [pendingDelete, setPendingDelete] = useState<LibraryItem | null>(null);
  const [sliderIds, setSliderIds] = useState<string[]>([]);

  useEffect(() => {
    if (!catalogAdmin) return;
    setSliderIds(loadSlider());
  }, [catalogAdmin, items]);

  const managed = useMemo(() => items.filter(canManage), [items, canManage]);
  const visible = useMemo(() => {
    const filtered = managed
      .filter((item) => searchScore(item, query) > 0)
      .filter((item) => formatFilter === "all" || item.format === formatFilter);
    return sortItems(filtered, sort);
  }, [managed, query, formatFilter, sort]);

  const totalReads = managed.reduce((sum, item) => sum + item.views, 0);
  const courses = new Set(managed.map((item) => item.courseCode).filter(Boolean));
  const topItem = [...managed].sort((a, b) => b.views - a.views)[0];

  const stats = [
    { icon: "https://img.icons8.com/scribby/96/book.png", label: manageLabel, value: managed.length, tone: "text-foreground" },
    { icon: "https://img.icons8.com/scribby/96/line-chart.png", label: "Total reads", value: totalReads.toLocaleString(), tone: "text-primary" },
    { icon: "https://img.icons8.com/scribby/96/graduation-cap.png", label: "Courses covered", value: courses.size, tone: "text-sky-600 dark:text-sky-400" },
    { icon: "https://img.icons8.com/scribby/96/star.png", label: "Whole catalog", value: items.length, tone: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      {organizeHref && (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={organizeHref}>Categories and slider</Link>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 px-4 py-5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center gap-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stat.icon} alt="" className="h-11 w-11" />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className={cn("text-3xl font-extrabold leading-none", stat.tone)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">{manageLabel}</TabsTrigger>
          <TabsTrigger value="browse">Browse as a student</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-6 space-y-4">
          {topItem && topItem.views > 0 && (
            <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="w-10 shrink-0">
                <BookCover item={topItem} size="xs" />
              </div>
              <p className="text-sm">
                <span className="font-semibold text-foreground">{topItem.title}</span>{" "}
                <span className="text-muted-foreground">is your most-read material with {topItem.views} reads.</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your materials" className="pl-9" />
            </div>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by format"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All formats</SelectItem>
                {LIBRARY_FORMATS.map((entry) => <SelectItem key={entry} value={entry}>{FORMAT_LABELS[entry]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(value) => setSort(value as LibrarySort)}>
              <SelectTrigger className="w-full sm:w-[170px]" aria-label="Sort"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="popular">Most read</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {managed.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.icons8.com/scribby/96/book.png" alt="" className="mb-4 h-14 w-14" />
              <h3 className="text-lg font-semibold">Nothing uploaded yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Add a book, reading packet, or recorded lecture and it appears on the course shelf for your students.</p>
              <Button asChild className="mt-6">
                <Link href={uploadHref}><Plus className="mr-1.5 h-4 w-4" /> Create your first material</Link>
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No materials match that search.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="hidden grid-cols-[minmax(0,1fr)_110px_120px_80px_110px_48px] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground md:grid">
                <span>Material</span>
                <span>Format</span>
                <span>Placement</span>
                <span className="text-right">Reads</span>
                <span>Added</span>
                <span />
              </div>
              <ul className="divide-y divide-border">
                {visible.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30 md:grid-cols-[minmax(0,1fr)_110px_120px_80px_110px_48px]"
                  >
                    <Link href={`${basePath}/${item.id}`} className="flex min-w-0 items-center gap-3">
                      <div className="w-10 shrink-0">
                        <BookCover item={item} size="xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground hover:text-primary">
                          {item.title}
                          {item.hidden && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Hidden</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{item.author} · {lengthLabel(item)}</p>
                      </div>
                    </Link>
                    <span className="hidden md:block">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-inset ring-primary/20">
                        {FORMAT_LABELS[item.format]}
                      </span>
                    </span>
                    <span className="hidden truncate text-xs text-muted-foreground md:block">
                      {item.courseCode ?? collectionById(item.collectionId)?.name}
                    </span>
                    <span className="hidden text-right text-sm font-semibold tabular-nums md:block">{item.views}</span>
                    <span className="hidden text-xs text-muted-foreground md:block">{format(new Date(item.addedAt), "MMM d, yyyy")}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${item.title}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`${basePath}/${item.id}`}><Eye className="mr-2 h-4 w-4" /> View page</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`${basePath}/${item.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                        </DropdownMenuItem>
                        {catalogAdmin && (
                          <DropdownMenuItem
                            onSelect={() => {
                              const onSlider = sliderIds.includes(item.id);
                              setSliderMembership(item.id, !onSlider);
                              setSliderIds(loadSlider());
                              toast.success(onSlider ? "Removed from the slider" : "Added to the slider", { description: item.title });
                            }}
                          >
                            <ImagePlus className="mr-2 h-4 w-4" /> {sliderIds.includes(item.id) ? "Remove from slider" : "Add to slider"}
                          </DropdownMenuItem>
                        )}
                        {catalogAdmin && (
                          <DropdownMenuItem
                            onSelect={() => {
                              const hiding = !item.hidden;
                              updateLibraryItem(item.id, { hidden: hiding, featured: hiding ? false : item.featured });
                              if (hiding) setSliderMembership(item.id, false);
                              toast.success(hiding ? "Hidden from readers" : "Visible in the library again", { description: item.title });
                            }}
                          >
                            <EyeOff className="mr-2 h-4 w-4" /> {item.hidden ? "Show to readers" : "Hide from readers"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={() => setPendingDelete(item)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          <LibraryBrowser items={items} basePath={basePath} myCourseCodes={myCourseCodes} showViews />
        </TabsContent>
      </Tabs>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{pendingDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Students will no longer see it in the library or on course shelves. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (!pendingDelete) return;
                removeLibraryItem(pendingDelete.id);
                toast.success("Removed from the library", { description: pendingDelete.title });
                setPendingDelete(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
