"use client";

import { FileText, Download, Eye, Calendar, BookOpen, Search, Filter, Share2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_MATERIALS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function MaterialsPage() {
  // Helper to get course name from id
  const getCourseName = (courseId: string) => {
    const course = STUDENT_COURSES.find(c => c.id === courseId);
    return course ? course.name : courseId;
  };

  return (
    <div>
      <Breadcrumb 
        items={[
          { label: "Study Materials" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Study Materials"
        description="Access and download course resources and supplementary files"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
              <p className="text-xs text-muted-foreground">All materials</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{STUDENT_MATERIALS.length}</p>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New this week</p>
              <p className="text-xs text-muted-foreground">Recently added</p>
            </div>
            <div className="rounded-full p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">4</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage used</p>
              <p className="text-xs text-muted-foreground">Total space</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">124 MB</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="font-medium">
            All Materials
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            PDFs Only
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            Course Guides
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Materials</h3>

        <div className="space-y-4">
          {STUDENT_MATERIALS.map((material) => (
            <Card
              key={material.id}
              className="p-4 border border-border transition-colors bg-card hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{material.name}</h4>
                      <span className="text-xs font-medium text-muted-foreground px-2 py-1 border border-border rounded bg-muted/30">
                        {material.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{getCourseName(material.course_id)}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>Added {new Date(material.uploaded_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
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
