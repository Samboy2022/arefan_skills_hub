# Instructor — Student Management — Feature Specification

> **Status: `PENDING`** — Improvement spec. Core pages exist but require significant UX uplift and feature completion.

---

## Overview

The **Student Management** module gives instructors a full command centre over every student enrolled in their courses. The current implementation has functional bones but several critical gaps:

| Page | Current State | Required Improvement |
|------|--------------|---------------------|
| `/instructor/students` | ✅ Good — table, filters, KPIs, export | Minor: replace `mailto:` with in-app message shortcut |
| `/instructor/students/[id]` | ❌ Skeleton — `"Student profile details go here."` | Full redesign — tabbed student detail hub |
| `/instructor/students/[id]/grades` | ✅ Good — transcript table per course | Minor: add grade trend mini-chart, back nav consistency |
| `/instructor/students/[id]/submissions` | ✅ Good — assignments + quizzes tabs | Minor: add "Grade Now" action, live attendance column |
| `/instructor/students/[id]/message` | ❌ Skeleton — single textarea form | Full redesign — threaded chat interface |

The objective of this spec is to:
1. **Transform `/instructor/students/[id]`** from a blank placeholder into a rich, tabbed Student Detail Hub.
2. **Upgrade the Message page** from a bare textarea into a proper in-app threaded conversation.
3. **Align all sub-pages** under a consistent breadcrumb + quick-nav tab strip so instructors never have to return to the list to switch contexts.
4. **Add a Quick Message button** in the main student list that opens the in-app chat instead of `mailto:`.

---

## URL Structure

| URL | Page | Current State |
|-----|------|--------------|
| `/instructor/students` | All Students list | ✅ Exists |
| `/instructor/students/[id]` | Student Detail Hub (tabbed) | ❌ Needs full build |
| `/instructor/students/[id]/grades` | Grades Transcript | ✅ Exists |
| `/instructor/students/[id]/submissions` | Submissions (Assignments + Quizzes) | ✅ Exists |
| `/instructor/students/[id]/message` | Direct Messaging (threaded) | ❌ Needs full build |

---

## Component Architecture

```
app/instructor/students/
├── page.tsx                          ← All Students list (improve: in-app message button)
└── [studentId]/
    ├── page.tsx                      ← Student Detail Hub — tabbed overview (FULL REBUILD)
    ├── grades/page.tsx               ← Grades Transcript (minor improvements)
    ├── submissions/page.tsx          ← Submissions — Assignments + Quizzes (minor improvements)
    └── message/page.tsx              ← Direct Messaging — threaded chat (FULL REBUILD)

components/instructor/students/
├── StudentHeroCard.tsx               ← Shared student identity card (avatar, name, ID, courses)
├── StudentTabStrip.tsx               ← Shared tab navigation across all sub-pages
├── StudentOverviewTab.tsx            ← Overview tab content
├── StudentGradesSummaryCard.tsx      ← Grade KPI mini card used on overview tab
├── MessageThread.tsx                 ← Threaded chat component
└── MessageComposer.tsx               ← Message input + send button
```

---

## Page Specifications

---

### 1. All Students (`/instructor/students`) — Minor Improvements

**What changes:**

#### Action Buttons — Replace `mailto:` with In-App Message

The current `Mail` icon button points to `mailto:${student.email}` which opens the user's OS email client. Replace this with a **Message** button that navigates to `/instructor/students/[id]/message`.

| Button | Icon | Current | Improved |
|--------|------|---------|---------|
| View Profile | `Eye` | `/instructor/students/[id]` | No change |
| **Message** | `MessageCircle` | `mailto:email` ❌ | `/instructor/students/[id]/message` ✅ |
| Submissions | `FileText` | `/instructor/students/[id]/submissions` | No change |
| Grades | `TrendingUp` | `/instructor/students/[id]/grades` | No change |

#### KPI Card — Add "At Risk" count

Add a 5th KPI card: **At Risk** = students with `avgGrade < 60`. Colour: Red (`border-red-100`, `text-red-600`, `bg-red-50`).

> The current 4-card grid becomes a responsive 5-card grid: `md:grid-cols-5`.

#### Table — Add "Performance" visual bar

In the `Avg Grade` column, replace the plain `N% (Letter)` text with:
```
[██████░░░░] 68%  C
```
A small `progress` bar (16px height, `w-24`, colour-coded) alongside the existing badge. Makes grade distribution scannable without opening each student.

#### Breadcrumb
`Dashboard › Students`

---

### 2. Student Detail Hub (`/instructor/students/[id]`) — FULL REBUILD

#### Purpose
A unified student profile page that replaces the current skeleton. It acts as the central hub from which an instructor can access all information about a single student without leaving the page. All four key actions (Overview, Grades, Submissions, Message) are surfaced as tabs.

#### Layout: Student Hero Card + Tab Strip + Tab Content

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard › Students › [Student Name]              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Avatar]  Alice Johnson                                 │   │
│  │            alice@example.com  ·  STU-2024-001           │   │
│  │            CS101  CS202  CS303  (enrolled course tags)   │   │
│  │                           [Active]  [Message]  [Export] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [ Overview ]  [ Grades ]  [ Submissions ]  [ Message ]         │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  (Tab content below)                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Student Hero Card (`<StudentHeroCard />`)

Shared across all sub-pages. Contains:

| Element | Detail |
|---------|--------|
| **Avatar** | Large initials avatar (`h-16 w-16`, gradient from violet → blue, 2-letter initials). If API provides a photo URL, render the image. |
| **Name** | Bold, `text-2xl` |
| **Email** | `text-sm text-muted-foreground` |
| **Student ID** | Monospace pill badge (`font-mono text-xs bg-muted`) |
| **Enrolled Courses** | Row of course code pills (`text-xs border rounded-md px-2`) |
| **Status badge** | `Active` (emerald) · `Pending` (amber) · `Inactive` (gray) |
| **Quick actions** | `Message` button → navigates to `/message` tab; `Export` dropdown (CSV / PDF) |

Background: subtle gradient `from-violet-500/10 via-blue-500/5 to-transparent` (matches existing submissions header pattern).

#### Tab Strip (`<StudentTabStrip />`)

A pill-style horizontal tab bar rendered below the Hero Card:

```
[ 🏠 Overview ]  [ 📊 Grades ]  [ 📁 Submissions ]  [ 💬 Message ]
```

- Active tab: `bg-background shadow-sm text-foreground`
- Inactive: `text-muted-foreground hover:text-foreground`
- Match the exact tab style already used in the Submissions page.

Each tab routes to its own URL segment **or** renders inline via URL query param (`?tab=grades`). Recommended: use URL segments (existing sub-pages) for deep-linkability and breadcrumb correctness.

---

#### Tab A — Overview

The default tab when visiting `/instructor/students/[id]`.

**Layout: 2-column grid (left 8 cols, right 4 cols)**

**Left column — Academic Summary**

- **Grade KPI row** (3 cards in a mini grid):

| Card | Value | Colour |
|------|-------|--------|
| Cumulative Grade | `N% (Letter)` | Emerald (A/B), Amber (C), Red (D/F) |
| Assignments Submitted | `N / N total` | Violet |
| Quizzes Passed | `N / N attempted` | Sky blue |

- **Course Progress table** — For each enrolled course, show:

| Column | Data |
|--------|------|
| Course | Code + title |
| Avg Grade | `N%` + letter badge |
| Assignments | `N submitted / N total` |
| Quizzes | `N passed / N attempted` |
| Trend | `↑` `↓` `→` indicator vs. last graded item |

- **Recent Graded Items** — Last 5 graded assignments or quiz attempts, sorted by date desc:
  - Icon (📄 assignment, 🧠 quiz)
  - Title + course code
  - Score: `N/N (N%)`
  - Date graded

**Right column — Student Info Card**

- Full name, email, Student ID
- Join date
- Last active date
- Status badge
- **Quick Actions:**
  - `View Grades →` (navigates to grades sub-page)
  - `View Submissions →` (navigates to submissions sub-page)
  - `Send Message →` (navigates to message sub-page)

---

#### Tab B — Grades

Renders the existing `/instructor/students/[id]/grades` page content **inline** as tab content (no page navigation). The full transcript table per course is preserved.

**Improvements to the existing grades page:**

1. **Grade Trend Chip** — next to the per-course final grade (`cAvg%`), add a small trend badge:
   - `↑ +5%` (emerald) if the student's last 3 graded items average higher than the course average.
   - `↓ -8%` (red) if trending down.
   - `→ Stable` (gray) otherwise.

2. **Average Score Bar** — Replace the raw `cAvg%` display with a colour-coded progress bar above the assignment table per course.

3. **Feedback Visibility** — The existing `Instructor notes: "…"` snippet is already shown in the table row — no change needed, but ensure it's prominent enough (currently italic, small — make it `text-sm` and non-italic).

---

#### Tab C — Submissions

Renders the existing `/instructor/students/[id]/submissions` page content inline. The Assignments + Quizzes tab structure, filter bar, and tables are preserved.

**Improvements to the existing submissions page:**

1. **"Grade Now" action button** — In the Assignments table, add a `Grade` icon button (`Pencil` icon, amber) in the Actions column for rows where `status === "submitted"` (awaiting grading). Navigates to `/instructor/assignments/[assignmentId]/grade?student=[studentId]`.

2. **"Late" badge enhancement** — The existing `Late` text is small orange text. Replace with a proper `<Badge>` component: `bg-orange-100 text-orange-700 border-transparent`.

3. **Live Classes Attendance column** — When the live-classes module is implemented, add a third tab: `🎥 Live Classes` showing the attendance records table (meeting name, date, time present, status) pulled from the student's attendance logs.

---

#### Tab D — Message

Full redesign. See Section 4 below for the complete specification.

---

#### Breadcrumb (Student Detail)
`Dashboard › Students › [Student Name]`

#### Breadcrumb (Sub-pages navigated directly)
`Dashboard › Students › [Student Name] › Grades`
`Dashboard › Students › [Student Name] › Submissions`
`Dashboard › Students › [Student Name] › Message`

---

### 3. Grades Transcript (`/instructor/students/[id]/grades`) — Minor Improvements

The existing page is well-built. Apply the three improvements described in Tab B above:
- Grade trend chip per course
- Colour-coded progress bar per course
- Feedback text size bump from `text-xs italic` → `text-sm`

Also: ensure the **Back to Students List** button at the top is consistent with other sub-pages (should be `← Back to [Student Name]`, not `← Back to Students List`, since the user came from the detail hub tab).

---

### 4. Direct Messaging (`/instructor/students/[id]/message`) — FULL REBUILD

#### Purpose
Replace the current bare `<Textarea>` form with a **threaded in-app conversation interface** — the same visual pattern used in the student-side messaging module. The instructor sees the full conversation history with this student and can compose and send new messages.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard › Students › Alice Johnson › Message     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [StudentHeroCard — compact single-line version]                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CONVERSATION THREAD (scrollable, ~60vh)                │   │
│  │                                                         │   │
│  │  [Date separator: Today]                                │   │
│  │                                                         │   │
│  │        ┌──────────────────────────────────┐            │   │
│  │        │ Alice Johnson         10:02 AM   │            │   │
│  │        │ "Can you clarify the assignment  │            │   │
│  │        │  deadline for Module 3?"         │            │   │
│  │        └──────────────────────────────────┘            │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────┐                  │   │
│  │  │ You (Instructor)      10:15 AM   │                  │   │
│  │  │ "The deadline is Friday at 11…"  │                  │   │
│  │  └──────────────────────────────────┘                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Message input — multi-line, auto-grows]                │   │
│  │                                          [Send →]       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Conversation Thread

- **Scroll container**: `overflow-y-auto`, height ~`60vh`, scrolls to bottom on new message.
- **Message bubble alignment**:
  - Student messages: left-aligned, `bg-muted rounded-2xl rounded-tl-none`.
  - Instructor messages: right-aligned, `bg-primary text-primary-foreground rounded-2xl rounded-tr-none`.
- **Message metadata**: sender name (bold) + timestamp (`HH:MM AM/PM`), displayed above the bubble.
- **Date separators**: gray centred text between days — `"Today"`, `"Yesterday"`, `"Apr 14, 2026"`.
- **Empty state**: If no messages, show centred icon + text: *"No messages yet. Start the conversation below."*
- **Read receipts** *(optional enhancement)*: Small `✓ Read` or `✓ Delivered` under instructor messages.

#### Message Composer (`<MessageComposer />`)

- **Textarea**: `min-h-[80px]`, auto-grows to `max-h-[200px]`. Placeholder: `"Type a message to Alice…"`.
- **Send button**: `Send` with `Send` icon. Disabled when textarea is empty.
- **Keyboard shortcut**: `Ctrl + Enter` / `Cmd + Enter` sends the message.
- **On send**: The new message is optimistically appended to the thread; API call fires in background.
- **Character limit**: 2000 chars. Show `N / 2000` counter when > 1800 chars.
- **Attachments** *(optional scope)*: Paperclip icon to attach files. Out of scope for v1 — reserve the icon placeholder.

#### Breadcrumb
`Dashboard › Students › [Student Name] › Message`

---

## UI / UX Design Specifications

### Design System Alignment
All pages must follow the established instructor design system:

| Token | Value |
|-------|-------|
| Max page width | `max-w-7xl` (list) / `max-w-6xl` (detail hub) |
| Page animation | `animate-in fade-in slide-in-from-bottom-4 duration-500` |
| Card | Shadcn/ui `rounded-xl border bg-card shadow-sm` |
| Table | Shadcn/ui `<Table>` with `bg-muted/40` header |
| Breadcrumb | Existing `<Breadcrumb>` component with `showHome={false}` |
| Page header | Existing `<PageHeader>` component |
| Buttons | Shadcn/ui `<Button>` — sizes: `sm` for action icons, `default` for primary CTAs |

### Colour Conventions (consistent across all sub-pages)

| Meaning | Colour family | Example usage |
|---------|--------------|--------------|
| Profile / Identity | Violet | Avatar bg, "View Profile" button |
| Grades / Academic | Amber | Grades tab icon, grade KPIs |
| Submissions | Violet / Purple | Submissions tab icon |
| Messages | Emerald | Message button, send button |
| Danger / At Risk | Red | Failing grade badge, "At Risk" KPI |
| Success / Passing | Emerald | Passed quiz, A grade, Active status |
| Warning / Late | Orange | Late submission badge |
| Neutral / Pending | Amber | Pending approval, awaiting grading |

### Avatar Pattern
All pages that show a student should use the same avatar component:
- `h-16 w-16 rounded-2xl` for hero cards.
- `h-9 w-9 rounded-full` for table rows.
- Background: `bg-gradient-to-br from-violet-500 to-blue-600`
- Content: 2-letter initials, `text-white font-bold`

### Tab Strip Pattern

Reuse the exact same tab component pattern from the Submissions page:

```tsx
<div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActive(tab.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active === tab.id
          ? "bg-background shadow-sm text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <tab.icon className="h-4 w-4" />
      {tab.label}
      {tab.count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
          active === tab.id ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}>
          {tab.count}
        </span>
      )}
    </button>
  ))}
</div>
```

### Micro-Animations
- All pages: `animate-in fade-in slide-in-from-bottom-4 duration-500` on mount.
- Tab switch: `animate-in fade-in duration-200` on new tab content.
- Message send: new bubble slides in from bottom with `translateY(8px) → 0, opacity 0 → 1`.
- Progress bars in grade columns: `transition-all duration-500 ease-out` on mount.

### Responsive Behaviour
- **List page**: Collapses to single-column at `sm`. Action buttons reduce to icon-only below `md`.
- **Detail hub**: Hero card stacks vertically below `md`. Tab strip becomes horizontally scrollable.
- **Submissions tables**: Horizontally scrollable (`overflow-x-auto`) below `md`.
- **Message thread**: Full-width on all breakpoints. Composer sticks to bottom.

---

## UX Rules — DOs / DON'Ts

### ✅ DO
- Always show the **Student Hero Card** on every sub-page so the instructor always knows which student they're looking at.
- Use **in-app navigation** (`/instructor/students/[id]/message`) for messaging — never `mailto:`.
- Keep the **Tab Strip visible** on the detail hub so the instructor can switch contexts without going back to the list.
- Use **colour-coded grade badges** consistently (A=emerald, B=blue, C=amber, D=orange, F=red).
- Show **"Grade Now" action** for assignments awaiting grading — make it a visible, prominent button.
- Show a **"No messages yet"** empty state in the message thread — not a blank white box.
- On the message page, **scroll to the latest message** automatically on mount.
- Use `Ctrl+Enter` to send messages in the composer.
- Show the **cumulative grade prominently** on the Overview tab — this is the first thing an instructor needs.

### ❌ DON'T
- Don't leave the student detail page (`/instructor/students/[id]`) as a skeleton — it is the first place an instructor lands after clicking "View Profile".
- Don't use `mailto:` for in-app student communication.
- Don't navigate away from the student context to switch between grades / submissions — use tabs.
- Don't use inline `style={}` for colours — always use Tailwind utility tokens.
- Don't show raw assignment IDs or database IDs — always resolve to human-readable titles.
- Don't show empty tables without an empty state illustration and helpful text.
- Don't reload the full page on tab switch — tabs should be client-side.
- Don't show a send button for an empty message — disable it with `disabled` attribute.

---

## Laravel API Contract

### Student Endpoints (Instructor-facing)

```
GET  /api/instructor/students                        → All students (paginated, filterable)
GET  /api/instructor/students/:id                    → Single student full profile
GET  /api/instructor/students/:id/grades             → All grade records (by course)
GET  /api/instructor/students/:id/submissions        → All assignment submissions + quiz attempts
GET  /api/instructor/students/:id/messages           → Conversation thread (paginated, latest first)
POST /api/instructor/students/:id/messages           → Send a new message to the student
GET  /api/instructor/students/:id/attendance         → Live class attendance records
```

---

### `GET /api/instructor/students/:id` — Response `200`

```json
{
  "id": "s-12",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "student_id": "STU-2024-001",
  "status": "active",
  "avatar_url": null,
  "join_date": "2024-09-01",
  "last_active": "2026-04-15T14:32:00Z",
  "enrolled_courses": [
    { "id": "c1", "code": "CS101", "title": "Introduction to Computer Science" },
    { "id": "c2", "code": "CS202", "title": "Data Structures" }
  ],
  "academic_summary": {
    "cumulative_avg": 82,
    "cumulative_letter": "B",
    "assignments_submitted": 12,
    "assignments_total": 15,
    "quizzes_passed": 4,
    "quizzes_attempted": 5
  }
}
```

---

### `GET /api/instructor/students/:id/messages` — Response `200`

```json
{
  "data": [
    {
      "id": "msg-1",
      "sender_id": "s-12",
      "sender_name": "Alice Johnson",
      "sender_role": "student",
      "body": "Can you clarify the Module 3 assignment deadline?",
      "sent_at": "2026-04-16T10:02:00Z",
      "read_at": "2026-04-16T10:15:00Z"
    },
    {
      "id": "msg-2",
      "sender_id": "t-3",
      "sender_name": "Jane Doe",
      "sender_role": "instructor",
      "body": "The deadline is Friday at 11:59 PM. Let me know if you need an extension.",
      "sent_at": "2026-04-16T10:15:00Z",
      "read_at": null
    }
  ],
  "meta": { "current_page": 1, "total": 12, "per_page": 50 }
}
```

---

### `POST /api/instructor/students/:id/messages` — Request Body

```json
{
  "body": "The deadline is Friday at 11:59 PM."
}
```

#### Response `201`
```json
{
  "id": "msg-3",
  "sender_id": "t-3",
  "sender_name": "Jane Doe",
  "sender_role": "instructor",
  "body": "The deadline is Friday at 11:59 PM.",
  "sent_at": "2026-04-16T10:20:00Z",
  "read_at": null
}
```

---

## Mock Data Strategy (Pre-API)

The existing `MOCK_STUDENTS`, `MOCK_GRADES`, `MOCK_ASSIGNMENTS`, and `MOCK_QUIZZES` from `lib/instructor-mock-data.ts` are sufficient for the list, grades, and submissions pages.

Add a new `MOCK_MESSAGES` array for the message thread:

```ts
// lib/instructor-mock-data.ts — append
export const MOCK_MESSAGES: Record<string, MessageThread[]> = {
  "s-12": [
    {
      id: "msg-1",
      senderId: "s-12",
      senderName: "Alice Johnson",
      senderRole: "student",
      body: "Hi, can you clarify the deadline for Module 3?",
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "msg-2",
      senderId: "t-3",
      senderName: "Jane Doe",
      senderRole: "instructor",
      body: "The deadline is Friday at midnight. Let me know if you need an extension.",
      sentAt: new Date(Date.now() - 1000 * 60 * 90), // 90 min ago
    },
  ],
};
```

---

## Summary of Gaps vs. Required State

| Feature | Current | Required |
|---------|---------|---------|
| Student detail page content | ❌ Empty placeholder | ✅ Tabbed hub with Overview, Grades, Submissions, Message |
| In-app messaging | ❌ `mailto:` link | ✅ Threaded chat with message history |
| Profile quick-actions | ❌ None | ✅ Message, Export, View Grades shortcuts |
| Grade trend indicators | ❌ Missing | ✅ `↑`/`↓` trend chips per course |
| "Grade Now" action | ❌ Missing | ✅ Amber button on ungraded submissions |
| "At Risk" KPI | ❌ Missing | ✅ 5th KPI card on list page |
| Attendance in submissions | ❌ Missing | ✅ 3rd tab (post live-classes implementation) |
| Shared hero card | ❌ Inconsistent across sub-pages | ✅ `<StudentHeroCard>` reused everywhere |
