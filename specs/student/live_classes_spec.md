# Student — Live Classes — Feature Specification

> **Status: `PENDING`** — Implementation not yet started. Spec is complete and ready for development.

---

## Overview

The **Student Live Classes** module gives enrolled students a single place to:

1. **See all upcoming and past live classes** they have been invited to.
2. **Join a live session directly inside the app** — the Zoom Meeting SDK is embedded in-page; students never leave the platform.
3. **Have their attendance automatically tracked** — the system measures how long the student is present inside the meeting relative to the instructor-defined meeting duration. Once the student has been present for **≥ 80 % of the scheduled duration**, their attendance is marked **Present** and a visual confirmation indicator is shown.

> **Key design principle:** The student is always informed about their attendance status in real time during the session. The attendance bar is always visible inside the meeting page so the student knows whether they have met the threshold yet.

---

## URL Structure

| URL | Page |
|-----|------|
| `/student/live-classes` | My Live Classes — list of all meetings the student is invited to |
| `/student/live-classes/[id]` | Meeting Detail — read-only info + join button |
| `/student/live-classes/[id]/join` | Meeting Room — Zoom SDK embedded + attendance tracker |

---

## Component Architecture

```
app/student/live-classes/
├── page.tsx               ← My Live Classes list (data table)
└── [id]/
    ├── page.tsx           ← Meeting Detail (read-only)
    └── join/page.tsx      ← Meeting Room (Zoom SDK + attendance tracker)

lib/hooks/
└── use-student-meetings.ts   ← Data hook (SWR / React Query)

components/student/live-classes/
├── AttendanceTracker.tsx      ← Attendance progress bar + status widget
├── MeetingRoomPage.tsx        ← Zoom SDK wrapper + tracker orchestration
└── SessionEndedScreen.tsx     ← Post-meeting confirmation screen
```

---

## Sidebar Navigation Update

The `STUDENT_NAV_ITEMS` in `lib/student-constants.ts` must receive a new entry in the **"Learning"** section:

```ts
{
  label: "Live Classes",
  href: "/student/live-classes",
  icon: Video,                  // lucide-react Video icon
  tooltip: "Join Live Sessions",
}
```

Badge behaviour:  
- Show a **red numeric badge** on the sidebar icon when there is ≥ 1 meeting with `status === "upcoming"` with a `start_time` within the next 60 minutes.

---

## Page Specifications

### 1. My Live Classes (`/student/live-classes`)

#### Purpose
Central hub where a student sees every live class they are invited to — upcoming, live right now, and past sessions — in a clean data table.

#### Layout

- **Page Header** (using existing `<PageHeader />` component):
  - Title: `Live Classes`
  - Description: `Your scheduled and past live sessions with instructors.`
  - No CTA button — students cannot create meetings.

- **KPI Summary Row** (matches dashboard stat card pattern):

| Card | Value | Accent colour |
|------|-------|--------------|
| **Upcoming Sessions** | Count of meetings with `status === "upcoming"` | Sky blue (`border-sky-200`) |
| **Attended** | Count of meetings where attendance ≥ 80 % | Emerald (`border-emerald-200`) |
| **Missed** | Count of ended meetings where student was absent or < 80 % | Red (`border-red-200`) |
| **Total Sessions** | Total invited meetings | Amber (`border-amber-200`) |

- **Filter Tabs** (pill-style, below KPI row):
  - `All` · `Upcoming` · `Live Now` · `Ended`
  - Default: `All`.

- **Data Table:**

| Column | Description |
|--------|-------------|
| **Session Name** | Meeting name (links to `/student/live-classes/[id]`) |
| **Instructor** | Creator name (tutor who scheduled the meeting) |
| **Date & Time** | `MMM DD, YYYY · HH:MM AM/PM` |
| **Duration** | Instructor-set duration (e.g., `60 min`) |
| **Status** | `Upcoming` (blue) · `Live` (green pulsing) · `Ended` (gray) |
| **Attendance** | Badge: `Present ✓` (emerald) · `Absent ✗` (red) · `—` (gray, not yet started) |
| **Action** | Context-aware button (see below) |

#### Action Button Logic (per row)

| Condition | Button Label | Behaviour |
|-----------|-------------|-----------|
| `status === "upcoming"` and `start_time > now + 15min` | `View Details` | Navigates to `/student/live-classes/[id]` |
| `status === "upcoming"` and `start_time` within 15 min | `Join Now` (pulsing green) | Navigates to `/student/live-classes/[id]/join` |
| `status === "live"` | `Join Now` (pulsing green) | Navigates to `/student/live-classes/[id]/join` |
| `status === "ended"` | `View Summary` | Navigates to `/student/live-classes/[id]` |

#### Empty State
If the student has no invited meetings:
> *"No live classes scheduled yet. Your instructor will notify you when a session is created."*

#### Breadcrumb
`Dashboard › Live Classes`

---

### 2. Meeting Detail (`/student/live-classes/[id]`)

#### Purpose
Read-only pre-meeting information card. Students can review details and join from here.

#### Content Sections

- **Header bar:**
  - Meeting name (bold, large).
  - Status badge.
  - `Join Now` button — only enabled when `status === "live"` or within 15 minutes of `start_time`.
  - Disabled state: `"Class starts in X minutes"` as a tooltip when too early.

- **Details card** (two-column grid on desktop, stacked on mobile):
  | Field | Value |
  |-------|-------|
  | Instructor | Creator name + avatar |
  | Scheduled Date | Formatted date |
  | Start Time | `HH:MM AM/PM` |
  | Duration | `N minutes` |
  | Status | Badge |
  | Attendance Requirement | `80 % of session duration to be marked Present` |
  | Your Attendance | `Present ✓` · `Absent ✗` · `Pending —` |

- **Description block:** Full meeting description.

- **Attendance Policy Notice** (amber info banner):
  > ℹ️ *You must be present in the session for at least **[0.8 × duration] minutes** to be recorded as present. The app will track this automatically.*

#### Breadcrumb
`Dashboard › Live Classes › [Meeting Name]`

---

### 3. Meeting Room (`/student/live-classes/[id]/join`)

#### Purpose
The most important page in this feature. It embeds the full Zoom session inside the app AND runs the attendance tracker simultaneously. The student never opens Zoom externally.

#### Full Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard › Live Classes › [Meeting Name] › Live    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────┐   ┌──────────────────────┐ │
│  │                                 │   │  ATTENDANCE TRACKER  │ │
│  │                                 │   │  ──────────────────  │ │
│  │     Zoom SDK Embedded View      │   │  ⏱ Time in session   │ │
│  │     (full Zoom meeting UI)      │   │  [████████░░] 68%    │ │
│  │     (~80% page width)           │   │                      │ │
│  │                                 │   │  Need: 48 min / 60   │ │
│  │                                 │   │  Present: 32 min     │ │
│  │                                 │   │                      │ │
│  │                                 │   │  Status: Counting…   │ │
│  │                                 │   │  [PRESENT ✓ badge    │ │
│  │                                 │   │   appears at 80%]    │ │
│  └─────────────────────────────────┘   └──────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

On **mobile** (`< md` breakpoint): The attendance tracker collapses to a fixed bottom bar (see Mobile section below).

---

#### Phase 1 — Pre-Join Loading State

While the signature is being fetched from Laravel and the Zoom SDK is initialising:

- Centred animated spinner (platform brand colour).
- Text: `"Connecting to your live class…"`
- Meeting name and scheduled time shown above spinner.
- Sub-text: `"Your attendance will be tracked automatically once you join."`

---

#### Phase 2 — Active Meeting + Attendance Tracker

Once the student joins the meeting, two things happen simultaneously:

**A) Zoom SDK renders** in the left panel (full meeting UI — video, audio, chat, screen share, whiteboard, polling).

**B) Attendance Tracker Widget** renders in the right sidebar:

| Element | Detail |
|---------|--------|
| **Timer label** | `"Time in session"` |
| **Elapsed time** | `MM:SS` counter — ticks every second from join time |
| **Progress bar** | Animated horizontal bar, fills from 0 → 100 % as `elapsed / (duration × 0.8)` |
| **Progress % label** | `"68 % of required time"` |
| **Threshold info** | `"You need X min to be marked Present"` |
| **Status label** | `"Counting your attendance…"` (gray) → `"Present ✓"` (emerald, animated pulse) once threshold met |
| **Meeting duration** | `"Session length: 60 min"` (set by instructor) |
| **Threshold time** | `"Attendance threshold: 48 min (80 %)"` |

**Progress Bar Colour States:**

| % Complete | Bar Colour |
|------------|-----------|
| 0–49 % | Red / rose |
| 50–79 % | Amber / orange |
| 80–100 % (threshold met) | Emerald green (pulsing glow) |

**When threshold is reached (≥ 80 %):**
- The progress bar fills to green and stops growing.
- A large `✓ Attendance Recorded — Present` animated badge appears in the tracker.
- A **toast notification** slides in from the top-right: `"🎉 Attendance recorded! You've met the required time for this session."`
- The tracker label changes to `"Attendance confirmed. You may leave the session."`.
- The backend is immediately notified via `POST /api/attendance` (see API section).

---

#### Phase 3 — Session Ended Screen

Triggered by the Zoom SDK `onMeetingEnd` event OR the student clicking "Leave":

- The Zoom container is replaced by the **Session Ended Screen** (`<SessionEndedScreen />`):

```
┌────────────────────────────────────────┐
│  ✓  Session Ended                      │
│                                        │
│  Meeting: Introduction to React Hooks  │
│  Duration attended: 52 min             │
│  Attendance: ✓ Present (87 %)          │
│                                        │
│  [← Back to Live Classes]              │
└────────────────────────────────────────┘
```

If the student left **before** the 80 % threshold:
```
│  Attendance: ✗ Absent (42 %)   │
│  You did not meet the 80 %     │
│  attendance requirement.       │
```

---

#### Mobile Layout (< `md` breakpoint)

On small screens the Zoom SDK takes the full screen width.  
The attendance tracker collapses to a **sticky bottom bar**:

```
┌───────────────────────────────────────┐
│ ⏱ 32:14  [████████░░] 68%  Counting… │  ← fixed bottom bar
└───────────────────────────────────────┘
```

Tapping the bar expands a bottom drawer showing full tracker details.

---

## Attendance Calculation Logic

```
threshold_minutes = meeting.duration × 0.80
elapsed_ms        = Date.now() - joinTimestamp
elapsed_minutes   = elapsed_ms / 60_000
progress_pct      = Math.min((elapsed_minutes / threshold_minutes) × 100, 100)
is_present        = elapsed_minutes >= threshold_minutes
```

The client-side timer ticks every second using `setInterval`. The backend is only called **once** — when `is_present` first becomes `true` (the 80 % threshold is crossed for the first time). It is **not** called again if the student stays longer.

If the student disconnects and reconnects:
- The frontend resumes the timer from `joinTimestamp` (stored in session/localStorage keyed to `meetingId + userId`).
- Laravel tracks cumulative presence via the `attendance_logs` table on reconnect.

---

## UX Rules — DOs / DON'Ts

### ✅ DO
- **Always show the attendance tracker** the moment the student joins — never hide it.
- Show **progress in real time** (every second tick, progress bar animates smoothly).
- Send the attendance POST request **exactly once** when the 80 % mark is first crossed — debounce to prevent double submission.
- Show a **toast + visual badge** the moment attendance is confirmed so the student has clear reassurance.
- Resume the timer from the correct `joinTimestamp` if the student refreshes the page mid-session.
- Show the **Session Ended screen** with the final attendance summary — never just redirect without showing the result.
- On mobile, collapse the tracker to a **fixed bottom bar** — never let it cover the video.
- Display the **attendance requirement** (80 %) clearly before the student joins (on Meeting Detail page).

### ❌ DON'T
- Don't redirect to zoom.us — the meeting must be fully embedded inside the page.
- Don't hide or remove the tracker during the meeting — students must always be able to see it.
- Don't call `POST /api/attendance` more than once per meeting session per student.
- Don't show `Present ✓` before the actual 80 % threshold is crossed — even by 1 second.
- Don't block the Zoom video with the tracker on small screens.
- Don't let the timer continue counting after the student leaves the session (unmount cleanup).
- Don't allow a student to manually override their attendance status.

---

## Laravel API Contract

### Student Meetings Endpoints

```
GET  /api/student/meetings                  → Fetch all meetings the logged-in student is invited to
GET  /api/student/meetings/:id              → Get single meeting detail (includes attendance record)
POST /api/student/meetings/:id/signature    → Generate Zoom SDK JWT signature (role = 0, participant)
POST /api/attendance                        → Record attendance when 80 % threshold is met
GET  /api/student/meetings/:id/attendance   → Get the student's attendance record for a specific meeting
```

---

### `GET /api/student/meetings` — Response `200`

```json
{
  "data": [
    {
      "id": 7,
      "name": "Introduction to React Hooks",
      "description": "A hands-on session covering useState, useEffect, and custom hooks.",
      "creator": { "id": 3, "name": "Jane Doe", "avatar_url": "https://..." },
      "start_time": "2026-05-10T10:00:00Z",
      "duration": 60,
      "status": "upcoming",
      "zoom": {
        "meeting_id": "84123456789",
        "password": "sec123"
      },
      "attendance": {
        "status": "pending",
        "minutes_present": 0,
        "percentage": 0,
        "threshold_minutes": 48
      }
    }
  ],
  "meta": { "current_page": 1, "total": 5, "per_page": 15 }
}
```

---

### `POST /api/attendance` — Request Body

Called **once** when the client-side timer confirms ≥ 80 % elapsed:

```json
{
  "meeting_id": 7,
  "joined_at": "2026-05-10T10:02:34Z",
  "left_at":   "2026-05-10T10:52:10Z",
  "minutes_present": 49,
  "percentage": 82,
  "status": "present"
}
```

#### Response `201`
```json
{
  "id": 101,
  "meeting_id": 7,
  "student_id": 22,
  "status": "present",
  "minutes_present": 49,
  "percentage": 82,
  "recorded_at": "2026-05-10T10:52:10Z"
}
```

---

### `POST /api/student/meetings/:id/signature` — Request Body
```json
{ "role": 0 }
```

`role 0` = participant (students are always participants, never hosts).

#### Response `200`
```json
{
  "signature":      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sdk_key":        "your_zoom_sdk_key",
  "meeting_number": "84123456789",
  "password":       "sec123"
}
```

---

### `attendance_logs` DB Table (Laravel)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `meeting_id` | FK → meetings | |
| `student_id` | FK → users | |
| `joined_at` | timestamp | When student clicked Join |
| `left_at` | timestamp | When student left / session ended |
| `minutes_present` | integer | Client-reported elapsed minutes |
| `percentage` | integer | `(minutes_present / duration) × 100` |
| `status` | enum: `present`, `absent`, `partial` | `present` if ≥ 80 %, `partial` if 50–79 %, `absent` if < 50 % |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

## Zoom Web SDK — Student Integration Notes

> Students always join as **participants** (`role = 0`). The SDK Secret never reaches the browser.

### Frontend SDK Lifecycle (Meeting Room Page)

```ts
import ZoomMtg from '@zoom/meetingsdk';

// 1. Pre-load assets
ZoomMtg.setZoomJSLib('https://source.zoom.us/3.9.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// 2. On mount — fetch signature from Laravel
const { signature, sdk_key, meeting_number, password } =
  await fetch(`/api/student/meetings/${id}/signature`, {
    method: 'POST',
    body: JSON.stringify({ role: 0 }),
  }).then(r => r.json());

// 3. Record join time for attendance tracking
const joinTimestamp = Date.now();
localStorage.setItem(`join_${id}_${currentUser.id}`, String(joinTimestamp));

// 4. Init + Join
ZoomMtg.init({
  leaveUrl: `/student/live-classes/${id}`,
  patchJsMedia: true,
  success: () => {
    ZoomMtg.join({
      signature,
      sdkKey: sdk_key,
      meetingNumber: meeting_number,
      userName: currentUser.name,
      userEmail: currentUser.email,
      passWord: password,
      success: () => startAttendanceTimer(joinTimestamp, meeting.duration),
      error: (e) => console.error('Zoom join error:', e),
    });
  },
});

// 5. Cleanup on unmount
return () => {
  clearInterval(attendanceTimerRef.current);
  ZoomMtg.leaveMeeting({});
};
```

### Attendance Timer Hook (`useAttendanceTimer`)

```ts
// components/student/live-classes/useAttendanceTimer.ts
export function useAttendanceTimer(joinTimestamp: number, durationMinutes: number) {
  const thresholdMs   = durationMinutes * 0.8 * 60_000;
  const [elapsedMs, setElapsedMs]         = useState(0);
  const [thresholdMet, setThresholdMet]   = useState(false);
  const reportedRef                        = useRef(false);  // prevent double POST

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - joinTimestamp;
      setElapsedMs(elapsed);

      if (elapsed >= thresholdMs && !reportedRef.current) {
        reportedRef.current = true;
        setThresholdMet(true);
        reportAttendance(elapsed); // POST /api/attendance
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [joinTimestamp, thresholdMs]);

  const progressPct = Math.min((elapsedMs / thresholdMs) * 100, 100);
  return { elapsedMs, progressPct, thresholdMet };
}
```

---

## UI / UX Design — Alignment with Student Dashboard

The Live Classes pages **must feel native** to the student dashboard. Follow these established patterns:

### Design Tokens

| Token | Value |
|-------|-------|
| Primary font | Same as platform (Inter / Outfit) |
| Card component | Shadcn/ui `<Card>` with `p-4`, `hover:shadow-md`, `transition-shadow` |
| Page header | `<PageHeader title="..." description="..." />` (existing component) |
| Table | Shadcn/ui `<Table>` with `<TableHeader>`, `<TableBody>`, `<TableRow>` |
| KPI stat cards | Same grid as student dashboard: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` |
| Present badge | Emerald (`border-emerald-200 dark:border-emerald-900`) — same as "Active Courses" card |
| Absent badge | Red (`border-red-200 dark:border-red-900`) — same as "Announcements" card |
| Upcoming badge | Sky blue (`border-sky-200 dark:border-sky-900`) |
| Icon watermark | Large icon at `-right-3 -bottom-3 opacity-30` (same pattern as dashboard KPI cards) |

### Attendance Progress Bar

- Height: `h-3`, `rounded-full`.
- Background track: `bg-muted`.
- Fill: red → amber → emerald based on threshold % (see table above).
- Animated fill: `transition-all duration-500 ease-out` on width update.
- When threshold is met: add `animate-pulse` class for 3 seconds then remove.

### Status Badges

| Badge | CSS |
|-------|-----|
| `Upcoming` | `bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400` |
| `Live` | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30` + pulsing dot |
| `Ended` | `bg-muted text-muted-foreground` |
| `Present ✓` | `bg-emerald-100 text-emerald-700` |
| `Absent ✗` | `bg-red-100 text-red-700` |
| `Counting…` | `bg-amber-100 text-amber-700` + spinner dot |

### Micro-Animations

- Table rows: staggered fade-in on first mount.
- `Live Now` action button: CSS `animate-pulse` on the green dot.
- Progress bar: smooth width transition on every second tick.
- Attendance confirmed badge: `scale(0.8) → scale(1)` spring animation + glow.
- Toast: slides in from top-right.

---

## Frontend Data Fetching Strategy

```ts
// lib/hooks/use-student-meetings.ts
import useSWR from 'swr';

export function useStudentMeetings() {
  const { data, isLoading, error, mutate } = useSWR('/api/student/meetings', fetcher);
  return { meetings: data?.data ?? [], isLoading, error, mutate };
}

export function useStudentMeeting(id: string) {
  const { data, isLoading, error } = useSWR(`/api/student/meetings/${id}`, fetcher);
  return { meeting: data, isLoading, error };
}
```

---

## Mock Data Strategy (Pre-API)

Use relative-date mocks so the UI is never empty during development:

```ts
// lib/student-mock-data.ts (append to existing file)
const now = new Date();
const _d = (daysOffset: number, hour: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const STUDENT_MOCK_MEETINGS = [
  {
    id: "m1",
    name: "Introduction to React Hooks",
    description: "A hands-on session covering useState, useEffect, and custom hooks.",
    creator: { id: "3", name: "Jane Doe", avatar_url: "" },
    start_time: _d(1, 10),
    duration: 60,
    status: "upcoming",
    zoom: { meeting_id: "84123456789", password: "abc123" },
    attendance: { status: "pending", minutes_present: 0, percentage: 0, threshold_minutes: 48 },
  },
  {
    id: "m2",
    name: "Advanced CSS Animations",
    description: "Deep dive into keyframes, transitions, and the Web Animations API.",
    creator: { id: "3", name: "Jane Doe", avatar_url: "" },
    start_time: _d(-5, 14),
    duration: 90,
    status: "ended",
    zoom: { meeting_id: "84987654321", password: "xyz789" },
    attendance: { status: "present", minutes_present: 74, percentage: 82, threshold_minutes: 72 },
  },
  {
    id: "m3",
    name: "Node.js & Express Fundamentals",
    description: "Building REST APIs with Node.js, Express, and MongoDB.",
    creator: { id: "4", name: "Dr. Ahmed", avatar_url: "" },
    start_time: _d(-10, 9),
    duration: 60,
    status: "ended",
    zoom: { meeting_id: "84111222333", password: "" },
    attendance: { status: "absent", minutes_present: 20, percentage: 33, threshold_minutes: 48 },
  },
];
```

---

## Data Isolation & Permissions

| Role | Can See All Meetings | Can Join | Can See Attendance |
|------|---------------------|----------|-------------------|
| **Student** | Only meetings they are invited to | ✅ (as participant) | Own attendance only |
| **Tutor** | N/A (uses instructor module) | N/A | Can see all students' attendance for own meetings |
| **Admin** | N/A (uses instructor module) | N/A | Can see all attendance records |

> Students **cannot** see other students' attendance. Each student sees only their own attendance record.
