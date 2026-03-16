"use client";

import { Mail, MapPin, Calendar, Award, BookOpen, Edit, Settings, Shield, Bell, ChevronRight, Share2, Download, ExternalLink, GraduationCap, Building2, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Profile"
        description="Comprehensive academic record and personal information"
      />

      {/* Profile Hero Section */}
      <Card className="border border-border shadow-none rounded-md bg-card overflow-hidden">
        <div className="h-32 bg-muted/30 border-b border-border relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
           <div className="absolute top-4 right-6 flex gap-2">
             <Button variant="outline" size="sm" className="h-8 border-border bg-background/50 backdrop-blur-sm font-bold text-[10px] uppercase tracking-wider shadow-none">
               <Settings className="h-3.5 w-3.5 mr-2" />
               Account Settings
             </Button>
           </div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-8">
            <Avatar className="h-28 w-28 border-4 border-background shadow-none rounded-md">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">JD</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight">John Doe</h1>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest px-2.5 py-1">Verified Student</Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  john.doe@university.edu
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  Computer Science • Faculty of Engineering
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Class of 2024
                </div>
              </div>
            </div>

            <Button className="font-bold shadow-none rounded-md border-border bg-foreground text-background hover:bg-foreground/90 transition-colors px-6">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2">
            {[
              { label: "Active Courses", value: "03", icon: BookOpen },
              { label: "Academic GPA", value: "3.65", icon: Shield },
              { label: "Credits Earned", value: "84", icon: Award },
              { label: "Success Rate", value: "98%", icon: GraduationCap },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-md border border-border bg-muted/5">
                <div className="h-10 w-10 bg-background border border-border rounded-md flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">{stat.label}</p>
                  <p className="text-xl font-black text-foreground leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Academic Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border shadow-none rounded-md bg-card p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 mb-8">
              <Award className="h-4 w-4" />
              Academic Performance Record
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Average Grade", val: "85.2%", sub: "Across all courses" },
                { label: "Attendance", val: "94%", sub: "Verified sessions" },
                { label: "Submissions", val: "100%", sub: "No pending tasks" },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-muted/20 border border-border/50 rounded-md">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">{item.label}</p>
                  <p className="text-3xl font-black text-foreground mb-1">{item.val}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">{item.sub}</p>
                </div>
              ))}
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-6">Current Enrollment Progress</h4>
            <div className="space-y-6">
              {[
                { name: "Introduction to Computer Science", code: "CS101", progress: 65 },
                { name: "Calculus II", code: "MATH201", progress: 72 },
                { name: "English Literature", code: "ENG102", progress: 58 },
              ].map((course, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">{course.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">{course.code}</p>
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{course.progress}% Complete</span>
                  </div>
                  <Progress value={course.progress} className="h-1 bg-muted" />
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="border border-border shadow-none rounded-md bg-card p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 mb-8">
              <Shield className="h-4 w-4" />
              Honors & Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-5 border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer group bg-muted/5">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-foreground">Dean's List {2024 - i}</h5>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Academic Excellence Award</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - University Information */}
        <div className="space-y-6">
          <Card className="border border-border shadow-none rounded-md bg-card p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 mb-6">
              <Building2 className="h-3.5 w-3.5" />
              Institution Info
            </h3>
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Primary Campus</p>
                <p className="text-xs font-bold text-foreground">Main University Campus • Building 4</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Academic Advisor</p>
                <p className="text-xs font-bold text-foreground">Dr. Michael Henderson</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Student ID</p>
                <p className="text-xs font-bold text-foreground">#UNIV-2024-8842</p>
              </div>
              <div className="pt-4 border-t border-border mt-6">
                <Button variant="ghost" className="w-full justify-between text-[10px] font-black uppercase tracking-[0.2em] h-10 px-0 hover:bg-transparent hover:text-primary group">
                  Institutional Records
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border border-border shadow-none rounded-md bg-muted/30 p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 mb-6">
               <UserCircle className="h-3.5 w-3.5" />
               External Profile
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-6 font-medium">
              Your public academic profile is visible to verified recruiters and faculty members only.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1 font-bold shadow-none text-[10px] uppercase tracking-wider h-9">
                <Share2 className="h-3.5 w-3.5 mr-2" />
                Share
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 font-bold shadow-none text-[10px] uppercase tracking-wider h-9">
                <Download className="h-3.5 w-3.5 mr-2" />
                CV / Resume
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
