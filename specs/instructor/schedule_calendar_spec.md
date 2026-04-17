# Instructor Schedule & Calendar — Feature Specification

## Overview
The Schedule & Calendar module is the central time and event management hub for instructors. It provides a Google Calendar–inspired interactive interface for creating, viewing, editing, and deleting academic events across multiple calendar views. All events are always relative to the current date, ensuring the calendar is never empty.

---

## URL Structure

| URL | Page |
|-----|------|
| `/instructor/schedule` | Main Calendar — Month, Week, Day views |
| `/instructor/schedule/create` | Create Event form |
| `/instructor/schedule/list` | Manage Events — standalone searchable list |
| `/instructor/schedule/[id]` | Event Detail — read-only view |
| `/instructor/schedule/[id]/edit` | Edit Event — pre-filled form |

---

## Component Architecture

```
app/instructor/schedule/
├── page.tsx              ← Main calendar (Month / Week / Day)
├── create/page.tsx       ← Create event form
├── list/page.tsx         ← Manage events standalone page
└── [id]/
    ├── page.tsx          ← Event detail
    └── edit/page.tsx     ← Edit event form
```

---

## Page Specifications

### 1. Main Calendar (`/instructor/schedule`)

#### Layout
- **Left/Main column:** Full calendar grid with navigation toolbar.
- **Right sidebar:** Upcoming events list (next 5 future events) with colour-coded dots and quick preview on click.

#### View Modes
| Mode | Description |
|------|-------------|
| **Month** | 7-column grid, full month. Up to 2 event pills per cell, `+N more` for overflow. |
| **Week** | 7-column time grid (7 AM–8 PM), 64px per hour. Red current-time indicator in today's column. |
| **Day** | Single column timeline (7 AM–9 PM), full-width event cards per hour slot. |

#### Event Pills / Blocks
- **Colour-coded** by event type (see legend below).
- **Truncated** with title and start time visible.
- **Clickable** — opens an Event Preview modal (popover).

#### Event Preview Modal
Triggered by clicking any event pill, block, or sidebar item. Contains:
- Event title, type badge, colour accent bar.
- Date, time range, location, virtual meeting link (if present).
- Description excerpt.
- Action buttons: **Details**, **Edit** (icon), **Delete** (destructive icon).
- Click outside or `×` to dismiss.

#### Empty Cell Interaction
- Clicking any empty day cell (Month view) or time slot (Week/Day view) navigates to `/instructor/schedule/create?date=YYYY-MM-DD`, pre-filling the date in the Create form.

#### Navigation Toolbar
- **‹ ›** arrows to navigate backward/forward by month/week/day.
- **Today** button to jump back to the current date.
- **View Switcher** (Month / Week / Day) as a pill-style toggle.

#### Event Type Legend
A row of colour-coded chips below the calendar explaining each type:
- 🔵 Lecture · 🔴 Exam · 🟡 Deadline · 🟣 Office Hours · 🟢 Meeting

#### Current-Time Indicator (Week View)
- A red horizontal line with a dot on the left, rendered inside today's column at the pixel position corresponding to the actual current time. Updates every 60 seconds.

---

### 2. Create Event (`/instructor/schedule/create`)
- Standard form with: Event Type (radio selector), Title, Date, Start Time, End Time, All-Day toggle, Location, Virtual Meeting URL, Description (rich text editor).
- On submit → redirect to `/instructor/schedule`.
- Breadcrumb: `Dashboard › Schedule & Calendar › New Event`.

---

### 3. Manage Events (`/instructor/schedule/list`)
- **Search bar** — filters events by title or type in real-time.
- **Type filter chips** — All / Lecture / Exam / Deadline / Office Hours / Meeting.
- **Event cards** — colour-coded dot icon, title, date/time, location, virtual badge.
- **Row actions:** View (Eye icon) → detail page · Edit (Pencil icon) → edit form · Delete (Trash icon) → confirmation dialog.
- Result count displayed: `Showing N of N events`.
- Breadcrumb: `Dashboard › Schedule & Calendar › Manage Events`.

---

### 4. Event Detail (`/instructor/schedule/[id]`)
- Read-only display of all event metadata:
  - Type badge, title, associated course.
  - Date and time range (formatted).
  - Physical location and/or virtual meeting link.
  - Description.
- **Edit** and **Delete** buttons in the page header.
- Delete triggers an `AlertDialog` confirmation before removing.
- Breadcrumb: `Dashboard › Schedule & Calendar › [Event Title]`.

---

### 5. Edit Event (`/instructor/schedule/[id]/edit`)
- Identical form structure to Create Event, pre-hydrated with existing data.
- On submit → redirect to Event Detail page.
- Breadcrumb: `Dashboard › Schedule & Calendar › [Event Title] › Edit`.

---

## Event Types & Colour System

| Type | Colour | Usage |
|------|--------|-------|
| `lecture` | Blue | Regular class sessions |
| `exam` | Red | Assessments and tests |
| `deadline` | Amber | Assignment or project due dates |
| `office-hours` | Purple | Instructor availability windows |
| `meeting` | Emerald | Faculty, group, or guest meetings |

---

## Mock Data Strategy
All schedule events are generated with **offsets from `new Date()`** (today), so the calendar is always populated regardless of when the app is loaded. For example:
- `_d(0, 10)` → today at 10 AM
- `_d(5, 14)` → 5 days from now at 2 PM
- `_d(-2, 10)` → 2 days ago at 10 AM

---

## UX Rules & DOs / DON'Ts

### ✅ DO
- Always show events relative to **today** — stale hardcoded dates are a UX failure.
- Use **colour-coded pills** that are readable at small sizes (truncate with `…`).
- Provide a **preview popover** on event click before opening a full page.
- Show a **real-time current-time indicator** in Week view.
- Clicking an empty cell should launch the **create flow** with the date pre-filled.
- Give `Manage Events` its own page with a real URL (not a toggled state).

### ❌ DON'T
- Don't use hardcoded `new Date("2024-...")` — always compute from today.
- Don't show more than 2–3 pills per cell in Month view — use `+N more`.
- Don't use native `alert()` or `confirm()` for delete — always use a styled `AlertDialog`.
- Don't allow two different `[slug]` names in the same route segment (Next.js router conflict).
- Don't render dead navigation — every button must either navigate or trigger a UI state change.
- Don't make the Week/Day views non-scrollable on small screens.

---

## Laravel API Integration Notes

When the Laravel backend is connected, replace mock data with API calls mapping to:

```
GET    /api/events?start=YYYY-MM-DD&end=YYYY-MM-DD   → Fetch events in date range
POST   /api/events                                     → Create event
GET    /api/events/:id                                 → Get single event
PATCH  /api/events/:id                                 → Update event
DELETE /api/events/:id                                 → Delete event
```

Isolate all fetching in `lib/hooks/use-events.ts` (React Query / SWR) so no page-level code changes when switching from mock to live data.
