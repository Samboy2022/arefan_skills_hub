# Fnskills LMS

A school subscribes to a plan, registers, and waits for Super Admin approval. After approval it gets a dedicated subdomain on the Fnskills domain. That subdomain then has its own School Admin, Instructor, and Student logins. Until the subdomain is active, the school only has a registration dashboard.

- One subdomain per approved school
- Three logins on each subdomain: School Admin, Instructor, and Student
- Super Admin must approve the school before the subdomain is issued

## How a school joins

| Step | What happens | Where they land |
| --- | --- | --- |
| 1. Register | The school submits its information and selects a plan | Registration dashboard |
| 2. Wait | Super Admin reviews the school before any subdomain is issued | Registration dashboard |
| 3. Approve | Super Admin approves the school and activates the subdomain | `school` subdomain on the Fnskills domain |
| 4. Operate | That subdomain opens School Admin, Instructor, and Student dashboards | Three role logins |

The registration dashboard is the school's home before the subdomain exists. It shows the registered school, the selected plan, the school information, whether the subdomain is active or not active, support and tickets, and a request for a custom domain.

## Library and plagiarism

School Admin and Instructor both get a library and a plagiarism checker.

- School Admin uploads the school's library materials.
- A lecturer uploads books only for the courses they teach.
- Students can open the library.
- When a student submits a project, School Admin or the instructor can run the plagiarism check on that submission.

## Portals

| Portal | Persona | Home shows | Job |
| --- | --- | --- | --- |
| Registration | School waiting for approval | School, plan, school information, subdomain status, support, custom-domain request | Hold the application until the subdomain is active |
| Super Admin | Platform operator | Tenants, students, MRR, courses, renewals, revenue and growth charts | Approve schools, then govern every subdomain |
| School Admin | Institution operator | Students, instructors, classes, courses, attendance, fees, enrollment chart | Run one school's people, programs, and calendar |
| Instructor | Dr. Jane Smith | Courses, students, open assignments, lessons, response time, reviews | Build courses, teach live, and grade |
| Student | John | Active courses, completed courses, due-soon work, unread notices | Study, submit, and track grades |

### Registration dashboard

This is the school's dashboard after it registers and before Super Admin activates its subdomain. It is not a teaching dashboard. School Admin, Instructor, and Student logins open only after the subdomain is active.

| Block | Contents |
| --- | --- |
| Registered school | The school that submitted the application |
| Selected plan | The subscription the school chose |
| School information | The details entered at registration |
| Subdomain | Active or not active |
| Support | Support page and tickets |
| Custom domain | A request to use the school's own domain |

### Super Admin

Platform owner. A school cannot get a subdomain until this admin approves the registration. After approval, the school is a tenant on its own subdomain, with a plan and a status. The current home screen greets "Super Admin" and is built from mock tenant and revenue data.

Home metrics: registered schools (tenants), monthly recurring revenue, and renewals that need follow-up.

Dashboard widgets: six KPI cards, a revenue line chart, tenant acquisition, student distribution by education segment, top five tenants by enrollment, and a recent-tenants table.

| Section | Screens |
| --- | --- |
| Main | Dashboard |
| Management | Tenants, Subscriptions and Billing, Users, Courses |
| Analytics | Analytics, Transactions |
| Configuration | Branding and CMS, Roles and Permissions, Modules |
| System | Settings, Security, Audit Logs |
| Support | Support and Tickets |

Modules can be switched on or off. Core modules start enabled: courses, gradebook, discussions, video, assignments, analytics. Premium modules start off: certificates and gamification.

### School Admin

Runs one school on its subdomain. Counts on the current home page come from local storage, seeded the first time from the instructor and school mock files. Attendance (94.2%) and pending fees ($8,450) on the home page are still hard-coded.

Home metrics: enrolled students, active classes, and pending fee collections.

Dashboard widgets: six KPI cards, a program enrollment-versus-capacity bar chart, the latest students, recent announcements, and shortcuts to add a student, add an instructor, create a course, or open programs.

| Section | Screens |
| --- | --- |
| Main | Dashboard, Classes, Users (students), Instructors, Schedule |
| Academics | Programs, Courses, Assignments, Quizzes, Attendance |
| Operations | Communications, Reports |
| Configuration | School Settings, User Roles, Notifications |

School Admin also uploads every school library item and can run the plagiarism checker on a submitted project. Curriculum and lessons pages exist under `/school-admin` but are not in the sidebar. Student status can be Active, Inactive, Suspended, or Graduated. Class status can be Active, Planned, or Archived.

### Instructor

Teaching workspace for Dr. Jane Smith. Home numbers are computed from mock courses, students, assignments, lessons, and grades. Course groups have full create, list, edit, and member pages, but they are not in the sidebar.

Home metrics: active courses with seats filled, submissions waiting for review, and a 2.3 hour average reply time.

Dashboard widgets: six KPI cards, weekly activity, enrollments by course, students by course, top students by score, recent submissions, and the latest announcements.

| Section | Screens |
| --- | --- |
| Main | Dashboard, Courses (create, edit, publish, grading) |
| Assessments | Assignments with submission review, Quizzes and question builder |
| Students and grades | Student profile, message, submissions, grades; Attendance; Gradebook |
| Communication | Discussions, Updates (announcements) |
| Planning | Schedule and calendar, Live classes (create and start) |
| Learning | Analytics, Resources |
| Settings | Profile and preferences |

A lecturer uploads books only for the courses they teach, and can run the plagiarism checker when a student submits a project. Lesson types are video, PDF, quiz, live, assignment, and text. Quizzes support multiple choice, essay, true/false, and file questions. Assignments can be essay, file, online, or discussion.

### Student

Learning hub for John. Home is built from mock courses, assignments, and announcements. The course player uses Video.js, tracks progress, and walks lessons that can be locked until earlier ones are done.

Home metrics: active courses with credit total, finished courses, deadlines inside 7 days, and unread announcements.

Dashboard widgets: four KPI cards, a course grid with a progress ring, current grade, and due or unread counts, plus an urgent-deadlines list sorted soonest first.

| Section | Screens |
| --- | --- |
| Main | Dashboard, My Courses, course page, lesson player |
| Learning | Assignments, Quizzes (instructions, take, results), Live classes |
| Academic | Grades, plus a per-course grade breakdown |
| Communication | Discussions, Updates |
| Resources | Materials downloads |
| Account | Profile and edit profile |

Students can open the school library. They submit projects; School Admin and the instructor run the plagiarism check. Assignment status is pending, submitted, graded, late, or missing. Quizzes are graded, practice, or ungraded. Letter grades use a 90 / 80 / 70 / 60 scale.

## How a school is organized

Super Admin sells and provisions tenants. Inside a tenant, academics nest like this: Program, then Course, then modules and lessons. Classes, course groups, assignments, quizzes, live classes, and the gradebook all hang off a course.

| Layer | What it is | Who creates it |
| --- | --- | --- |
| Tenant | An approved school on its own Fnskills subdomain | School registers, Super Admin approves |
| Program | Certificate, Diploma, Degree, Masters, or PhD | School Admin |
| Course | A subject with credits, status, and enrollment cap | School Admin or Instructor |
| Class | A semester section with capacity and instructors | School Admin |
| Course group | A named cohort of students inside one course | Instructor |
| Lesson | Video, document, quiz, assignment, text, or live | Instructor |
| Assessment | Assignment or quiz, attached to course, module, or lesson | Instructor, visible to School Admin |
| Library | School-wide materials, plus course books from lecturers | School Admin and Instructor upload, Student reads |
| Plagiarism check | A check run on a submitted project | School Admin and Instructor |

## Feature coverage

Registration, library, plagiarism, and custom-domain request are product rules. The other rows are the screens already in the app.

| Feature | Super Admin | School Admin | Instructor | Student |
| --- | --- | --- | --- | --- |
| Home dashboard | Platform KPIs | School KPIs | Teaching KPIs | Learning hub |
| People | All platform users | Students and instructors | Enrolled students | Own profile |
| Courses | Cross-tenant catalog | Create, edit, publish, grade | Build and publish | Study and progress |
| Programs and classes | — | Full management | — | — |
| Assignments | — | List, edit, view submissions | Create and grade | Submit and see feedback |
| Quizzes | — | List and questions | Create and questions | Instructions, take, results |
| Gradebook | — | Course grading page | Full gradebook | Grades by course |
| Attendance | — | School attendance | Course attendance | Shown on live classes |
| Schedule | — | School calendar | Personal calendar | Deadlines on dashboard |
| Live classes | Module toggle | — | Create, start, host | Join a session |
| Discussions | Module toggle | Communications | Course forums | Forums and replies |
| Announcements | — | Communications feed | Create and schedule | Read updates |
| Billing | Plans, MRR, transactions | Pending fees on dashboard | — | — |
| Roles | Platform roles | Admin, Tutor, Learner, Accountant | — | — |
| Registration | Approves the school and subdomain | Sees own application until approved | — | — |
| Library | — | Uploads any school file and readers can open or download it | Uploads course files students can open or download | Reads, plays, and downloads library files |
| Plagiarism checker | — | Runs a check on a submitted project | Runs a check on a submitted project | Submits the project |
| Custom domain | Approves the request | Requests one from registration | — | — |
| Settings and security | Branding, modules, audit, security | School settings, notifications | Profile and preferences | Profile edit |

## School permission roles

These are templates inside a school, edited at User Roles. They do not have their own login or dashboard yet.

| Role | Scope | Can do |
| --- | --- | --- |
| Admin | System, MFA | Full CRUD on school features |
| Tutor | Campus | Classes, attendance, assessments |
| Learner | Campus | Read courses, classes, assessments |
| Accountant | Department, MFA, IP lock | Finance and reports |

## Plans sold on the marketing site

Super Admin tenant records use free, starter, pro, and enterprise. The public pricing page sells three paid tiers.

| Plan | Price | Fit |
| --- | --- | --- |
| Starter | $49 / month | Up to 100 students, 5 instructors |
| Professional | $199 / month | 1,000 students, Zoom, gradebook |
| Enterprise | Custom | Unlimited, SSO, white-label, on-prem |

## Demo sign-in

Choose a role at `/login`, then use the matching demo account. Any other password is rejected.

| Portal | Email | Password | Lands on |
| --- | --- | --- | --- |
| Super Admin | admin@fnskills.com | admin123 | `/super-admin` |
| School Admin | admin@school.com | admin123 | `/school-admin` |
| Instructor | instructor@fnskills.com | instructor123 | `/instructor` |
| Student | student@fnskills.com | student123 | `/student` |

## Routes added for registration, library, and plagiarism

These screens store data in the browser. Approving a registration marks the subdomain active and adds the school to the Super Admin tenant list. The plagiarism pages are a report layout only. Run check does not call a service.

| Route | Who | What it does |
| --- | --- | --- |
| `/register` | Public | One expandable form for school information, admin account, plan, and subdomain |
| `/registration` | Applicant | Sidebar dashboard: subdomain status, checklist, and activity |
| `/registration/school` | Applicant | Review and update school details while the application is pending |
| `/registration/plan` | Applicant | Selected plan and a request to change it |
| `/registration/documents` | Applicant | Logo, accreditation, and admin identification file names |
| `/registration/support` | Applicant | Open and read support tickets |
| `/registration/domain` | Applicant | Request a custom domain, see the CNAME, and recheck |
| `/super-admin/registrations` | Super Admin | Approve or reject applications |
| `/school-admin/library` | School Admin | Full catalog, with hide, slider, upload, and edit on each title |
| `/school-admin/library/organize` | School Admin | Add categories and subcategories, order the home slider, and move titles |
| `/instructor/library` | Instructor | Books for the courses they teach |
| `/library` | Anyone | Public catalog published by instructors and school admins |
| `/student/library` | Student | The same catalog inside the student dashboard |
| `/school-admin/plagiarism` | School Admin | Similarity inbox and report preview |
| `/instructor/plagiarism` | Instructor | Similarity inbox and report preview |

