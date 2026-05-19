# **School Admin Program Management - Detailed Engineering & Design Specification**

**Version:** 1.0.0 | **Date:** 2026-05-19 | **Status:** Approved

**Priority:** High | **Complexity:** Medium

**Lead Engineer:** AI Agent | **Lead Designer:** AI Agent

---

## **1. Overview & Business Logic**

**Purpose:** The Program Management service enables school administrators to group individual courses into higher-level academic structures known as "Programs" (e.g., Bachelor of Science in Computer Science, Master of Business Administration). This service handles the complete CRUD lifecycle for these program entities and their relationships with existing courses.

**Business Value:** While courses are individual units of study, students enroll in Programs to achieve degrees or certificates. This feature allows the institution to define graduation paths, organize the curriculum hierarchically, and sell/manage enrollment at the macro (Program) level rather than just the micro (Course) level.

**Key Capabilities:**
*   **Program Listing:** View all existing academic programs showing the creator, creation date, and total attached courses.
*   **Create Program:** A specialized form to define a new program (Name, Description, Level) and attach multiple existing courses to it via a multi-select interface.
*   **Edit Program:** Modify program details and manage the attached courses (add new ones or remove existing ones).
*   **Delete Program:** Safe deletion of a program with a required confirmation dialog, ensuring that attached courses are merely unlinked, not deleted.

---

## **2. Software Architecture & Design Principles**

*This feature must strictly adhere to the following engineering patterns to ensure long-term maintainability, testability, and scalability.*

*   **Design Pattern (Container/Presenter):** We strictly enforce the separation of concerns. "Smart" Container components (e.g., `app/school-admin/programs/page.tsx`) handle state and routing. They pass data to "Dumb" Presenter components which handle UI rendering.
*   **Atomic Design:** UI components must utilize the `components/ui` library (Cards, Buttons, Selects, DataTables) directly to ensure the application's design system is uniform with other Admin areas.
*   **Relational Data Handling:** Programs have a one-to-many or many-to-many relationship with Courses. The UI must cleanly handle the selection and display of these linked course entities.

---

## **3. UI/UX & Component Specification**

### **Page Layout 1: Program List (`/school-admin/programs`)**
```text
┌──────────────────────────────────────────────┐
│ SIDEBAR │  HEADER (Title: Programs, Action: [+ Create Program])
├─────────┼────────────────────────────────────┤
│         │  [ Search Input ]                    
│         │
│         │  ┌──────────────────────────────┐  │
│         │  │ Data Table                   │  │
│         │  │ ---------------------------- │  │
│         │  │ Program Name | Creator | Courses | Actions (Edit, Delete) │
│         │  │ ...                          ... │  │
│         │  └──────────────────────────────┘  │
└─────────┴────────────────────────────────────┘
```

### **Page Layout 2: Create/Edit Program (`/school-admin/programs/create` or `.../[id]/edit`)**
```text
┌──────────────────────────────────────────────┐
│ SIDEBAR │  HEADER (Title: Create Program, [<- Back])
├─────────┼────────────────────────────────────┤
│         │  ┌──────────────────────────────┐  │
│         │  │ Card: Program Details        │  │
│         │  │ [Program Name] [Level (e.g. BSc)]│
│         │  │ [Description (Textarea)]     │  │
│         │  └──────────────────────────────┘  │
│         │  ┌──────────────────────────────┐  │
│         │  │ Card: Attach Courses         │  │
│         │  │ [Multi-Select Course Dropdown]│  │
│         │  │ * List of currently attached *│  │
│         │  │ * courses with 'Remove' btn  *│  │
│         │  └──────────────────────────────┘  │
│         │  [ Cancel ] [ Save Program ]       │
└─────────┴────────────────────────────────────┘
```

---

## **4. API Contracts & Data Flow**

*Define the strict data interfaces expected between the frontend client and backend services (simulated for now).*

### **Entity Schemas**

```typescript
export type ProgramLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD';

export interface Program {
  id: string;
  name: string;
  description: string;
  level: ProgramLevel;
  createdBy: string; // Name of the admin who created it
  createdAt: string; // ISO date string
  courseIds: string[]; // Array of linked Course IDs
}
```

### **Request: [POST/PUT] /api/v1/admin/programs**
**Payload Schema:**
```typescript
interface AdminProgramRequestDTO {
  name: string;
  description: string;
  level: ProgramLevel;
  courseIds: string[]; // Sent to the backend to update relationships
}
```

---

## **5. State Management & Side Effects**

*   **Mock State:** The application currently relies on simulated data. Leverage a new `mockPrograms` array in `lib/tenant-mock-data.ts`. You must also import `mockCourses` to populate the "Attach Courses" multi-select dropdown.
*   **Loading States:** Action buttons (`Save Program`) MUST enter a disabled state displaying a spinner or "Saving..." text during artificial network latency (800ms).

---

## **6. Interactivity & User Flow**

1.  **List View:** Admin navigates to `/school-admin/programs`. Views the paginated table of existing programs.
2.  **Create:** Admin clicks "Create New Program". Navigates to `/school-admin/programs/create`.
3.  **Data Entry:** Admin inputs Name, Description, and Level. 
4.  **Attaching Courses:** Admin uses a specialized Multi-Select or Checkbox List component to choose from existing courses (from `mockCourses`). Selected courses appear in a visual list below the selector.
5.  **Submission:** Admin clicks "Create Program". `isLoading` state engages. After delay, routes back to List View.
6.  **Edit:** Clicking "Edit" icon on a list row routes to `/school-admin/programs/[id]/edit`. The form pre-fills with details and previously attached courses.
7.  **Delete:** Clicking "Delete" icon opens the `ConfirmDeleteDialog`. Accepting removes the item from the local mock state.

---

## **7. Validation & Business Rules**

*Strict enforcement of business logic before data hits the network.*

*   **Business Rule 1:** A Program must have a unique Name.
*   **Business Rule 2:** A Program does NOT strictly require courses upon creation (it can be an empty shell), but UI should encourage attaching at least one.
*   **Business Rule 3:** Deleting a program ONLY deletes the grouping. The attached Courses themselves remain completely untouched and active in the system. The delete confirmation dialog must explicitly state this safety guarantee.

---

## **8. AI Agent Instructions - STRICT ADHERENCE REQUIRED**

### **❌ DO NOT**
*   **DO NOT** overcomplicate the layout. Stick to the standard `max-w-4xl mx-auto space-y-6` for forms if not using the full 3-column layout. Given this is simpler than courses, a centered, single-column stacked Card approach is acceptable.
*   **DO NOT** leave out the "Delete" confirmation dialog. Use the existing `ConfirmDeleteDialog` component.
*   **DO NOT** mutate the mock data arrays directly.

### **✅ ALWAYS DO**
*   **ALWAYS** use Lucide-react icons (`Plus`, `Pencil`, `Trash2`, `ArrowLeft`, `Save`).
*   **ALWAYS** use the `PageHeader` component from `@/components/admin/page-header`.
*   **ALWAYS** use the `DataTable` component from `@/components/admin/data-table` for the listing page.

---

# **10. AI Agent Implementation Roadmap (Tasks & Sub-tasks)**

*AI Agents: Follow this step-by-step checklist to implement the feature. Check off tasks internally as you progress.*

### **Phase 1: Data Preparation**
*   [ ] **Task 1.1:** Open `lib/tenant-mock-data.ts`. Create a new exported array `mockPrograms: Program[]` containing 2-3 sample programs. Ensure they reference `courseIds` that actually exist in the `mockCourses` array.
*   [ ] **Task 1.2:** Open `lib/tenant-types.ts` (or similar) and add the `Program` interface defined in Section 4.

### **Phase 2: Program Listing Page (`/school-admin/programs`)**
*   [ ] **Task 2.1:** Create `app/school-admin/programs/page.tsx`.
*   [ ] **Task 2.2:** Implement `PageHeader` with title "Academic Programs" and a "Create New Program" button.
*   [ ] **Task 2.3:** Implement `DataTable` component. 
    *   Columns: Name, Level, Creator, Attached Courses (Count of `courseIds`), Actions (Edit button, Delete button).
*   [ ] **Task 2.4:** Integrate `ConfirmDeleteDialog` for the delete action. Update the dialog's description text to assure the user that "Deleting this program will not delete the attached courses."

### **Phase 3: Program Creation Flow (`/school-admin/programs/create`)**
*   [ ] **Task 3.1:** Create `app/school-admin/programs/create/page.tsx`.
*   [ ] **Task 3.2:** Implement `PageHeader` with back button.
*   [ ] **Task 3.3:** Build the "Program Details" Card. Add inputs for Name, Level (Select: Degree, Masters, PhD, etc.), and Description (Textarea).
*   [ ] **Task 3.4:** Build the "Attach Courses" Card. 
    *   Import `mockCourses`.
    *   Implement a UI to select courses (either a multi-select dropdown, or a list with checkboxes). 
    *   Maintain a local `selectedCourseIds` state array.
*   [ ] **Task 3.5:** Implement `handleSubmit` with simulated `isLoading` delay and routing back to `/school-admin/programs`.

### **Phase 4: Program Edit Flow (`/school-admin/programs/[id]/edit`)**
*   [ ] **Task 4.1:** Create `app/school-admin/programs/[id]/edit/page.tsx`.
*   [ ] **Task 4.2:** Retrieve the ID from URL, find the program in `mockPrograms`.
*   [ ] **Task 4.3:** Replicate the UI from Phase 3, pre-filling all fields and the `selectedCourseIds` state.
*   [ ] **Task 4.4:** Ensure the "Attach Courses" section correctly displays the pre-selected courses as checked/selected.
*   [ ] **Task 4.5:** Implement `handleUpdate` with simulated delay and routing back to list.
