"use client";

import { Mail, MapPin, Calendar, Award, BookOpen, Edit, Settings, Shield, Bell, ChevronRight, Share2, Download, ExternalLink, GraduationCap, Building2, UserCircle, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">3</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Academic GPA</p>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">3.65</p>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Credits Earned</p>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </div>
            <div className="rounded-full p-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">84</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-xs text-muted-foreground">Assignment completion</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">98%</p>
        </Card>
      </div>

      {/* Profile Hero Section */}
      <Card className="border border-border bg-card">
        <div className="h-24 bg-muted/30 border-b border-border relative">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
           <div className="absolute top-4 right-6 flex gap-2">
             <Button variant="outline" size="sm">
               <Settings className="h-4 w-4 mr-2" />
               Settings
             </Button>
           </div>
        </div>
        
        <div className="px-6 pb-6">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-6">
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

            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Academic Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Academic Performance</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Average Grade", val: "85.2%", sub: "Across all courses" },
                { label: "Attendance", val: "94%", sub: "Verified sessions" },
                { label: "Submissions", val: "100%", sub: "No pending tasks" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-muted/30 border border-border rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{item.val}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-foreground mb-4">Current Course Progress</h4>
            <div className="space-y-4">
              {[
                { name: "Introduction to Computer Science", code: "CS101", progress: 65 },
                { name: "Calculus II", code: "MATH201", progress: 72 },
                { name: "English Literature", code: "ENG102", progress: 58 },
              ].map((course, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.code}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{course.progress}% Complete</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">Dean's List {2024 - i}</h5>
                    <p className="text-xs text-muted-foreground">Academic Excellence Award</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Additional Information */}
        <div className="space-y-6">
          <Card className="border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-4">Institution Info</h3>
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

          <Card className="border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
