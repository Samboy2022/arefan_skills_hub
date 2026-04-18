# Live Classes — Feature Specification

> **Status: `COMPLETED`** — All pages implemented and verified. No further action required.


---

## Overview

The Live Classes module enables Administrators and Tutors to **schedule, manage, and host virtual live sessions** powered by the **Zoom Web SDK**. It supports real-time presentations, extended whiteboard capabilities, screen sharing, video/audio sharing, and built-in polling to keep students engaged.

> **Key architectural decision:** The Zoom meeting runs **fully inside the app** using the [Zoom Video SDK / Meeting SDK Web](https://developers.zoom.us/docs/meeting-sdk/web/). The meeting is embedded in the `/instructor/live-classes/[id]/start` page as an in-page component — users never leave the app or open Zoom externally.

This module has three primary flows:

1. **Create Meeting** — Schedule a new virtual Zoom session, configure attendance settings, and notify attendees via email.
2. **Start/Join Meeting** — Launch the embedded Zoom SDK directly inside the page from the meeting list.
3. **Attendance Report** — View per-student attendance results after a session ends.

---

## URL Structure

| URL | Page |
|-----|------|
| `/instructor/live-classes` | All Meetings — list of all created meetings |
| `/instructor/live-classes/create` | Create Meeting form |
| `/instructor/live-classes/[id]` | Meeting Detail — read-only view |
| `/instructor/live-classes/[id]/start` | Meeting Room — Zoom embedded / redirect page |

---

## Component Architecture

```
app/instructor/live-classes/
├── page.tsx               ← All Meetings list (data table)
├── create/page.tsx        ← Create Meeting form
└── [id]/
    ├── page.tsx           ← Meeting Detail (read-only)
    └── start/page.tsx     ← Meeting Room (Zoom launch page)
```

---

## Page Specifications

### 1. All Meetings (`/instructor/live-classes`)

#### Purpose
The landing page for the Live Classes section. Displays all meetings created by the logged-in tutor (or all meetings if Admin). Each meeting can be started, viewed, or deleted from this page.

#### Layout
- **Page Header:**
  - Title: `Live Classes`
  - Subtitle: `Manage and host your virtual live sessions`
  - Primary CTA button: `+ Create Meeting` (top-right), navigates to `/instructor/live-classes/create`.
- **Data Table:** Renders all meetings with the following columns:

| Column | Description |
|--------|-------------|
| **Meeting Name** | Name/title of the meeting |
| **Description** | Short excerpt of the meeting description (truncated to ~60 chars with `…`) |
| **Creator** | Full name of the tutor/admin who created the meeting |
| **Scheduled Date & Time** | Start date and time formatted as `MMM DD, YYYY · HH:MM AM/PM` |
| **Duration** | Instructor-set session duration (e.g., `60 min`) |
| **Attendance Threshold** | The % the instructor configured (e.g., `80 %`) — shows `—` if attendance tracking is off |
| **Status** | Badge: `Upcoming` (blue) · `Live` (green pulsing dot) · `Ended` (gray) |
| **Actions** | Action buttons per row (see below) |

#### Action Buttons (per row)
| Button | Icon | Behaviour |
|--------|------|-----------|
| **Start Call** | Video camera icon | Visible to the meeting creator only. Navigates to `/instructor/live-classes/[id]/start` — launches the embedded Zoom SDK inside the page as host. |
| **Join** | Log-in icon | Visible to attendees who are not the creator. Also navigates to `/instructor/live-classes/[id]/start` — launches the embedded Zoom SDK inside the page as participant. |
| **View** | Eye icon | Navigates to `/instructor/live-classes/[id]` (detail page). |
| **Delete** | Trash icon | Shows a styled `AlertDialog` confirmation before deleting. Only visible to the creator or Admin. |

#### Empty State
- If no meetings exist, show a centred illustration with the message:
  > *"No live classes yet. Click '+ Create Meeting' to schedule your first session."*

#### Breadcrumb
`Dashboard › Live Classes`

---

### 2. Create Meeting (`/instructor/live-classes/create`)

#### Purpose
Form page for scheduling a new Zoom meeting. On successful submission, a Zoom meeting is created via the Zoom API, attendees are stored, attendance rules are persisted, and email notifications are dispatched by the Laravel backend.

#### Form Layout
The form is divided into two clearly labelled sections:
1. **Meeting Details** — core info
2. **Attendance Settings** — how student attendance is tracked

---

#### Section 1 — Meeting Details

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| **Meeting Name** | Text input | Required, min 3 chars | Placeholder: `e.g. Introduction to React Hooks` |
| **Attendees** | Multi-select dropdown | Required, min 1 attendee | Populated from `/api/users?role=student` — shows user full name + avatar |
| **Description** | Textarea | Optional, max 1000 chars | Placeholder: `Describe what this session will cover…` |
| **Start Date** | Date picker | Required, must be today or future | Calendar popover |
| **Start Time** | Time picker | Required | 15-minute interval increments |
| **Duration** | Select | Required | Options: 30 min · 45 min · 1 hr · 1.5 hrs · 2 hrs · Custom (number input in minutes) |
| **Password (optional)** | Text input | Optional | Zoom meeting password for extra security |

---

#### Section 2 — Attendance Settings

This section is visually separated by a divider and a section heading `"Attendance Settings"` with a brief explanation: *"Configure how student attendance is measured for this session."*

| Field | Type | Validation | Default | Notes |
|-------|------|------------|---------|-------|
| **Enable Attendance Tracking** | Toggle switch | — | `ON` | When off, all other attendance fields are disabled (grayed out). No attendance is recorded for this session. |
| **Attendance Threshold (%)** | Number input + slider | Required if tracking on. Integer 1–100. | `80` | The percentage of the session duration a student must be present to be marked **Present**. Shown as: `"Student must attend at least [N]% of the session ([X] min out of [Y] min)"` — updates live as Duration or Threshold changes. |
| **Late Join Grace Period** | Select | Required if tracking on | `5 min` | Options: None · 5 min · 10 min · 15 min · 30 min. Students joining within this window are still counted from the session start time, not from when they actually joined. |
| **Allow Partial Credit** | Toggle switch | — | `OFF` | When ON, students who attend 50–79% of the required time receive a `Partial` attendance status instead of `Absent`. |
| **Notify Students of Attendance** | Toggle switch | — | `ON` | When ON, students see the real-time attendance tracker during the session. When OFF, tracking still happens silently but students are not shown the progress bar. |

#### Live Threshold Preview
Below the threshold fields, show a dynamic computed summary line that updates whenever **Duration** or **Attendance Threshold (%)** changes:

```
📋 Attendance Summary
   Session Length:  60 min
   Threshold:       80 %
   Required Time:   48 min
   Grace Period:    5 min
```

This is non-editable display text, recalculated client-side in real time.

---

#### Form Actions
- **Submit** — Creates the meeting (Zoom API + Laravel persist), redirects to `/instructor/live-classes`.
- **Cancel** — Navigates back to `/instructor/live-classes` without saving.

#### Post-Submit Behaviour
1. Laravel backend calls Zoom API → receives `meeting_id`, `start_url`, `join_url`.
2. Meeting record is persisted to `meetings` table with all attendance settings columns.
3. Email notifications are dispatched to all attendees with the `join_url`, meeting details, and the attendance requirement (if `notify_students` is on).
4. User sees a **success toast**: `"Meeting created! Attendees have been notified."`

#### Breadcrumb
`Dashboard › Live Classes › Create Meeting`

---

### 3. Meeting Detail (`/instructor/live-classes/[id]`)

#### Purpose
Read-only summary of a specific meeting. Instructors can review all configuration details — including the attendance settings they defined — and view the post-session attendance report once the meeting has ended.

#### Content Sections

**Header bar:**
- Meeting name + Status badge.
- `Start Call` button (creator/admin) or `Join` button (attendees).
- `Delete` icon button — shows AlertDialog confirmation.

**Details card** (two-column grid on desktop):
| Field | Value |
|-------|-------|
| Scheduled Date & Time | Formatted date + time |
| Duration | `N min` |
| Meeting ID | Zoom `meeting_id` |
| Password | Masked `●●●●●●` with copy-to-clipboard icon |
| Creator | Name + avatar |

**Description:** Full meeting description block.

**Attendees list:** Avatar grid of all invited attendees with their names.

**Attendance Settings Card** (read-only display of configured settings):

| Setting | Displayed Value |
|---------|----------------|
| Attendance Tracking | `Enabled` / `Disabled` badge |
| Threshold | `80 %   →   48 min of 60 min required` |
| Late Join Grace Period | `5 min` |
| Partial Credit | `Allowed` / `Not allowed` |
| Student Notification | `Visible to students` / `Hidden` |

**Attendance Report** (shown only when `status === "ended"`):

A table listing every invited student and their attendance result:

| Column | Description |
|--------|-------------|
| **Student** | Name + avatar |
| **Joined At** | Time the student entered the meeting |
| **Left At** | Time the student left |
| **Time Present** | `N min` |
| **Percentage** | `N %` of session duration |
| **Status** | `Present ✓` (emerald) · `Partial` (amber) · `Absent ✗` (red) · `Did Not Join` (gray) |

Below the table:
- **Summary counts**: `Present: N · Partial: N · Absent: N · Did Not Join: N`
- **Export button**: `⬇ Export CSV` — downloads attendance report as a CSV file.

**Actions (footer):**
- `Edit` (pencil icon) — *(future scope; reserved placeholder)*
- `Delete` (trash icon) — AlertDialog confirmation before deletion.

#### Breadcrumb
`Dashboard › Live Classes › [Meeting Name]`

---

### 4. Meeting Room (`/instructor/live-classes/[id]/start`)

#### Purpose
Renders the **live Zoom session fully inside the app** using the [Zoom Meeting SDK for Web](https://developers.zoom.us/docs/meeting-sdk/web/). No external redirect occurs. The full Zoom experience (video, audio, chat, screen share, whiteboard, polling) is embedded directly in the page.

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard › Live Classes › [Name] › Start   │
├──────────────────────────────────────────────────────────┤
│  Meeting title bar + Leave button (top-right)            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│          ┌─────────────────────────────────┐            │
│          │                                 │            │
│          │     Zoom SDK Embedded View       │            │
│          │    (full-width, ~80vh height)    │            │
│          │                                 │            │
│          └─────────────────────────────────┘            │
│                                                          │
│  Pre-join loading state: spinner + "Connecting…"        │
└──────────────────────────────────────────────────────────┘
```

#### Pre-Join Loading State
- While the SDK initialises and the signature is being fetched, show:
  - A pulsing spinner / animated ring.
  - Text: `"Connecting to your live class…"`
  - Meeting name and scheduled time displayed above the spinner.
- Once the SDK is ready, the Zoom UI renders in-place (no page navigation).

#### SDK Mount Target
- A `<div id="zoom-meeting-root" />` element used as the SDK container.
- Styled to take `100%` width and `80vh` height inside the page, with `border-radius` matching the design system card.
- When the meeting ends, the SDK fires the `onMeetingEnd` event — replace the Zoom container with a **Session Ended** screen:
  - Message: `"The live class has ended."`
  - CTA: `← Back to Live Classes` → navigates to `/instructor/live-classes`.

#### Role-Based SDK Init Logic
```ts
const role = currentUser.id === meeting.creator_id ? 1 : 0;
// role 1 = host, role 0 = participant

// 1. Fetch JWT signature from Laravel
const { signature } = await fetch(`/api/meetings/${id}/signature`, {
  method: 'POST',
  body: JSON.stringify({ role }),
});

// 2. Initialise Zoom Meeting SDK
await ZoomMtg.init({ leaveUrl: '/instructor/live-classes' });

// 3. Join meeting
ZoomMtg.join({
  meetingNumber: meeting.zoom.meeting_id,
  userName: currentUser.name,
  userEmail: currentUser.email,
  passWord: meeting.zoom.password,
  signature,
  sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY,
});
```

#### Leave / End Meeting
- **Host (Tutor/Admin):** "End for All" button ends the meeting for every participant.
- **Participant (Student):** "Leave" button exits only for them.
- Both actions trigger the `onMeetingEnd` Zoom SDK event, which shows the Session Ended screen.

#### Breadcrumb
`Dashboard › Live Classes › [Meeting Name] › Live Session`

---

## UI / UX Design Specifications

### Design System Tokens
Refer to the platform's established design system. The Live Classes module should feel consistent with other instructor pages.

| Token | Value |
|-------|-------|
| Primary accent | Platform brand blue (`--color-primary`) |
| Success / Live | Emerald green (`#10B981`) with pulsing dot animation |
| Pending / Upcoming | Sky blue badge |
| Ended | Neutral gray badge |
| Danger | Red (`#EF4444`) — delete actions |
| Card background | Glassmorphism card (backdrop-blur, semi-transparent) |
| Font | Inter / Outfit (Google Fonts) |

### Status Badge Behaviour
- **Upcoming** — Static blue pill. Shown when `start_time > now`.
- **Live** — Emerald green pill with a CSS pulsing dot (`@keyframes pulse`). Shown when meeting is currently active (within start time window).
- **Ended** — Gray pill. Shown when `start_time + duration < now`.

### Table Layout
- Use a styled `<table>` or shadcn/ui `DataTable` component.
- Zebra striping on alternate rows for readability.
- Rows are highlighted on hover (`background: rgba(255,255,255,0.05)` in dark mode).
- Mobile: table collapses to stacked card layout below `md` breakpoint.

### Create Meeting Form UX
- Field labels are above inputs, bold, with a small asterisk `*` for required fields.
- The Attendees multi-select uses avatar thumbnails in the dropdown for instant visual recognition.
- Inline validation errors appear beneath each field in red on blur.
- The Submit button shows a spinner while the API request is in flight and is disabled to prevent double-submission.
- The form uses `react-hook-form` + `zod` for validation.

### Attendance Settings UX
- The **Enable Attendance Tracking** toggle is the master switch. When toggled OFF:
  - All other attendance fields are grayed out with `opacity-50 pointer-events-none`.
  - A banner appears: *"Attendance will not be tracked for this session."*
- The **Threshold (%) slider** is paired with a numeric input — either can be changed and they stay in sync.
- The **Live Threshold Preview** block updates in real time without any submit. It uses a `useMemo` derived from the form values for `duration` and `attendance_threshold`.
- The **Late Join Grace Period** select has a tooltip: *"Students who join within this window will have their attendance counted from the session start time, not their actual join time."*
- The attendance section has a subtle light-amber background (`bg-amber-50 dark:bg-amber-950/20`) and a left border accent (`border-l-4 border-amber-400`) to visually distinguish it from the main meeting details.

### Micro-animations
- Table rows fade in with a staggered animation on first mount (`opacity 0 → 1`, `translateY 8px → 0`).
- The `Live` badge pulses continuously.
- The `+ Create Meeting` button has a subtle `scale(1.03)` hover effect.
- Toast notifications slide in from the top-right.

### Empty State Illustration
- Use an SVG illustration (video camera with a "+" sign or similar).
- Maintain accessibility: `aria-label` on the illustration container.

---

## UX Rules — DOs / DON'Ts

### ✅ DO
- Always show the **status badge** so users know at a glance whether a class is upcoming, live, or ended.
- **Embed the Zoom SDK in-page** — the meeting must render inside the app, never redirect to an external zoom.us URL.
- **Notify attendees** by email immediately after meeting creation, including the attendance requirement if `notify_students` is on.
- Allow the **creator and Admin** to delete meetings; attendees should not see the delete button.
- Show a **pulsing "Live" indicator** when a session is currently active.
- Show a **pre-join loading / connecting screen** while the SDK initialises.
- Truncate long descriptions in the table; show the full text only on the detail page.
- Use a **confirmation dialog** (`AlertDialog`) for all destructive actions.
- Show a **Session Ended screen** (with a back button) when the `onMeetingEnd` SDK event fires.
- Show the **Attendance Report** table on the Meeting Detail page once a session has ended.
- Allow the instructor to **export the attendance report as CSV**.
- Disable the **Start Call** button with a tooltip (`"Not started yet"`) if the scheduled time is more than 15 minutes away *(optional UX enhancement)*.
- **Default attendance threshold to 80 %** — the instructor can change it but should never see a blank default.
- When the instructor changes the `duration` or `attendance_threshold` fields, **update the Live Preview** in real time.

### ❌ DON'T
- Don't use native `alert()` or `confirm()` for deletes.
- **Don't redirect to zoom.us** — the meeting must be embedded inside the page using the Zoom Meeting SDK.
- Don't expose the raw `start_url` or `join_url` to the browser — these are server-side only.
- Don't allow attendees to receive or see the host `start_url`.
- Don't hardcode Zoom SDK credentials on the frontend — the SDK Key is public but the SDK Secret must never leave Laravel.
- Don't show a blank table — always handle the empty state gracefully.
- Don't block the UI during meeting creation — show an inline spinner on the Submit button instead.
- Don't forget to call `ZoomMtg.endMeeting()` / `ZoomMtg.leaveMeeting()` cleanup on component unmount to prevent memory leaks.
- Don't disable the attendance section fields silently — always show a clear "Tracking Disabled" banner when the toggle is off.
- Don't allow the threshold to be set to 0 % or 100 % — enforce min: 1, max: 99 validation.

---

## Laravel API Contract

All Zoom interactions are proxied through Laravel. The frontend never calls Zoom directly.

### Meeting Endpoints

```
GET    /api/meetings                              → Fetch all meetings (paginated, 15/page)
POST   /api/meetings                              → Create a meeting (triggers Zoom API + email)
GET    /api/meetings/:id                          → Get single meeting detail (includes attendance settings)
DELETE /api/meetings/:id                          → Delete meeting (revokes Zoom meeting)
POST   /api/meetings/:id/signature                → Generate Zoom SDK JWT signature (server-side HMAC)
GET    /api/meetings/:id/attendance               → Get full attendance report for a meeting (instructor only)
GET    /api/meetings/:id/attendance/export        → Download attendance report as CSV (instructor only)
```

#### `POST /api/meetings/:id/signature` — Request Body
```json
{ "role": 1 }
```
`role`: `1` = host (tutor/admin), `0` = participant (student).

#### `POST /api/meetings/:id/signature` — Response `200`
```json
{
  "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sdk_key": "your_zoom_sdk_key",
  "meeting_number": "84123456789",
  "password": "sec123"
}
```

> The signature is generated server-side using **HMAC-SHA256** with `ZOOM_SDK_SECRET` from `.env`. It is time-limited (expires in 2 hours). The frontend uses it once to initialise the SDK — it must never be cached or reused.

### Request / Response Shapes

#### `POST /api/meetings` — Request Body
```json
{
  "name": "Introduction to React Hooks",
  "description": "A hands-on session covering useState, useEffect, and custom hooks.",
  "attendee_ids": [12, 34, 56],
  "start_time": "2026-05-10T10:00:00Z",
  "duration": 60,
  "password": "sec123",
  "attendance": {
    "tracking_enabled": true,
    "threshold_percentage": 80,
    "grace_period_minutes": 5,
    "allow_partial_credit": false,
    "notify_students": true
  }
}
```

#### `POST /api/meetings` — Success Response `201`
```json
{
  "id": 7,
  "name": "Introduction to React Hooks",
  "description": "A hands-on session...",
  "creator": {
    "id": 3,
    "name": "Jane Doe",
    "avatar_url": "https://cdn.example.com/avatars/3.jpg"
  },
  "attendees": [
    { "id": 12, "name": "Alice Smith", "avatar_url": "..." },
    { "id": 34, "name": "Bob Jones",  "avatar_url": "..." }
  ],
  "start_time": "2026-05-10T10:00:00Z",
  "duration": 60,
  "status": "upcoming",
  "attendance": {
    "tracking_enabled": true,
    "threshold_percentage": 80,
    "threshold_minutes": 48,
    "grace_period_minutes": 5,
    "allow_partial_credit": false,
    "notify_students": true
  },
  "zoom": {
    "meeting_id": "84123456789",
    "start_url": "https://zoom.us/s/84123456789?zak=...",
    "join_url":  "https://zoom.us/j/84123456789",
    "password":  "sec123"
  },
  "created_at": "2026-04-16T09:00:00Z"
}
```

#### `GET /api/meetings` — Success Response `200`
```json
{
  "data": [
    {
      "id": 7,
      "name": "Introduction to React Hooks",
      "description": "A hands-on session...",
      "creator": { "id": 3, "name": "Jane Doe" },
      "start_time": "2026-05-10T10:00:00Z",
      "duration": 60,
      "status": "upcoming"
    }
  ],
  "meta": { "current_page": 1, "total": 1, "per_page": 15 }
}
```

### `GET /api/meetings/:id/attendance` — Attendance Report Response `200`

Returned to the instructor after a session ends:

```json
{
  "meeting_id": 7,
  "meeting_name": "Introduction to React Hooks",
  "duration": 60,
  "attendance_settings": {
    "threshold_percentage": 80,
    "threshold_minutes": 48,
    "grace_period_minutes": 5,
    "allow_partial_credit": false
  },
  "summary": {
    "present": 18,
    "partial": 3,
    "absent": 4,
    "did_not_join": 2
  },
  "records": [
    {
      "student_id": 12,
      "student_name": "Alice Smith",
      "avatar_url": "https://...",
      "joined_at": "2026-05-10T10:02:00Z",
      "left_at":   "2026-05-10T10:54:00Z",
      "minutes_present": 52,
      "percentage": 87,
      "status": "present"
    },
    {
      "student_id": 34,
      "student_name": "Bob Jones",
      "avatar_url": "https://...",
      "joined_at": "2026-05-10T10:05:00Z",
      "left_at":   "2026-05-10T10:32:00Z",
      "minutes_present": 27,
      "percentage": 45,
      "status": "absent"
    }
  ]
}
```

### Attendees Dropdown Population

```
GET /api/users?role=student    → Returns list of users to populate the Attendees multi-select
```

Response shape:
```json
[
  { "id": 12, "name": "Alice Smith", "avatar_url": "https://..." },
  { "id": 34, "name": "Bob Jones",  "avatar_url": "https://..." }
]
```

### Email Notification
Triggered automatically by Laravel after `POST /api/meetings` succeeds. Each attendee receives an email containing:
- Meeting name and description.
- Scheduled date and time (localised to attendee's timezone if available).
- `join_url` as a clickable CTA button.
- Meeting password (if set).
- If `notify_students` is `true`: *"You must attend at least **48 min** (80 % of 60 min) to be recorded as Present."*

### `meetings` Table — Attendance Columns

In addition to the existing Zoom columns, the `meetings` table needs these new columns:

| DB Column | Type | Default | Notes |
|-----------|------|---------|-------|
| `attendance_tracking_enabled` | boolean | `true` | Master attendance switch |
| `attendance_threshold_pct` | tinyint | `80` | Integer 1–99 |
| `attendance_threshold_minutes` | integer | computed | `FLOOR(duration × threshold_pct / 100)` — stored for query efficiency |
| `attendance_grace_period_minutes` | tinyint | `5` | Late-join grace window |
| `attendance_allow_partial` | boolean | `false` | Whether 50–79 % earns `partial` status |
| `attendance_notify_students` | boolean | `true` | Whether tracker is visible to students |

---

## Zoom Integration Notes

> All Zoom API calls and credential handling are done **server-side (Laravel)**. The frontend only uses the **Zoom Meeting SDK** (public SDK Key + short-lived signature).

### Two Separate Zoom Credentials

| Credential | Purpose | Where stored |
|------------|---------|-------------|
| Server-to-Server OAuth (`ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`) | Creating/deleting meetings via REST API | Laravel `.env` — never exposed to frontend |
| Meeting SDK (`ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET`) | Initialising the embedded Zoom SDK in-browser | SDK Key → `NEXT_PUBLIC_ZOOM_SDK_KEY` (public). SDK Secret → Laravel `.env` only. |

---

### 1. Server-to-Server OAuth (Meeting Management)
- Laravel requests an OAuth access token from `https://zoom.us/oauth/token` before each REST call.
- Token cached for 55 minutes.

### 2. Create Meeting — Zoom REST API (Laravel-side)
```
POST https://api.zoom.us/v2/users/me/meetings
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "topic":      "Introduction to React Hooks",
  "type":       2,
  "start_time": "2026-05-10T10:00:00Z",
  "duration":   60,
  "password":   "sec123",
  "settings": {
    "host_video":        true,
    "participant_video": true,
    "join_before_host":  false,
    "waiting_room":      true,
    "auto_recording":    "none"
  }
}
```

Zoom returns `meeting_id`, `start_url`, and `join_url`. Laravel stores these in the `meetings` table.

> **Note:** `start_url` and `join_url` are **never sent to the frontend**. The frontend only ever receives the `zoom_meeting_id` and `zoom_password`, which are used with the SDK.

### 3. Signature Generation (For In-App SDK — Laravel-side)

The Zoom Meeting SDK requires a **time-limited JWT signature** to authenticate the in-browser session. Laravel generates this on demand:

```php
// app/Http/Controllers/MeetingSignatureController.php
use Carbon\Carbon;

public function generate(Request $request, Meeting $meeting): JsonResponse
{
    $sdkKey    = config('zoom.sdk_key');     // ZOOM_SDK_KEY
    $sdkSecret = config('zoom.sdk_secret');  // ZOOM_SDK_SECRET
    $role      = $request->integer('role');  // 0 = participant, 1 = host

    $iat = Carbon::now()->timestamp;
    $exp = $iat + 7200; // 2 hour expiry

    $payload = base64_encode(json_encode([
        'sdkKey'       => $sdkKey,
        'mn'           => $meeting->zoom_meeting_id,
        'role'         => $role,
        'iat'          => $iat,
        'exp'          => $exp,
        'tokenExp'     => $exp,
    ]));

    $signature = hash_hmac('sha256', $sdkKey . '.' . $meeting->zoom_meeting_id . '.' . $iat . '.' . $role, $sdkSecret, true);
    // Return properly constructed JWT — use a Zoom-provided SDK signature library for production

    return response()->json([
        'signature'      => $generatedJwt,
        'sdk_key'        => $sdkKey,
        'meeting_number' => $meeting->zoom_meeting_id,
        'password'       => $meeting->zoom_password,
    ]);
}
```

### 4. Frontend SDK Initialisation (Next.js page)

Install the Zoom Meeting SDK:
```bash
npm install @zoom/meetingsdk
```

Import and initialise inside the `/start` page component:
```ts
import ZoomMtg from '@zoom/meetingsdk';

// Must be called before init — sets required assets path
ZoomMtg.setZoomJSLib('https://source.zoom.us/3.9.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// On component mount:
ZoomMtg.init({
  leaveUrl: '/instructor/live-classes',
  patchJsMedia: true,
  success: () => {
    ZoomMtg.join({
      signature,          // from Laravel /api/meetings/:id/signature
      sdkKey,             // from signature response
      meetingNumber,      // from signature response
      userName: currentUser.name,
      userEmail: currentUser.email,
      passWord: password, // from signature response
      success: () => console.log('Joined'),
      error:   (e) => console.error(e),
    });
  },
});

// On component unmount:
return () => { ZoomMtg.endMeeting({}); };
```

### 5. Key DB Columns in `meetings` Table

| DB Column | Source | Notes |
|-----------|--------|-------|
| `zoom_meeting_id` | Zoom REST API `id` | Used by SDK to join |
| `zoom_password` | Zoom REST API `password` | Passed to SDK join, stored encrypted |
| `zoom_start_url` | Zoom REST API `start_url` | **Server-side only** — never returned to frontend |
| `zoom_join_url` | Zoom REST API `join_url` | Included in attendee email only |

### 6. Delete Meeting — Zoom REST API (Laravel-side)
```
DELETE https://api.zoom.us/v2/meetings/{meetingId}
Authorization: Bearer {access_token}
```

---

## Data Isolation & Permissions

| Role | Can Create | Can See All Meetings | Can Start | Can Delete |
|------|-----------|----------------------|-----------|-----------|
| **Admin** | ✅ | ✅ (all tutors) | ✅ | ✅ |
| **Tutor** | ✅ | Own meetings only | ✅ (own) | ✅ (own) |
| **Student** | ❌ | Meetings they're invited to | ❌ (Join only) | ❌ |

---

## Frontend Data Fetching Strategy

Isolate all API calls in a custom hook so that switching from mock to live data requires no page-level changes:

```ts
// lib/hooks/use-meetings.ts
import useSWR from 'swr';

export function useMeetings() {
  const { data, error, isLoading, mutate } = useSWR('/api/meetings', fetcher);
  return { meetings: data?.data ?? [], isLoading, error, mutate };
}

export function useMeeting(id: string) {
  const { data, error, isLoading } = useSWR(`/api/meetings/${id}`, fetcher);
  return { meeting: data, isLoading, error };
}
```

---

## Mock Data Strategy (Pre-API)

Until the Laravel backend and Zoom API are integrated, use relative mock data so the UI is never empty:

```ts
const now = new Date();
const _d = (daysOffset: number, hour: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const MOCK_MEETINGS = [
  {
    id: "1",
    name: "Introduction to React Hooks",
    description: "A hands-on session covering useState, useEffect, and custom hooks.",
    creator: { id: "3", name: "Jane Doe" },
    start_time: _d(2, 10),
    duration: 60,
    status: "upcoming",
    zoom: {
      meeting_id: "84123456789",
      join_url: "https://zoom.us/j/84123456789",
    },
  },
  {
    id: "2",
    name: "Advanced CSS Animations",
    description: "Deep dive into keyframes, transitions, and the Web Animations API.",
    creator: { id: "3", name: "Jane Doe" },
    start_time: _d(5, 14),
    duration: 90,
    status: "upcoming",
    zoom: {
      meeting_id: "84987654321",
      join_url: "https://zoom.us/j/84987654321",
    },
  },
  {
    id: "3",
    name: "Node.js & Express Fundamentals",
    description: "Building REST APIs with Node.js, Express, and MongoDB.",
    creator: { id: "3", name: "Jane Doe" },
    start_time: _d(-3, 9),
    duration: 60,
    status: "ended",
    zoom: {
      meeting_id: "84111222333",
      join_url: "https://zoom.us/j/84111222333",
    },
  },
];
```
