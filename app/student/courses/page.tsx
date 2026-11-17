"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, isToday, isValid } from "date-fns";
import { ArrowRight, BookOpen, CheckCircle2, Lock, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, pageStackClass } from "@/lib/student-ui";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES, STUDENT_LESSONS, STUDENT_MODULES, STUDENT_PROGRESS } from "@/lib/student-mock-data";
import type { StudentCourse } from "@/lib/student-types";

type StatusFilter = "all" | "active" | "completed";

/** Fallback banner colours, shown behind/instead of a missing thumbnail. */
const BANNERS = [
  "from-emerald-500 to-emerald-700",
  "from-sky-500 to-indigo-600",
  "from-amber-400 to-orange-600",
  "from-violet-500 to-fuchsia-600",
  "from-rose-500 to-pink-600",
  "from-teal-500 to-cyan-600",
];

/** First lesson the student hasn't finished in a course (skips locked ones). */
function nextLesson(courseId: string) {
  const lessons = STUDENT_LESSONS.filter(l => l.course_id === courseId).sort((a, b) => a.order - b.order);
  return lessons.find(l => !l.completed && !l.is_locked) ?? lessons.find(l => !l.completed) ?? null;
}

function moduleInfo(moduleId: string) {
  const mod = STUDENT_MODULES.find(m => m.id === moduleId);
  const count = STUDENT_LESSONS.filter(l => l.module_id === moduleId).length;
  return { mod, count };
}

const hasThumb = (c: StudentCourse) => !!c.thumbnail && !c.thumbnail.startsWith("/placeholder");

function CourseCard({ course, index }: { course: StudentCourse; index: number }) {
  const completed = course.status === "completed";
  return (
    <Link
      prefetch={false}
      href={`/student/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={cn("relative h-32 overflow-hidden bg-gradient-to-br sm:h-36", BANNERS[index % BANNERS.length])}>
        {hasThumb(course) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt=""
            loading="lazy"
            className={cn("h-full w-full object-cover transition-transform duration-300 group-hover:scale-105", completed && "grayscale")}
          />
        )}
        {completed && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            Completed
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
          {course.code}
        </span>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">{course.name}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {course.instructor} · {course.credits} credits
        </p>
        {!completed && (
          <div className="mt-auto flex items-center gap-2 pt-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">{course.progress}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MyCoursesPage() {
  return (
    <Suspense fallback={null}>
      <MyCoursesContent />
    </Suspense>
  );
}

function MyCoursesContent() {
  const searchParams = useSearchParams();
  const session = (searchParams.get("session") ?? "2024-2025").replace("-", "/");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const activeCourses = STUDENT_COURSES.filter(c => c.status === "active");

  // Resume: the course studied most recently
  const resume = useMemo(() => {
    const latest = [...STUDENT_PROGRESS].sort(
      (a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime(),
    )[0];
    const course = STUDENT_COURSES.find(c => c.id === latest?.course_id && c.status === "active") ?? activeCourses[0];
    if (!course) return null;
    const lesson = nextLesson(course.id);
    const { mod } = lesson ? moduleInfo(lesson.module_id) : { mod: undefined };
    const progress = STUDENT_PROGRESS.find(p => p.course_id === course.id);
    return { course, lesson, mod, lastActivity: progress ? new Date(progress.last_activity) : null };
  }, [activeCourses]);

  // Coming up next: the next module in each of the other active courses
  const upcoming = useMemo(
    () =>
      activeCourses
        .filter(c => c.id !== resume?.course.id)
        .map(c => {
          const lesson = nextLesson(c.id);
          if (!lesson) return null;
          const { mod, count } = moduleInfo(lesson.module_id);
          return { course: c, lesson, mod, count };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .slice(0, 3),
    [activeCourses, resume],
  );

  const courses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENT_COURSES.filter(c => c.status === "active" || c.status === "completed")
      .filter(c => status === "all" || c.status === status)
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      // in-progress first, completed last
      .sort((a, b) => Number(a.status === "completed") - Number(b.status === "completed"));
  }, [query, status]);

  const resumeHref = resume
    ? resume.lesson
      ? `/student/courses/${resume.course.id}/lessons/${resume.lesson.id}`
      : `/student/courses/${resume.course.id}`
    : "/student/courses";

  const lastStudied =
    resume?.lastActivity && isValid(resume.lastActivity)
      ? isToday(resume.lastActivity)
        ? `today at ${format(resume.lastActivity, "HH:mm")}`
        : format(resume.lastActivity, "MMM d 'at' HH:mm")
      : null;

  return (
    <div className={pageStackClass}>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Courses</h1>

      {/* Resume + Coming up next (compact) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-2xl border border-primary/15 bg-primary/5 p-4 shadow-sm lg:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold">Pick up where you left off</h2>
            {lastStudied && <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">Last studied {lastStudied}</span>}
          </div>
          {resume ? (
            <div className="mt-3 flex items-center gap-3 sm:gap-4">
              <Link
                prefetch={false}
                href={resumeHref}
                aria-label={`Resume ${resume.lesson?.title ?? resume.course.name}`}
                className="group relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 sm:h-16 sm:w-24"
              >
                {hasThumb(resume.course) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resume.course.thumbnail} alt="" className="h-full w-full object-cover" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/45">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground">
                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                  </span>
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">
                  {resume.course.name}
                  {resume.mod ? ` · Module ${resume.mod.order}` : ""}
                </p>
                <p className="truncate font-bold text-primary sm:text-lg">{resume.lesson?.title ?? "Course overview"}</p>
                <div className="mt-1 flex items-center gap-2">
                  {resume.lesson && (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                      Lesson {resume.lesson.order} · {resume.lesson.duration} min
                    </span>
                  )}
                  <div className="h-1.5 max-w-xs flex-1 overflow-hidden rounded-full bg-primary/15">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${resume.course.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{resume.course.progress}%</span>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0 gap-1.5">
                <Link prefetch={false} href={resumeHref} aria-label="Resume">
                  <span className="hidden sm:inline">Resume</span> <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">You have no active courses yet.</p>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold">Coming up next</h2>
          {upcoming.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nothing scheduled. You&apos;re all caught up.</p>
          ) : (
            <ul className="mt-1.5 divide-y divide-border">
              {upcoming.slice(0, 2).map(({ course, lesson, mod, count }) => (
                <li key={course.id}>
                  <Link prefetch={false} href={`/student/courses/${course.id}`} className="group flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-primary group-hover:underline">{mod?.title ?? lesson.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {course.code}
                        {mod ? ` · Module ${mod.order}` : ""} · {count} lessons
                      </p>
                    </div>
                    {lesson.is_locked ? (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="Locked" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Available now" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Enrolled courses */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-xl font-semibold">Enrolled courses</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {activeCourses.length} active
            </span>
            <span className="text-sm text-muted-foreground">Academic Year {session}</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64 md:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search your courses"
                aria-label="Search your courses"
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <Select value={status} onValueChange={v => setStatus(v as StatusFilter)}>
              <SelectTrigger className="h-10 w-36 shrink-0 bg-card" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                <SelectItem value="active">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className={emptyStateClass}>
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className={emptyTitleClass}>No courses found</h3>
            <p className={emptyBodyClass}>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} index={STUDENT_COURSES.indexOf(course)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
