"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MOCK_INSTRUCTOR_COURSES, MOCK_STUDENTS, MOCK_GRADES } from "@/lib/instructor-mock-data";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import { toast } from "sonner"; // If sonner exists, otherwise just router.push

export default function EditGradePage({ params }: { params: Promise<{ courseId: string, studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  
  const course = MOCK_INSTRUCTOR_COURSES.find(c => c.id === unwrappedParams.courseId);
  const student = MOCK_STUDENTS.find(s => s.id === unwrappedParams.studentId);

  // Initialize values (in a real app, fetch from API)
  const [assignmentScore, setAssignmentScore] = useState<string>(() => {
    const g = MOCK_GRADES.filter(g => g.studentId === unwrappedParams.studentId && g.courseId === unwrappedParams.courseId && g.type === "assignment");
    if (!g.length) return "";
    return Math.round(g.reduce((s, x) => s + (x.score / x.maxScore) * 100, 0) / g.length).toString();
  });
  const [quizScore, setQuizScore] = useState<string>(() => {
    const g = MOCK_GRADES.filter(g => g.studentId === unwrappedParams.studentId && g.courseId === unwrappedParams.courseId && g.type === "quiz");
    if (!g.length) return "";
    return Math.round(g.reduce((s, x) => s + (x.score / x.maxScore) * 100, 0) / g.length).toString();
  });
  const [forumScore, setForumScore] = useState<string>(() => {
    const g = MOCK_GRADES.filter(g => g.studentId === unwrappedParams.studentId && g.courseId === unwrappedParams.courseId && g.type === "forum");
    if (!g.length) return "";
    return Math.round(g.reduce((s, x) => s + (x.score / x.maxScore) * 100, 0) / g.length).toString();
  });

  const a = Number(assignmentScore) || 0;
  const q = Number(quizScore) || 0;
  const f = Number(forumScore) || 0;
  const total = Math.min(100, Math.round(a + q + f));

  if (!course || !student) {
    return <div className="p-8 text-center text-red-500">Resource not found.</div>;
  }

  const handleSave = () => {
    // In a real app, this would hit an API endpoint to save the grades
    try {
        toast.success("Grades saved successfully!");
    } catch (e) {
        // Fallback if toast isn't available
        alert("Grades saved successfully!");
    }
    router.push(`/instructor/gradebook/${course.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Gradebook", href: "/instructor/gradebook" },
          { label: course.code, href: `/instructor/gradebook/${course.id}` },
          { label: `Grade ${student.name}` }
        ]} 
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
          <Link href={`/instructor/gradebook/${course.id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Student: <span className="text-muted-foreground">{course.title}</span></h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">{course.code} • Update official marks for the course record.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-muted/30 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <CardTitle className="text-xl">{student.name}</CardTitle>
              <CardDescription className="font-mono mt-0.5">{student.studentId} • {student.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
            <Alert className="bg-blue-50 border-blue-200 mb-6">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Scoring Guidelines</AlertTitle>
                <AlertDescription className="text-blue-700 mt-1">
                    Input the marks obtained for each category. They will automatically be summed up to calculate the total course mark (max 100%).
                </AlertDescription>
            </Alert>

            <div className="rounded-lg border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[40%] font-semibold">Assessment Category</TableHead>
                            <TableHead className="w-[30%] font-semibold text-center">Score Input</TableHead>
                            <TableHead className="w-[30%] font-semibold text-right">Max Obtainable</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>Assignments Mark</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <HelpCircle className="h-3 w-3" /> E.g. typically out of 40%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Input 
                                    type="number" 
                                    min="0" max="100" 
                                    value={assignmentScore} 
                                    onChange={(e) => setAssignmentScore(e.target.value)} 
                                    placeholder="0"
                                    className="bg-muted/50 focus:bg-background h-10 w-32 mx-auto text-center"
                                />
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground font-mono">100</TableCell>
                        </TableRow>
                        
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>Quizzes Mark</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <HelpCircle className="h-3 w-3" /> E.g. typically out of 30%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Input 
                                    type="number" 
                                    min="0" max="100" 
                                    value={quizScore} 
                                    onChange={(e) => setQuizScore(e.target.value)} 
                                    placeholder="0"
                                    className="bg-muted/50 focus:bg-background h-10 w-32 mx-auto text-center"
                                />
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground font-mono">100</TableCell>
                        </TableRow>

                        <TableRow className="hover:bg-transparent">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>Forum Participation Mark</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <HelpCircle className="h-3 w-3" /> E.g. typically out of 30%
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Input 
                                    type="number" 
                                    min="0" max="100" 
                                    value={forumScore} 
                                    onChange={(e) => setForumScore(e.target.value)} 
                                    placeholder="0"
                                    className="bg-muted/50 focus:bg-background h-10 w-32 mx-auto text-center"
                                />
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground font-mono">100</TableCell>
                        </TableRow>
                        
                        <TableRow className="bg-slate-50 dark:bg-slate-900 border-t-2">
                            <TableCell className="font-bold text-lg">Total Course Mark</TableCell>
                            <TableCell colSpan={2} className="text-right">
                                <div className="flex justify-end pr-4">
                                    <div className="flex items-baseline gap-1 bg-white dark:bg-black px-4 py-2 rounded-lg border shadow-sm">
                                        <span className={`text-3xl font-bold tracking-tighter ${
                                            total >= 70 ? "text-emerald-500" :
                                            total >= 50 ? "text-amber-500" : "text-rose-500"
                                        }`}>{total}</span>
                                        <span className="text-lg font-bold text-muted-foreground">%</span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/10 px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" asChild>
                <Link href={`/instructor/gradebook/${course.id}`}>Cancel</Link>
            </Button>
            <Button onClick={handleSave} className="min-w-[120px]">
                Save Grades
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
