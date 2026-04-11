"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Edit, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MOCK_ANNOUNCEMENTS } from "@/lib/instructor-mock-data";

export default function ViewAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const announcement = MOCK_ANNOUNCEMENTS.find(a => a.id === unwrappedParams.id);

  if (!announcement) {
    return (
        <div className="p-8 text-center text-red-500 max-w-2xl mx-auto mt-12 bg-red-50 rounded-xl border border-red-100">
            Resource not found. The announcement may have been deleted or does not exist.
            <div className="mt-4">
                <Button variant="outline" asChild><Link href="/instructor/announcements">Go Back</Link></Button>
            </div>
        </div>
    );
  }

  const formatDate = (date?: Date) => {
    if (!date) return "Not published";
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const getStatusBadge = () => {
    if (announcement.publishedAt) {
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Published</span>;
    }
    if (announcement.scheduled) {
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Scheduled</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Draft</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Announcements", href: "/instructor/announcements" },
          { label: "View Announcement" }
        ]} 
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
            <Link href="/instructor/announcements">
                <ChevronLeft className="h-5 w-5" />
            </Link>
            </Button>
            <div>
            <h1 className="text-2xl font-bold tracking-tight">View Announcement</h1>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild className="gap-2">
                <Link href={`/instructor/announcements/${announcement.id}/edit`}>
                    <Edit className="h-4 w-4" /> Edit Announcement
                </Link>
            </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="border-b bg-muted/20 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
                {getStatusBadge()}
                <span className="text-sm text-muted-foreground flex items-center gap-1.5 border-l pl-3 border-border">
                    <Calendar className="h-4 w-4" /> 
                    {announcement.publishedAt ? `Published on ${formatDate(announcement.publishedAt)}` : 
                     announcement.scheduled ? `Scheduled for ${formatDate(announcement.createdAt)}` : 
                     `Last updated on ${formatDate(announcement.updatedAt)}`}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center shrink-0 shadow-sm">
                    <img src="https://img.icons8.com/color/96/commercial.png" alt="Announcement" className="h-6 w-6 md:h-7 md:w-7 filter drop-shadow-sm" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{announcement.title}</h1>
            </div>
        </div>
        <div className="p-6 md:p-8 bg-card min-h-[300px]">
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-lg">
                {announcement.content}
            </p>
        </div>
      </div>

    </div>
  );
}
