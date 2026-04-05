"use client";

import { useState } from "react";
import { Bell, Calendar, User, ChevronRight, ChevronLeft, Info, Megaphone, Pin, ArrowRight, Share2, Printer, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { COURSE_ANNOUNCEMENTS } from "@/lib/student-mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Announcements
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border bg-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="outline" className="font-medium text-xs px-2 py-1 rounded border-primary/20 text-primary bg-primary/5">
                    Official Update
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(activeAnnouncement.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                  {activeAnnouncement.title}
                </h1>

                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
                  <p>Dear Students,</p>
                  <p>{activeAnnouncement.content}</p>
                  <p>Please ensure you have reviewed any supplementary materials related to this update in the Materials section. Our goal is to ensure everyone has the resources they need to succeed.</p>
                  <p>Should you have any immediate concerns, feel free to reach out during office hours or post your questions in the discussion forum.</p>
                  <p>Best regards,<br /><span className="font-semibold text-foreground">{activeAnnouncement.instructor}</span></p>
                </div>
              </div>

              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Published by Academic Staff
                  </span>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm">
                     <Share2 className="h-4 w-4 mr-2" />
                     Share
                   </Button>
                   <Button variant="ghost" size="sm">
                     <Printer className="h-4 w-4 mr-2" />
                     Print
                   </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border bg-card p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAnnouncement.instructor}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeAnnouncement.instructor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{activeAnnouncement.instructor}</h4>
                  <p className="text-xs text-muted-foreground">Course Instructor</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Instructor
              </Button>
            </Card>

            <Card className="border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-3">Recent Announcements</h4>
              <div className="space-y-3">
                {COURSE_ANNOUNCEMENTS.filter(a => a.id !== activeAnnouncementId).slice(0, 3).map(ann => (
                  <div 
                    key={ann.id} 
                    onClick={() => setActiveAnnouncementId(ann.id)}
                    className="cursor-pointer group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {ann.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
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
      <Breadcrumb 
        items={[
          { label: "Announcements" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Announcements"
        description="Stay informed about your courses and important updates"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Announcements</p>
              <p className="text-xs text-muted-foreground">All updates</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{COURSE_ANNOUNCEMENTS.length}</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Info className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{COURSE_ANNOUNCEMENTS.filter(a => !a.is_read).length}</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-xs text-muted-foreground">Recent updates</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">2</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Announcements</h3>
        
        <div className="space-y-4">
          {COURSE_ANNOUNCEMENTS.map((ann) => (
            <Card
              key={ann.id}
              onClick={() => setActiveAnnouncementId(ann.id)}
              className="p-4 border border-border transition-colors cursor-pointer hover:border-primary/50 bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="font-medium text-xs px-2 py-1 border-primary/20 text-primary">
                  Announcement
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h4 className="font-semibold text-lg mb-2 leading-tight hover:text-primary transition-colors">{ann.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {ann.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ann.instructor}`} />
                    <AvatarFallback className="text-xs">{ann.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{ann.instructor}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
