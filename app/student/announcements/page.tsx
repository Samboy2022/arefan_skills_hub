"use client";

import { useState } from "react";
import { Bell, Calendar, User, ChevronRight, ChevronLeft, Info, Megaphone, Pin, ArrowRight, Share2, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { COURSE_ANNOUNCEMENTS } from "@/lib/student-mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [activeAnnouncementId, setActiveAnnouncementId] = useState<string | null>(null);
  
  const activeAnnouncement = COURSE_ANNOUNCEMENTS.find(a => a.id === activeAnnouncementId);

  if (activeAnnouncement) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveAnnouncementId(null)}
            className="flex items-center gap-2 border-border hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Updates
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border shadow-none rounded-md bg-card overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Badge variant="outline" className="font-bold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-sm border border-primary/20 text-primary bg-primary/5">
                    Official Update
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(activeAnnouncement.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h1 className="text-3xl font-black text-foreground mb-6 leading-tight">
                  {activeAnnouncement.title}
                </h1>

                <div className="prose prose-slate prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
                  <p>Dear Students,</p>
                  <p>{activeAnnouncement.content}</p>
                  <p>Please ensure you have reviewed any supplementary materials related to this update in the Materials section. Our goal is to ensure everyone has the resources they need to succeed.</p>
                  <p>Should you have any immediate concerns, feel free to reach out during office hours or post your questions in the discussion forum.</p>
                  <p>Best regards,<br /><span className="font-bold text-foreground">{activeAnnouncement.instructor}</span></p>
                </div>
              </div>

              <div className="px-8 py-4 bg-muted/5 border-t border-border flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    Published by Academic Staff
                  </span>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" className="h-8 text-muted-foreground font-bold hover:bg-muted/50">
                     <Share2 className="h-3.5 w-3.5 mr-2" />
                     Share
                   </Button>
                   <Button variant="ghost" size="sm" className="h-8 text-primary font-bold hover:bg-primary/5">
                     <Printer className="h-3.5 w-3.5 mr-2" />
                     Print
                   </Button>
                </div>
              </div>
            </Card>

            {/* Attachments Section */}
            <Card className="border border-border shadow-none rounded-md bg-card p-6">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Official Documentation</h4>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-md border border-border bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Revised_Schedule_V{i}.pdf</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">PDF Document • 1.{i} MB</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border shadow-none rounded-md bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-12 w-12 border border-border shadow-none bg-muted">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAnnouncement.instructor}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeAnnouncement.instructor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{activeAnnouncement.instructor}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Course Instructor</p>
                </div>
              </div>
              <Button className="w-full font-bold shadow-none rounded-md" variant="secondary">Message Instructor</Button>
            </Card>

            <Card className="border border-border shadow-none rounded-md bg-muted/30 p-6" id="recent-announcements">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Recent Announcements</h4>
              <div className="space-y-4">
                {COURSE_ANNOUNCEMENTS.filter(a => a.id !== activeAnnouncementId).slice(0, 3).map(ann => (
                  <div 
                    key={ann.id} 
                    onClick={() => setActiveAnnouncementId(ann.id)}
                    className="cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {ann.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(ann.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Updates & Announcements"
        description="Stay informed about your courses"
      />

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 mb-6">
          <Bell className="h-3.5 w-3.5" />
          Timeline of Communications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_ANNOUNCEMENTS.map((ann) => (
            <Card
              key={ann.id}
              id={`announcement-${ann.id}`}
              onClick={() => setActiveAnnouncementId(ann.id)}
              className="group flex flex-col h-full border border-border shadow-none rounded-md transition-all cursor-pointer hover:border-primary/50 relative overflow-hidden bg-card"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                   <Badge variant="outline" className="font-bold uppercase tracking-wider text-[8px] px-2 py-0.5 rounded-sm border-primary/30 text-primary">
                    Announcement
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="font-bold text-lg mb-3 leading-tight group-hover:text-primary transition-colors">{ann.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                  {ann.content}
                </p>
                
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50">
                    {ann.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-foreground truncate uppercase tracking-wider">{ann.instructor}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-tight">Lead Faculty</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-muted/30 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Read announcement</span>
                <ChevronRight className="h-3.5 w-3.5 text-primary" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
