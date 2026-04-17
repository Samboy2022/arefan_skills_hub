# Instructor Course Grouping Feature Design

## Overview
The Course Grouping module empowers Instructors to organize learners within any given course into specific subgroups. This facilitates smaller scale assignments, separate discussion forums, or concentrated grading configurations. The module enables complete CRUD (Create, Read, Update, Delete) capabilities over Groups.

## User Flow & Specifications

### 1. Course Group Landing Page (Select Course)
- **Objective:** Allow an instructor to view a list of all their active courses to initiate group creation.
- **UI Elements:**
  - Standard page header with breadcrumbs.
  - A Data Table or ListView of all available courses (displays minimal details such as Course Title, Course Code, Enrolled Learners).
- **Actions:** 
  - Each course row includes a **"New Group"** button.
  - Clicking "New Group" navigates the instructor to the Create New Group wizard with the corresponding `courseId`.

### 2. Create Course Group
- **Objective:** Create a new cluster of learners for a predetermined course.
- **UX Form Elements:**
  - **Group Name:** TextInput block (Required).
  - **Description:** TextArea for group purpose.
  - **Pick Group Members:** A multi-select UI interface (Checkboxes or dual-listbox). It must populate fully with a list of "Course Learners" specific to that active course.
- **Action:** 
  - A primary **"Create Group"** submit button securely transmits the relational mapping.
  - Upon successful creation, the system triggers a success toast notification and redirects the user to the *Manage Course Group (List Groups)* view.

### 3. Manage Course Group (List Groups)
- **Objective:** Provides a comprehensive directory of all existing groups currently being managed.
- **UI Elements:**
  - A central Table rendering all Course Groups.
  - Columns: `Group Name`, `Associated Course`, `Total Members`.
- **Actions (Row Level):**
  - **Details:** Navigates the user to the View Course Group mode.
  - **Edit:** Navigates the user to the Edit Course Group mode.
  - **Trash (Delete):** Triggers the Delete flow.

### 4. View Course Group
- **Objective:** A read-only representation of the Course Group details.
- **UI Elements:**
  - Renders the Group Name and Description boldly.
  - Provides a stylized list or grid displaying the avatars and names of all associated Course Learners inside the group.

### 5. Edit Course Group
- **Objective:** Allows modification of an existing group (e.g. adding new members or fixing a typo).
- **UX Form Elements:**
  - Same visual structure as the *Create* mode, but pre-hydrated with the current data.
- **Action:** 
  - Primary button titled **"Update Group"**.
  - Persists data to the database and routes the user back to the *List Groups* page.

### 6. Delete Course Group
- **Objective:** Secure deletion mechanism to prevent accidental destructiveness.
- **UX:**
  - Triggered by clicking "Trash".
  - Instantly spawns a Modal Dialog acting as an interstitial warning.
  - The warning explicitly asks to confirm deletion.
- **Actions:**
  - **"Yes, Continue to delete"** (Red/Destructive Variant button).
  - **"Cancel"** (Outline/Secondary Variant button).

## UX/UI Principles & Best Practices
- **DO NOT** use generic native system alerts for the delete confirmation; always use a well-styled React Radix/Tailwind dialog modal component.
- **DO** ensure the "Pick group members" input efficiently handles scale (e.g. if a course has 200 learners, a searchable multi-select or dual-listbox is mandatory).
- **DO NOT** allow the instructor to mix learners from *different* courses into the same group. Groups are strictly isolated children of Courses.
- **DO** ensure state-persistence on the Manage Course tables (e.g. remembering paginated locations or filter sorts).
