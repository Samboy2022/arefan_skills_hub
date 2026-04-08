"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  GripVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonItem } from "./LessonItem";
import { Module, Lesson } from "./CurriculumBuilder";

interface ModuleItemProps {
  module: Module;
  totalModules: number;
  onLessonsReordered: (moduleId: string, lessons: Lesson[]) => void;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (moduleId: string, lessonId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditModule: (moduleId: string) => void;
}

export function ModuleItem({
  module,
  totalModules,
  onLessonsReordered,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onDeleteModule,
  onEditModule,
}: ModuleItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = module.lessons.findIndex((l) => l.id === active.id);
      const newIndex = module.lessons.findIndex((l) => l.id === over.id);
      onLessonsReordered(
        module.id,
        arrayMove(module.lessons, oldIndex, newIndex).map((l, i) => ({ ...l, order: i + 1 }))
      );
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete section "${module.title}" and all ${module.lessons.length} lesson(s) inside it?`)) {
      onDeleteModule(module.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-card shadow-sm transition-shadow ${
        isDragging ? "opacity-40 shadow-xl ring-2 ring-primary" : ""
      }`}
    >
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 rounded-t-lg border-b border-border">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none p-0.5 rounded"
          title="Drag to reorder section"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Section number + title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="shrink-0 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Section {String(module.order).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground truncate">{module.title}</span>
          {module.description && (
            <span className="hidden md:inline text-xs text-muted-foreground truncate">
              — {module.description}
            </span>
          )}
        </div>

        {/* Lesson count badge */}
        <Badge variant="secondary" className="shrink-0 text-[10px] h-5 px-1.5">
          <BookOpen className="w-2.5 h-2.5 mr-1" />
          {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
        </Badge>

        {/* Action buttons */}
        <div className="shrink-0 flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
            onClick={() => onAddLesson(module.id)}
            title="Add content"
          >
            <PlusCircle className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
            onClick={() => onEditModule(module.id)}
            title="Edit section"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            title="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Lessons Area ── */}
      {isExpanded && (
        <div className="px-4 pt-3 pb-4 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleLessonDragEnd}
          >
            <SortableContext
              items={module.lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {module.lessons.length > 0 ? (
                <div className="space-y-1.5">
                  {module.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      moduleId={module.id}
                      onEdit={onEditLesson}
                      onDelete={onDeleteLesson}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2 border-2 border-dashed border-border/60 rounded-md bg-muted/10">
                  <BookOpen className="w-7 h-7 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No lessons yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    Click <strong>+</strong> in the section header to add content.
                  </p>
                </div>
              )}
            </SortableContext>
          </DndContext>

          {/* Inline add lesson link at the bottom */}
          <button
            onClick={() => onAddLesson(module.id)}
            className="w-full mt-1 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-border hover:border-primary/50 rounded-md flex items-center justify-center gap-1.5 transition-all group"
          >
            <PlusCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Add lesson to this section
          </button>
        </div>
      )}
    </div>
  );
}
