"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Save, BookOpen, X } from "lucide-react";
import Link from "next/link";
import { mockPrograms, mockCourses } from "@/lib/tenant-mock-data";

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [programNotFound, setProgramNotFound] = useState(false);
  
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const program = mockPrograms.find(p => p.id === programId);
    if (program) {
      setName(program.name);
      setLevel(program.level);
      setDescription(program.description);
      setSelectedCourseIds(program.courseIds || []);
    } else {
      setProgramNotFound(true);
    }
  }, [programId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/programs");
  };

  const handleSelectCourse = (courseId: string) => {
    if (courseId && !selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
  };

  const selectedCoursesData = mockCourses.filter(c => selectedCourseIds.includes(c.id));
  const availableCourses = mockCourses.filter(c => !selectedCourseIds.includes(c.id));

  if (programNotFound) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-destructive">Program Not Found</h2>
        <p className="text-muted-foreground">The program you are trying to edit does not exist.</p>
        <Button onClick={() => router.push("/school-admin/programs")} className="mt-4">
          Return to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Breadcrumb 
        showHome={false} 
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Programs", href: "/school-admin/programs" },
          { label: "Edit Program" }
        ]} 
        className="mb-2" 
      />
      <PageHeader
        title="Edit Program"
        description="Update the academic program details and manage its attached courses."
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
        <Card className="p-6">
          <h2 className="text-base font-semibold text-foreground mb-5">Program Details</h2>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Program Name <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Bachelor of Science in Computer Science" 
                required 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Program Level <span className="text-destructive">*</span></Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
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
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Provide a comprehensive description of the program objectives and outcomes..." 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Attach Courses</h2>
              <p className="text-sm text-muted-foreground mt-1">Select the courses that make up this program curriculum.</p>
            </div>
            <div className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {selectedCourseIds.length} Selected
            </div>
          </div>
          
          <div className="space-y-4">
            <Select onValueChange={handleSelectCourse} value="">
              <SelectTrigger>
                <SelectValue placeholder="Select a course to attach..." />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No more courses available</div>
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
              <div className="mt-4 border rounded-md divide-y overflow-hidden">
                {selectedCoursesData.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{course.title}</span>
                      <span className="text-xs text-muted-foreground">{course.code} • {course.credits} Credits • {course.level}</span>
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
              <div className="text-center p-6 border border-dashed rounded-md text-sm text-muted-foreground bg-muted/20">
                No courses attached yet. Select a course above to add it automatically.
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Program
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
