# Student Courses Display Redesign Specification

> **Status: `COMPLETED`** — All components implemented and verified. No further action required.

## 1. Directory Structure & Files Targeted
- **Target Page:** `app/student/courses/page.tsx`
- **New Components to Create:** 
  - `components/student/student-course-card.tsx` (Extracting the current hardcoded grid card for modularity "Normal Card")
  - `components/student/student-course-list-item.tsx` (Serves as "Title Card" or List View)
  - `components/student/student-course-data-table.tsx` (Serves as "Data-Table")
  - `components/student/course-view-toolbar.tsx` (Controls for Sorting and View Mode toggles)

## 2. Detailed Technical Specification & Architecture

### State Management
We will introduce specific local states inside the student `page.tsx`:
- `viewMode`: (`'grid' | 'list' | 'table'`) Defaults to 'grid'.
- `sortBy`: (`'name' | 'progress_desc' | 'recent' | 'code' | 'due_assignments'`) Defaults to 'recent'.
- `searchQuery`: (`string`) For filtering by course name or code.

### Sorting & Transformation Logic (Laravel API Compatibility)
By extracting the UI mapping into isolated components, we perfectly set the stage for pagination and backend-sorting. 
- **Current Setup:** Client-side sorting via `useMemo` leveraging the mocked `STUDENT_COURSES`.
- **Future Laravel Setup:** API-driven sorting using query parameters like `?search=Computer&sort=progress&dir=desc`. 

## 3. UX Changes & Improvements

### View Modes
1. **Normal Card (Grid View):** The current beautiful image cards with circular progress indicators and "due assignments" alerts. 
2. **Title Card (List View):** A horizontal layout. Thumbnail on the left. Course title, instructor, and progress tracking in the center. Resume/Syllabus buttons strictly on the right.
3. **Data-Table:** A structured view showing `Course Code`, `Name`, `Instructor`, `Progress (Linear Bar)`, `Due Tasks`, and `Grade` for completed courses. This allows students to quickly check which courses need the most attention.

### Controls Sub-Header Toolkit
Between the high-level KPI cards and the "Active Courses" section, we will inject a toolbar that contains:
- Interactive text search.
- A select menu for sorting courses (e.g., sorting by most urgent due assignments).
- View mode switcher (Grid, List, Table).

---

## 4. Implementation Guidelines: DOs and DON'Ts

### For UX and Frontend (What to Avoid & What to DO)

> [!WARNING]
> **What to AVOID (Bad UX that we will NOT do):**
> - **Avoid duplicating messy code:** The student page currently hardcodes the huge card HTML inside the `.map()`. We MUST extract it so the parent file stays clean and readable. 
> - **Avoid breaking mobile layouts:** Student tables must employ `overflow-x-auto` to allow horizontal scrolling on phones. Large tables that break viewport bounds are unacceptable.
> - **Avoid inconsistent heights:** When in grid mode, cards must flex-stretch so that uneven titles don't cause staggered, ugly grids.

> [!TIP]
> **What to ALWAYS DO (Best Practices we WILL implement):**
> - **Do Maintain Persistence:** Just like the instructor side, we will store `student-course-view` in `localStorage` so their preferences persist across sessions.
> - **Do Make Calls to Action Prominent:** The primary button/link across all layouts should visually guide the student to the "next logical step" (e.g., resuming a course or viewing an urgent assignment).
> - **Do Keep Accessibility:** All links must have `aria-label`s, especially in the grid views.
