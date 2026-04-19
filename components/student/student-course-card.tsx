"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import type { StudentCourse } from "@/lib/student-types";

interface StudentCourseCardProps {
  course: StudentCourse;
  variant?: "active" | "completed";
}

export function StudentCourseCard({
  course,
  variant = "active",
}: StudentCourseCardProps) {
  const href = `/student/courses/${course.id}`;
  const isCompleted = variant === "completed";

  return (
    <Link
      href={href}
      className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View ${isCompleted ? 'completed ' : 'active '}course: ${course.name}`}
    >
      <Card className="h-full bg-card hover:border-primary/40 hover:shadow-lg rounded-xl flex flex-col overflow-hidden border border-border/80 relative">
        {/* Thumbnail Header area */}
        <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={`Course thumbnail for ${course.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Subtle gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top Info Strip */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white uppercase shadow-sm border border-white/10">
              {course.code}
            </span>
          </div>

          {!isCompleted && course.due_assignments > 0 && (
             <div className="absolute top-3 right-3">
               <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white uppercase shadow-sm">
                 <AlertCircle className="w-3.5 h-3.5" />
                 {course.due_assignments} Task{course.due_assignments !== 1 ? "s" : ""}
               </span>
             </div>
          )}
          
        </div>

        {/* Content Body */}
        <div className="p-5 pt-8 flex flex-col flex-1 bg-card relative z-0">
          {/* Progress Indicator floating on thumbnail boundary */}
          <div className="absolute -top-[35px] right-5 z-10 shrink-0">
            <div className="bg-card rounded-full flex items-center justify-center shadow-md border border-border/50 w-[70px] h-[70px]">
               {isCompleted ? (
                 <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center border-[4px] border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
                   <CheckCircle className="w-8 h-8" />
                 </div>
               ) : (
                 <CircularProgress
                   value={course.progress}
                   size={60}
                   strokeWidth={5}
                   className="shrink-0"
                   labelClassName="text-sm font-bold text-foreground"
                 />
               )}
            </div>
          </div>

          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
               {course.credits} Credits
             </span>
          </div>
          
          <h4 className="font-bold text-base leading-snug group-hover:text-primary transition-colors text-foreground mb-4 line-clamp-2">
            {course.name}
          </h4>

          {/* Instructor Block */}
          <div className="flex items-center gap-3 mb-6 bg-muted/30 rounded-lg p-2.5 border border-transparent group-hover:border-border/50 transition-colors">
            <Avatar className="h-8 w-8 border border-border shadow-sm">
              <AvatarImage src={course.instructor_avatar} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {course.instructor.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {course.instructor}
              </p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">
                Instructor
              </p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Footer Metrics */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
             <div className="flex items-center gap-2">
                {!isCompleted && course.unread_announcements > 0 && (
                   <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-2 py-1 rounded">
                      {course.unread_announcements} New
                   </span>
                )}
                {isCompleted && (
                   <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded">
                     <CheckCircle className="w-3 h-3" /> Completed
                   </span>
                )}
             </div>
             
             <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Grade</span>
                <span className="text-sm font-black text-foreground">{course.grade}</span>
             </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

