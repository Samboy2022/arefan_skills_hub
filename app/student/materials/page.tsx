"use client";

import { useState } from "react";
import {
  FileText, Download, Eye, BookOpen, Search,
  ArrowLeft, ChevronRight, File, FileArchive, Image, Link2,
  Users, FolderOpen
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_MATERIALS, STUDENT_COURSES, STUDENT_MODULES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { format } from "date-fns";
import type { StudentMaterial } from "@/lib/student-types";
import { toast } from "sonner";
import { emptyBodyClass, emptyStateClass, emptyTitleClass, listCardClass, pageStackClass, statGridClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";
import { StudentTip } from "@/components/student/tip";

// ── File type helpers ──────────────────────────────────────────────────────────
const typeConfig: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  pdf:      { label: "PDF",      icon: <FileText className="h-5 w-5" />,    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  zip:      { label: "ZIP",      icon: <FileArchive className="h-5 w-5" />, cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  document: { label: "DOC",      icon: <File className="h-5 w-5" />,        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  image:    { label: "IMG",      icon: <Image className="h-5 w-5" />,       cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  link:     { label: "LINK",     icon: <Link2 className="h-5 w-5" />,       cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  video:    { label: "VIDEO",    icon: <FileText className="h-5 w-5" />,    cls: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
};

const getType = (t: string) => typeConfig[t] ?? typeConfig.document;

// ── Material Row ───────────────────────────────────────────────────────────────
function MaterialRow({ mat }: { mat: StudentMaterial }) {
  const tc = getType(mat.type);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Icon + Info */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10", tc.cls)} aria-hidden="true">
          {tc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-1">{mat.name}</p>
          {mat.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{mat.description}</p>
          )}
          <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded-md border border-border bg-muted/40">{tc.label}</span>
            <span>{mat.size}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{mat.uploaded_by}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Added {format(new Date(mat.uploaded_date), "MMM dd, yyyy")}</span>
            <span className="flex items-center gap-1" title="Downloads"><Download className="h-3 w-3" />{mat.download_count}<span className="sr-only"> downloads</span></span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs"
          aria-label={`View ${mat.name}`}
          onClick={() => toast.info(`Opening ${mat.name}…`)}
        >
          <Eye className="h-3.5 w-3.5" /> View
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs"
          aria-label={`Download ${mat.name}`}
          onClick={() => toast.success(`Downloading ${mat.name}`, { description: mat.size })}
        >
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
      </div>
    </div>
  );
}

// ── Course Materials View (modules + documents) ────────────────────────────────
function CourseMateriasView({
  courseId,
  onBack,
}: {
  courseId: string;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(
    STUDENT_MODULES.filter(m => m.course_id === courseId).map(m => m.id)
  ));

  const course = STUDENT_COURSES.find(c => c.id === courseId)!;
  const modules = STUDENT_MODULES.filter(m => m.course_id === courseId).sort((a, b) => a.order - b.order);
  const allMaterials = STUDENT_MATERIALS.filter(m => m.course_id === courseId);

  // Materials with no module (course-level)
  const courseLevelMaterials = allMaterials.filter(m => !m.module_id);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(modId) ? next.delete(modId) : next.add(modId);
      return next;
    });
  };

  const matchesSearch = (mat: StudentMaterial) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return mat.name.toLowerCase().includes(q) || (mat.description ?? "").toLowerCase().includes(q);
  };

  const totalMats = allMaterials.length;

  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Materials", href: "/student/materials" },
        { label: `${course.code} — ${course.name}` },
      ]} />

      {/* Back + Header */}
      <div>
        <Button variant="outline" size="sm" onClick={onBack} className="mb-3 gap-1.5">
          <ArrowLeft className="h-4 w-4" /> All Courses
        </Button>
        <h1 className="text-xl font-bold text-foreground">{course.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {course.code} · {totalMats} document{totalMats !== 1 ? "s" : ""} across {modules.length} module{modules.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documents..."
          aria-label="Search documents"
          className="h-10 bg-card pl-10 pr-4"
        />
      </div>

      {/* Course-level materials (no module) */}
      {courseLevelMaterials.filter(matchesSearch).length > 0 && (
        <Card className={listCardClass}>
          <div className="px-5 py-3 bg-muted/40 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Course Documents</p>
          </div>
          {courseLevelMaterials.filter(matchesSearch).map(mat => (
            <MaterialRow key={mat.id} mat={mat} />
          ))}
        </Card>
      )}

      {/* Per-Module accordion */}
      {modules.map(mod => {
        const mats = allMaterials.filter(m => m.module_id === mod.id).filter(matchesSearch);
        if (search && mats.length === 0) return null;
        const isOpen = expandedModules.has(mod.id);

        return (
          <Card key={mod.id} className={listCardClass}>
            {/* Module header */}
            <button
              onClick={() => toggleModule(mod.id)}
              aria-expanded={isOpen}
              className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:bg-muted/40"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center shrink-0 text-xs font-bold">
                {mod.order}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                <p className="text-xs text-muted-foreground">{mod.description} · {mats.length} file{mats.length !== 1 ? "s" : ""}</p>
              </div>
              <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-90")} />
            </button>

            {/* Expanded document list */}
            {isOpen && (
              <div className="border-t border-border">
                {mats.length === 0 ? (
                  <div className={cn(emptyStateClass, "m-3 py-10")}>
                    <p className={emptyTitleClass}>No documents found</p>
                    <p className={emptyBodyClass}>This module does not have files yet.</p>
                  </div>
                ) : (
                  mats.map(mat => <MaterialRow key={mat.id} mat={mat} />)
                )}
              </div>
            )}
          </Card>
        );
      })}

      {search.trim() && allMaterials.filter(matchesSearch).length === 0 && (
        <div className={emptyStateClass}>
          <Search className="mb-3 h-8 w-8 text-muted-foreground/60" />
          <p className={emptyTitleClass}>No documents match “{search}”</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearch("")}>Clear search</Button>
        </div>
      )}
    </div>
  );
}

// ── Main Landing: Course Cards ─────────────────────────────────────────────────
export default function MaterialsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (selectedCourseId) {
    return <CourseMateriasView courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
  }

  // Enrolled courses that have materials
  const enrolledCourseIds = [...new Set(STUDENT_MATERIALS.map(m => m.course_id))];
  const totalMaterials = STUDENT_MATERIALS.length;
  const totalDownloads = STUDENT_MATERIALS.reduce((sum, m) => sum + m.download_count, 0);

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Materials" }]} />

      <PageHeader
        title="Study Materials"
        description="Access and download course resources and module documents."
      />

      <StudentTip>
        Files stay available for the rest of the semester. Download copies you need before access closes.
      </StudentTip>

      <div className={statGridClass}>
        <StudentKPICard title="Total Documents" value={totalMaterials} icon={FileText} />
        <StudentKPICard title="Courses" value={enrolledCourseIds.length} icon={BookOpen} />
        <StudentKPICard title="Modules" value={STUDENT_MODULES.filter(m => enrolledCourseIds.includes(m.course_id)).length} icon={FolderOpen} />
        <StudentKPICard title="Downloads" value={totalDownloads} icon={Download} variant="info" />
      </div>

      {/* Course Cards Grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Select a Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourseIds.map(courseId => {
            const course = STUDENT_COURSES.find(c => c.id === courseId);
            if (!course) return null;
            const courseMats = STUDENT_MATERIALS.filter(m => m.course_id === courseId);
            const courseModules = STUDENT_MODULES.filter(m => m.course_id === courseId);
            const fileTypes = [...new Set(courseMats.map(m => m.type))];

            return (
              <Card
                key={courseId}
                role="button"
                tabIndex={0}
                aria-label={`Open materials for ${course.code} ${course.name}`}
                onClick={() => setSelectedCourseId(courseId)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedCourseId(courseId); } }}
                className="group cursor-pointer gap-0 overflow-hidden rounded-2xl border-border py-0 shadow-none transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 mb-2">{course.code}</span>
                  <h3 className="font-bold text-foreground mb-1 line-clamp-2 leading-snug">{course.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{course.instructor}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="h-3.5 w-3.5" />
                      {courseModules.length} module{courseModules.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {courseMats.length} file{courseMats.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      {fileTypes.map(t => {
                        const tc = getType(t);
                        return (
                          <span key={t} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase", tc.cls)}>
                            {tc.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
