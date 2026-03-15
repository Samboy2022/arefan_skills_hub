import {
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  ArrowRight,
  CalendarDays,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import { STUDENT_COURSES } from "@/lib/student-mock-data";
import Link from "next/link";
import Image from "next/image";

export default function MyCoursesPage() {
  const activeCourses = STUDENT_COURSES.filter((c) => c.status === "active");
  const completedCourses = STUDENT_COURSES.filter(
    (c) => c.status === "completed"
  );

  return (
    <div>
      <PageHeader
        title="My Courses"
        description="View all your enrolled courses and track your progress"
      />

      {/* Active Courses */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Active Courses
          <span className="text-sm font-normal text-muted-foreground">
            ({activeCourses.length})
          </span>
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCourses.map((course) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.id}`}
              className="block group"
            >
              <Card className="border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm flex flex-col h-full rounded-2xl group overflow-hidden relative">
                {/* Course Image */}
                <div className="relative aspect-[16/10] w-full shrink-0 bg-muted border-b">
                  <Image 
                    src={course.thumbnail} 
                    alt={course.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105 duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Code Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white text-black shadow-sm">
                      {course.code}
                    </span>
                  </div>

                  {/* Circular Progress Bubble - Placed absolute to Image container */}
                  <div className="absolute -bottom-[32px] right-4 z-20 bg-card rounded-full p-[3px] shadow-sm flex items-center justify-center">
                    <div className="bg-white rounded-full p-1 overflow-hidden">
                      <CircularProgress
                        value={course.progress}
                        size={56}
                        strokeWidth={5}
                        className="shrink-0 bg-white"
                        labelClassName="text-[13px] font-black text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-5 pt-8 flex flex-col flex-1 bg-card relative z-0">
                  <span className="text-[13px] text-muted-foreground font-medium mb-1.5 block">
                    {course.credits} Credits
                  </span>
                  <h4 className="font-bold text-xl md:text-[22px] leading-tight group-hover:text-primary transition-colors text-foreground mb-6 line-clamp-2">
                    {course.name}
                  </h4>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={course.instructor_avatar} />
                      <AvatarFallback className="text-sm font-bold">
                        {course.instructor.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-foreground truncate">{course.instructor}</p>
                      <p className="text-[13px] text-muted-foreground truncate">Instructor</p>
                    </div>
                  </div>

                  {/* Assignment Status */}
                  <div className="mt-auto">
                    {course.due_assignments > 0 ? (
                      <div className="flex items-center gap-2 text-[15px] font-bold text-amber-700 bg-amber-50/50 dark:bg-amber-900/10 dark:text-amber-500 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{course.due_assignments} pending assignment{course.due_assignments !== 1 ? 's' : ''}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[15px] font-bold text-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 dark:text-emerald-400 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                        <span>All assignments completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-green-600" />
            Completed Courses
            <span className="text-sm font-normal text-muted-foreground">
              ({completedCourses.length})
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="block group"
              >
                <Card className="overflow-hidden border hover:border-primary/30 transition-all hover:shadow-md flex flex-col h-full">
                  {/* Course Image */}
                  <div className="relative h-32 w-full bg-muted border-b grayscale-[0.5] opacity-90 transition-all group-hover:grayscale-0 group-hover:opacity-100 overflow-hidden">
                    <Image src={course.thumbnail} alt={course.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
                        {course.code}
                      </span>
                    </div>
                    <div className="absolute -bottom-5 right-4 bg-background rounded-full p-1 shadow-md z-10">
                      <CircularProgress
                        value={100}
                        size={40}
                        strokeWidth={3.5}
                        className="shrink-0 bg-background rounded-full"
                        labelClassName="text-[10px] font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-5 pt-6 flex flex-col flex-1 z-0 relative">
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-3 pr-12">
                      {course.name}
                    </h4>

                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-6 w-6 border">
                      <AvatarImage src={course.instructor_avatar} />
                      <AvatarFallback className="text-[9px]">
                        {course.instructor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">
                      {course.instructor} &bull; {course.credits} Credits
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground">
                        Final Grade
                      </p>
                      <p className="text-lg font-black text-primary leading-none">
                        {course.grade}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      View Details →
                    </span>
                  </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
