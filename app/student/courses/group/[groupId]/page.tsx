import {
  LayoutGrid,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/student/page-header";
import { CircularProgress } from "@/components/ui/circular-progress";
import Link from "next/link";
import { pageStackClass } from "@/lib/student-ui";

export default async function GroupCoursePage({ params }: { params: Promise<{ groupId: string }> }) {
  await params;

  // Demo data for the "Full-Stack Web Development Mastery" group
  const groupInfo = {
    id: "fullstack-web",
    title: "Full-Stack Web Development Mastery",
    description: "A comprehensive learning path covering modern web technologies from frontend to backend. This path is designed to take you from a beginner to a production-ready software engineer.",
    credits: 12,
    progress: 45,
    instructor: "Fnskills Engineering School",
    totalCourses: 4,
    enrolledAt: "January 2024",
    courses: [
      {
        id: "cs101",
        name: "Introduction to Computer Science",
        code: "CS101",
        progress: 65,
        status: "active",
        due_assignments: 2,
        credits: 3,
      },
      {
        id: "frontend-react",
        name: "Advanced React & Next.js Patterns",
        code: "FE202",
        progress: 30,
        status: "active",
        due_assignments: 1,
        credits: 4,
      },
      {
        id: "backend-node",
        name: "Backend Architecture with Node.js & PostgreSQL",
        code: "BE301",
        progress: 0,
        status: "enrolled",
        due_assignments: 0,
        credits: 3,
      },
      {
        id: "system-design",
        name: "Scalable Systems & Infrastructure Design",
        code: "SYS401",
        progress: 0,
        status: "enrolled",
        due_assignments: 0,
        credits: 2,
      }
    ]
  };

  return (
    <div className={pageStackClass}>
      <Breadcrumb 
        items={[
          { label: "My Courses", href: "/student/courses" },
          { label: groupInfo.title }
        ]}
      />

      <PageHeader
        title={groupInfo.title}
        description={groupInfo.description}
      />
      
      <div className="rounded-2xl border border-border bg-card p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <LayoutGrid className="h-8 w-8" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest text-primary">Professional Path</span>
             </div>
             <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-primary" />
                   <span className="text-sm font-semibold">{groupInfo.totalCourses} Featured Courses</span>
                </div>
                <div className="flex items-center gap-2">
                   <CheckCircle className="h-4 w-4 text-primary" />
                   <span className="text-sm font-semibold">{groupInfo.credits} Credits Path</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                   <Clock className="h-4 w-4" />
                   <span className="text-sm">Enrolled {groupInfo.enrolledAt}</span>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/30 p-6 md:w-64">
             <CircularProgress
                value={groupInfo.progress}
                size={120}
                strokeWidth={8}
                className="mb-4"
                labelClassName="text-xl font-black"
             />
             <p className="text-xs font-black uppercase font-sans tracking-widest text-muted-foreground mb-1 text-center">Path Completion</p>
             <p className="text-sm font-bold text-primary text-center">In Progress</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Courses in this path</h2>
          <p className="text-sm text-muted-foreground">{groupInfo.courses.length} courses</p>
      </div>

      <div className="space-y-4">
        {groupInfo.courses.map((course) => (
           <Link
             href={`/student/courses/${course.id}`}
             key={course.id}
             className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
           >
              <Card className="flex flex-col items-stretch gap-0 overflow-hidden rounded-2xl border border-border p-0 shadow-none transition-colors group-hover:border-primary/40 md:flex-row">
                 <div className="w-1.5 bg-muted group-hover:bg-primary transition-colors shrink-0" />
                 
                 <div className="px-6 py-4 md:py-6 md:w-32 bg-muted/30 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 border-b md:border-b-0 md:border-r border-border shrink-0">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/15 md:mb-1.5">{course.code}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{course.credits} Credits</span>
                 </div>

                 <div className="p-6 flex-1 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 min-w-0 text-center md:text-left">
                       <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">{course.name}</h3>
                       <div className="flex items-center gap-4 justify-center md:justify-start">
                          <span className="text-xs font-medium text-muted-foreground">Fnskills Certified</span>
                          {course.due_assignments > 0 && (
                             <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 ring-1 ring-inset ring-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.due_assignments} pending
                             </span>
                          )}
                       </div>
                    </div>

                    <div className="w-full md:w-48 shrink-0 space-y-2">
                       <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-muted-foreground">Course Coverage</span>
                          <span className="font-bold text-foreground">{course.progress}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-primary/15 rounded-full overflow-hidden">
                          <div 
                             className="h-full rounded-full bg-primary" 
                             style={{ width: `${course.progress}%` }} 
                          />
                       </div>
                    </div>

                    <div className="shrink-0 flex w-full md:w-44 justify-center md:justify-end">
                       {course.status === "active" ? (
                          <span className="inline-flex h-8 items-center gap-2 whitespace-nowrap bg-primary px-3 text-xs font-medium text-primary-foreground">
                             Resume <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                       ) : (
                          <span className="inline-flex h-8 items-center whitespace-nowrap border border-border bg-card px-3 text-xs font-medium text-foreground">
                             View course
                          </span>
                       )}
                    </div>
                 </div>
              </Card>
           </Link>
        ))}
      </div>
    </div>
  );
}
