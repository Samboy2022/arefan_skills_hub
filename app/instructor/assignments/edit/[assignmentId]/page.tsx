"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { CalendarIcon, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MOCK_ASSIGNMENTS } from "@/lib/instructor-mock-data";

// Mock data for select dropdowns
const mockCourses = [
  { id: "1", name: "Introduction to Computer Science" },
  { id: "2", name: "Advanced Web Development" },
  { id: "3", name: "Data Structures & Algorithms" },
];

const mockModules = [
  { id: "1", courseId: "1", name: "Module 1: Fundamentals" },
  { id: "2", courseId: "1", name: "Module 2: Programming Basics" },
  { id: "3", courseId: "2", name: "Module 1: Modern CSS" },
  { id: "4", courseId: "2", name: "Module 2: React Fundamentals" },
];

const mockLessons = [
  { id: "1", moduleId: "1", name: "Lesson 1: What is Computer Science?" },
  { id: "2", moduleId: "1", name: "Lesson 2: Binary & Data" },
  { id: "3", moduleId: "3", name: "Lesson 1: CSS Grid Layout" },
];

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const assignment = useMemo(
    () => MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  );

  if (!assignment) {
    notFound();
  }

  const [description, setDescription] = useState(assignment.description || "");
  const [date, setDate] = useState<Date | undefined>(assignment.dueDate);
  const [title, setTitle] = useState(assignment.title);
  const [assignmentType, setAssignmentType] = useState<string | null>(assignment.assignmentType || null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(assignment.courseId || null);
  const [selectedModule, setSelectedModule] = useState<string | null>(assignment.moduleId || null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(assignment.lessonId || null);
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(assignment.notifyOnSubmit ?? true);
  const [enableDeadline, setEnableDeadline] = useState(assignment.enableDeadline ?? true);
  const [supportFiles, setSupportFiles] = useState<FileList | null>(null);

  // Filter modules based on selected course
  const filteredModules = mockModules.filter(m => m.courseId === selectedCourse);
  
  // Filter lessons based on selected module
  const filteredLessons = mockLessons.filter(l => l.moduleId === selectedModule);
  
  const handleSave = () => {
    // Demo save
    window.alert("Assignment updated! (Demo)");
    router.push("/instructor/assignments");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Assignments", href: "/instructor/assignments" },
            { label: `Edit ${assignment.title}` }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Edit Assignment"
          description={`Make changes to ${assignment.title}. Modify due dates, scoring, and rubrics below.`}
        />
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Assignment Details
          </CardTitle>
          <CardDescription>Update the information for this student assignment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-semibold">Assignment Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Midterm Essay" className="max-w-xl" />
          </div>

          {/* ASSIGNMENT TYPE SELECTOR */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Assignment Type</Label>
            <Select onValueChange={setAssignmentType} value={assignmentType || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignment scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Course Assignment</SelectItem>
                <SelectItem value="module">Module Assignment</SelectItem>
                <SelectItem value="lesson">Lesson Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CONDITIONAL SELECTION FIELDS */}
          {assignmentType && (
            <div className="grid gap-6 sm:grid-cols-3 border rounded-lg p-4 bg-muted/10">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select Course</Label>
                <Select onValueChange={setSelectedCourse} value={selectedCourse || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(assignmentType === 'module' || assignmentType === 'lesson') && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Module</Label>
                  <Select onValueChange={setSelectedModule} value={selectedModule || undefined} disabled={!selectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCourse ? "Choose module" : "Select course first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredModules.map(module => (
                        <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {assignmentType === 'lesson' && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Lesson</Label>
                  <Select onValueChange={setSelectedLesson} value={selectedLesson || undefined} disabled={!selectedModule}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedModule ? "Choose lesson" : "Select module first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredLessons.map(lesson => (
                        <SelectItem key={lesson.id} value={lesson.id}>{lesson.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Assignment Category</Label>
              <Select defaultValue={assignment.type || "file"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="essay">Text Entry (Essay)</SelectItem>
                  <SelectItem value="quiz">Interactive Quiz</SelectItem>
                  <SelectItem value="external">External Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="totalScore" className="text-sm font-semibold">Total Score Obtainable</Label>
              <Input id="totalScore" type="number" defaultValue={assignment.maxScore} min={1} />
            </div>
          </div>

          {/* SUPPORTING DOCUMENTS UPLOAD */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Supporting Documents</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center border-border/60 hover:border-border transition-colors cursor-pointer">
              <Input
                id="supportFiles"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setSupportFiles(e.target.files)}
              />
              <Label htmlFor="supportFiles" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {supportFiles && supportFiles.length > 0
                    ? `${supportFiles.length} file(s) selected`
                    : "Click to upload supporting documents or drag and drop"}
                </p>
              </Label>
            </div>
          </div>

          {/* TOGGLE OPTIONS */}
          <div className="grid gap-6 sm:grid-cols-2 border rounded-lg p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Notification on Submission</Label>
                <p className="text-xs text-muted-foreground">Receive email when students submit</p>
              </div>
              <Switch
                checked={notifyOnSubmit}
                onCheckedChange={setNotifyOnSubmit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Enable Deadline</Label>
                <p className="text-xs text-muted-foreground">Allow late submissions when disabled</p>
              </div>
              <Switch
                checked={enableDeadline}
                onCheckedChange={setEnableDeadline}
              />
            </div>
          </div>

          {/* DEADLINE DATE (CONDITIONAL) */}
          {enableDeadline && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Submission Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a deadline date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Status</Label>
              <Select defaultValue={assignment.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Published)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Detailed Instructions</Label>
            <div className="border border-border/50 rounded-md overflow-hidden">
              <ForumRichEditor
                content={description}
                onChange={setDescription}
                placeholder="Give students specific contexts, references, and rubrics."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-3 border-t bg-muted/20 p-6">
          <Button variant="ghost" asChild>
            <Link href="/instructor/assignments">Cancel</Link>
          </Button>
          <Button type="button" onClick={handleSave} className="min-w-[120px]">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
