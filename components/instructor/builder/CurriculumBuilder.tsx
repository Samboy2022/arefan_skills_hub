"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save } from "lucide-react";
import { ModuleItem } from "./ModuleItem";
import { LessonFormModal } from "./LessonFormModal";
import { ModuleFormModal } from "./ModuleFormModal";

// Types
export type LessonType = "video" | "audio" | "pdf" | "text" | "quiz" | "assignment";

export interface Lesson {
  id: string;
  title: string;
  lessonType: LessonType;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface CurriculumBuilderProps {
  initialModules: Module[];
  courseId: string;
}

export function CurriculumBuilder({ initialModules, courseId }: CurriculumBuilderProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [modalTargetModuleId, setModalTargetModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Module DnD ───────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => {
    setActiveModuleId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveModuleId(null);
    if (over && active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((m) => m.id === active.id);
        const newIndex = items.findIndex((m) => m.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((mod, i) => ({
          ...mod,
          order: i + 1,
        }));
      });
    }
  };

  // ─── Module CRUD ──────────────────────────────────────────────────
  const handleAddModuleClick = () => {
    setEditingModuleId(null);
    setIsModuleModalOpen(true);
  };

  const handleEditModuleClick = (moduleId: string) => {
    setEditingModuleId(moduleId);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = (data: { title: string; description: string }) => {
    if (editingModuleId) {
      setModules((curr) =>
        curr.map((m) =>
          m.id === editingModuleId ? { ...m, title: data.title, description: data.description } : m
        )
      );
    } else {
      const newModule: Module = {
        id: `mod_${Date.now()}`,
        courseId,
        title: data.title,
        description: data.description,
        order: modules.length + 1,
        lessons: [],
      };
      setModules((curr) => [...curr, newModule]);
    }
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules((curr) =>
      curr.filter((m) => m.id !== moduleId).map((m, i) => ({ ...m, order: i + 1 }))
    );
  };

  // ─── Lesson CRUD ──────────────────────────────────────────────────
  const handleLessonsReordered = (moduleId: string, updatedLessons: Lesson[]) => {
    setModules((curr) =>
      curr.map((m) => (m.id === moduleId ? { ...m, lessons: updatedLessons } : m))
    );
  };

  const handleAddLessonClick = (moduleId: string) => {
    setModalTargetModuleId(moduleId);
    setEditingLessonId(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLessonClick = (moduleId: string, lessonId: string) => {
    setModalTargetModuleId(moduleId);
    setEditingLessonId(lessonId);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (moduleId: string, data: any) => {
    setModules((curr) =>
      curr.map((mod) => {
        if (mod.id !== moduleId) return mod;
        let lessons = [...mod.lessons];
        if (editingLessonId) {
          lessons = lessons.map((l) =>
            l.id === editingLessonId ? { ...l, ...data } : l
          );
        } else {
          lessons.push({
            id: `les_${Date.now()}`,
            title: data.title,
            lessonType: data.lessonType,
            order: lessons.length + 1,
          });
        }
        return { ...mod, lessons };
      })
    );
    setIsLessonModalOpen(false);
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules((curr) =>
      curr.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons
            .filter((l) => l.id !== lessonId)
            .map((l, i) => ({ ...l, order: i + 1 })),
        };
      })
    );
  };

  const handleSaveAll = () => {
    console.log("Saving curriculum:", modules);
    alert("Curriculum saved successfully!");
  };

  const activeModule = modules.find((m) => m.id === activeModuleId);
  const editingModule = editingModuleId ? modules.find((m) => m.id === editingModuleId) : null;

  return (
    <div className="space-y-0">
      {/* Sticky Top Save Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-background border border-border rounded-t-md sticky top-0 z-10 shadow-sm">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{modules.length}</span> section{modules.length !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
          <span className="font-semibold text-foreground">
            {modules.reduce((sum, m) => sum + m.lessons.length, 0)}
          </span>{" "}
          lessons total
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveAll}>
            Save Draft
          </Button>
          <Button size="sm" onClick={handleSaveAll} className="gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Save &amp; Publish
          </Button>
        </div>
      </div>

      {/* Builder Area */}
      <div className="border border-t-0 border-border rounded-b-md bg-muted/5 p-6 space-y-4">
        {modules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3 border-2 border-dashed border-border rounded-md bg-background">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground">No sections yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start building your course by adding your first section below.
            </p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {modules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  totalModules={modules.length}
                  onLessonsReordered={handleLessonsReordered}
                  onAddLesson={handleAddLessonClick}
                  onEditLesson={handleEditLessonClick}
                  onDeleteLesson={handleDeleteLesson}
                  onDeleteModule={handleDeleteModule}
                  onEditModule={handleEditModuleClick}
                />
              ))}
            </div>
          </SortableContext>

          {/* Ghost module while dragging */}
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }),
            }}
          >
            {activeModule ? (
              <div className="bg-card border-2 border-primary rounded-md shadow-2xl p-4 opacity-90">
                <p className="font-semibold text-sm">{activeModule.title}</p>
                <p className="text-xs text-muted-foreground">{activeModule.lessons.length} lesson{activeModule.lessons.length !== 1 ? "s" : ""}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add Section */}
        <button
          onClick={handleAddModuleClick}
          className="w-full mt-2 py-3 border-2 border-dashed border-border rounded-md text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
        >
          <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add Section
        </button>
      </div>

      {/* Modals */}
      <ModuleFormModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
        editingModule={editingModule}
      />

      <LessonFormModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        moduleId={modalTargetModuleId}
        editingLesson={
          editingLessonId && modalTargetModuleId
            ? modules.find((m) => m.id === modalTargetModuleId)?.lessons.find((l) => l.id === editingLessonId)
            : undefined
        }
      />
    </div>
  );
}
