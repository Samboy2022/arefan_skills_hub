import {
  LayoutGrid,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/student/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CircularProgress } from "@/components/ui/circular-progress";
import Link from "next/link";
import { STUDENT_COURSES } from "@/lib/student-mock-data";

export default async function GroupCoursePage({ params }: { params: Promise<{ groupId: string }> }) {
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;

  // Demo data for the "Full-Stack Web Development Mastery" group
  const groupInfo = {
    id: "fullstack-web",
    title: "Full-Stack Web Development Mastery",
    description: "A comprehensive learning path covering modern web technologies from frontend to backend. This path is designed to take you from a beginner to a production-ready software engineer.",
    credits: 12,
    progress: 45,
    instructor: "FnSkills Engineering School",
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
        name: "Scalable Systems & Infrastructure Desing",
        code: "SYS401",
        progress: 0,
        status: "enrolled",
        due_assignments: 0,
        credits: 2,
      }
    ]
  };

  return (
    <div className="font-sans">
      <Breadcrumb 
        items={[
          { label: "My Courses", href: "/student/courses" },
          { label: groupInfo.title }
        ]}
        className="mb-6"
      />
      
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <LayoutGrid className="h-8 w-8" />
                 </div>
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Professional Path</span>
             </div>
             <h1 className="text-3xl font-black text-foreground mb-4">{groupInfo.title}</h1>
             <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
               {groupInfo.description}
             </p>

             <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-primary" />
                   <span className="text-sm font-semibold">{groupInfo.totalCourses} Featured Courses</span>
                </div>
                <div className="flex items-center gap-2">
                   <CheckCircle className="h-4 w-4 text-emerald-600" />
                   <span className="text-sm font-semibold">{groupInfo.credits} Credits Path</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                   <Clock className="h-4 w-4" />
                   <span className="text-sm">Enrolled {groupInfo.enrolledAt}</span>
                </div>
             </div>
          </div>
          
          <div className="md:w-64 flex flex-col items-center justify-center p-6 bg-background rounded-xl border border-primary/10">
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

      <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black uppercase font-sans tracking-widest text-foreground pb-4 border-b-2 border-primary inline-block">
             Courses in this Path
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
             <Filter className="h-4 w-4" />
             <span>Filter By Status</span>
          </div>
      </div>

      <div className="space-y-4">
        {groupInfo.courses.map((course) => (
           <Link
             href={`/student/courses/${course.id}`}
             key={course.id}
             className="block group"
           >
              <Card className="p-0 border border-border group-hover:border-primary/50 transition-all overflow-hidden flex flex-col md:flex-row items-stretch">
                 <div className="w-1.5 bg-muted group-hover:bg-primary transition-colors shrink-0" />
                 
                 <div className="p-6 md:w-32 bg-muted/20 flex flex-col items-center justify-center border-r border-border shrink-0">
                    <span className="text-xs font-black text-muted-foreground mb-1">{course.code}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{course.credits} Credits</span>
                 </div>

                 <div className="p-6 flex-1 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 min-w-0 text-center md:text-left">
                       <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">{course.name}</h3>
                       <div className="flex items-center gap-4 justify-center md:justify-start">
                          <span className="text-xs font-medium text-muted-foreground">FnSkills Certified</span>
                          {course.due_assignments > 0 && (
                             <span className="text-[10px] font-bold text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.due_assignments} PENDING
                             </span>
                          )}
                       </div>
                    </div>

                    <div className="w-48 shrink-0 space-y-2">
                       <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-muted-foreground">Course Coverage</span>
                          <span className="font-bold text-foreground">{course.progress}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-primary" 
                             style={{ width: `${course.progress}%` }} 
                          />
                       </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center gap-2">
                       {course.status === "active" ? (
                          <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                             Resume Course <ArrowRight className="h-4 w-4" />
                          </div>
                       ) : (
                          <div className="text-muted-foreground font-semibold text-sm">
                             Enroll to Start
                          </div>
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
