"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Save, Upload, Download, FileText, CheckCircle2, 
  AlertCircle, Info, User, Mail, Phone, BookOpen, Clock, ShieldAlert
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
  TabsTrigger 
} from "@/components/ui/tabs";

import { mockFaculty } from "@/lib/tenant-mock-data";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default function CreateInstructorPage() {
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
  const [gender, setGender] = useState("male");
  const [qualification, setQualification] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [assignedCourses, setAssignedCourses] = useState<string[]>([]);
  
  // Emergency Contacts
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");

  // Existing instructors state
  const [instructors, setInstructors] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("school_admin_instructors");
    if (saved) {
      try {
        setInstructors(JSON.parse(saved));
      } catch (e) {
        setInstructors([]);
      }
    }
  }, []);

  const toggleCourse = (courseId: string) => {
    setAssignedCourses(prev =>
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
      setErrorMsg("Please enter the instructor's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const nextIdNum = instructors.length + 1;
      const instructorId = `INS${String(nextIdNum).padStart(3, "0")}`;

      const newInstructor = {
        id: `instructor-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender: gender,
        qualification: qualification.trim(),
        department: department,
        joinDate: joinDate || new Date().toISOString().split("T")[0],
        role: "Instructor",
        status: status,
        assignedCourses: assignedCourses,
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relation: emergencyRelation.trim(),
        }
      };

      const saved = localStorage.getItem("school_admin_instructors");
      let currentFaculty = [];
      if (saved) {
        currentFaculty = JSON.parse(saved);
      } else {
        // Fallback to initial seed if empty
        const courseMappings: Record<string, string[]> = {
          "1": ["course-1", "course-2"],
          "2": ["course-2"],
          "3": ["course-3"],
          "4": ["course-1", "course-3"],
        };
        currentFaculty = mockFaculty.map(f => ({
          ...f,
          assignedCourses: courseMappings[f.id] || ["course-1"],
        }));
      }

      const updated = [...currentFaculty, newInstructor];
      localStorage.setItem("school_admin_instructors", JSON.stringify(updated));

      setSuccess(true);
      setTimeout(() => {
        router.push("/school-admin/instructors");
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to register instructor. Please check details.");
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
    router.push("/school-admin/instructors");
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
        <h2 className="text-2xl font-bold text-foreground">Instructor Registered!</h2>
        <p className="text-muted-foreground text-sm">
          The instructor profile was successfully enrolled in the system. Redirecting to directory...
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
          { label: "Instructors", href: "/school-admin/instructors" },
          { label: "Add Instructor" }
        ]}
        className="mb-2"
      />
      
      <PageHeader
        title="Add New Instructor"
        description="Register a new instructor, assign courses, and define their emergency contacts."
        titleAction={
          <Button variant="outline" asChild className="border-border text-foreground">
            <Link href="/school-admin/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload (CSV/Excel)</TabsTrigger>
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

                {/* Personal Information */}
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="h-5 w-5 text-primary" /> Personal Information
                  </h2>
                  
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-semibold text-foreground">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="e.g. Dr. Priya Mehta"
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
                        placeholder="e.g. priya.mehta@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold text-foreground">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="font-semibold text-foreground">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender" className="h-11 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="qualification" className="font-semibold text-foreground">Qualification</Label>
                      <Input
                        id="qualification"
                        placeholder="e.g. Ph.D. in Computer Science, M.Sc."
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>
                </Card>

                {/* Course Assignments Checklist */}
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Assigned Courses to Teach
                  </h2>
                  
                  <div className="space-y-4">
                    <Label className="font-semibold text-foreground">Select Active Courses</Label>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {MOCK_INSTRUCTOR_COURSES.map(course => {
                        const isChecked = assignedCourses.includes(course.id);
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
                              onCheckedChange={() => {}} // Controlled by container
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

              {/* Sidebar controls */}
              <div className="space-y-6">
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <Clock className="h-5 w-5 text-primary" /> School Administration
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="font-semibold text-foreground">Department</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger id="department" className="h-11 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Science">General Science</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Business">Business Administration</SelectItem>
                          <SelectItem value="Arts">Humanities & Arts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joinDate" className="font-semibold text-foreground">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={joinDate}
                        onChange={(e) => setJoinDate(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="font-semibold text-foreground">Status</Label>
                      <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                        <SelectTrigger id="status" className="h-11 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6 border">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                    <ShieldAlert className="h-5 w-5 text-primary" /> Emergency Contact
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName" className="font-semibold text-foreground">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Emergency contact name"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="font-semibold text-foreground">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation" className="font-semibold text-foreground">Relation</Label>
                      <Input
                        id="emergencyRelation"
                        placeholder="e.g. Spouse, Parent"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="h-11 bg-background"
                      />
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
                        <p className="text-xs text-muted-foreground">Follow this schema to avoid registration issues</p>
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
                      <span className="font-semibold text-foreground">Mandatory fields:</span> Every row must supply Full Name, Email, and Qualification.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Unique emails:</span> Instructor account creation will utilize email credentials automatically.
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
