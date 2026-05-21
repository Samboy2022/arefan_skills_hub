"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, FileText, Upload, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [assignmentType, setAssignmentType] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(true);
  const [enableDeadline, setEnableDeadline] = useState(true);
  const [supportFiles, setSupportFiles] = useState<FileList | null>(null);

  const [openCourse, setOpenCourse] = useState(false);
  const [openModule, setOpenModule] = useState(false);
  const [openLesson, setOpenLesson] = useState(false);

  // Filter modules based on selected course
  const filteredModules = mockModules.filter(m => m.courseId === selectedCourse);
  
  // Filter lessons based on selected module
  const filteredLessons = mockLessons.filter(l => l.moduleId === selectedModule);

  const handleSave = () => {
    // Demo save
    window.alert("Assignment created! (Demo)");
    router.push("/school-admin/assignments");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/school-admin" },
            { label: "Assignments", href: "/school-admin/assignments" },
            { label: "Create New Assignment" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Create New Assignment"
          description="Setup a new assignment, set a due date, and define scoring criteria."
        />
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Assignment Details
          </CardTitle>
          <CardDescription>Fill out the required information for the student assignment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-semibold">Assignment Title</Label>
            <Input id="title" placeholder="e.g. Midterm Essay" className="max-w-xl" />
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

          {/* CONDITIONAL SELECTION FIELDS (COMBOBOXES) */}
          {assignmentType && (
            <div className="grid gap-6 sm:grid-cols-3 border rounded-lg p-6 bg-muted/10 shadow-sm transition-all hover:bg-muted/20">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select Course</Label>
                <Popover open={openCourse} onOpenChange={setOpenCourse}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCourse}
                      className="w-full justify-between"
                    >
                      {selectedCourse
                        ? mockCourses.find((course) => course.id === selectedCourse)?.name
                        : "Search course..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search courses..." />
                      <CommandList>
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup>
                          {mockCourses.map((course) => (
                            <CommandItem
                              key={course.id}
                              value={course.name}
                              onSelect={() => {
                                setSelectedCourse(course.id);
                                setSelectedModule(null);
                                setSelectedLesson(null);
                                setOpenCourse(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCourse === course.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {course.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {(assignmentType === 'module' || assignmentType === 'lesson') && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Module</Label>
                  <Popover open={openModule} onOpenChange={setOpenModule}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!selectedCourse}
                        aria-expanded={openModule}
                        className="w-full justify-between"
                      >
                        {selectedModule
                          ? mockModules.find((module) => module.id === selectedModule)?.name
                          : selectedCourse ? "Search module..." : "Select course first"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search modules..." />
                        <CommandList>
                          <CommandEmpty>No module found.</CommandEmpty>
                          <CommandGroup>
                            {filteredModules.map((module) => (
                              <CommandItem
                                key={module.id}
                                value={module.name}
                                onSelect={() => {
                                  setSelectedModule(module.id);
                                  setSelectedLesson(null);
                                  setOpenModule(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedModule === module.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {module.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {assignmentType === 'lesson' && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Lesson</Label>
                  <Popover open={openLesson} onOpenChange={setOpenLesson}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!selectedModule}
                        aria-expanded={openLesson}
                        className="w-full justify-between"
                      >
                        {selectedLesson
                          ? mockLessons.find((lesson) => lesson.id === selectedLesson)?.name
                          : selectedModule ? "Search lesson..." : "Select module first"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search lessons..." />
                        <CommandList>
                          <CommandEmpty>No lesson found.</CommandEmpty>
                          <CommandGroup>
                            {filteredLessons.map((lesson) => (
                              <CommandItem
                                key={lesson.id}
                                value={lesson.name}
                                onSelect={() => {
                                  setSelectedLesson(lesson.id);
                                  setOpenLesson(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLesson === lesson.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {lesson.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Assignment Category</Label>
              <Select defaultValue="file">
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
              <Input id="totalScore" type="number" defaultValue={100} min={1} />
            </div>
          </div>

          {/* SUPPORTING DOCUMENTS UPLOAD */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Supporting Documents</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center border-border/60 hover:border-border transition-colors cursor-pointer bg-muted/5 hover:bg-muted/10">
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
                    ? <span className="text-primary font-medium">{supportFiles.length} file(s) selected</span>
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
              <Select defaultValue="active">
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
            <div className="border border-border/50 rounded-md overflow-hidden bg-background">
              <ForumRichEditor
                content={description}
                onChange={setDescription}
                placeholder="Give students specific contexts, references, and rubrics."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-3 border-t bg-muted/20 p-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/school-admin/assignments">Cancel</Link>
          </Button>
          <Button type="button" onClick={handleSave} className="min-w-[120px]">
            Save Assignment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
