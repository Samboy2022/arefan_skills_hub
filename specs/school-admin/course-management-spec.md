# **School Admin Course Management - Detailed Engineering & Design Specification**

**Version:** 1.1.0 | **Date:** 2026-05-19 | **Status:** Approved

**Priority:** High | **Complexity:** High

**Lead Engineer:** AI Agent | **Lead Designer:** AI Agent

---

## **1. Overview & Business Logic**

**Purpose:** The School Admin Course Management service enables school administrators to have full CRUD (Create, Read, Update, Delete) control over the institution's curriculum. This service is a critical administrative path accessed frequently to ensure the course catalog is up-to-date, accurately represented, and properly assigned.

**Business Value:** This feature centralizes course administration, ensuring that administrators do not have to rely on individual instructors to set up course metadata. It provides top-down visibility, improving data integrity, reducing scheduling conflicts, and ensuring compliance with the institution's academic standards.

**Key Capabilities:**
*   **Comprehensive Listing:** View all courses across the institution with powerful search, filtering, and tabbed views (Active, Draft, Archived).
*   **Course Details (Read):** A dedicated overview dashboard for a single course, showing analytics, assigned instructors, and enrolled student counts.
*   **Course Creation & Editing:** A unified, sectioned form to input metadata, media (thumbnails/covers), prerequisites, and configurations.
*   **Curriculum Management:** Ability for admins to build, order, and edit course Modules and Lessons directly, bypassing the instructor if needed.
*   **Enrollment & Assignment:** Assign instructors to teach the course and manage bulk student enrollments.
*   **Course Archiving & Deletion:** Safe mechanisms (with confirmation dialogs) to remove or retire courses that are no longer offered, ensuring historical data is preserved if needed.
*   **Consistency:** Strict adherence to the `fnskills` UI structure established in existing "Create" flows (e.g., Faculty, Classes, Students).

---

## **2. Software Architecture & Design Principles**

*This feature must strictly adhere to the following engineering patterns to ensure long-term maintainability, testability, and scalability.*

*   **Design Pattern (Container/Presenter):** We strictly enforce the separation of concerns. "Smart" Container components (e.g., `app/school-admin/courses/page.tsx`) handle state and routing. They pass data to "Dumb" Presenter components (e.g., `CourseDataTable`, `CourseForm`) which handle UI rendering.
*   **Component Modularity:** Re-use the existing `CourseForm` logic where possible or build a highly aligned Admin version. Components should rarely exceed 200 lines of code.
*   **Atomic Design:** UI components must utilize the `components/ui` library (Cards, Buttons, Selects, Inputs) directly to ensure the application's design system is uniform.
*   **Immutability:** State must never be mutated directly. Rely on React's functional state updates.

---

## **3. UI/UX & Component Specification**

### **Page Layout 1: Course List (`/school-admin/courses`)**
```text
┌──────────────────────────────────────────────┐
│ SIDEBAR │  HEADER (Title: Courses, Action: [+ Create Course])
├─────────┼────────────────────────────────────┤
│         │  [ KPI Cards: Total | Active | Draft ]
│         │
│         │  [ Tabs: All | Active | Archived ]   [ Search Bar ]
│         │
│         │  ┌──────────────────────────────┐  │
│         │  │ Data Table / Grid View       │  │
│         │  │ ---------------------------- │  │
│         │  │ Course Name | Code | Status  │  │
│         │  │ ...                        ... │  │
│         │  └──────────────────────────────┘  │
└─────────┴────────────────────────────────────┘
```

### **Page Layout 2: Create/Edit Course (`/school-admin/courses/create` or `.../[id]/edit`)**
```text
┌──────────────────────────────────────────────┐
│ SIDEBAR │  HEADER (Title: Create Course, [<- Back])
├─────────┼────────────────────────────────────┤
│         │  ┌─────────────────┐ ┌───────────┐ │
│         │  │ Card: Basic Info│ │ Card: Med │ │
│         │  │ [Name] [Code]   │ │ [Upload]  │ │
│         │  └─────────────────┘ └───────────┘ │
│         │  ┌─────────────────┐ ┌───────────┐ │
│         │  │ Card: Academic  │ │ Card: Opt │ │
│         │  │ [Credits] [Cap] │ │ [Status]  │ │
│         │  └─────────────────┘ │ [Actions] │ │
│         │                      └───────────┘ │
└─────────┴────────────────────────────────────┘
```

### **Page Layout 3: Course Overview Dashboard (`/school-admin/courses/[id]`)**
```text
┌──────────────────────────────────────────────┐
│ SIDEBAR │  HEADER (Breadcrumbs: Courses > [Course Name])
├─────────┼────────────────────────────────────┤
│         │  [ Sub-Nav: Overview | Curriculum | Instructors | Students | Settings ]
│         │
│         │  ┌──────────────┐ ┌──────────────┐ │
│         │  │ Course Stats │ │ Quick Actions│ │
│         │  │ (Enrollment) │ │ (Edit, Publ) │ │
│         │  └──────────────┘ └──────────────┘ │
│         │  ┌──────────────────────────────┐  │
│         │  │ Recent Activity / Curriculum │  │
│         │  │ Summary                      │  │
│         │  └──────────────────────────────┘  │
└─────────┴────────────────────────────────────┘
```

---

## **4. API Contracts & Data Flow**

*Define the strict data interfaces expected between the frontend client and backend services (simulated for now).*

### **Entity Schemas**

```typescript
export interface Course {
  id: string;
  title: string;
  code: string;
  categoryId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'active' | 'archived';
  credits: number;
  maxStudents?: number;
  thumbnailUrl?: string;
  description: string;
  createdAt: string;
  modules?: CourseModule[]; // Nested curriculum
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  durationMinutes: number;
  order: number;
}
```

---

## **5. State Management & Side Effects**

*   **Form State:** Exclusively managed via React `useState` to handle complex, multi-field input tracking for Course metadata.
*   **Mock State:** The application currently relies on simulated data. Leverage `lib/tenant-mock-data.ts` to mimic API CRUD operations.
*   **Loading States:** Buttons MUST enter a disabled `<Button disabled={isLoading}>` state displaying a spinner or "Saving..." text during artificial network latency (800-1500ms).

---

## **6. Interactivity & User Flow**

1.  **List View:** Admin navigates to `/school-admin/courses`. Views KPI row and paginated table.
2.  **Create:** Admin clicks "Create Course". Navigates to `/school-admin/courses/create`. Fills structured 2-column + 1-column layout form. Submits. Routes back to List View.
3.  **Read/View:** Admin clicks a course name in the list. Navigates to `/school-admin/courses/[id]`. Views dashboard stats, curriculum summary, and enrolled instructors.
4.  **Edit:** From the Overview or List, clicking "Edit" routes to `/school-admin/courses/[id]/edit` pre-filling the form.
5.  **Curriculum Edit:** From the Overview, clicking "Curriculum" tab allows adding Modules and Lessons.
6.  **Delete:** Clicking "Delete" opens the `ConfirmDeleteDialog`. Accepting removes the item from the local mock state and routes back to List View.

---

## **7. Validation & Business Rules**

*Strict enforcement of business logic before data hits the network.*

*   **Business Rule 1:** Course codes must be automatically formatted to UPPERCASE.
*   **Business Rule 2:** A status must default to 'draft' upon creation.
*   **Business Rule 3:** Cannot delete a course if it has active 'enrolled' students (Admin must archive instead, or force remove students first - show alert).

---

## **8. AI Agent Instructions - STRICT ADHERENCE REQUIRED**

### **❌ DO NOT**
*   **DO NOT** deviate from the established School Admin layout for Create/Edit pages. (i.e., `grid gap-6 lg:grid-cols-3` with action buttons at the bottom of the right column).
*   **DO NOT** use custom `CardHeader` or `CardTitle` components if `h2` tags are the established pattern for the specific module.
*   **DO NOT** leave out the "Delete" confirmation dialog. Deletions must NEVER be instant.

### **✅ ALWAYS DO**
*   **ALWAYS** use Lucide-react icons for visual consistency (`Plus`, `Pencil`, `Trash2`, `ArrowLeft`, `Save`, `BookOpen`, `Users`).
*   **ALWAYS** implement simulated network delays (`await new Promise((r) => setTimeout(r, 800));`) to ensure loading states work perfectly.
*   **ALWAYS** disable primary action buttons while `isLoading` is true.

---

# **10. AI Agent Implementation Roadmap (Tasks & Sub-tasks)**

*AI Agents: Follow this step-by-step checklist to implement the feature. Check off tasks internally as you progress.*

### **Phase 1: Foundation & Data Preparation**
*   [ ] **Task 1.1:** Review `lib/tenant-mock-data.ts` and ensure a `mockCourses` array exists with the fields defined in the Entity Schema (id, title, code, status, credits, etc.). If it doesn't exist, create it.
*   [ ] **Task 1.2:** Ensure `lib/types.ts` or `lib/tenant-types.ts` contains the interfaces for `Course`, `CourseModule`, and `CourseLesson`.

### **Phase 2: Course Listing Page (`/school-admin/courses`)**
*   [ ] **Task 2.1:** Create `app/school-admin/courses/page.tsx`.
*   [ ] **Task 2.2:** Implement `PageHeader` with title "Courses" and a "Create Course" button routing to `/school-admin/courses/create`.
*   [ ] **Task 2.3:** Implement KPI Cards at the top: "Total Courses", "Active Courses", "Draft Courses". Calculate values dynamically from `mockCourses`.
*   [ ] **Task 2.4:** Implement `Tabs` (All, Active, Draft, Archived) and a Search Input.
*   [ ] **Task 2.5:** Implement `DataTable` component. Columns: Course Title (clickable link to `[id]`), Code, Credits, Status (color-coded pills), Actions (View, Edit, Delete).
*   [ ] **Task 2.6:** Integrate `ConfirmDeleteDialog` for the delete action.

### **Phase 3: Course Creation Flow (`/school-admin/courses/create`)**
*   [ ] **Task 3.1:** Create `app/school-admin/courses/create/page.tsx`.
*   [ ] **Task 3.2:** Implement `PageHeader` with back button.
*   [ ] **Task 3.3:** Implement the strict UI layout: `<div className="grid gap-6 lg:grid-cols-3">`. The left column (`lg:col-span-2`) contains "Basic Information" and "Academic Details" Cards. The right column contains "Media Setup" and the Submit/Cancel buttons.
*   [ ] **Task 3.4:** Add form fields: Title, Code, Category (Select), Level (Select), Status (Select), Credits (Number), Max Students (Number), Description (Textarea).
*   [ ] **Task 3.5:** Implement `handleSubmit` with simulated `isLoading` delay and routing back to `/school-admin/courses`.

### **Phase 4: Course Edit Flow (`/school-admin/courses/[id]/edit`)**
*   [ ] **Task 4.1:** Create `app/school-admin/courses/[id]/edit/page.tsx`.
*   [ ] **Task 4.2:** Retrieve the course ID from the URL params. Look up the course in `mockCourses`.
*   [ ] **Task 4.3:** Replicate the UI layout from Phase 3, but pre-fill all `Input`, `Select`, and `Textarea` fields with the existing course data.
*   [ ] **Task 4.4:** Implement `handleUpdate` with simulated `isLoading` delay and routing back to `/school-admin/courses/[id]` or the list.

### **Phase 5: Course Overview Dashboard (`/school-admin/courses/[id]`)**
*   [ ] **Task 5.1:** Create `app/school-admin/courses/[id]/page.tsx` (or `layout.tsx` if using nested routing for tabs).
*   [ ] **Task 5.2:** Implement `Breadcrumb` navigation (Dashboard > Courses > [Course Title]).
*   [ ] **Task 5.3:** Implement a Header showing the Course Title, Status badge, and Quick Actions (Edit Course, Delete).
*   [ ] **Task 5.4:** Implement internal page `Tabs` (Overview, Curriculum, Settings).
*   [ ] **Task 5.5:** **Overview Tab:** Display 2-3 KPI cards (Total Students, Completion Rate, Modules). Display a summary Card with Course Description and Metadata.
*   [ ] **Task 5.6:** **Curriculum Tab:** Display a list or accordion of Modules and their nested Lessons.
*   [ ] **Task 5.7:** **Settings Tab:** Form to update Status (Publish/Archive) or permanently Delete the course.

### **Phase 6: Quality Assurance & Review**
*   [ ] **Task 6.1:** Verify that ALL pages use `<Card className="p-6">` and `<h2 className="text-base font-semibold mb-5">` instead of custom Card headers, adhering to the Admin UI guidelines.
*   [ ] **Task 6.2:** Verify that all action buttons at the bottom of forms use the flex layout: `<div className="flex gap-3"><Button className="flex-1">Save</Button><Button variant="outline">Cancel</Button></div>`.
*   [ ] **Task 6.3:** Test the routing flow: List -> Create -> List -> View Details -> Edit -> View Details. Ensure no broken links.
