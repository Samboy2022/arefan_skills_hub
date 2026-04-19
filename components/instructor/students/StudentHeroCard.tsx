"use client";

import { Download, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student, Course } from "@/lib/instructor-types";

interface StudentHeroCardProps {
  student: Student;
  courses: Course[];
}

export function StudentHeroCard({ student, courses }: StudentHeroCardProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-md shrink-0">
              {initials}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground truncate">{student.name}</h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <span className="text-sm text-muted-foreground truncate">{student.email}</span>
                <span className="inline-flex items-center font-mono text-xs bg-muted/50 border border-border px-2 py-0.5 rounded-md text-foreground">
                  {student.studentId}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                  student.status === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                  student.status === "pending" ? "bg-amber-50 border-amber-200 text-amber-700" :
                  "bg-gray-50 border-gray-200 text-gray-700"
                }`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
              </div>
              
              <div className="flex gap-2 mt-3 flex-wrap">
                {courses.map((c) => (
                  <span key={c.id} className="text-xs bg-muted/30 border border-border px-2.5 py-1 rounded-md text-muted-foreground font-medium">
                    {c.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" asChild className="gap-2 h-9 shadow-sm">
              <Link href={`/instructor/students/${student.id}/message`}>
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 shadow-sm">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
