"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Edit2,
  Trash2,
  Video,
  FileText,
  FileAudio,
  File,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lesson, LessonType } from "./CurriculumBuilder";

interface LessonItemProps {
  lesson: Lesson;
  moduleId: string;
  onEdit: (moduleId: string, lessonId: string) => void;
  onDelete: (moduleId: string, lessonId: string) => void;
}

const LESSON_META: Record<LessonType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  video:      { icon: <Video className="w-3.5 h-3.5" />,      color: "text-primary",       bg: "bg-primary/10",       label: "Video" },
  text:       { icon: <FileText className="w-3.5 h-3.5" />,   color: "text-blue-500",      bg: "bg-blue-500/10",      label: "Text" },
  pdf:        { icon: <File className="w-3.5 h-3.5" />,       color: "text-red-500",       bg: "bg-red-500/10",       label: "PDF" },
  audio:      { icon: <FileAudio className="w-3.5 h-3.5" />,  color: "text-amber-500",     bg: "bg-amber-500/10",     label: "Audio" },
  quiz:       { icon: <HelpCircle className="w-3.5 h-3.5" />, color: "text-purple-500",    bg: "bg-purple-500/10",    label: "Quiz" },
  assignment: { icon: <FileCheck className="w-3.5 h-3.5" />,  color: "text-emerald-500",   bg: "bg-emerald-500/10",   label: "Assignment" },
};

export function LessonItem({ lesson, moduleId, onEdit, onDelete }: LessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = LESSON_META[lesson.lessonType] ?? LESSON_META.text;

  const handleDelete = () => {
    if (confirm(`Delete "${lesson.title}"?`)) {
      onDelete(moduleId, lesson.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-md border bg-background transition-all ${
        isDragging
          ? "shadow-lg ring-2 ring-primary border-primary opacity-90 z-50"
          : "border-border hover:border-border/80 hover:shadow-sm"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground touch-none"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Type icon pill */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${meta.bg} ${meta.color}`}>
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Lecture {String(lesson.order).padStart(2, "0")}
          </span>
          <Badge
            variant="outline"
            className={`text-[9px] h-4 py-0 px-1 uppercase tracking-wider font-semibold border-0 ${meta.bg} ${meta.color}`}
          >
            {meta.label}
          </Badge>
        </div>
        <p className="text-sm font-medium text-foreground truncate leading-tight mt-0.5">
          {lesson.title}
        </p>
      </div>

      {/* Actions — only visible on hover */}
      <div className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
          onClick={() => onEdit(moduleId, lesson.id)}
          title="Edit lesson"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
          title="Delete lesson"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
