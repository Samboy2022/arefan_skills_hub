# Instructor — Courses & Curriculum — Feature Specification

> **Status: `PENDING`** — Improvement spec. Core pages exist but have critical bugs, dead API calls, duplicated code between create/edit, and scalability issues in the curriculum builder. This spec documents every issue found and defines the correct implementation.

---

## Overview

The Courses module covers four interconnected areas:

| URL | Page | Status |
|-----|------|--------|
| `/instructor/courses` | Course List | ✅ Good — minor improvements only |
| `/instructor/courses/create` | Create Course | ⚠️ Partially working — `alert()` on submit, no API, no `zod` validation, missing fields |
| `/instructor/courses/[courseId]` | Course Detail Hub | ⚠️ Hardcoded mock data throughout — instructor name, 156 lessons, ratings all fake |
| `/instructor/courses/[courseId]/edit` | Edit Course | ⚠️ Same issues as Create — `alert()`, no API, `whatYouLearn` always initialises as `[""]` ignoring real data |
| `/instructor/courses/[courseId]/grading` | Grading Setup | ⚠️ `alert()` on submit, hardcoded defaults, not persisted |
| `/instructor/lessons?courseId=[id]` | Curriculum Builder | ⚠️ Hardcoded mock modules, drag-and-drop state not persisted, no API calls |

---

## Critical Issues Found (Priority Order)

### 🔴 P0 — Breaking / Data Loss

1. **`alert()` on all form submits** — `create/page.tsx:55`, `edit/page.tsx:68`, `grading/page.tsx:48`. Native `alert()` blocks the UI thread, is impossible to style, and is completely non-standard. Replace with toast notifications.

2. **Create course does nothing** — `handleSubmit` only `console.log()`s data and calls `alert()`. No `POST /api/courses` is fired. User thinks a course was created but nothing was saved.

3. **Edit course does nothing** — Same issue. `whatYouLearn` is always initialised as `[""]` — it never loads the actual existing course outcomes from the mock (let alone the real API).

4. **Grading page does nothing** — `handleSubmit` calls `alert()`. The hardcoded defaults (10/30/60) come from `useState` only — not from the course record. Any previously saved values are lost on page reload.

5. **Curriculum builder state is lost on reload** — `initialModules` in `lessons/page.tsx` is hardcoded static data. Dragging, adding, and renaming is lost the moment the user navigates away or refreshes.

6. **Course detail page uses a fake `getRichCourseData()` bridge** — hardcodes `rating: 4.8`, `reviews_count: 1245`, `lessons_count: 156`, `instructor.name: 'Instructor'`. None of this is real course data.

### 🟡 P1 — UX / Quality

7. **Image upload zones are not wired** — Both thumbnail and cover image `<Input type="file">` are hidden inside a `<div>` but the `<div>` has no `onClick` handler to trigger the file picker. They can only be clicked with perfect precision over the input element.

8. **Create and Edit pages are 95% duplicated** — All form fields, image uploaders, and learning outcome handlers are copied verbatim. Extract to a shared `<CourseForm />` component.

9. **Breadcrumb truncation** — The course detail breadcrumb renders the full course title which truncates visually (`Introduction to Computer Sci...`). Apply `max-w-[200px] truncate` to avoid this.

10. **`/instructor/courses` uses `<PageHeader>` from `@/components/student/page-header`** — This is an incorrect import. Instructor pages must use `@/components/instructor/page-header`.

11. **Sort heuristic `parseInt(b.id) - parseInt(a.id)` for "Newest"** — This breaks when IDs are not numeric (e.g. `"course-1"`). Should sort by `created_at` from the API.

12. **Curriculum builder has no "Publish/Draft" toggle per lesson** — Students can see all lessons regardless of whether the instructor intends them to be visible.

13. **Grading page only supports 3 categories** — Forum, Quiz, Assignment. Cannot add or remove categories. Should be dynamic.

14. **No course status management** — No way to set a course from `active` → `draft` → `archived` from the UI, except via the delete action.

---

## URL Structure

| URL | Page |
|-----|------|
| `/instructor/courses` | Course List (all courses) |
| `/instructor/courses/create` | Create Course |
| `/instructor/courses/[courseId]` | Course Detail Hub |
| `/instructor/courses/[courseId]/edit` | Edit Course Details |
| `/instructor/courses/[courseId]/grading` | Grading & Assessment Weights |
| `/instructor/courses/[courseId]/publish` | Publish Settings *(new)* |
| `/instructor/lessons?courseId=[id]` | Curriculum Builder |

---

## Component Architecture — Consolidation Plan

```
app/instructor/courses/
├── page.tsx                            ← List (fix import from student → instructor PageHeader)
├── create/page.tsx                     ← Thin shell — renders <CourseForm mode="create" />
└── [courseId]/
    ├── page.tsx                        ← Detail Hub (replace all hardcoded mock bridge data)
    ├── edit/page.tsx                   ← Thin shell — renders <CourseForm mode="edit" course={...} />
    ├── grading/page.tsx                ← Dynamic grading weights (remove alert, add API call)
    └── publish/page.tsx                ← NEW: publish/draft/archive controls

app/instructor/lessons/
└── page.tsx                            ← Curriculum Builder (load from API, persist via API)

components/instructor/courses/
├── CourseForm.tsx                      ← SHARED form (replaces create + edit duplication)
├── CourseForm.schema.ts                ← Zod schema for CourseForm
├── ImageUploader.tsx                   ← Clickable drop zone with preview + clear button
├── LearningOutcomesList.tsx            ← Dynamic "What You'll Learn" list
├── CourseStatusBadge.tsx               ← Draft / Active / Archived badge
└── GradingWeightsForm.tsx              ← Dynamic grading categories (replaces hardcoded 3)

components/instructor/builder/
├── CurriculumBuilder.tsx               ← Existing (keep, add API persistence)
├── ModuleCard.tsx                      ← Existing
└── LessonRow.tsx                       ← Add: publish/draft toggle per lesson
```

---

## Page Specifications

---

### 1. Course List (`/instructor/courses`) — Minor Fixes

#### Fixes Required

| Issue | Fix |
|-------|-----|
| Wrong `PageHeader` import | Change `from "@/components/student/page-header"` → `from "@/components/instructor/page-header"` |
| "Newest" sort uses `parseInt(id)` | Sort by `created_at` descending (from API response) |
| Missing "Draft" KPI card | Add 4th KPI: Drafts count (courses with `status === "draft"`) |
| Search only searches `active` | Also search `archived` list simultaneously |
| Delete is client-only state mutation | Replace `setCourses(prev => prev.filter(...))` with `DELETE /api/courses/:id` then refetch |

#### KPI Cards (updated)

| Card | Value | Colour |
|------|-------|--------|
| Total Courses | All courses | Sky blue |
| Active | `status === "active"` | Emerald |
| Drafts | `status === "draft"` | Amber |
| At Capacity | `enrollmentCount >= maxStudents` | Red |

#### Breadcrumb
`Dashboard › My Courses`

---

### 2. Create Course (`/instructor/courses/create`) — Major Fix

#### Problems
- Uses `alert()` — replace with toast
- No `zod` validation
- No API call
- No thumbnail/cover image wired
- Missing fields: Category, Level, Language, Max Students, Status (Draft vs Active), Prerequisites

#### Shared `<CourseForm />` Component

Extract all create/edit form logic into one shared component. Both create and edit pages render this:

```tsx
// create/page.tsx
<CourseForm mode="create" onSuccess={(id) => router.push(`/instructor/courses/${id}`)} />

// edit/page.tsx
<CourseForm mode="edit" course={course} onSuccess={() => router.push(viewHref)} />
```

#### Form Sections

**Section 1 — Basic Information**

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| **Course Name** | Text | Required, min 3, max 120 chars | Character counter shown |
| **Course Code** | Text | Optional, max 20 chars. Auto-uppercase. | Placeholder: `CS101` |
| **Category** | Select | Required | Options from `GET /api/categories` |
| **Level** | Select | Required | Beginner · Intermediate · Advanced |
| **Language** | Select | Required | English · French · Arabic · Mandarin · etc. |
| **Status** | Radio group | Required | `Draft` (default) · `Published` |

**Section 2 — Details**

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| **Course Duration** | Number input | Optional, min 1 | Weeks |
| **Credit Units** | Number input | Optional, min 1 | |
| **Max Students** | Number input | Optional | Leave blank = unlimited |
| **Prerequisites** | Multi-line text or tag input | Optional | Free text, comma-separated tags |

**Section 3 — Media**

- **Thumbnail Image** (`<ImageUploader />`) — `800×400px`, max 2 MB
- **Cover Image** (`<ImageUploader />`) — `1920×1080px`, max 5 MB

`<ImageUploader />` spec:
- The entire drop zone `<div>` must have `onClick={() => fileInputRef.current?.click()}` to trigger the hidden `<input type="file">`.
- On file select: show a circular preview thumbnail + file name + clear `×` button.
- On drag-over: border turns `border-primary` with `bg-primary/5`.
- Accepted formats: `image/jpeg, image/png, image/webp, image/gif`

**Section 4 — Content**

| Field | Type | Notes |
|-------|------|-------|
| **About This Course** | `<RichTextEditor>` | Existing component — keep |
| **What You'll Learn** | `<LearningOutcomesList>` | Dynamic list — min 1 required item |
| **Who This Is For** | Textarea | Optional — target audience description |

#### Form Validation (`CourseForm.schema.ts`)

```ts
import { z } from "zod";

export const courseFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(120),
  code: z.string().max(20).optional(),
  category_id: z.string().min(1, "Please select a category"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().min(1, "Please select a language"),
  status: z.enum(["draft", "published"]).default("draft"),
  duration_weeks: z.coerce.number().int().positive().optional(),
  credit_units: z.coerce.number().int().positive().optional(),
  max_students: z.coerce.number().int().positive().optional(),
  prerequisites: z.string().optional(),
  description: z.string().optional(),
  learning_outcomes: z.array(z.string().min(1)).min(1, "Add at least one learning outcome"),
  target_audience: z.string().optional(),
});
```

#### Submit Flow

```
1. Run zod validation → show inline errors on invalid fields
2. Build FormData (text fields + image files)
3. POST /api/courses (multipart/form-data)
4. On 201: toast "Course created!" + router.push(`/instructor/courses/${newId}`)
5. On error: toast "Failed to create course. Please try again." 
   + highlight failing field if validation error from server
```

#### Remove `alert()` — All occurrences

Replace every `alert("Course created successfully!")` and `alert("Course updated successfully!")` with:
```ts
import { toast } from "@/components/ui/use-toast"; // or platform's toast system
toast({ title: "Course saved", description: "Your changes have been saved.", variant: "default" });
```

#### Breadcrumb
`Dashboard › My Courses › Create Course`

---

### 3. Course Detail Hub (`/instructor/courses/[courseId]`) — Data Fix

#### Problem: Hardcoded bridge data
The `getRichCourseData()` function in `page.tsx` fabricates all the rich data:

```ts
// REMOVE — all these are fake:
rating: 4.8,                       // hardcoded
reviews_count: 1245,               // hardcoded
lessons_count: 156,                // hardcoded
instructor: { name: 'Instructor' } // hardcoded
learning_outcomes: [...]           // generic template text
curriculum: [...]                  // 2 placeholder sections
```

#### Fix: Replace bridge with real API call

Convert the page to fetch real data:

```ts
// Replace getRichCourseData() with:
const response = await fetch(`/api/courses/${courseId}`, {
  headers: { Authorization: `Bearer ${token}` },
  next: { revalidate: 60 }
});
if (!response.ok) notFound();
const course = await response.json();
```

#### Sidebar — Manage Course Card

Keep the existing Manage Course card. Add one more action button:

| Button | Icon | Action |
|--------|------|--------|
| Edit Course Details | `Pencil` | `/instructor/courses/[id]/edit` |
| Edit Curriculum | `LayoutList` | `/instructor/lessons?courseId=[id]` |
| Class Roster | `Users` | `/instructor/students?courseId=[id]` |
| **Publish Settings** *(new)* | `Globe` | `/instructor/courses/[id]/publish` |

#### Breadcrumb — Truncation Fix

```tsx
// Before (truncates at page width):
{ label: course.title }

// After (safe truncated breadcrumb):
{ label: course.title.length > 30 ? course.title.slice(0, 30) + "…" : course.title }
```

#### Grading Breakdown — Load from API

Replace the hardcoded `10.00 pts / 30.00 pts / 60.00 pts` with data from `GET /api/courses/:id/grading`.

#### Breadcrumb
`My Courses › [Course Name]`

---

### 4. Edit Course (`/instructor/courses/[courseId]/edit`) — Dedup + Fix

#### Problems
- **95% duplicated** from `/create` — extract to `<CourseForm mode="edit" />`
- `whatYouLearn` initialises as `[""]` — ignores existing `course.learningOutcomes`
- Same `alert()` issue
- No image preview of existing thumbnail/cover

#### Fix: Use shared `<CourseForm />`

```tsx
// edit/page.tsx — thin shell only:
export default function InstructorCourseEditPage() {
  const course = await fetchCourse(courseId); // GET /api/courses/:id
  return (
    <CourseForm
      mode="edit"
      course={course}
      onSuccess={() => router.push(`/instructor/courses/${courseId}`)}
    />
  );
}
```

The `<CourseForm mode="edit">` must:
1. Pre-populate all fields from the `course` prop using `react-hook-form` `defaultValues`.
2. Pre-populate `whatYouLearn` from `course.learning_outcomes[]`.
3. Show the existing thumbnail/cover images in the uploader zones (as preview).
4. On submit → `PUT /api/courses/:id` (not `POST`).

#### Breadcrumb
`Dashboard › My Courses › [Course Name] › Edit Details`

---

### 5. Grading Setup (`/instructor/courses/[courseId]/grading`) — Dynamic + Fix

#### Problems
- Hardcoded to 3 categories only (Forum, Quiz, Assignment)
- `alert()` on submit
- Not persisted (resets on reload)
- No add/remove category capability

#### Redesign: Dynamic `<GradingWeightsForm />`

Categories are dynamic — the instructor can add, rename, or remove any row. The total must always equal 100 pts.

**UI Layout:**

```
┌──────────────────────────────────────────┐
│  Mark Breakdown                           │
│  ─────────────────────────────────────── │
│  [Forum Participation]  [10]  [pts]  [×] │
│  [Quizzes]              [30]  [pts]  [×] │
│  [Assignments]          [60]  [pts]  [×] │
│  + Add Category                          │
│  ─────────────────────────────────────── │
│  Total: [████████████████████] 100 / 100 │
│                                          │
│  [Cancel]  [Save Grading]                │
└──────────────────────────────────────────┘
```

**Visual progress bar** showing total / 100 — turns red if ≠ 100, green if = 100.

**Validation rule:** Submit is disabled until total === 100. Show inline error `"Total is N pts. Adjust categories to reach exactly 100."`.

#### API: Load Existing Weights on Mount

```ts
// On page load:
const { data } = await fetch(`/api/courses/${courseId}/grading`).then(r => r.json());
// data.categories: [{ id, name, points }, ...]
```

#### Submit Flow
```
PUT /api/courses/:id/grading
Body: { categories: [{ name: "Forum", points: 10 }, ...] }
On success: toast "Grading updated." + stay on page (don't navigate away)
```

#### Breadcrumb
`Dashboard › My Courses › [Course Name] › Grading Setup`

---

### 6. Curriculum Builder (`/instructor/lessons?courseId=[id]`) — Persistence Fix

#### Problem: State is Never Saved

The builder has excellent client-side UX (drag-and-drop, collapse, add/remove). But none of it persists — the `initialModules` array is a hardcoded constant in `page.tsx`. Every module/lesson change lives only in React state.

#### Fix: Load → Edit → Save Cycle

**Load:**
```ts
// Replace static initialModules with:
const modules = await fetch(`/api/courses/${courseId}/modules`).then(r => r.json());
```

**Save (per action):**

Each mutation in `<CurriculumBuilder>` should call the appropriate API endpoint rather than only mutating local state:

| User Action | API Call |
|-------------|----------|
| Add module | `POST /api/courses/:id/modules` |
| Rename module | `PATCH /api/modules/:moduleId` |
| Delete module | `DELETE /api/modules/:moduleId` |
| Reorder modules (drag) | `PUT /api/courses/:id/modules/reorder` |
| Add lesson | `POST /api/modules/:moduleId/lessons` |
| Rename lesson | `PATCH /api/lessons/:lessonId` |
| Delete lesson | `DELETE /api/lessons/:lessonId` |
| Reorder lessons (drag) | `PUT /api/modules/:moduleId/lessons/reorder` |
| Toggle lesson publish | `PATCH /api/lessons/:lessonId { published: bool }` |

**Optimistic updates:** Apply the UI change immediately (fast UX), then call the API in the background. If the API fails, revert the local state and show an error toast.

#### Add: Lesson Publish/Draft Toggle

Each lesson row needs a visibility toggle:

```
📹 Course Overview     • Video   [● Published]  [Edit] [⋮]
📄 Setup Guide         • PDF     [○ Draft    ]  [Edit] [⋮]
```

- Toggle switch on each lesson row: `Published` (emerald) / `Draft` (gray).
- Students only see `Published` lessons.
- `PATCH /api/lessons/:lessonId { published: true/false }`

#### Scalability: Virtualised list for large courses

Courses with 100+ lessons will cause DOM performance issues. For courses with > 50 total lessons, render the lesson list with a virtualised scroll (e.g. `@tanstack/react-virtual`). Show a warning banner when > 100 lessons: `"Large curriculum detected. Consider splitting into multiple courses."`.

#### Auto-save indicator

Show a persistent "Saved" / "Saving…" / "Unsaved changes" indicator at the top of the builder:

```
[✓ All changes saved]   Last saved 2 minutes ago
```

Updates after every successful API call.

#### Breadcrumb
`Dashboard › My Courses › [Course Name] › Curriculum Builder`

---

### 7. Publish Settings (`/instructor/courses/[courseId]/publish`) — NEW PAGE

A simple but critical missing page. Currently there is no way to transition a course between Draft → Published → Archived via the UI.

#### Layout

```
┌─────────────────────────────────────────────┐
│  Publish Settings                            │
│  [Course Name]                              │
│                                             │
│  Current Status: [Draft] ●                  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ ○ Draft                              │   │
│  │   Hidden from students. Editable.   │   │
│  │                                     │   │
│  │ ● Published                         │   │
│  │   Visible to enrolled students.     │   │
│  │                                     │   │
│  │ ○ Archived                          │   │
│  │   Hidden. Read-only. Data retained. │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Enrolment Settings:                        │
│  Max Students: [____]  (blank = unlimited)  │
│  Open Enrolment: [● ON]                     │
│                                             │
│  [Cancel]  [Save Publish Settings]          │
└─────────────────────────────────────────────┘
```

| Field | Notes |
|-------|-------|
| Status radio | Draft / Published / Archived |
| Max Students | Number input. Blank = unlimited. |
| Open Enrolment toggle | When OFF, instructor must manually approve each student |

Submit → `PATCH /api/courses/:id/status` → toast → stay on page.

---

## UX Rules — DOs / DON'Ts

### ✅ DO
- Use `react-hook-form` + `zod` for ALL forms — no raw `useState` per field.
- Use toast notifications for all success/error feedback — never `alert()`.
- Wire `<ImageUploader>` so clicking the entire drop zone opens the file picker.
- Show existing image previews in the Edit form uploader zones.
- Load real grading weights from `GET /api/courses/:id/grading` on the grading page.
- Persist every curriculum builder change to the API (optimistic update pattern).
- Add a publish/draft toggle per lesson in the curriculum builder.
- Fix the `PageHeader` import on the list page (student → instructor).
- Show a "Saved" indicator in the curriculum builder.
- Auto-uppercase course code input as the user types.
- Initialize `whatYouLearn` from real `course.learning_outcomes` on the edit page.

### ❌ DON'T
- Don't use `alert()` anywhere — ever.
- Don't duplicate the create/edit form code — use the shared `<CourseForm />`.
- Don't hardcode `rating`, `reviews_count`, `lessons_count`, or instructor info — fetch from API.
- Don't use `parseInt(b.id)` for "Newest" sorting on string IDs like `"course-1"`.
- Don't let curriculum builder changes be lost on navigation — always persist to API.
- Don't restrict grading to exactly 3 categories — make it dynamic.
- Don't show students draft lessons — always filter by `published: true` on the student side.
- Don't leave the `/instructor/courses/[courseId]/publish` page missing — it's needed for course lifecycle management.

---

## Laravel API Contract

### Course Endpoints

```
GET    /api/courses                          → List instructor's courses (paginated)
POST   /api/courses                          → Create course (multipart — includes images)
GET    /api/courses/:id                      → Full course detail (for detail hub + edit form)
PUT    /api/courses/:id                      → Update course (multipart — can include new images)
PATCH  /api/courses/:id/status              → Change course status (draft/published/archived)
DELETE /api/courses/:id                      → Delete course

GET    /api/courses/:id/grading             → Get grading weight categories
PUT    /api/courses/:id/grading             → Save grading categories

GET    /api/categories                       → List all course categories (for the Category select)
```

---

### `POST /api/courses` — Request (multipart/form-data)

```
name:               "Introduction to React"
code:               "CS101"
category_id:        "cat-3"
level:              "intermediate"
language:           "english"
status:             "draft"
duration_weeks:     12
credit_units:       3
max_students:       50
prerequisites:      "Basic HTML/CSS knowledge"
description:        "<p>This course covers...</p>"
learning_outcomes:  ["Build SPA apps", "Understand hooks", "Deploy to Vercel"]
target_audience:    "Web developers with basic JS knowledge"
thumbnail:          [File]
cover_image:        [File]
```

#### Response `201`
```json
{
  "id": "course-42",
  "name": "Introduction to React",
  "code": "CS101",
  "status": "draft",
  "slug": "introduction-to-react",
  "thumbnail_url": "https://cdn.example.com/thumbnails/course-42.jpg",
  "cover_image_url": "https://cdn.example.com/covers/course-42.jpg",
  "created_at": "2026-04-17T00:00:00Z"
}
```

---

### `GET /api/courses/:id` — Response `200`

```json
{
  "id": "course-1",
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "status": "published",
  "category": { "id": "cat-3", "name": "Computer Science" },
  "level": "beginner",
  "language": "english",
  "duration_weeks": 16,
  "credit_units": 3,
  "max_students": 50,
  "enrollment_count": 45,
  "prerequisites": "None",
  "description": "<p>...</p>",
  "learning_outcomes": [
    "Understand core CS fundamentals",
    "Write basic algorithms",
    "Design simple data structures"
  ],
  "target_audience": "Students with no prior programming experience",
  "thumbnail_url": "https://cdn.example.com/...",
  "cover_image_url": "https://cdn.example.com/...",
  "rating": 4.7,
  "reviews_count": 312,
  "lessons_count": 48,
  "duration_hours": 36,
  "is_certificate_enabled": true,
  "instructor": {
    "id": "t-3",
    "name": "Jane Smith",
    "avatar_url": "https://...",
    "bio": "Associate Professor, CS Department"
  },
  "grading": {
    "categories": [
      { "id": "g1", "name": "Forum", "points": 10 },
      { "id": "g2", "name": "Quizzes", "points": 30 },
      { "id": "g3", "name": "Assignments", "points": 60 }
    ]
  },
  "created_at": "2025-09-01T00:00:00Z",
  "updated_at": "2026-04-10T00:00:00Z"
}
```

---

### `PUT /api/courses/:id/grading` — Request Body

```json
{
  "categories": [
    { "name": "Forum Participation", "points": 10 },
    { "name": "Quizzes",             "points": 25 },
    { "name": "Assignments",         "points": 50 },
    { "name": "Final Project",       "points": 15 }
  ]
}
```

**Validation rule (Laravel):** Sum of all `points` must equal `100`. Return `422` if not.

---

### Curriculum / Modules / Lessons Endpoints

```
GET    /api/courses/:id/modules                  → All modules with nested lessons
POST   /api/courses/:id/modules                  → Add a new module
PATCH  /api/modules/:moduleId                    → Rename / update module
DELETE /api/modules/:moduleId                    → Delete module + all its lessons
PUT    /api/courses/:id/modules/reorder          → Drag reorder — body: { order: ["mod_2","mod_1"] }

POST   /api/modules/:moduleId/lessons            → Add lesson to module
PATCH  /api/lessons/:lessonId                    → Rename / change type / toggle published
DELETE /api/lessons/:lessonId                    → Delete lesson
PUT    /api/modules/:moduleId/lessons/reorder    → Drag reorder — body: { order: ["les_3","les_1","les_2"] }
```

---

### `GET /api/courses/:id/modules` — Response `200`

```json
[
  {
    "id": "mod_1",
    "course_id": "course-1",
    "title": "Introduction",
    "description": "Basics of the subject",
    "order": 1,
    "lessons": [
      {
        "id": "les_1",
        "title": "Course Overview",
        "lesson_type": "video",
        "order": 1,
        "published": true,
        "duration_minutes": 10
      },
      {
        "id": "les_2",
        "title": "Getting Started Guide",
        "lesson_type": "pdf",
        "order": 2,
        "published": false,
        "duration_minutes": 5
      }
    ]
  }
]
```

---

### `POST /api/courses/:id/modules` — Request/Response

Request:
```json
{ "title": "New Module", "description": "", "order": 3 }
```

Response `201`:
```json
{ "id": "mod_new", "course_id": "course-1", "title": "New Module", "order": 3, "lessons": [] }
```

---

### `PATCH /api/lessons/:lessonId` — Request Body

```json
{
  "title": "Updated Lesson Name",
  "published": true,
  "lesson_type": "video",
  "duration_minutes": 12
}
```

---

### `PUT /api/courses/:id/modules/reorder` — Request Body

```json
{ "order": ["mod_3", "mod_1", "mod_2"] }
```

---

### `PATCH /api/courses/:id/status` — Request Body

```json
{
  "status": "published",
  "max_students": 50,
  "open_enrollment": true
}
```

---

## `courses` Table — Missing Columns

The following columns need to be added to the `courses` table in Laravel migrations if not already present:

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `category_id` | FK → categories | null | |
| `level` | enum: beginner, intermediate, advanced | `beginner` | |
| `language` | string | `english` | |
| `status` | enum: draft, published, archived | `draft` | |
| `max_students` | integer nullable | null | null = unlimited |
| `open_enrollment` | boolean | `true` | |
| `prerequisites` | text nullable | null | |
| `learning_outcomes` | JSON / text | `[]` | |
| `target_audience` | text nullable | null | |
| `cover_image_url` | string nullable | null | |
| `thumbnail_url` | string nullable | null | |
| `credit_units` | integer nullable | null | |
| `duration_weeks` | integer nullable | null | |
| `is_certificate_enabled` | boolean | `false` | |

---

## Gap Summary

| Feature | Current | Required |
|---------|---------|---------|
| Form validation | Raw `useState` per field | `react-hook-form` + `zod` |
| Submit feedback | `alert()` ❌ | Toast notifications ✅ |
| Create course API | `console.log()` only ❌ | `POST /api/courses` ✅ |
| Update course API | `console.log()` only ❌ | `PUT /api/courses/:id` ✅ |
| Grading API | Not persisted ❌ | `PUT /api/courses/:id/grading` ✅ |
| Create/Edit duplication | 95% copy-paste ❌ | Shared `<CourseForm>` ✅ |
| Image upload | Hidden file input, not clickable ❌ | Wired `<ImageUploader>` with preview ✅ |
| `whatYouLearn` in Edit | Always `[""]` ❌ | Pre-populated from course data ✅ |
| Course detail data | Hardcoded bridge function ❌ | Real `GET /api/courses/:id` ✅ |
| Curriculum persistence | Lost on navigate/reload ❌ | API-persisted per action ✅ |
| Lesson publish toggle | Missing ❌ | `PATCH /api/lessons/:id {published}` ✅ |
| Course status management | Not possible via UI ❌ | Publish Settings page ✅ |
| Dynamic grading categories | Fixed 3 only ❌ | Add/remove/rename rows ✅ |
| Scalable curriculum list | No virtualisation ❌ | `@tanstack/react-virtual` for > 50 lessons ✅ |
| `PageHeader` import | Wrong (student) ❌ | Correct (instructor) ✅ |
| Breadcrumb truncation | Overflows ❌ | `max-w truncate` applied ✅ |
