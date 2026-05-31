"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, User, Mail, Save, ArrowLeft,
  CheckCircle, AlertCircle, BookOpen, CheckSquare, ShieldAlert
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockFaculty } from "@/lib/tenant-mock-data";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default function EditInstructorPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const [faculty, setFaculty] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load instructor data
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_instructors");
    let currentFaculty: any[] = [];
    if (saved) {
      try {
        currentFaculty = JSON.parse(saved);
        setFaculty(currentFaculty);
      } catch (e) {
        console.error("Failed to parse faculty, seeding", e);
      }
    }

    if (currentFaculty.length === 0) {
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
      setFaculty(currentFaculty);
      localStorage.setItem("school_admin_instructors", JSON.stringify(currentFaculty));
    }

    const target = currentFaculty.find(f => f.id === id);
    if (target) {
      setFullName(target.name || "");
      setEmail(target.email || "");
      setPhone(target.phone || "");
      setGender(target.gender || "male");
      setQualification(target.qualification || "");
      setDepartment(target.department || "Computer Science");
      setJoinDate(target.joinDate || "");
      setStatus(target.status || "Active");
      setAssignedCourses(target.assignedCourses || []);
      
      if (target.emergencyContact) {
        setEmergencyName(target.emergencyContact.name || "");
        setEmergencyPhone(target.emergencyContact.phone || "");
        setEmergencyRelation(target.emergencyContact.relation || "");
      }
    }

    setLoaded(true);
  }, [id]);

  const targetFaculty = faculty.find(f => f.id === id);

  const toggleCourse = (courseId: string) => {
    setAssignedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    try {
      const updated = faculty.map(f => {
        if (f.id === id) {
          return {
            ...f,
            name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            gender: gender,
            qualification: qualification.trim(),
            department: department,
            joinDate: joinDate,
            status: status,
            assignedCourses: assignedCourses,
            emergencyContact: {
              name: emergencyName.trim(),
              phone: emergencyPhone.trim(),
              relation: emergencyRelation.trim(),
            }
          };
        }
        return f;
      });

      localStorage.setItem("school_admin_instructors", JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => {
        router.push(`/school-admin/instructors/${id}`);
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save changes. Please try again.");
    }
  };

  if (!loaded) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading instructor editor...</p>
      </div>
    );
  }

  if (!targetFaculty) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-md mx-auto py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mt-4">Instructor Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">
          The instructor profile you are trying to edit does not exist.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/school-admin/instructors">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
        <h2 className="text-2xl font-bold text-foreground">Changes Saved!</h2>
        <p className="text-muted-foreground text-sm">
          The instructor profile was updated successfully. Redirecting to profile view...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Instructors", href: "/school-admin/instructors" },
          { label: "Instructor Profile", href: `/school-admin/instructors/${id}` },
          { label: "Edit Instructor" },
        ]}
      />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
          <Link href={`/school-admin/instructors/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Instructor Details</h1>
      </div>

      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-foreground">Personal Details</h2>
            <p className="text-xs text-muted-foreground">Modify the instructor's personal information and academic credentials.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-semibold text-foreground">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-foreground">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold text-foreground">Phone Number</Label>
              <Input
                id="phone"
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
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="border-b pb-3 pt-2">
            <h2 className="text-base font-bold text-foreground">School Administration Settings</h2>
            <p className="text-xs text-muted-foreground">Manage active assigned courses, departments, and statuses.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
              <Label htmlFor="status" className="font-semibold text-foreground">Access Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger id="status" className="h-11 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive / Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assigned Courses checklist */}
          <div className="space-y-3 pt-2">
            <Label className="font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-muted-foreground" /> Assigned Courses to Teach
            </Label>
            
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
                      onCheckedChange={() => {}} // Controlled by wrapper div click
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold font-mono text-primary">{course.code}</p>
                      <p className="text-xs font-medium text-foreground truncate mt-0.5">{course.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border-b pb-3 pt-2">
            <h2 className="text-base font-bold text-foreground">Emergency Contact Details</h2>
            <p className="text-xs text-muted-foreground">Manage the instructor's system emergency details.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="emergencyName" className="font-semibold text-foreground">Contact Name</Label>
              <Input
                id="emergencyName"
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
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelation" className="font-semibold text-foreground">Relation</Label>
              <Input
                id="emergencyRelation"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" type="button" className="h-11 px-5" asChild>
              <Link href={`/school-admin/instructors`}>Cancel</Link>
            </Button>
            <Button type="submit" className="h-11 px-6 gap-2">
              <Save className="h-4 w-4" /> Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
