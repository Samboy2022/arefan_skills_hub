"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, User, Mail, Save, ArrowLeft,
  CheckCircle, AlertCircle, BookOpen, CheckSquare, Square
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

import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { Student } from "@/lib/instructor-types";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "pending" | "dropped">("active");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load students and populate form
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_students");
    let loadedStudents: Student[] = [];
    if (saved) {
      try {
        loadedStudents = JSON.parse(saved);
        setStudents(loadedStudents);
      } catch (e) {
        console.error("Failed to parse students", e);
        loadedStudents = MOCK_STUDENTS;
        setStudents(loadedStudents);
      }
    } else {
      loadedStudents = MOCK_STUDENTS;
      setStudents(loadedStudents);
    }

    const targetStudent = loadedStudents.find(s => s.id === id);
    if (targetStudent) {
      setName(targetStudent.name);
      setEmail(targetStudent.email);
      setStatus(targetStudent.status);
      setEnrolledCourses(targetStudent.enrolledCourses || []);
    }

    setLoaded(true);
  }, [id]);

  const targetStudent = students.find(s => s.id === id);

  const toggleCourse = (courseId: string) => {
    setEnrolledCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg("Please enter the student's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const updatedStudents = students.map(stud => {
        if (stud.id === id) {
          return {
            ...stud,
            name: name.trim(),
            email: email.trim(),
            status: status,
            enrolledCourses: enrolledCourses,
            lastActivity: new Date(),
          };
        }
        return stud;
      });

      localStorage.setItem("school_admin_students", JSON.stringify(updatedStudents));
      setSuccess(true);
      setTimeout(() => {
        router.push(`/school-admin/students/${id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save changes. Please try again.");
    }
  };

  if (!loaded) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading student editor...</p>
      </div>
    );
  }

  if (!targetStudent) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-md mx-auto py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mt-4">Student Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">
          The student profile you are trying to edit does not exist.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/school-admin/students">Back to Student Directory</Link>
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
          The student's profile was updated successfully. Redirecting back to profile view...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Students", href: "/school-admin/students" },
          { label: "Student Profile", href: `/school-admin/students/${id}` },
          { label: "Edit Profile" },
        ]}
      />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
          <Link href={`/school-admin/students/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Student Profile</h1>
      </div>

      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Personal Info Heading */}
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-foreground">Personal Details</h2>
            <p className="text-xs text-muted-foreground">Modify the student's legal name and official school email.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-muted-foreground" /> Full Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-background"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          {/* Academic Info Heading */}
          <div className="border-b pb-3 pt-2">
            <h2 className="text-base font-bold text-foreground">Academic & System Settings</h2>
            <p className="text-xs text-muted-foreground">Manage active course enrollments and platform access state.</p>
          </div>

          {/* Grid: Status & System ID */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status" className="font-semibold text-foreground">Account Access Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger id="status" className="h-11 bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                  <SelectItem value="inactive">Inactive / Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground">Student System ID</Label>
              <div className="h-11 px-3 py-3 border rounded-lg bg-muted text-xs font-mono font-bold flex items-center select-none text-muted-foreground">
                {targetStudent.studentId}
              </div>
            </div>
          </div>

          {/* Enrolled Courses Checklist */}
          <div className="space-y-3 pt-2">
            <Label className="font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-muted-foreground" /> Active Course Enrollments
            </Label>
            
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
                      onCheckedChange={() => {}} // Handle click on container
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

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" type="button" className="h-11 px-5" asChild>
              <Link href={`/school-admin/students/${id}`}>Cancel</Link>
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
