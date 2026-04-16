# Instructor Courses Display Redesign Specification

## 1. Directory Structure & Files Targeted
- **Target Page:** `app/instructor/courses/page.tsx`
- **Existing Component:** `components/instructor/instructor-course-card.tsx` (Serves as "Normal Card")
- **New Components to Create:** 
  - `components/instructor/course-list-item.tsx` (Serves as "Title Card" or List View)
  - `components/instructor/course-data-table.tsx` (Serves as "Data-Table")
  - `components/instructor/course-view-toolbar.tsx` (Controls for Sorting and View Mode toggles)

## 2. Detailed Technical Specification & Architecture

### State Management
We will introduce specific local states inside `page.tsx`:
- `viewMode`: (`'grid' | 'list' | 'table'`) Defaults to 'grid'. Controls which component maps over the courses array.
- `sortBy`: (`'title' | 'enrollment_desc' | 'created_newest' | 'code'`) Defaults to newest.
- `searchQuery`: (`string`) Allow immediate text-based filtering.

### Sorting & Transformation Logic (Laravel API Compatibility)
Right now, the app uses mocked data via `MOCK_INSTRUCTOR_COURSES`. 
- **Current Setup:** We will use `useMemo` to sort and filter the data client-side before rendering. This keeps the UX incredibly snappy.
- **Future Laravel Setup:** We will structure our sorting parameters so that they translate directly into typical Laravel REST query syntax (`?sort_by=title&sort_dir=asc`). This ensures that swapping the frontend hook out for an SWR or React Query hook calling the backend will require *almost zero* UI rewrite. 

## 3. UX Changes & Improvements

### View Modes
1. **Normal Card (Grid View):** Uses the current `InstructorCourseCard`. Ideal for visual browsing when instructors have fewer thumbnails to scan.
2. **Title Card (List View):** A horizontal, compact bar spanning `w-full`. Thumbnail gracefully sits on the left, primary metadata in the center, and call-to-actions aligned to the right. Excellent for quick scannability.
3. **Data-Table:** A structured tabular format. Eliminates the thumbnail in favor of high-density data reading: `Code`, `Course Title`, `Semester`, `Enrollment Count / Max Students`, `Credits`, and `Actions`. Perfect for large datasets.

### Controls Sub-Header Toolkit
Between the Course Stats Cards and the actual Course list, a new toolbar will be introduced:
- A "Search courses..." input.
- A Select dropdown for `Sort By`.
- A Toggle Group (Grid, List, Table Icons) indicating the active view.

---

## 4. Implementation Guidelines: DOs and DON'Ts

### For UX and Frontend (What to Avoid & What to DO)

> [!WARNING]
> **What to AVOID (Bad UX that we will NOT do):**
> - **Avoid Cumulative Layout Shift (CLS):** Do not let the screen jump wildly when switching from Grid to List to Table. Wrap the view layers in min-height containers so switching views feels smooth, not jarring.
> - **Avoid Non-Persisted State:** Users get incredibly frustrated if they explicitly switch to "Table View", visit a course, click "back", and find the view reverted to "Grid View". (We will implement view mode persistence via `localStorage`).
> - **Avoid Desktop-Only Table Views:** Raw HTML tables break mobile interfaces. The Data-Table must become horizontally scrollable or transform on small breakpoints. 

> [!TIP]
> **What to ALWAYS DO (Best Practices we WILL implement):**
> - **Do Maintain Graceful Fallbacks:** If a course thumbnail fails to load, render a colorized placeholder based on the `course.code`. 
> - **Do Debounce Searches:** If we eventually link "Search" to a Laravel API endpoint, searching on every keystroke will kill the server. We will ensure search text state is pre-staged for debouncing.
> - **Do Highlight Selected View States:** Make sure the active View icon (List vs Grid) distinctly stands out using your platform's `text-primary` or `bg-primary/10` coloration.
