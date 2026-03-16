"use client";

import { FileText, Download, Eye, Calendar, BookOpen, Search, Filter, Share2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_MATERIALS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";

export default function MaterialsPage() {
  // Helper to get course name from id
  const getCourseName = (courseId: string) => {
    const course = STUDENT_COURSES.find(c => c.id === courseId);
    return course ? course.name : courseId;
  };

  return (
    <div>
      <PageHeader
        title="Study Materials"
        description="Access and download course resources and supplementary files"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 border border-border shadow-none rounded-md bg-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Resources</p>
          <p className="text-3xl font-bold text-foreground">{STUDENT_MATERIALS.length}</p>
        </Card>
        <Card className="p-5 border border-border shadow-none rounded-md bg-card relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">New this week</p>
          <p className="text-3xl font-bold text-primary">4</p>
        </Card>
        <Card className="p-5 border border-border shadow-none rounded-md bg-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Storage used</p>
          <p className="text-3xl font-bold text-foreground">124 MB</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" className="font-bold text-xs uppercase tracking-wider shadow-none border border-border/50">All Materials</Button>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">PDFs Only</Button>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Course Guides</Button>
        </div>
        <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
           <input 
             type="text" 
             placeholder="Search library..." 
             className="pl-9 pr-4 py-1.5 bg-muted/20 border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-64"
           />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 mb-6">
          <BookOpen className="h-3.5 w-3.5" />
          Academic Resources Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_MATERIALS.map((material) => (
            <Card
              key={material.id}
              className="group flex flex-col h-full border border-border shadow-none rounded-md transition-all bg-card overflow-hidden hover:border-primary/50"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2 py-0.5 border border-border rounded-sm bg-muted/30">
                    {material.type}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{material.size}</span>
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 bg-primary/5 rounded-md flex items-center justify-center text-primary border border-primary/10 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors truncate">{material.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">{getCourseName(material.course_id)}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Comprehensive reference guide and case studies for the current module. 
                  Includes practice problems and visual diagrams.
                </p>
              </div>
              
              <div className="px-6 py-4 bg-muted/5 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                  <Calendar className="h-3 w-3" />
                  Added {new Date(material.uploaded_date).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-md">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/5 rounded-md">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
