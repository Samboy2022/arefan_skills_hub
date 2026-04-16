# Skill: Instructor Schedule & Calendar

> **Source spec:** `specs/instructor_schedule_calendar_spec.md`  
> **Codebase root:** `app/instructor/schedule/`  
> **Last audited:** 2026-04-16

---

## 1. Feature Overview

The Schedule & Calendar module is the time-and-event management hub for instructors. It provides a Google Calendar–inspired interactive interface for creating, viewing, editing, and deleting academic events across Month / Week / Day views. All events are **always relative to `new Date()`** so the calendar never appears empty regardless of when the app is loaded.

---

## 2. URL & File Map

| URL | File | Status |
|-----|------|--------|
| `/instructor/schedule` | `app/instructor/schedule/page.tsx` | ✅ Implemented |
| `/instructor/schedule/create` | `app/instructor/schedule/create/page.tsx` | ✅ Implemented |
| `/instructor/schedule/list` | `app/instructor/schedule/list/page.tsx` | ✅ Implemented |
| `/instructor/schedule/[id]` | `app/instructor/schedule/[id]/page.tsx` | ✅ Implemented |
| `/instructor/schedule/[id]/edit` | `app/instructor/schedule/[id]/edit/page.tsx` | ✅ Implemented |

> [!IMPORTANT]
> **Next.js router rule:** Never use two different `[slug]` names in the same route segment. The existing `[id]` segment is the canonical dynamic param. Always add nested routes *inside* `[id]/` not alongside it (e.g., `[id]/edit/page.tsx` ✅, not `[eventId]/page.tsx` alongside `[id]/page.tsx` ❌).

---

## 3. Data Layer

### 3.1 Types
Defined in `lib/instructor-types.ts`:

```ts
export interface ScheduleEvent {
  id: string;
  courseId: string;          // links to MOCK_INSTRUCTOR_COURSES
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: "lecture" | "exam" | "deadline" | "office-hours" | "meeting";
  location?: string;
  meetingLink?: string;
}
```

### 3.2 Mock Data
Defined in `lib/instructor-mock-data.ts` — **must always use offsets from today**:

```ts
// helper — always compute from today
const _today = new Date();
const _d = (offsetDays: number, hour: number, minute = 0) => {
  const dt = new Date(_today);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, minute, 0, 0);
  return dt;
};

export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  { id: "event-1", courseId: "course-1",  title: "...", type: "lecture",
    startTime: _d(0, 10), endTime: _d(0, 11, 30), ... },
  // _d(0, 10)  → today at 10 AM
  // _d(5, 14)  → 5 days from now at 2 PM
  // _d(-2, 10) → 2 days ago at 10 AM
];
```

> [!CAUTION]
> **NEVER** use hardcoded `new Date("2024-...")` dates in schedule mock data. This is a spec violation and creates a permanently empty calendar.

### 3.3 Future: API Hook Isolation
The spec requires all fetching to be isolated in `lib/hooks/use-events.ts` so pages need zero changes when switching from mock to live data. This hook **does not yet exist** — it is the primary work item needed before Laravel integration.

Planned API surface:
```
GET    /api/events?start=YYYY-MM-DD&end=YYYY-MM-DD   → Fetch events in date range
POST   /api/events                                     → Create event
GET    /api/events/:id                                 → Get single event
PATCH  /api/events/:id                                 → Update event
DELETE /api/events/:id                                 → Delete event
```

---

## 4. Shared Colour System

The `TYPE_STYLES` map is **duplicated** across four files today. When refactoring, extract to a shared constant:

```ts
// lib/schedule-constants.ts  (PROPOSED — does not exist yet)
export const TYPE_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  lecture:        { pill: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",        dot: "bg-blue-500",    label: "Lecture" },
  exam:           { pill: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",              dot: "bg-red-500",     label: "Exam" },
  deadline:       { pill: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",   dot: "bg-amber-500",   label: "Deadline" },
  "office-hours": { pill: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800", dot: "bg-purple-500", label: "Office Hours" },
  meeting:        { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", label: "Meeting" },
};
export function typeStyle(type: string) {
  return TYPE_STYLES[type] ?? TYPE_STYLES["lecture"];
}
```

Currently duplicated in:
- `app/instructor/schedule/page.tsx`
- `app/instructor/schedule/[id]/page.tsx`
- `app/instructor/schedule/list/page.tsx`

---

## 5. Page-by-Page Patterns

### 5.1 Main Calendar (`page.tsx`)

**Key state:**
```ts
const [events, setEvents] = useState<ScheduleEvent[]>(MOCK_SCHEDULE_EVENTS);
const [activeView, setActiveView] = useState<"month" | "week" | "day">("month");
const [currentDate, setCurrentDate] = useState(new Date());
const [deleteId, setDeleteId] = useState<string | null>(null);
const [previewEvent, setPreviewEvent] = useState<ScheduleEvent | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Live clock (updates current-time indicator every 60s):**
```ts
useEffect(() => {
  const interval = setInterval(() => setCurrentTime(new Date()), 60_000);
  return () => clearInterval(interval);
}, []);
```

**Navigation:**
```ts
const navigate = (dir: -1 | 1) => {
  if (activeView === "month") setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  if (activeView === "week")  setCurrentDate(addDays(currentDate, dir * 7));
  if (activeView === "day")   setCurrentDate(addDays(currentDate, dir));
};
```

**Empty cell → create flow:**
```ts
// Month cell click
router.push(`/instructor/schedule/create?date=${format(day, "yyyy-MM-dd")}`);
// Week/Day slot click (also passes hour)
const d2 = new Date(day); d2.setHours(hour, 0, 0, 0);
router.push(`/instructor/schedule/create?date=${format(d2, "yyyy-MM-dd")}`);
```

**View constants:**
- Month: `min-h-[110px]` cells, max 2 pills + `+N more` overflow
- Week: `CELL_H = 64` px/hour, hours 7–20 (7 AM–8 PM)
- Day: hours 7–21 (7 AM–9 PM), `min-h-[72px]` rows

**Current-time indicator (Week view only):**
```tsx
const nowPct = (currentTime.getHours() - 7 + currentTime.getMinutes() / 60) * CELL_H;
// Red line positioned at todayIdx column, top: nowPct px
<div className="absolute z-20 flex items-center pointer-events-none"
     style={{ top: `${nowPct}px`, left: `calc(60px + ${todayIdx} * (100% - 60px) / 7)`, width: `calc((100% - 60px) / 7)` }}>
  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
  <div className="h-px flex-1 bg-red-500" />
</div>
```

**Event Preview Modal (`EventPreview` component):**
- Fixed overlay, `backdrop-blur-sm`, click-outside to dismiss
- Contains: colour accent bar, type Badge, title, time/location/link, description
- Action buttons: Details → `/instructor/schedule/${event.id}`, Edit icon → `/${id}/edit`, Delete icon → sets `deleteId` → opens `AlertDialog`

**Sidebar (upcoming events):**
```ts
const upcoming = [...events]
  .filter(e => new Date(e.startTime) >= new Date())
  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  .slice(0, 5);
```

**Delete pattern (in-memory only, no API yet):**
```ts
const confirmDelete = () => {
  if (deleteId) { setEvents(prev => prev.filter(e => e.id !== deleteId)); setDeleteId(null); }
};
```

---

### 5.2 Create Event (`create/page.tsx`)

**Form state:**
```ts
const [eventType, setEventType] = useState("course"); // "personal" | "course" | "group"
const [title, setTitle] = useState("");
const [startDate, setStartDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endDate, setEndDate] = useState("");
const [endTime, setEndTime] = useState("");
const [isAllDay, setIsAllDay] = useState(false);
const [location, setLocation] = useState("");
const [meetingUrl, setMeetingUrl] = useState("");
const [description, setDescription] = useState(""); // rich-text via ForumRichEditor
```

> [!NOTE]
> The Create form uses a **3-category radio** (Personal / Course / Group) — this is distinct from the 5 `ScheduleEvent.type` values (lecture/exam/deadline/office-hours/meeting). The spec's "Event Type" radio is for *audience scoping*, not the colour-coded type. Keep these two concepts separate.

**Validation:**
```ts
if (!title || !startDate || (!isAllDay && !startTime) || (!isAllDay && !endTime)) {
  toast.error("Please fill in all required fields.");
  return;
}
```

**Submit → redirect to calendar:**
```ts
setTimeout(() => {
  toast.success("Event successfully created!");
  router.push("/instructor/schedule");
}, 600);
```

**`?date=` query param pre-fill** (not yet wired in the create page — a known gap; implement with `useSearchParams`):
```ts
// Add to CreateEventPage
const searchParams = useSearchParams();
const dateParam = searchParams.get("date");
useEffect(() => { if (dateParam) setStartDate(dateParam); }, [dateParam]);
```

**Breadcrumb:** `Dashboard › Schedule & Calendar › New Event`

**Rich editor:** `ForumRichEditor` from `@/components/student/discussions/ForumRichEditor`

---

### 5.3 Manage Events (`list/page.tsx`)

**Filter state:**
```ts
const ALL_TYPES = ["all", "lecture", "exam", "deadline", "office-hours", "meeting"] as const;
type FilterType = typeof ALL_TYPES[number];
const [search, setSearch] = useState("");
const [filterType, setFilterType] = useState<FilterType>("all");
```

**Filtered & sorted list:**
```ts
const filtered = [...events]
  .filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || e.type === filterType;
    return matchSearch && matchType;
  })
  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
```

**Row actions:** Eye → `/instructor/schedule/${id}` · Pencil → `/${id}/edit` · Trash → opens `AlertDialog`

**Result count:** `Showing {filtered.length} of {events.length} events`

**Breadcrumb:** `Dashboard › Schedule & Calendar › Manage Events`

---

### 5.4 Event Detail (`[id]/page.tsx`)

```tsx
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Next.js 15 async params unwrap
  const event = MOCK_SCHEDULE_EVENTS.find(e => e.id === id);
  const course = event ? MOCK_INSTRUCTOR_COURSES.find(c => c.id === event.courseId) : null;
```

**Not-found state:** renders a centered empty state with back-to-calendar button.

**Delete:** uses `AlertDialog`, on confirm calls `router.push("/instructor/schedule")` (mock — no real deletion).

**Breadcrumb:** `Dashboard › Schedule & Calendar › {event.title}`

---

### 5.5 Edit Event (`[id]/edit/page.tsx`)

**Hydration from mock data:**
```ts
useEffect(() => {
  if (event) {
    setTitle(event.title);
    setStartDate(format(new Date(event.startTime), "yyyy-MM-dd"));
    setStartTime(format(new Date(event.startTime), "HH:mm"));
    setEndDate(format(new Date(event.endTime),   "yyyy-MM-dd"));
    setEndTime(format(new Date(event.endTime),   "HH:mm"));
    setLocation(event.location   || "");
    setMeetingUrl(event.meetingLink || "");
    setDescription(event.description || "");
  }
}, [event]);
```

**On submit:** `toast.success("Event successfully updated!")` → `router.push("/instructor/schedule")`

> [!NOTE]
> The spec says edit should redirect to the **Event Detail page** (`/instructor/schedule/${id}`), but the current implementation redirects to the calendar root. Fix: `router.push(\`/instructor/schedule/${id}\`)`.

**Breadcrumb:** `Dashboard › Schedule & Calendar › {event.title} › Edit`  
(current code says "Edit Event" — should include the event title per spec)

---

## 6. Shared UI Components Used

| Component | Import Path |
|-----------|-------------|
| `PageHeader` | `@/components/instructor/page-header` |
| `Breadcrumb` | `@/components/ui/breadcrumb` |
| `Button` | `@/components/ui/button` |
| `Card` | `@/components/ui/card` |
| `Badge` | `@/components/ui/badge` |
| `Input` | `@/components/ui/input` |
| `Label` | `@/components/ui/label` |
| `Switch` | `@/components/ui/switch` |
| `RadioGroup` / `RadioGroupItem` | `@/components/ui/radio-group` |
| `AlertDialog` (+ sub-components) | `@/components/ui/alert-dialog` |
| `ForumRichEditor` | `@/components/student/discussions/ForumRichEditor` |
| `toast` | `sonner` |

---

## 7. Implementation Status vs. Spec

### ✅ Fully Implemented
- Month / Week / Day calendar views with navigation toolbar
- Colour-coded event pills in all three views
- `+N more` overflow in Month view (max 2 pills per cell)
- Event Preview Modal (popover) with Details / Edit / Delete actions
- Click empty cell → `/create?date=...`
- Today button + ‹ › navigation
- View switcher pill toggle (Month/Week/Day)
- Event Type Legend row
- Current-time red indicator in Week view (updates every 60s)
- Right sidebar: next 5 upcoming events with colour dots
- Manage Events page (`/list`) with search + type filter chips + CRUD row actions
- Event Detail page (`/[id]`) — read-only with Edit/Delete buttons
- Edit Event page (`/[id]/edit`) — pre-hydrated form
- Create Event page (`/create`) — full form with rich text
- AlertDialog for all delete confirmations (no native `alert()`)
- Breadcrumbs on all pages
- Async params unwrap (`React.use(params)`) for Next.js 15

### ⚠️ Known Gaps vs. Spec

| Gap | File(s) | Fix |
|-----|---------|-----|
| `?date=` query param **not read** in Create form | `create/page.tsx` | Add `useSearchParams()` + pre-fill `startDate` |
| Edit page redirects to **calendar root**, not detail page | `[id]/edit/page.tsx` | Change `router.push("/instructor/schedule")` to `router.push(\`/instructor/schedule/${id}\`)` |
| Edit breadcrumb says "Edit Event" not `[Event Title] › Edit` | `[id]/edit/page.tsx` | Replace label with `event.title` |
| `TYPE_STYLES` duplicated across 3 files | multiple | Extract to `lib/schedule-constants.ts` |
| `lib/hooks/use-events.ts` **missing** | `lib/hooks/` | Create hook to isolate fetching (needed for Laravel) |
| Create form event-type radio uses **audience** categories (Personal/Course/Group), not the 5 ScheduleEvent types | `create/page.tsx` | Spec's radio is audience-scoping — this is intentional, but the mapping to `ScheduleEvent.type` on save is unimplemented |

---

## 8. UX Rules (from Spec)

### ✅ DO
- Always show events relative to **today** — stale hardcoded dates are a UX failure.
- Use **colour-coded pills** that are readable at small sizes (truncate with `…`).
- Provide a **preview popover** on event click before opening a full page.
- Show a **real-time current-time indicator** in Week view.
- Clicking an empty cell should launch the **create flow** with the date pre-filled.
- Give Manage Events its own page with a real URL.
- Use Next.js `React.use(params)` for async dynamic params.

### ❌ DON'T
- Don't use hardcoded `new Date("2024-...")` — always use `_d()` helper.
- Don't show more than 2 pills per cell in Month view — use `+N more`.
- Don't use native `alert()` / `confirm()` — always use `AlertDialog`.
- Don't use two different `[slug]` names in the same route segment.
- Don't render dead navigation — every button must navigate or trigger a UI state change.
- Don't make Week/Day views non-scrollable on small screens (use `overflow-x-auto`).

---

## 9. Adding a New Event Type

1. Add to the type union in `lib/instructor-types.ts`:
   ```ts
   type: "lecture" | "exam" | "deadline" | "office-hours" | "meeting" | "NEW_TYPE";
   ```
2. Add to `TYPE_STYLES` in all affected pages (or the planned `lib/schedule-constants.ts`).
3. Add to `ALL_TYPES` in `list/page.tsx`.
4. Add a mock event using `_d()` in `lib/instructor-mock-data.ts`.

---

## 10. Adding a New Sub-Page

Per the file structure rule, always add inside `app/instructor/schedule/`:
```
app/instructor/schedule/
├── page.tsx
├── create/page.tsx
├── list/page.tsx
└── [id]/
    ├── page.tsx
    └── edit/page.tsx
    └── NEW_SUBPAGE/page.tsx   ← put new [id]-specific sub-pages here
```

Any new top-level page (not id-scoped): place directly under `app/instructor/schedule/NEW/page.tsx`.

---

## 11. Laravel API Integration Checklist

When connecting the real backend:

- [ ] Create `lib/hooks/use-events.ts` (React Query / SWR)
- [ ] Replace `useState(MOCK_SCHEDULE_EVENTS)` with the hook's data
- [ ] Map `GET /api/events?start=&end=` in the main calendar for range fetching
- [ ] Map `POST /api/events` in create form
- [ ] Map `GET /api/events/:id` in detail page
- [ ] Map `PATCH /api/events/:id` in edit form (with optimistic update)
- [ ] Map `DELETE /api/events/:id` in AlertDialog confirm handler
- [ ] Handle loading/error states per page (skeleton or spinner)
- [ ] No page-level logic should need to change — only the hook's internals

---

## 12. Key Imports Reference

```ts
// date-fns utilities used across the feature
import {
  format, addDays, addMonths, subMonths,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isSameMonth,
  differenceInMinutes
} from "date-fns";

// Lucide icons used
import {
  Plus, Calendar, CalendarDays, CalendarRange, List,
  MapPin, Clock, Video, Search, ChevronLeft, ChevronRight,
  Edit, Trash2, Filter, X, ExternalLink, BookOpen,
  ArrowLeft, Pencil, Eye
} from "lucide-react";

// Data
import { MOCK_SCHEDULE_EVENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { ScheduleEvent } from "@/lib/instructor-types";
```
