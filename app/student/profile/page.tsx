"use client";

import { Mail, Calendar, Edit, GraduationCap, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Breadcrumb 
        items={[
          { label: "Profile" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Student Profile"
        description="View and manage your academic profile and personal information"
      />



      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-500">Security Warning: Default Password Detected</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400/90 mt-1">
            You are currently using the default system password. Please update your password immediately to secure your account.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="bg-white dark:bg-black border-amber-200 hover:bg-amber-100 shrink-0">
          <Link href="/student/profile/edit">Change Password</Link>
        </Button>
      </div>

      {/* Profile Hero Section */}
      <Card className="border border-border bg-card">
        <div className="px-6 py-8">
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">JD</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-xs">
                  Verified Student
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  john.doe@university.edu
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Computer Science
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Class of 2024
                </div>
              </div>
            </div>

            <Button asChild>
              <Link href="/student/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Academic Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border bg-card p-0 overflow-hidden relative">
            <div className="p-6 border-b border-border relative z-10 flex items-center justify-between">
               <h3 className="text-lg font-semibold text-foreground">Academic Performance</h3>
            </div>
            <img src="https://img.icons8.com/color/96/diploma.png" className="absolute right-4 top-4 h-12 w-12 opacity-10 pointer-events-none" alt="Academic" />
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="w-[30%]">Progress</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Introduction to Computer Science", code: "CS101", progress: 65 },
                  { name: "Calculus II", code: "MATH201", progress: 72 },
                  { name: "English Literature", code: "ENG102", progress: 58 },
                ].map((course, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="text-muted-foreground">{course.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <span className="text-xs font-semibold">{course.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">In Progress</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>


        </div>

        {/* Right Column - Additional Information */}
        <div className="space-y-6">
          <Card className="border border-border bg-card p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-semibold text-foreground mb-4">Institution Info</h3>
            </div>
            <img src="https://img.icons8.com/color/96/university.png" className="absolute -right-2 -bottom-2 h-20 w-20 opacity-10 pointer-events-none" alt="Institution" />
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Primary Campus</p>
                <p className="text-sm font-medium text-foreground">Main University Campus</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Academic Advisor</p>
                <p className="text-sm font-medium text-foreground">Dr. Michael Henderson</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Student ID</p>
                <p className="text-sm font-medium text-foreground">#UNIV-2024-8842</p>
              </div>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
}
