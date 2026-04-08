"use client";

import { useState } from "react";
import {
  Bell, Calendar, ChevronRight, Globe, BookOpen,
  ArrowLeft, Megaphone, AlertTriangle, Info, CheckCircle, Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { COURSE_ANNOUNCEMENTS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import type { CourseAnnouncement } from "@/lib/student-types";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d: string) => {
  try { return format(new Date(d), "MMM dd, yyyy"); } catch { return d; }
};

const priorityConfig = {
  urgent:    { label: "Urgent",    cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",    icon: <AlertTriangle className="h-3 w-3" /> },
  important: { label: "Important", cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800", icon: <Info className="h-3 w-3" /> },
  normal:    { label: "Notice",    cls: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",     icon: <Megaphone className="h-3 w-3" /> },
};

// ── Announcement Row ──────────────────────────────────────────────────────────
function AnnouncementRow({ ann, onClick }: { ann: CourseAnnouncement; onClick: () => void }) {
  const p = priorityConfig[ann.priority ?? "normal"];
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
    >
      {/* Unread dot */}
      <div className="mt-1.5 shrink-0">
        {!ann.is_read
          ? <span className="h-2 w-2 rounded-full bg-primary block" />
          : <span className="h-2 w-2 rounded-full bg-transparent block" />}
      </div>

      <div className="flex-1 min-w-0">
        {/* Priority badge + date */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", p.cls)}>
            {p.icon}{p.label}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(ann.created_at)}</span>
        </div>
        <p className={cn("text-sm font-semibold line-clamp-1", !ann.is_read ? "text-foreground" : "text-foreground/80")}>
          {ann.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{ann.content}</p>
        <p className="text-xs text-muted-foreground mt-1">— {ann.instructor}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
    </button>
  );
}

// ── Announcement Detail ───────────────────────────────────────────────────────
function AnnouncementDetail({
  ann,
  others,
  onBack,
  onPickOther,
}: {
  ann: CourseAnnouncement;
  others: CourseAnnouncement[];
  onBack: () => void;
  onPickOther: (id: string) => void;
}) {
  const p = priorityConfig[ann.priority ?? "normal"];
  const course = ann.course_id ? STUDENT_COURSES.find(c => c.id === ann.course_id) : null;

  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Announcements", href: "#" },
        { label: ann.announcement_type === "general" ? "General" : (course?.code ?? "Course") },
        { label: ann.title },
      ]} />

      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2">
          <Card className="border-border overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {ann.announcement_type === "general" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800">
                    <Globe className="h-3 w-3" /> General
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-sky-200 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800">
                    <BookOpen className="h-3 w-3" /> {course?.code ?? "Course"}
                  </span>
                )}
                <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", p.cls)}>
                  {p.icon}{p.label}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {formatDate(ann.created_at)}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{ann.title}</h1>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4 text-sm text-foreground leading-relaxed">
              <p>Dear Students,</p>
              <p>{ann.content}</p>
              <p>Please ensure you have reviewed any supplementary materials in the Materials section. If you have any concerns, reach out during office hours or post in the discussion forum.</p>
              <p className="pt-2">
                Best regards,<br />
                <span className="font-semibold text-foreground">{ann.instructor}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Mark as read
              </span>
              <span className="text-xs text-muted-foreground">Published by Academic Staff</span>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Sender card */}
          <Card className="border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={ann.instructor_avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${ann.instructor}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{ann.instructor.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{ann.instructor}</p>
                <p className="text-xs text-muted-foreground">
                  {ann.announcement_type === "general" ? "Platform Administration" : "Course Instructor"}
                </p>
              </div>
            </div>
            {ann.course_id && course && (
              <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{course.code}</span> — {course.name}
              </div>
            )}
          </Card>

          {/* Other announcements */}
          {others.length > 0 && (
            <Card className="border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">More Announcements</p>
              </div>
              <div className="divide-y divide-border">
                {others.slice(0, 4).map(o => (
                  <button
                    key={o.id}
                    onClick={() => onPickOther(o.id)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {!o.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-2">{o.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(o.created_at)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Announcement List (General or Course) ──────────────────────────────────────
function AnnouncementList({
  announcements,
  title,
  description,
  isGeneral,
  onBack,
}: {
  announcements: CourseAnnouncement[];
  title: string;
  description: string;
  isGeneral: boolean;
  onBack: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set(announcements.filter(a => a.is_read).map(a => a.id)));

  const enriched = announcements.map(a => ({ ...a, is_read: readIds.has(a.id) }));
  const active = enriched.find(a => a.id === activeId);

  const handleOpen = (id: string) => {
    setActiveId(id);
    setReadIds(prev => new Set([...prev, id]));
  };

  if (active) {
    return (
      <AnnouncementDetail
        ann={active}
        others={enriched.filter(a => a.id !== activeId)}
        onBack={() => setActiveId(null)}
        onPickOther={handleOpen}
      />
    );
  }

  const unread = enriched.filter(a => !a.is_read).length;

  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Announcements", href: "#" },
        { label: isGeneral ? "General" : title },
      ]} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-1 mb-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> All Announcements
          </Button>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
        {unread > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Bell className="h-3.5 w-3.5" /> {unread} unread
          </span>
        )}
      </div>

      <Card className="border-border overflow-hidden">
        {enriched.length === 0 ? (
          <div className="py-16 text-center">
            <img src="https://img.icons8.com/color/96/bell.png" alt="No announcements" className="h-12 w-12 opacity-80 grayscale-[50%] mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {enriched.map(ann => (
              <AnnouncementRow key={ann.id} ann={ann} onClick={() => handleOpen(ann.id)} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Main Landing Page ──────────────────────────────────────────────────────────
type PageView = "landing" | "general" | { type: "course"; courseId: string };

export default function AnnouncementsPage() {
  const [view, setView] = useState<PageView>("landing");

  const generalAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => a.announcement_type === "general");
  const courseAnnouncements  = COURSE_ANNOUNCEMENTS.filter(a => a.announcement_type === "course");
  const courseIds = [...new Set(courseAnnouncements.map(a => a.course_id!))];

  const totalUnread = COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length;
  const generalUnread = generalAnnouncements.filter(a => !a.is_read).length;

  // Sub-views
  if (view === "general") {
    return (
      <AnnouncementList
        announcements={generalAnnouncements}
        title="General Announcements"
        description="Platform-wide updates from administration"
        isGeneral={true}
        onBack={() => setView("landing")}
      />
    );
  }

  if (typeof view === "object" && view.type === "course") {
    const course = STUDENT_COURSES.find(c => c.id === view.courseId);
    const anns = courseAnnouncements.filter(a => a.course_id === view.courseId);
    return (
      <AnnouncementList
        announcements={anns}
        title={`${course?.code} — ${course?.name}`}
        description={`Announcements from your ${course?.code} instructor`}
        isGeneral={false}
        onBack={() => setView("landing")}
      />
    );
  }

  // ── Landing ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Announcements" }]} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay informed about platform updates and your course news.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">{COURSE_ANNOUNCEMENTS.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/megaphone.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Total" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Unread</p>
            <p className="text-2xl font-bold text-primary">{totalUnread}</p>
          </div>
          <img src="https://img.icons8.com/color/96/new-message.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Unread" />
        </Card>
        <Card className="p-4 border-border relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1">Course</p>
            <p className="text-2xl font-bold text-foreground">{courseAnnouncements.length}</p>
          </div>
          <img src="https://img.icons8.com/color/96/teacher.png" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" alt="Course" />
        </Card>
      </div>

      {/* Two panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* General Announcements Pane */}
        <Card className="border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center border border-violet-200 dark:border-violet-800">
                <img src="https://img.icons8.com/color/96/commercial.png" alt="General" className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-foreground">General Announcements</h2>
                  {generalUnread > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">{generalUnread}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Platform-wide updates</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              System notifications, platform updates, and institution-wide messages published for all students.
            </p>
          </div>
          {/* Preview rows */}
          <div className="flex-1 divide-y divide-border">
            {generalAnnouncements.slice(0, 3).map(ann => {
              const p = priorityConfig[ann.priority ?? "normal"];
              return (
                <div key={ann.id} className="px-5 py-3 flex items-center gap-3">
                  {!ann.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  {ann.is_read && <span className="h-2 w-2 shrink-0" />}
                  <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-bold uppercase px-1 py-0.5 rounded border shrink-0", p.cls)}>
                    {p.icon}
                  </span>
                  <p className="text-sm text-foreground line-clamp-1 flex-1">{ann.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{formatDate(ann.created_at)}</span>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-border">
            <Button className="w-full gap-2" onClick={() => setView("general")}>
              <Eye className="h-4 w-4" /> View All General Announcements
            </Button>
          </div>
        </Card>

        {/* Course Announcements Pane */}
        <Card className="border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center border border-sky-200 dark:border-sky-800">
                <img src="https://img.icons8.com/color/96/books.png" alt="Course" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Course Announcements</h2>
                <p className="text-xs text-muted-foreground">From your instructors</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Updates from your course instructors — deadlines, schedule changes, exam notices and more.
            </p>
          </div>
          {/* Course list */}
          <div className="flex-1 divide-y divide-border">
            {courseIds.map(courseId => {
              const course = STUDENT_COURSES.find(c => c.id === courseId);
              const anns = courseAnnouncements.filter(a => a.course_id === courseId);
              const unread = anns.filter(a => !a.is_read).length;
              const latest = anns[0];
              return (
                <button
                  key={courseId}
                  onClick={() => setView({ type: "course", courseId })}
                  className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-muted/20 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{course?.code}</span>
                      {unread > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">{unread} new</span>}
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{course?.name}</p>
                    {latest && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{latest.title}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-foreground">{anns.length}</p>
                    <p className="text-[11px] text-muted-foreground">notices</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
