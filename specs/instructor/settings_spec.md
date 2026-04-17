# Instructor — Settings — Feature Specification

> **Status: `PENDING`** — Improvement spec. The page exists but is entirely non-functional. All fields are static `defaultValue` props with no state management, no validation, and no API calls. All buttons are decorative. This spec defines the full functional redesign.

---

## Overview

The **Settings** page is the instructor's personal control centre for their account identity, platform preferences, notification behaviour, and security. The current implementation is a visual-only skeleton — it looks like a real settings page but saves nothing, validates nothing, and communicates with no backend.

### Current State Audit

| Section | Fields | Current Problems |
|---------|--------|-----------------|
| **Profile** | Name, Email, Department, Bio, Office Hours, Avatar | All `defaultValue` hardcode. No `useState`. "Save Changes" does nothing. Avatar upload wired to no handler. |
| **Notifications** | 4 checkbox toggles | `defaultChecked` hardcode. No state. "Save Preferences" does nothing. |
| **Preferences** | Language, Timezone, Dark Mode toggle | Static `<select>` with no value binding. Dark Mode checkbox doesn't change the theme. |
| **Security** | Password, 2FA, Sessions, Logout | All 4 buttons are non-functional. "Change Password" opens nothing. Logout does nothing. |
| **Profile 404** | — | `http://localhost:3000/instructor/profile` (linked from nav dropdown) → **404 page**. Must be redirected to `/instructor/settings?tab=profile`. |

---

## URL Structure

| URL | Description |
|-----|-------------|
| `/instructor/settings` | Main settings page — defaults to Profile tab |
| `/instructor/settings?tab=profile` | Profile tab (deep-linkable) |
| `/instructor/settings?tab=notifications` | Notifications tab |
| `/instructor/settings?tab=preferences` | Preferences tab |
| `/instructor/settings?tab=security` | Security tab |
| `/instructor/profile` | **Must redirect** → `/instructor/settings?tab=profile` |

---

## Component Architecture

```
app/instructor/settings/
└── page.tsx                          ← Main settings page (full rebuild as client component)

components/instructor/settings/
├── ProfileTab.tsx                    ← Profile form with react-hook-form + zod
├── NotificationsTab.tsx              ← Notification toggles with state
├── PreferencesTab.tsx                ← Language, timezone, theme
├── SecurityTab.tsx                   ← Password modal, 2FA, sessions, logout
├── AvatarUploader.tsx                ← Avatar upload with preview
└── ChangePasswordModal.tsx           ← Modal with current + new + confirm password fields
```

---

## Page Layout

The page uses a **two-column layout on desktop** — Left sidebar navigation (visible section labels) + Right content panel. On mobile, the sidebar collapses to a horizontal tab strip.

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard › Settings                               │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│  ┌────────────┐  │  ┌──────────────────────────────────────┐   │
│  │ 👤 Profile  │  │  │  SECTION CONTENT                     │   │
│  │ 🔔 Notifs  │  │  │  (form fields, toggles, etc.)        │   │
│  │ ⚙ Prefs   │  │  │                                      │   │
│  │ 🔒 Security│  │  │                                      │   │
│  └────────────┘  │  └──────────────────────────────────────┘   │
│  (left sidebar   │                                              │
│   lg only)       │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

On **mobile** (`< lg`): The left sidebar becomes a horizontal scrollable tab strip above the content panel.

---

## Tab / Section Specifications

---

### Tab 1 — Profile

#### Purpose
Allow the instructor to update their public-facing identity and personal information displayed across the platform.

#### Layout — Two sub-sections

**Sub-section A: Identity** (avatar + name + email)

**Sub-section B: Professional Details** (department, bio, office hours, social links)

---

#### Avatar Uploader (`<AvatarUploader />`)

| Element | Spec |
|---------|------|
| Current avatar | `h-20 w-20 rounded-full` — shows initials gradient if no photo uploaded |
| Upload button | "Change Photo" — opens native file picker, accepts `image/jpeg, image/png, image/webp` only |
| Preview | On file select, show a cropped circular preview before confirming upload |
| Remove | "Remove Photo" link (text button, red) — reverts to initials avatar |
| Max file size | 5 MB. Show inline error if exceeded: `"File too large. Max 5 MB."` |
| Upload flow | On confirm → `POST /api/instructor/profile/avatar` (multipart). On success → update displayed avatar everywhere (navbar, settings page). |

---

#### Form Fields (Profile)

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| **First Name** | Text input | Required, min 2 chars | Split from "Full Name" (currently one field) |
| **Last Name** | Text input | Required, min 2 chars | |
| **Email Address** | Text input (read-only display) | — | Email is **read-only**. Changing email requires a separate "Change Email" flow (see below). |
| **Phone Number** | Text input | Optional. E.164 format validation | Placeholder: `+1 (555) 000-0000` |
| **Department** | Text input | Required | Placeholder: `e.g. Computer Science` |
| **Title / Role** | Text input | Optional | Placeholder: `e.g. Associate Professor, Senior Instructor` |
| **Bio** | Textarea | Optional, max 500 chars | Character counter shown at bottom right: `N / 500`. `resize-none` |
| **Office Hours** | Text input | Optional | Placeholder: `e.g. Tue & Thu 2–4 PM, Room 304` |
| **Website / LinkedIn** | URL input | Optional. Must be valid URL | Placeholder: `https://` |

#### Change Email Flow

Email is sensitive — it cannot be updated via the same "Save Changes" button. Instead:
- Email field is displayed as **read-only** (`bg-muted/50 cursor-not-allowed`) with a `Change Email →` link next to it.
- Clicking "Change Email" opens a **modal**:
  1. `"Enter new email address"` — text input
  2. `"Confirm new email address"` — text input (must match)
  3. `"Enter your password to confirm"` — password input
  4. Submit → Laravel sends verification email to the **new** address. Not active until verified.

#### Form Actions

- **Save Changes** button: Primary, full-width on mobile. Disabled while submitting (spinner).
- On success: Green toast `"Profile updated successfully."` slides in top-right.
- On error: Red inline error messages below each failing field.
- Validation: `react-hook-form` + `zod`. All validation runs on blur and on submit.
- Unsaved changes guard: If the user navigates away with unsaved changes, show an `AlertDialog`: `"You have unsaved changes. Leave anyway?"`.

#### Breadcrumb
`Dashboard › Settings › Profile`

---

### Tab 2 — Notifications

#### Purpose
Give the instructor granular control over which events trigger notifications and through which channels.

#### Layout

Each notification type is a **row** with:
- Icon (left)
- Label + description (centre)
- Channel controls (right): toggles for `Email` · `In-App` · `Push`

#### Notification Categories

| Category | Icon | Description | Default: Email | Default: In-App | Default: Push |
|----------|------|-------------|---------------|----------------|--------------|
| **New Student Submissions** | `FileText` | Assignment or quiz turned in | ✅ ON | ✅ ON | ❌ OFF |
| **Discussion Replies** | `MessageCircle` | Student replies in a forum thread you're watching | ✅ ON | ✅ ON | ❌ OFF |
| **Assignment Due Reminders** | `Clock` | Deadlines approaching (24h, 1h before) | ✅ ON | ✅ ON | ❌ OFF |
| **New Direct Message** | `Mail` | Student sends you a direct message | ✅ ON | ✅ ON | ✅ ON |
| **Live Class Reminders** | `Video` | Meeting starting soon (15 min before) | ✅ ON | ✅ ON | ✅ ON |
| **Grade Disputes** | `AlertCircle` | Student contests a grade | ✅ ON | ✅ ON | ❌ OFF |
| **Announcement Replies** | `Bell` | Someone comments on your announcement | ❌ OFF | ✅ ON | ❌ OFF |
| **Weekly Digest** | `BarChart` | Summary of week's activity every Monday | ✅ ON | ❌ OFF | ❌ OFF |

#### Channel Toggle Design

Each row has three small toggle switches (not checkboxes) — one per channel:

```
[📄 New Student Submissions          ]  Email [●] · In-App [●] · Push [○]
[   When students submit assignments ]
```

Use shadcn/ui `<Switch>` components. Active = brand colour. Inactive = gray.

#### Master "Mute All" Toggle

At the top of the section, a prominent toggle:
- `Mute All Notifications` — When ON, disables all notification delivery globally (overrides individual settings). Shows a yellow warning banner: `"All notifications are muted. You won't receive any alerts until you unmute."`.

#### Form Actions
- **Save Preferences** button at bottom of section.
- On success: toast `"Notification preferences saved."`

---

### Tab 3 — Preferences

#### Purpose
Control localisation (language, timezone, date format), display (theme), and teaching defaults.

#### Section A: Localisation

| Field | Type | Options | Notes |
|-------|------|---------|-------|
| **Language** | Select | English · Spanish · French · German · Arabic · Mandarin | `value`-controlled via `useState`. Saves to profile. |
| **Timezone** | Select (searchable) | Full IANA timezone list (grouped by region) | Searchable combobox, not plain `<select>`. Current: show detected timezone as default. |
| **Date Format** | Radio group | `MM/DD/YYYY` · `DD/MM/YYYY` · `YYYY-MM-DD` | Affects how dates display across the platform for this instructor. |
| **Time Format** | Radio group | `12-hour (AM/PM)` · `24-hour` | |

#### Section B: Appearance

| Field | Type | Options | Notes |
|-------|------|---------|-------|
| **Theme** | Icon button group | `Light` · `Dark` · `System` | Three buttons, not a checkbox. Active button has `ring-2 ring-primary`. "System" follows OS preference. Applies immediately on click — no save required for instant preview. |

#### Section C: Teaching Defaults

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| **Default Assignment Duration** | Select | `1 Week` | Options: 3 days · 1 week · 2 weeks · 1 month |
| **Default Quiz Time Limit** | Number input | `30 min` | Minutes. Range 5–180. |
| **Auto-publish Grades** | Toggle | `OFF` | When ON, grades are visible to students immediately after marking. When OFF, instructor manually releases grades. |
| **Grade Scale** | Select | `Standard (A/B/C/D/F)` | Options: Standard · Pass/Fail · Percentage only. Affects gradebook display. |

#### Form Actions
- **Save Preferences** — saves all 3 sections.
- Theme changes apply immediately (no save needed).
- On success: toast `"Preferences saved."`

---

### Tab 4 — Security

#### Purpose
Protect the instructor's account with password management, two-factor authentication, active session monitoring, and a safe logout.

#### Section A: Password

| Element | Spec |
|---------|------|
| Status line | `"Password last changed: January 14, 2026"` (dynamic from API) |
| Password strength indicator | `Weak · Fair · Strong · Very Strong` pill badge — updated as user types in the change modal |
| **Change Password** button | Opens `<ChangePasswordModal />` |

##### `<ChangePasswordModal />`

A modal dialog (not a page navigation) containing:

| Field | Type | Validation |
|-------|------|------------|
| **Current Password** | Password input | Required |
| **New Password** | Password input | Required. Min 8 chars. Must contain: 1 uppercase, 1 number, 1 special char. Real-time strength bar. |
| **Confirm New Password** | Password input | Required. Must exactly match "New Password". |

- Show/hide password toggle (eye icon) on each field.
- Inline validation on blur.
- Submit → `PUT /api/instructor/account/password`. On success: close modal + toast `"Password updated."`. On wrong current password: inline error `"Current password is incorrect."`.

---

#### Section B: Two-Factor Authentication (2FA)

| State | Display |
|-------|---------|
| 2FA **disabled** | Info card: `"Your account is not protected by 2FA."` + `Enable 2FA` button |
| 2FA **enabled** | Emerald success card: `"2FA is active."` + `Manage 2FA` button (can disable or regenerate backup codes) |

##### Enable 2FA Flow (modal):
1. **Step 1** — Show QR code + secret key for authenticator app (Google Authenticator, Authy).
2. **Step 2** — Enter 6-digit OTP code to confirm the device is set up correctly.
3. **Step 3** — Show 8 **one-time backup codes** in a grid. Prompt: `"Save these codes. Each can only be used once."` + `Download Backup Codes` button.
4. On success — 2FA is enabled. Security tab updates to show "Active" state.

---

#### Section C: Active Sessions

A table of logged-in devices/sessions:

| Column | Description |
|--------|-------------|
| **Device** | Browser + OS icon (e.g., Chrome on macOS) |
| **IP Address** | Partially masked: `102.89.xxx.xxx` |
| **Location** | City, Country (from GeoIP) |
| **Last Active** | Relative time: `"2 hours ago"` |
| **Current** | Badge: `"This session"` on the current session row |
| **Action** | `Revoke` button on all rows except current session |

- Revoking a session → `DELETE /api/instructor/sessions/:sessionId` → the device is logged out remotely.
- **"Revoke All Other Sessions"** link at the bottom (red text) — logs out all other devices.

---

#### Section D: Danger Zone

Visually separated with a red left border (`border-l-4 border-red-500`) and `bg-red-50/30 dark:bg-red-950/20` background:

| Action | Button Style | Behaviour |
|--------|-------------|-----------|
| **Log Out** | Red outline button | Calls logout API + redirects to `/login` |
| **Delete Account** | Red destructive button (small, subtle) | *(Admin-controlled. Shows info: "Contact your administrator to delete your account.")* |

> **Important:** The current `Logout` button inside the Security tab is the correct placement. Do NOT remove it — but style it as a proper Danger Zone section, not just a loose button at the bottom.

---

## UI / UX Design Specifications

### Layout & Max Width
- Settings page: `max-w-5xl mx-auto` — wider than the current `max-w-2xl` which feels cramped.
- Left sidebar (desktop): `w-56` fixed. Content area: `flex-1`.
- On mobile: full-width single column with tab strip at top.

### Left Sidebar Design (Desktop, `lg+`)

```
┌──────────────┐
│  ⚙ Settings  │  ← section title
├──────────────┤
│ 👤 Profile   │  ← active item: bg-primary/10, left border accent
│ 🔔 Notifs   │
│ ⚙ Prefs    │
│ 🔒 Security │
└──────────────┘
```

Each nav item:
- Icon + label
- Active state: `bg-primary/10 text-primary border-l-2 border-primary`
- Hover state: `bg-muted/60 text-foreground`
- Transition: `transition-colors duration-150`

### Form Field Design

Replace all raw `<input>` / `<textarea>` / `<select>` with the platform's existing Shadcn/ui components:

| Raw HTML | Replace With |
|----------|-------------|
| `<input type="text">` | `<Input>` from `@/components/ui/input` |
| `<textarea>` | `<Textarea>` from `@/components/ui/textarea` |
| `<select>` | `<Select>` from `@/components/ui/select` |
| `<input type="checkbox">` | `<Switch>` from `@/components/ui/switch` |

All fields must have `<label>` with `htmlFor` / `id` pairs for accessibility.

### Validation Error Display

Below each invalid field:
```
<p className="text-sm text-red-600 mt-1 flex items-center gap-1">
  <AlertCircle className="h-3.5 w-3.5" />
  This field is required.
</p>
```

### Toast Notifications

Use the platform toast system. All settings saves produce:
- ✅ Success: `"[Section] saved successfully."` — green, 3 seconds.
- ❌ Error: `"Failed to save. Please try again."` — red, 5 seconds with retry action.

### Password Strength Bar

```
[████████░░]  Strong
```
- 4-segment progress bar. Colours: red (1/4) → orange (2/4) → yellow (3/4) → emerald (4/4).
- Below the "New Password" field in the Change Password modal.
- Updated in real time on every keystroke.

### 2FA QR Code Modal Steps

Use a shadcn/ui `<Dialog>` with a `<Stepper>` sub-component (Step 1 / 2 / 3) shown as numbered pills at the top of the modal.

### Micro-animations
- Tab switch: `animate-in fade-in duration-200`
- Modal open: `zoom-in-95 fade-in duration-200`
- Toggle switches: smooth `transition-transform duration-200` on the knob
- Password strength bar: `transition-all duration-300 ease-out` on width change
- Toast: slides in from top-right

### Responsive
- `lg+` : Two-column layout (sidebar + content)
- `md` : Single column, horizontal tab strip at top
- `sm` : Single column, tab strip scrolls horizontally

---

## UX Rules — DOs / DON'Ts

### ✅ DO
- Convert the page to a **client component** (`"use client"`) with proper `useState` / `react-hook-form`.
- Use **`zod`** for all form validation schemas.
- Show **real-time character counts** for Bio (500 char max).
- Use **three separate theme options** (Light / Dark / System) — not a simple dark mode checkbox.
- Apply theme changes **immediately** on toggle (no save required) using `next-themes`.
- Use a **modal** for "Change Password" — never navigate to a separate page.
- Make the 2FA setup a **multi-step modal** (QR → OTP → Backup Codes).
- Show **"This session"** badge on the current active session in the sessions table.
- Add an **unsaved changes guard** on all tab switches when a form is dirty.
- Fix the **`/instructor/profile` 404** — redirect to `/instructor/settings?tab=profile`.
- Sync the active tab with the URL via `?tab=profile` query param for deep-linking.

### ❌ DON'T
- Don't use `defaultValue` on inputs — always use `react-hook-form` `register` or controlled `value`/`onChange`.
- Don't allow email to be changed via the simple "Save Changes" flow — require a verification modal.
- Don't use plain HTML `<input type="checkbox">` for toggles — use shadcn `<Switch>`.
- Don't constrain the layout to `max-w-2xl` — it feels cramped. Use `max-w-5xl`.
- Don't place the Logout button at the very end of security fields without a "Danger Zone" visual separation.
- Don't show the 2FA backup codes in plain text without a "copy" or "download" mechanism.
- Don't show the `View Sessions` button if it doesn't load real session data.
- Don't save theme changes to the server on every click — apply locally via CSS class, batch-save with "Save Preferences".

---

## Laravel API Contract

### Settings Endpoints

```
GET    /api/instructor/profile                    → Fetch current profile data
PUT    /api/instructor/profile                    → Update profile fields
POST   /api/instructor/profile/avatar             → Upload avatar (multipart/form-data)
DELETE /api/instructor/profile/avatar             → Remove avatar (revert to initials)

POST   /api/instructor/account/change-email       → Initiate email change (sends verification)
PUT    /api/instructor/account/password           → Change password

GET    /api/instructor/notifications/preferences  → Fetch notification settings
PUT    /api/instructor/notifications/preferences  → Save notification settings

GET    /api/instructor/preferences                → Fetch UI preferences (lang, tz, theme, etc.)
PUT    /api/instructor/preferences                → Save UI preferences

POST   /api/instructor/2fa/enable                 → Initiate 2FA setup (returns QR + secret)
POST   /api/instructor/2fa/verify                 → Verify OTP to complete 2FA setup
DELETE /api/instructor/2fa                        → Disable 2FA

GET    /api/instructor/sessions                   → List active sessions
DELETE /api/instructor/sessions/:id               → Revoke a specific session
DELETE /api/instructor/sessions                   → Revoke all sessions except current

POST   /api/auth/logout                           → Logout current session
```

---

### `GET /api/instructor/profile` — Response `200`

```json
{
  "id": "t-3",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@school.edu",
  "phone": "+1 555 000 0000",
  "department": "Computer Science",
  "title": "Associate Professor",
  "bio": "Passionate educator with 10+ years of teaching experience in Computer Science.",
  "office_hours": "Tue & Thu 2–4 PM, Room 304",
  "website": "https://janesmith.edu",
  "avatar_url": null,
  "email_verified_at": "2025-09-01T08:00:00Z"
}
```

---

### `PUT /api/instructor/profile` — Request Body

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1 555 000 0000",
  "department": "Computer Science",
  "title": "Associate Professor",
  "bio": "Passionate educator with 10+ years...",
  "office_hours": "Tue & Thu 2–4 PM, Room 304",
  "website": "https://janesmith.edu"
}
```

---

### `GET /api/instructor/notifications/preferences` — Response `200`

```json
{
  "mute_all": false,
  "preferences": [
    {
      "type": "new_submission",
      "label": "New Student Submissions",
      "email": true,
      "in_app": true,
      "push": false
    },
    {
      "type": "discussion_reply",
      "label": "Discussion Replies",
      "email": true,
      "in_app": true,
      "push": false
    },
    {
      "type": "direct_message",
      "label": "New Direct Message",
      "email": true,
      "in_app": true,
      "push": true
    },
    {
      "type": "live_class_reminder",
      "label": "Live Class Reminders",
      "email": true,
      "in_app": true,
      "push": true
    },
    {
      "type": "due_reminder",
      "label": "Assignment Due Reminders",
      "email": true,
      "in_app": true,
      "push": false
    },
    {
      "type": "grade_dispute",
      "label": "Grade Disputes",
      "email": true,
      "in_app": true,
      "push": false
    },
    {
      "type": "announcement_reply",
      "label": "Announcement Replies",
      "email": false,
      "in_app": true,
      "push": false
    },
    {
      "type": "weekly_digest",
      "label": "Weekly Digest",
      "email": true,
      "in_app": false,
      "push": false
    }
  ]
}
```

---

### `GET /api/instructor/sessions` — Response `200`

```json
{
  "current_session_id": "sess-7f82",
  "sessions": [
    {
      "id": "sess-7f82",
      "device": "Chrome 124 on macOS",
      "ip": "102.89.12.xxx",
      "location": "Lagos, Nigeria",
      "last_active_at": "2026-04-17T00:08:00Z",
      "is_current": true
    },
    {
      "id": "sess-3a11",
      "device": "Safari on iPhone",
      "ip": "197.210.xx.xxx",
      "location": "Abuja, Nigeria",
      "last_active_at": "2026-04-15T18:32:00Z",
      "is_current": false
    }
  ]
}
```

---

## Gap Summary — Current vs Required

| Feature | Current | Required |
|---------|---------|---------|
| Form state | ❌ Static `defaultValue` | ✅ `react-hook-form` + controlled state |
| Validation | ❌ None | ✅ `zod` schema, inline errors |
| "Save Changes" | ❌ Does nothing | ✅ Calls `PUT /api/instructor/profile` |
| Avatar upload | ❌ Button wired to nothing | ✅ File input → preview → `POST /api/avatar` |
| Email change | ❌ Plain editable field | ✅ Read-only + verification modal flow |
| Notification channels | ❌ One checkbox per type | ✅ Email / In-App / Push per type |
| Mute All | ❌ Missing | ✅ Master toggle with warning banner |
| Dark mode toggle | ❌ Checkbox that does nothing | ✅ Three-way Light/Dark/System via `next-themes` |
| Timezone select | ❌ 4 US options only | ✅ Full IANA list, searchable combobox |
| Teaching defaults | ❌ Missing | ✅ Grade scale, auto-publish, quiz defaults |
| Change password | ❌ Button does nothing | ✅ Modal with current/new/confirm + strength bar |
| 2FA | ❌ Button does nothing | ✅ Full QR → OTP → backup codes flow |
| Active sessions | ❌ Button does nothing | ✅ Table of sessions with revoke buttons |
| Layout width | ❌ `max-w-2xl` (cramped) | ✅ `max-w-5xl` two-column with sidebar |
| `/instructor/profile` | ❌ 404 | ✅ Redirect to `/instructor/settings?tab=profile` |
| URL deep-link | ❌ No query param support | ✅ `?tab=profile` synced with browser URL |
| Unsaved changes guard | ❌ Missing | ✅ `AlertDialog` on dirty form navigation |
