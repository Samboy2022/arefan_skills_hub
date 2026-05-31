"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArrowLeft, Save, BookOpen, X, AlertCircle } from "lucide-react";
import Link from "next/link";

import { mockPrograms } from "@/lib/tenant-mock-data";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default function CreateProgramPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form inputs
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Degree");
  const [description, setDescription] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  
  // Storage list state
  const [programsList, setProgramsList] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("school_admin_programs");
    if (saved) {
      try {
        setProgramsList(JSON.parse(saved));
      } catch (e) {
        setProgramsList([]);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please provide a name for the program.");
      return;
    }
    if (!description.trim() || description === "<p></p>" || description === "<p><br></p>") {
      setErrorMsg("Please provide a description of the program.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const newProgram = {
        id: `program-${Date.now()}`,
        name: name.trim(),
        level: level,
        description: description,
        createdBy: "Admin User",
        createdAt: new Date().toISOString(),
        courseIds: selectedCourseIds,
      };

      const saved = localStorage.getItem("school_admin_programs");
      let currentPrograms: any[] = [];
      if (saved) {
        currentPrograms = JSON.parse(saved);
      } else {
        // Fallback to seeds
        const seedCourseMappings: Record<string, string[]> = {
          "1": ["course-1", "course-3"],
          "2": ["course-2"],
          "3": ["course-1", "course-2"],
        };
        currentPrograms = mockPrograms.map(p => ({
          ...p,
          courseIds: seedCourseMappings[p.id] || ["course-1"],
        }));
      }

      const updated = [...currentPrograms, newProgram];
      localStorage.setItem("school_admin_programs", JSON.stringify(updated));
      router.push("/school-admin/programs");
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while saving the program.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    if (courseId && !selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
  };

  const selectedCoursesData = MOCK_INSTRUCTOR_COURSES.filter(c => selectedCourseIds.includes(c.id));
  const availableCourses = MOCK_INSTRUCTOR_COURSES.filter(c => !selectedCourseIds.includes(c.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 px-4 md:px-6">
      <Breadcrumb 
        showHome={false} 
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Programs", href: "/school-admin/programs" },
          { label: "Create Program" }
        ]} 
        className="mb-2" 
      />
      <PageHeader
        title="Create New Program"
        description="Define a new academic program and attach its required courses."
        titleAction={
          <Button variant="outline" asChild size="sm">
            <Link href="/school-admin/programs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Card className="p-6 border">
          <h2 className="text-base font-bold text-foreground mb-4 border-b pb-2">Program Details</h2>
          
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold text-foreground">Program Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g. Bachelor of Science in Computer Science" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="h-11 bg-background"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level" className="font-semibold text-foreground">Program Level *</Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger id="level" className="h-11 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-semibold text-foreground">Description *</Label>
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Provide a comprehensive description of the program objectives and outcomes..." 
              />
            </div>
          </div>
        </Card>

        {/* Course attachment */}
        <Card className="p-6 border">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div>
              <h2 className="text-base font-bold text-foreground">Attach Curriculum Courses</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Select the courses that make up this program curriculum.</p>
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1.5 border border-primary/20 shadow-sm shrink-0">
              <BookOpen className="h-3.5 w-3.5" />
              {selectedCourseIds.length} Attached
            </div>
          </div>
          
          <div className="space-y-4">
            <Select onValueChange={handleSelectCourse} value="">
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select a course to attach..." />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">No more courses available</div>
                ) : (
                  availableCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {selectedCoursesData.length > 0 && (
              <div className="mt-4 border rounded-md divide-y overflow-hidden bg-card">
                {selectedCoursesData.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 hover:bg-muted/10 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{course.title}</span>
                      <span className="text-xs text-muted-foreground font-mono mt-0.5">{course.code} • {course.credits} Credits</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeCourse(course.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {selectedCoursesData.length === 0 && (
              <div className="text-center p-6 border border-dashed rounded-md text-xs text-muted-foreground bg-muted/20">
                No courses attached yet. Select a course above to add it automatically.
              </div>
            )}
          </div>
        </Card>

        {/* Submissions */}
        <div className="flex gap-3 justify-end pt-2 border-t">
          <Button type="button" variant="outline" className="h-11 px-5" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="h-11 px-6 min-w-[150px] gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Create Program"}
          </Button>
        </div>
      </form>
    </div>
  );
}
