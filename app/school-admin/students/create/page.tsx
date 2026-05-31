"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Upload, Download, FileText, CheckCircle2,
  AlertCircle, Info, User, Mail, Phone, BookOpen, Clock, PlusCircle
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { Student } from "@/lib/instructor-types";

export default function CreateStudentPage() {
  const router = useRouter();
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "pending">("active");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  // Load current students on mount to count for ID generation
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_students");
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        setStudents(MOCK_STUDENTS);
      }
    } else {
      setStudents(MOCK_STUDENTS);
    }
  }, []);

  const toggleCourse = (courseId: string) => {
    setEnrolledCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg("Please enter the student's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    // Simulate slight API save delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      // Dynamic roll number increments
      const nextIdNum = students.length + 1;
      const studentId = `STU${String(nextIdNum).padStart(3, "0")}`;

      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        studentId: studentId,
        status: status,
        enrolledCourses: enrolledCourses,
        joinDate: new Date(),
        lastActivity: new Date(),
      };

      const updated = [...students, newStudent];
      localStorage.setItem("school_admin_students", JSON.stringify(updated));

      setSuccess(true);
      setTimeout(() => {
        router.push("/school-admin/students");
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to register student. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/school-admin/students");
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
        <h2 className="text-2xl font-bold text-foreground">Student Enrolled!</h2>
        <p className="text-muted-foreground text-sm">
          The student profile was registered successfully. Redirecting to student directory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Students", href: "/school-admin/students" },
          { label: "Add Student" }
        ]}
        className="mb-2"
      />
      
      <PageHeader
        title="Add New Student"
        description="Register a new student to the platform or perform a bulk CSV import."
        titleAction={
          <Button variant="outline" asChild className="border-border text-foreground">
            <Link href="/school-admin/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="manual">Manual Registration</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import (CSV/Excel)</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                
                {errorMsg && (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Personal Information Card */}
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="h-5 w-5 text-primary" /> Personal Information
                  </h2>
                  
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-semibold text-foreground">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="e.g. Alice Cooper"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold text-foreground">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. alice@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="phone" className="font-semibold text-foreground">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>
                </Card>

                {/* Course Enrollment Card */}
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Academic Enrollments
                  </h2>
                  
                  <div className="space-y-4">
                    <Label className="font-semibold text-foreground">Select Enrolled Courses</Label>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {MOCK_INSTRUCTOR_COURSES.map(course => {
                        const isChecked = enrolledCourses.includes(course.id);
                        return (
                          <div
                            key={course.id}
                            onClick={() => toggleCourse(course.id)}
                            className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer hover:bg-muted/10 transition-colors select-none ${
                              isChecked ? "border-primary/50 bg-primary/5" : "bg-card border-border"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => {}} // Controlled by wrapper div click
                              className="mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold font-mono text-primary">{course.code}</p>
                              <p className="text-xs font-semibold text-foreground truncate mt-0.5">{course.title}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Status and Actions Panel */}
              <div className="space-y-6">
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <Clock className="h-5 w-5 text-primary" /> System Controls
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="font-semibold text-foreground">Access Status</Label>
                      <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                        <SelectTrigger id="status" className="h-11 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active Account</SelectItem>
                          <SelectItem value="pending">Verification Pending</SelectItem>
                          <SelectItem value="inactive">Inactive / Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-2 border-t text-xs text-muted-foreground leading-relaxed">
                      Saving this form will auto-generate a unique Student ID (roll number) and construct system settings.
                    </div>
                  </div>
                </Card>

                {/* Form Submissions */}
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 h-11 gap-2" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Record"}
                  </Button>
                  <Button type="button" variant="outline" className="h-11 px-4 border-border text-foreground" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bulk" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border">
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                  <Upload className="h-5 w-5 text-primary" /> Bulk Import Roster
                </h2>
                
                <div className="space-y-6">
                  <div 
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                      uploadFile ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/30'
                    }`}
                  >
                    <div className="max-w-xs mx-auto">
                      {uploadFile ? (
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-lg text-foreground truncate">{uploadFile.name}</p>
                            <p className="text-sm text-muted-foreground">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setUploadFile(null)} className="border-border text-foreground">
                            Remove file
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-lg text-foreground">Click to upload or drag & drop</p>
                            <p className="text-sm text-muted-foreground">CSV or XLSX files only (Max 10MB)</p>
                          </div>
                          <Button asChild variant="secondary">
                            <label className="cursor-pointer">
                              Browse Files
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".csv, .xlsx, .xls"
                                onChange={handleFileUpload} 
                              />
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-background rounded-md flex items-center justify-center border shadow-sm shrink-0">
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Download Roster Template</p>
                        <p className="text-xs text-muted-foreground">Follow this schema to avoid enrollment rejections</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto border-border text-foreground">
                      <Download className="mr-2 h-4 w-4" />
                      Download .CSV
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 border">
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                  <Info className="h-5 w-5 text-primary" />
                  Roster Guidelines
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Mandatory fields:</span> Every row must supply Full Name and a unique Email.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Validation emails:</span> Enrolled students will receive platform welcome emails with auto credentials.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 h-11 gap-2" 
                  disabled={!uploadFile || isLoading}
                  onClick={handleBulkUpload}
                >
                  <Upload className="h-4 w-4" />
                  {isLoading ? "Importing..." : "Start Import"}
                </Button>
                <Button type="button" variant="outline" className="h-11 px-4 border-border text-foreground" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
