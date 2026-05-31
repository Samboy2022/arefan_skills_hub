"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, AlignLeft, BookOpen,
  ArrowLeft, Edit, Trash2, ShieldCheck, Mail, Phone,
  GraduationCap, User, UserCheck, AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import type { Student } from "@/lib/instructor-types";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("school_admin_students");
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse students", e);
        setStudents(MOCK_STUDENTS);
      }
    } else {
      setStudents(MOCK_STUDENTS);
    }
    setLoaded(true);
  }, []);

  // Find target student
  const student = useMemo(() => {
    return students.find(s => s.id === id);
  }, [students, id]);

  const handleDelete = () => {
    const updated = students.filter(s => s.id !== id);
    localStorage.setItem("school_admin_students", JSON.stringify(updated));
    router.push("/school-admin/students");
  };

  if (!loaded) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto py-12">
        <p className="text-center text-muted-foreground text-sm animate-pulse">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-md mx-auto py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mt-4">Student Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">
          The student with ID "{id}" does not exist in the active directory.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/school-admin/students">Back to Student Directory</Link>
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    inactive: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  return (
    <div className="space-y-6 pb-12 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Students", href: "/school-admin/students" },
          { label: "Student Profile" },
        ]}
      />

      {/* Header back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
            <Link href="/school-admin/students">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Student Record Card</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/school-admin/students/${id}/edit`}>
              <Edit className="h-4 w-4" /> Edit Profile
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete Student
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 text-center space-y-4 shadow-sm border">
            <div className="relative mx-auto h-24 w-24 rounded-full flex items-center justify-center border-4 border-muted overflow-hidden bg-primary/10">
              {student.avatar ? (
                <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-primary" />
              )}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground truncate">{student.name}</h2>
              <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${statusColors[student.status]}`}>
                {student.status}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground font-semibold font-mono bg-muted py-1.5 rounded-lg border">
              ID: {student.studentId}
            </div>

            <div className="pt-4 border-t space-y-2 text-left text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-foreground/50 shrink-0" />
                <span className="truncate text-foreground/80">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-foreground/50 shrink-0" />
                <span>Joined: {format(new Date(student.joinDate), "MMM d, yyyy")}</span>
              </div>
              {student.lastActivity && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-foreground/50 shrink-0" />
                  <span>Active: {format(new Date(student.lastActivity), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Academic Course Enrollments Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 border shadow-sm">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b pb-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Enrollments
            </h3>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Currently Enrolled Courses ({student.enrolledCourses?.length || 0})
              </h4>

              {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {student.enrolledCourses.map(cId => {
                    const c = MOCK_INSTRUCTOR_COURSES.find(crs => crs.id === cId);
                    if (!c) return null;
                    return (
                      <Card key={cId} className="p-4 border bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded">
                              {c.code}
                            </span>
                            <h5 className="font-bold text-sm text-foreground leading-snug pt-1">{c.title}</h5>
                            <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5 line-clamp-2">
                              {c.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-xl bg-muted/20">
                  <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This student is not enrolled in any courses.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="p-6 space-y-4 border shadow-sm">
            <h3 className="text-sm font-bold text-foreground">Academic Status Logs</h3>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <div className="bg-muted/10 p-3 rounded-lg border text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">MFA Status</span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1 justify-center mt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Secure
                </span>
              </div>
              <div className="bg-muted/10 p-3 rounded-lg border text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Verify Status</span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1 justify-center mt-1">
                  <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Verified
                </span>
              </div>
              <div className="bg-muted/10 p-3 rounded-lg border text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">System Access</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1 block">Granted</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the profile of "{student.name}"? This will withdraw them from all courses and remove all record history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
