"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Users, X } from "lucide-react";
import Link from "next/link";
import { mockFaculty, mockClasses } from "@/lib/tenant-mock-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const programLabels: Record<string, string> = {
  "Computer Science": "cs",
  "Engineering": "eng",
  "Business Administration": "bus",
  "Arts & Humanities": "arts",
};

const programValues: Record<string, string> = {
  cs: "Computer Science",
  eng: "Engineering",
  bus: "Business Administration",
  arts: "Arts & Humanities",
};

const semesterLabels: Record<string, string> = {
  "Fall Semester": "fall",
  "Spring Semester": "spring",
  "Summer Semester": "summer",
};

const semesterValues: Record<string, string> = {
  fall: "Fall Semester",
  spring: "Spring Semester",
  summer: "Summer Semester",
};

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState<any>(null);
  
  // Form States
  const [program, setProgram] = useState("cs");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [capacity, setCapacity] = useState("");
  const [creditUnit, setCreditUnit] = useState("3");
  const [semester, setSemester] = useState("fall");
  const [session, setSession] = useState("2024-2025");
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem("school_admin_classes");
    let currentClasses: any[] = [];
    if (saved) {
      try {
        currentClasses = JSON.parse(saved);
      } catch (err) {
        currentClasses = [...mockClasses];
      }
    } else {
      currentClasses = [...mockClasses];
    }

    const item = currentClasses.find(c => c.id === id);
    if (item) {
      setClassData(item);
      setProgram(programLabels[item.program] || "cs");
      setCourseTitle(item.name || "");
      setCourseCode(item.courseCode || "");
      setCapacity(String(item.capacity || ""));
      setSemester(semesterLabels[item.semester] || "fall");
      setSession(item.academicYear || "2024-2025");
      
      // Resolve instructors to IDs
      const instructorNames = item.instructors || [];
      const instIds = mockFaculty
        .filter(f => instructorNames.includes(f.name))
        .map(f => f.id);
      setSelectedInstructorIds(instIds);
    }
  }, [id]);

  const handleSelectInstructor = (instructorId: string) => {
    if (instructorId && !selectedInstructorIds.includes(instructorId)) {
      setSelectedInstructorIds([...selectedInstructorIds, instructorId]);
    }
  };

  const removeInstructor = (instructorId: string) => {
    setSelectedInstructorIds(selectedInstructorIds.filter(id => id !== instructorId));
  };

  const selectedInstructorsData = mockFaculty.filter(f => selectedInstructorIds.includes(f.id));
  const availableInstructors = mockFaculty.filter(f => !selectedInstructorIds.includes(f.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const saved = localStorage.getItem("school_admin_classes");
    let currentClasses: any[] = [];
    if (saved) {
      try {
        currentClasses = JSON.parse(saved);
      } catch (err) {
        currentClasses = [...mockClasses];
      }
    } else {
      currentClasses = [...mockClasses];
    }

    const updated = currentClasses.map(c => {
      if (c.id === id) {
        return {
          ...c,
          name: courseTitle,
          program: programValues[program] || "Computer Science",
          courseCode: courseCode.toUpperCase(),
          semester: semesterValues[semester] || "Fall Semester",
          instructors: selectedInstructorsData.map(inst => inst.name).length > 0
            ? selectedInstructorsData.map(inst => inst.name)
            : ["Unassigned"],
          capacity: Number(capacity) || 50,
          academicYear: session,
        };
      }
      return c;
    });

    localStorage.setItem("school_admin_classes", JSON.stringify(updated));

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/classes");
  };

  if (!classData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">Loading class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Classes", href: "/school-admin/classes" },
          { label: `Edit ${classData.name}` }
        ]}
        className="mb-2"
      />
      <PageHeader
        title={`Edit Class: ${classData.name}`}
        description="Update class configuration, schedule settings, and assigned instructors."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/classes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Course Class Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="program">Program <span className="text-destructive">*</span></Label>
                  <Select value={program} onValueChange={setProgram} required>
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="bus">Business Administration</SelectItem>
                      <SelectItem value="arts">Arts & Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courseTitle">Course Title Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="courseTitle" 
                    placeholder="e.g. Mathematics 101" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courseCode">Course Code <span className="text-destructive">*</span></Label>
                  <Input 
                    id="courseCode" 
                    placeholder="e.g. MAT101" 
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Student Capacity <span className="text-destructive">*</span></Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    min={1} 
                    placeholder="e.g. 40" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="creditUnit">Credit Unit <span className="text-destructive">*</span></Label>
                  <Input 
                    id="creditUnit" 
                    type="number" 
                    min={1} 
                    placeholder="e.g. 3" 
                    value={creditUnit}
                    onChange={(e) => setCreditUnit(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester <span className="text-destructive">*</span></Label>
                  <Select value={semester} onValueChange={setSemester} required>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall Semester</SelectItem>
                      <SelectItem value="spring">Spring Semester</SelectItem>
                      <SelectItem value="summer">Summer Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session">Academic Session <span className="text-destructive">*</span></Label>
                  <Select value={session} onValueChange={setSession} required>
                    <SelectTrigger id="session">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024/2025 Academic Session</SelectItem>
                      <SelectItem value="2025-2026">2025/2026 Academic Session</SelectItem>
                      <SelectItem value="2026-2027">2026/2027 Academic Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Assign Instructors</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select the instructors assigned to teach this course class.</p>
                </div>
                <div className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {selectedInstructorIds.length} Selected
                </div>
              </div>
              
              <div className="space-y-4">
                <Select onValueChange={handleSelectInstructor} value="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instructor to assign..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInstructors.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No more instructors available</div>
                    ) : (
                      availableInstructors.map(instructor => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name} ({instructor.department})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {selectedInstructorsData.length > 0 && (
                  <div className="mt-4 border rounded-md divide-y overflow-hidden">
                    {selectedInstructorsData.map((instructor) => (
                      <div key={instructor.id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{instructor.name}</span>
                          <span className="text-xs text-muted-foreground">{instructor.department} • {instructor.subjects.join(', ')}</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeInstructor(instructor.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedInstructorsData.length === 0 && (
                  <div className="text-center p-6 border border-dashed rounded-md text-sm text-muted-foreground bg-muted/20">
                    No instructors assigned yet. Select an instructor above to assign them.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Schedule</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" defaultValue="08:00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" defaultValue="14:00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="days">Working Days</Label>
                  <Select defaultValue="mon-fri">
                    <SelectTrigger id="days">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon-fri">Monday - Friday</SelectItem>
                      <SelectItem value="mon-sat">Monday - Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Course Grades Settings</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignmentsWeight">Assignments (%)</Label>
                  <Input id="assignmentsWeight" type="number" min={0} max={100} defaultValue={30} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="forumWeight">Forum Activities (%)</Label>
                  <Input id="forumWeight" type="number" min={0} max={100} defaultValue={10} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quizzesWeight">Quizzes (%)</Label>
                  <Input id="quizzesWeight" type="number" min={0} max={100} defaultValue={20} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courseWeight">Course/Final Exam (%)</Label>
                  <Input id="courseWeight" type="number" min={0} max={100} defaultValue={40} />
                </div>
              </div>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Course Class"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
