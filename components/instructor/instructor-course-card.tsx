"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Pencil,
  FilePenLine,
  Trash2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Course } from "@/lib/instructor-types";

function enrollmentPct(course: Course) {
  if (!course.maxStudents) return 0;
  return Math.min(
    100,
    Math.round((course.enrollmentCount / course.maxStudents) * 100)
  );
}

type Variant = "active" | "archived";

export function InstructorCourseCard({
  course,
  variant = "active",
  onDelete,
}: {
  course: Course;
  variant?: Variant;
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pct = enrollmentPct(course);
  const atCapacity = course.enrollmentCount >= course.maxStudents;
  const initials =
    course.code.replace(/[^A-Za-z]/g, "").slice(0, 2) || "—";

  const viewHref = `/instructor/courses/${course.id}`;
  const editHref = `/instructor/courses/${course.id}/edit`;
  const contentHref = `/instructor/lessons?courseId=${encodeURIComponent(course.id)}`;

  if (variant === "archived") {
    return (
      <div className="h-full">
        <Card className="h-full bg-card group flex flex-col overflow-hidden border border-border/80 relative rounded-xl opacity-80 hover:opacity-100 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
          {/* Thumbnail Header area */}
          <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
            <div className="absolute inset-0 grayscale transition-all duration-500 group-hover:grayscale-0">
               <Image
                 src={course.thumbnail}
                 alt={course.title}
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 className="object-cover"
               />
            </div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Top Info Strip */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white uppercase shadow-sm border border-white/10">
                {course.code}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded bg-muted/80 backdrop-blur-md text-muted-foreground uppercase shadow-sm border border-border/50">
                Archived
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 pt-5 flex flex-col flex-1 bg-card relative z-0">
            <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
                 {course.credits} Credits · {course.semester}
               </span>
            </div>
            
            <Link href={viewHref} className="mb-4">
               <h4 className="font-bold text-base leading-snug group-hover:text-primary transition-colors text-foreground line-clamp-2">
                 {course.title}
               </h4>
            </Link>

            <div className="flex-1" />

            {/* Actions Footer */}
            <div className="pt-4 mt-2 border-t border-border/60 flex flex-wrap gap-2">
               <Button size="sm" variant="secondary" className="gap-1.5 transition-all duration-200" asChild>
                 <Link href={viewHref}>
                   <Eye className="h-3.5 w-3.5" /> View
                 </Link>
               </Button>
               <Button size="sm" variant="outline" className="gap-1.5 transition-all duration-200" asChild>
                 <Link href={editHref}>
                   <Pencil className="h-3.5 w-3.5" /> Edit
                 </Link>
               </Button>
               <Button
                 size="sm"
                 variant="outline"
                 className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                 onClick={() => setDeleteOpen(true)}
               >
                 <Trash2 className="h-3.5 w-3.5" /> Delete
               </Button>
            </div>
          </div>
        </Card>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this course section?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{course.code}</strong> —{" "}
                {course.title} from your list. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  onDelete(course.id);
                  setDeleteOpen(false);
                }}
              >
                Delete course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="group h-full bg-card hover:border-primary/40 hover:shadow-lg rounded-xl flex flex-col overflow-hidden border border-border/80 relative transition-all duration-300 hover:translate-y-[-4px]">
        {/* Thumbnail Header area */}
        <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden z-0">
          <Link href={viewHref} className="absolute inset-0 z-[1] block">
            <span className="sr-only">View {course.title}</span>
          </Link>
          <Image
            src={course.thumbnail}
            alt={`Course thumbnail for ${course.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top Info Strip */}
          <div className="absolute top-3 left-3 z-[2] flex gap-2">
            <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white uppercase shadow-sm border border-white/10">
              {course.code}
            </span>
          </div>

          {atCapacity && (
             <div className="absolute top-3 right-3 z-[2]">
               <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white uppercase shadow-sm">
                 <AlertCircle className="w-3.5 h-3.5" />
                 Full Capacity
               </span>
             </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 pt-5 flex flex-col flex-1 bg-card relative z-10">
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
               {course.credits} Credits · {course.semester}
             </span>
          </div>
          
          <Link href={viewHref} className="mb-4">
             <h4 className="font-bold text-base leading-snug group-hover:text-primary transition-colors text-foreground line-clamp-2">
               {course.title}
             </h4>
          </Link>

          {/* Instructor Block (Enrollment tracking for instructors) */}
          <div className="flex flex-col mb-6 bg-muted/30 rounded-lg p-3 border border-transparent group-hover:border-border/50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border shadow-sm">
                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {course.enrollmentCount} / {course.maxStudents} Enrolled
                </p>
                <div className="w-full bg-muted-foreground/20 rounded-full h-1.5 mt-1 overflow-hidden">
                   <div 
                      className={`h-full rounded-full ${atCapacity ? 'bg-amber-500' : 'bg-primary'}`} 
                      style={{ width: `${pct}%` }} 
                   />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Actions Footer */}
          <div className="pt-4 border-t border-border/60 flex flex-wrap gap-2">
             <Button size="sm" variant="default" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] flex-1 min-w-[100px]" asChild>
               <Link href={viewHref}>
                 <Eye className="h-3.5 w-3.5" /> View
               </Link>
             </Button>
             <Button size="sm" variant="secondary" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] flex-1 min-w-[100px]" title="Edit Settings" asChild>
               <Link href={editHref}>
                 <Pencil className="h-3.5 w-3.5" /> Edit
               </Link>
             </Button>
             <Button size="sm" variant="outline" className="gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] flex-1 min-w-[100px]" title="Manage Curriculum" asChild>
               <Link href={contentHref}>
                 <FilePenLine className="h-3.5 w-3.5" /> Content
               </Link>
             </Button>
             <Button
               size="sm"
               variant="outline"
               className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
               onClick={() => setDeleteOpen(true)}
               title="Delete Course"
             >
               <Trash2 className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course section?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to remove <strong>{course.code}</strong> —{" "}
              {course.title}. Students will lose access after the change is
              saved in production.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(course.id);
                setDeleteOpen(false);
              }}
            >
              Delete course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
