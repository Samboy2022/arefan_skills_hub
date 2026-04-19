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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
      {/* Icon + Info */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <div className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0", tc.cls)}>
          {tc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-1">{mat.name}</p>
          {mat.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{mat.description}</p>
          )}
          <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium uppercase text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted/30">{tc.label}</span>
            <span>{mat.size}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{mat.uploaded_by}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Added {format(new Date(mat.uploaded_date), "MMM dd, yyyy")}</span>
            <span className="flex items-center gap-1"><Download className="h-3 w-3" />{mat.download_count}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground h-7 sm:h-8 text-xs">
          <Eye className="h-3.5 w-3.5" /> View
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 h-7 sm:h-8 text-xs">
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
        { label: "Materials", href: "#" },
        { label: `${course.code} — ${course.name}` },
      ]} />

      {/* Back + Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-1 mb-1 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> All Courses
        </Button>
        <h1 className="text-xl font-bold text-foreground">{course.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {course.code} · {totalMats} document{totalMats !== 1 ? "s" : ""} across {modules.length} module{modules.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="pl-9"
        />
      </div>

      {/* Course-level materials (no module) */}
      {courseLevelMaterials.filter(matchesSearch).length > 0 && (
        <Card className="border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/30 border-b border-border">
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
          <Card key={mod.id} className="border-border overflow-hidden">
            {/* Module header */}
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-muted/20 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
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
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No documents found.</p>
                  </div>
                ) : (
                  mats.map(mat => <MaterialRow key={mat.id} mat={mat} />)
                )}
              </div>
            )}
          </Card>
        );
      })}
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

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Materials" }]} />

      <PageHeader
        title="Study Materials"
        description="Access and download course resources and module documents"
      />

      {/* ── Prominent summary bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center px-4 py-4 rounded-xl border border-border bg-muted/20 mb-8 mt-2">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/document.png" alt="Total Documents" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Documents</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{totalMaterials}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-l lg:border-r border-border px-4">
          <img src="https://img.icons8.com/scribby/96/book.png" alt="Courses" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Courses</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">{enrolledCourseIds.length}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <img src="https://img.icons8.com/scribby/96/stack.png" alt="Modules" className="h-12 w-12" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Modules</p>
            <p className="text-3xl font-extrabold text-foreground leading-none">
              {STUDENT_MODULES.filter(m => enrolledCourseIds.includes(m.course_id)).length}
            </p>
          </div>
        </div>
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
                onClick={() => setSelectedCourseId(courseId)}
                className="border-border cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all overflow-hidden group"
              >
                {/* Course colour bar */}
                <div className="h-1 bg-gradient-to-r from-primary/60 to-primary/20" />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{course.code}</p>
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
                          <span key={t} className={cn("text-[9px] font-bold px-1 py-0.5 rounded uppercase", tc.cls)}>
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
