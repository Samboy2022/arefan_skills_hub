"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookMarked, LayoutGrid, List, Search, SlidersHorizontal, Sparkles, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  FORMAT_LABELS,
  LIBRARY_COLLECTIONS,
  LIBRARY_FORMATS,
  LIBRARY_SUBJECTS,
  LibraryCollection,
  LibraryFormat,
  LibraryItem,
  LibrarySort,
  ReadingProgress,
  SORT_LABELS,
  SUBJECT_ICONS,
  collectionLabel,
  loadCollections,
  loadSlider,
  orderedCollections,
  searchScore,
  sortItems,
} from "@/lib/library";
import { BookCard, BookListRow } from "@/components/library/book-card";
import { BookShelf } from "@/components/library/book-shelf";
import { LibraryHero } from "@/components/library/library-hero";

type ViewMode = "grid" | "list";
type Tab = "discover" | "shelf";

interface Filters {
  formats: LibraryFormat[];
  collection: string;
  language: string;
  minRating: number;
  myCourses: boolean;
}

const EMPTY_FILTERS: Filters = { formats: [], collection: "all", language: "all", minRating: 0, myCourses: false };
const VIEW_KEY = "fnskills:library-view";

export function LibraryBrowser({
  items: sourceItems,
  basePath,
  shelf = [],
  progress = {},
  myCourseCodes,
  readerMode = false,
  showViews = false,
  showHero = true,
  includeHidden = false,
  rowActions,
}: {
  items: LibraryItem[];
  basePath: string;
  shelf?: string[];
  progress?: Record<string, ReadingProgress>;
  /** Course codes the viewer is enrolled in or teaches; powers the course reserves shelf. */
  myCourseCodes?: string[];
  /** Student view: shows My shelf, continue reading, and save buttons. */
  readerMode?: boolean;
  showViews?: boolean;
  showHero?: boolean;
  /** School admin manage view can include titles hidden from readers. */
  includeHidden?: boolean;
  rowActions?: (item: LibraryItem) => React.ReactNode;
}) {
  const items = useMemo(
    () => (includeHidden ? sourceItems : sourceItems.filter((item) => !item.hidden)),
    [includeHidden, sourceItems],
  );
  const [collections, setCollections] = useState<LibraryCollection[]>(LIBRARY_COLLECTIONS);
  const [sliderIds, setSliderIds] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("discover");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<LibrarySort>("relevance");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {
      // Keep the default view.
    }
  }, []);

  useEffect(() => {
    const syncCatalog = () => {
      setCollections(loadCollections());
      setSliderIds(loadSlider());
    };
    syncCatalog();
    window.addEventListener("fnskills-library", syncCatalog);
    return () => window.removeEventListener("fnskills-library", syncCatalog);
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Preference only.
    }
  }

  // "/" focuses the search from anywhere on the page; Esc clears it.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const myCourseSet = useMemo(() => new Set(myCourseCodes ?? []), [myCourseCodes]);
  const languages = useMemo(
    () => Array.from(new Set(items.map((item) => item.language).filter(Boolean) as string[])).sort(),
    [items],
  );

  const activeFilterCount =
    filters.formats.length +
    (filters.collection !== "all" ? 1 : 0) +
    (filters.language !== "all" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.myCourses ? 1 : 0);
  const browsing = tab === "discover" && !query.trim() && subject === "all" && activeFilterCount === 0;

  const matched = useMemo(() => {
    return items
      .map((item) => ({ item, score: searchScore(item, query) }))
      .filter(({ score }) => score > 0)
      .filter(({ item }) => subject === "all" || item.subject === subject);
  }, [items, query, subject]);

  const results = useMemo(() => {
    const filtered = matched
      .filter(({ item }) => filters.formats.length === 0 || filters.formats.includes(item.format))
      .filter(({ item }) => filters.collection === "all" || itemInCollection(item, filters.collection, collections))
      .filter(({ item }) => filters.language === "all" || item.language === filters.language)
      .filter(({ item }) => (item.rating ?? 0) >= filters.minRating)
      .filter(({ item }) => !filters.myCourses || (item.courseCode && myCourseSet.has(item.courseCode)));
    if (sort === "relevance") {
      return filtered.sort((a, b) => b.score - a.score || b.item.views - a.item.views).map(({ item }) => item);
    }
    return sortItems(
      filtered.map(({ item }) => item),
      sort,
    );
  }, [matched, filters, sort, myCourseSet, collections]);

  const savedItems = useMemo(
    () => shelf.map((id) => items.find((item) => item.id === id)).filter(Boolean) as LibraryItem[],
    [shelf, items],
  );

  function clearAll() {
    setQuery("");
    setSubject("all");
    setFilters(EMPTY_FILTERS);
    setSort("relevance");
  }

  function showSorted(next: LibrarySort, patch?: Partial<Filters>) {
    setTab("discover");
    setSort(next);
    if (patch) setFilters({ ...EMPTY_FILTERS, ...patch });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.subject] = (counts[item.subject] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <div className="space-y-8">
      {/* ── Search and tabs ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (tab !== "discover") setTab("discover");
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search by title, author, subject, ISBN, or course code"
              className="h-12 rounded-xl border-border bg-card pl-12 pr-20 text-base shadow-sm"
              aria-label="Search the library"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Kbd className="hidden sm:inline-flex">/</Kbd>
              )}
            </div>
          </div>
          {readerMode && (
            <div className="flex shrink-0 rounded-xl border border-border bg-muted/40 p-1">
              <TabButton active={tab === "discover"} onClick={() => setTab("discover")}>
                <Sparkles className="h-4 w-4" /> Discover
              </TabButton>
              <TabButton active={tab === "shelf"} onClick={() => setTab("shelf")}>
                <BookMarked className="h-4 w-4" /> My shelf
                {shelf.length > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{shelf.length}</span>
                )}
              </TabButton>
            </div>
          )}
        </div>

        {/* Category rail */}
        {tab === "discover" && (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CategoryChip active={subject === "all"} onClick={() => setSubject("all")} label="All subjects" count={items.length} />
            {LIBRARY_SUBJECTS.filter((entry) => subjectCounts[entry]).map((entry) => (
              <CategoryChip
                key={entry}
                active={subject === entry}
                onClick={() => setSubject(subject === entry ? "all" : entry)}
                label={entry}
                count={subjectCounts[entry]}
                icon={SUBJECT_ICONS[entry]}
              />
            ))}
          </div>
        )}
      </div>

      {tab === "shelf" ? (
        <MyShelf items={savedItems} basePath={basePath} progress={progress} onBrowse={() => setTab("discover")} />
      ) : browsing ? (
        <BrowseView
          items={items}
          basePath={basePath}
          shelf={shelf}
          progress={progress}
          myCourseSet={myCourseSet}
          readerMode={readerMode}
          showHero={showHero}
          sliderIds={sliderIds}
          onSubject={setSubject}
          onSort={showSorted}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
              <FacetPanel
                items={matched.map(({ item }) => item)}
                filters={filters}
                setFilters={setFilters}
                languages={languages}
                hasCourses={myCourseSet.size > 0}
                collections={collections}
              />
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {results.length} {results.length === 1 ? "result" : "results"}
                  {query.trim() && <span className="font-normal text-muted-foreground"> for “{query.trim()}”</span>}
                </h2>
                <ActiveFilters
                  subject={subject}
                  filters={filters}
                  onSubject={() => setSubject("all")}
                  setFilters={setFilters}
                  collections={collections}
                  onClear={clearAll}
                />
              </div>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filters
                      {activeFilterCount > 0 && <span className="ml-1 text-primary">({activeFilterCount})</span>}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
                    <SheetHeader className="border-b px-5 py-4">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="p-5">
                      <FacetPanel
                        items={matched.map(({ item }) => item)}
                        filters={filters}
                        setFilters={setFilters}
                        languages={languages}
                        hasCourses={myCourseSet.size > 0}
                        collections={collections}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <Select value={sort} onValueChange={(value) => setSort(value as LibrarySort)}>
                  <SelectTrigger className="h-9 w-[170px]" aria-label="Sort results">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORT_LABELS) as LibrarySort[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {SORT_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex rounded-md border border-border p-0.5">
                  <ViewButton active={view === "grid"} onClick={() => changeView("grid")} label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ViewButton>
                  <ViewButton active={view === "list"} onClick={() => changeView("list")} label="List view">
                    <List className="h-4 w-4" />
                  </ViewButton>
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyResults onClear={clearAll} />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {results.map((item) => (
                  <BookCard
                    key={item.id}
                    item={item}
                    href={`${basePath}/${item.id}`}
                    saved={shelf.includes(item.id)}
                    progress={progress[item.id]}
                    showSave={readerMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((item) => (
                  <BookListRow
                    key={item.id}
                    item={item}
                    href={`${basePath}/${item.id}`}
                    saved={shelf.includes(item.id)}
                    showSave={readerMode}
                    showViews={showViews}
                    actions={rowActions?.(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Browse view: hero and shelves ──────────────────────────────────────── */

function BrowseView({
  items,
  basePath,
  shelf,
  progress,
  myCourseSet,
  readerMode,
  showHero,
  sliderIds,
  onSubject,
  onSort,
}: {
  items: LibraryItem[];
  basePath: string;
  shelf: string[];
  progress: Record<string, ReadingProgress>;
  myCourseSet: Set<string>;
  readerMode: boolean;
  showHero: boolean;
  sliderIds: string[];
  onSubject: (subject: string) => void;
  onSort: (sort: LibrarySort, patch?: Partial<Filters>) => void;
}) {
  const fromSlider = sliderIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is LibraryItem => Boolean(item));
  const featured = items.filter((item) => item.featured).slice(0, 5);
  const hero = fromSlider.length > 0 ? fromSlider : featured.length > 0 ? featured : sortItems(items, "popular").slice(0, 4);
  const continueReading = items
    .filter((item) => progress[item.id] && progress[item.id].percent > 0 && progress[item.id].percent < 100)
    .sort((a, b) => progress[b.id].at.localeCompare(progress[a.id].at));
  const reserves = items.filter((item) => item.courseCode && myCourseSet.has(item.courseCode));
  const newest = sortItems(items, "newest").slice(0, 12);
  const popular = sortItems(items, "popular").slice(0, 12);
  const topRated = sortItems(items, "rating").filter((item) => (item.rating ?? 0) >= 4.5).slice(0, 12);
  const media = items.filter((item) => item.format === "video" || item.format === "audio");
  const shared = { basePath, shelf, progress, showSave: readerMode };

  return (
    <div className="space-y-12">
      {showHero && <LibraryHero items={hero} basePath={basePath} />}

      {readerMode && (
        <BookShelf
          {...shared}
          title="Continue reading"
          subtitle="Pick up where you stopped"
          icon="https://img.icons8.com/scribby/96/book.png"
          items={continueReading}
        />
      )}
      <BookShelf
        {...shared}
        title={readerMode ? "Reserved for your courses" : "Course reserves"}
        subtitle="Readings your lecturers attached to a course"
        icon="https://img.icons8.com/scribby/96/graduation-cap.png"
        items={reserves}
        onSeeAll={() => onSort("newest", { myCourses: true })}
      />
      <BookShelf
        {...shared}
        title="New arrivals"
        subtitle="Recently added to the catalog"
        icon="https://img.icons8.com/scribby/96/new.png"
        items={newest}
        onSeeAll={() => onSort("newest")}
      />
      <BookShelf
        {...shared}
        title="Most read this term"
        subtitle="What other students are opening"
        icon="https://img.icons8.com/scribby/96/fire-element.png"
        items={popular}
        onSeeAll={() => onSort("popular")}
      />
      <BookShelf
        {...shared}
        title="Top rated"
        subtitle="Rated 4.5 stars and above"
        icon="https://img.icons8.com/scribby/96/star.png"
        items={topRated}
        onSeeAll={() => onSort("rating", { minRating: 4.5 })}
      />
      {LIBRARY_SUBJECTS.map((subject) => {
        const subjectItems = items.filter((item) => item.subject === subject);
        if (subjectItems.length < 2) return null;
        return (
          <BookShelf
            key={subject}
            {...shared}
            title={subject}
            icon={SUBJECT_ICONS[subject]}
            items={subjectItems}
            onSeeAll={() => onSubject(subject)}
          />
        );
      })}
      <BookShelf
        {...shared}
        title="Video and audio"
        subtitle="Recorded lectures you can watch or listen to"
        icon="https://img.icons8.com/scribby/96/video.png"
        items={media}
        onSeeAll={() => onSort("newest", { formats: ["video"] })}
      />
    </div>
  );
}

function MyShelf({
  items,
  basePath,
  progress,
  onBrowse,
}: {
  items: LibraryItem[];
  basePath: string;
  progress: Record<string, ReadingProgress>;
  onBrowse: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://img.icons8.com/scribby/96/like.png" alt="" className="mb-4 h-14 w-14" />
        <h3 className="text-lg font-semibold text-foreground">Your shelf is empty</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Tap the bookmark on any cover to keep it here. Saved titles stay on this device.
        </p>
        <Button className="mt-6" onClick={onBrowse}>
          Browse the library
        </Button>
      </div>
    );
  }
  const finished = items.filter((item) => (progress[item.id]?.percent ?? 0) >= 100).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-muted/20 px-5 py-4 text-sm">
        <span>
          <span className="text-2xl font-bold text-foreground">{items.length}</span>{" "}
          <span className="text-muted-foreground">saved</span>
        </span>
        <span>
          <span className="text-2xl font-bold text-primary">
            {items.filter((item) => (progress[item.id]?.percent ?? 0) > 0 && (progress[item.id]?.percent ?? 0) < 100).length}
          </span>{" "}
          <span className="text-muted-foreground">in progress</span>
        </span>
        <span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{finished}</span>{" "}
          <span className="text-muted-foreground">finished</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <BookCard key={item.id} item={item} href={`${basePath}/${item.id}`} saved progress={progress[item.id]} />
        ))}
      </div>
    </div>
  );
}

/* ── Facets ─────────────────────────────────────────────────────────────── */

function FacetPanel({
  items,
  filters,
  setFilters,
  languages,
  hasCourses,
  collections,
}: {
  items: LibraryItem[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  languages: string[];
  hasCourses: boolean;
  collections: LibraryCollection[];
}) {
  function toggleFormat(format: LibraryFormat) {
    const formats = filters.formats.includes(format)
      ? filters.formats.filter((entry) => entry !== format)
      : [...filters.formats, format];
    setFilters({ ...filters, formats });
  }

  return (
    <div className="space-y-6 text-sm">
      {hasCourses && (
        <label className="flex items-center justify-between gap-3">
          <span className="font-medium">My course reserves</span>
          <Switch checked={filters.myCourses} onCheckedChange={(myCourses) => setFilters({ ...filters, myCourses })} />
        </label>
      )}

      <FacetGroup title="Format">
        {LIBRARY_FORMATS.map((format) => {
          const count = items.filter((item) => item.format === format).length;
          return (
            <label key={format} className="flex cursor-pointer items-center gap-2.5 py-1">
              <Checkbox checked={filters.formats.includes(format)} onCheckedChange={() => toggleFormat(format)} />
              <span className="flex-1">{FORMAT_LABELS[format]}</span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          );
        })}
      </FacetGroup>

      <FacetGroup title="Collection">
        <FacetRadio
          active={filters.collection === "all"}
          onClick={() => setFilters({ ...filters, collection: "all" })}
          label="All collections"
          count={items.length}
        />
        {orderedCollections(collections).map((collection) => (
          <FacetRadio
            key={collection.id}
            active={filters.collection === collection.id}
            onClick={() => setFilters({ ...filters, collection: collection.id })}
            label={collection.parentId ? `– ${collection.name}` : collection.name}
            count={items.filter((item) => itemInCollection(item, collection.id, collections)).length}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Rating">
        {[0, 4, 4.5].map((value) => (
          <FacetRadio
            key={value}
            active={filters.minRating === value}
            onClick={() => setFilters({ ...filters, minRating: value })}
            label={
              value === 0 ? (
                "Any rating"
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {value} and up
                </span>
              )
            }
            count={items.filter((item) => (item.rating ?? 0) >= value).length}
          />
        ))}
      </FacetGroup>

      {languages.length > 1 && (
        <FacetGroup title="Language">
          <FacetRadio
            active={filters.language === "all"}
            onClick={() => setFilters({ ...filters, language: "all" })}
            label="All languages"
            count={items.length}
          />
          {languages.map((language) => (
            <FacetRadio
              key={language}
              active={filters.language === language}
              onClick={() => setFilters({ ...filters, language })}
              label={language}
              count={items.filter((item) => item.language === language).length}
            />
          ))}
        </FacetGroup>
      )}
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FacetRadio({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors",
        active ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted",
      )}
    >
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">{count}</span>
    </button>
  );
}

function ActiveFilters({
  subject,
  filters,
  collections,
  onSubject,
  setFilters,
  onClear,
}: {
  subject: string;
  filters: Filters;
  collections: LibraryCollection[];
  onSubject: () => void;
  setFilters: (filters: Filters) => void;
  onClear: () => void;
}) {
  const chips: { label: string; remove: () => void }[] = [];
  if (subject !== "all") chips.push({ label: subject, remove: onSubject });
  filters.formats.forEach((format) =>
    chips.push({
      label: FORMAT_LABELS[format],
      remove: () => setFilters({ ...filters, formats: filters.formats.filter((entry) => entry !== format) }),
    }),
  );
  if (filters.collection !== "all") {
    chips.push({
      label: collections.find((collection) => collection.id === filters.collection)
        ? collectionLabel(collections.find((collection) => collection.id === filters.collection)!, collections)
        : "Collection",
      remove: () => setFilters({ ...filters, collection: "all" }),
    });
  }
  if (filters.language !== "all") chips.push({ label: filters.language, remove: () => setFilters({ ...filters, language: "all" }) });
  if (filters.minRating > 0) chips.push({ label: `${filters.minRating}★ and up`, remove: () => setFilters({ ...filters, minRating: 0 }) });
  if (filters.myCourses) chips.push({ label: "My course reserves", remove: () => setFilters({ ...filters, myCourses: false }) });

  if (chips.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium hover:border-primary/40"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="ml-1 text-xs font-medium text-primary hover:underline">
        Clear all
      </button>
    </div>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://img.icons8.com/scribby/96/search.png" alt="" className="mb-4 h-14 w-14" />
      <h3 className="text-lg font-semibold text-foreground">No titles match</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a shorter search, another subject, or remove a filter.
      </p>
      <Button variant="outline" className="mt-6" onClick={onClear}>
        Clear search and filters
      </Button>
    </div>
  );
}

/* ── Small controls ─────────────────────────────────────────────────────── */

function CategoryChip({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50",
      )}
    >
      {icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" className={cn("h-5 w-5", active && "brightness-0 invert")} />
      )}
      {label}
      <span className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{count}</span>
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn("rounded p-1.5 transition-colors", active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
    >
      {children}
    </button>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading the library">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      {[0, 1].map((row) => (
        <div key={row} className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] w-32 shrink-0 animate-pulse rounded-md bg-muted sm:w-36" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function itemInCollection(item: LibraryItem, collectionId: string, collections: LibraryCollection[]) {
  if (item.collectionId === collectionId) return true;
  return collections.some((collection) => collection.parentId === collectionId && collection.id === item.collectionId);
}
