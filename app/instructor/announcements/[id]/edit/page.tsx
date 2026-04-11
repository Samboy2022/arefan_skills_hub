"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_INSTRUCTOR_COURSES, MOCK_ANNOUNCEMENTS } from "@/lib/instructor-mock-data";
import { toast } from "sonner";

export default function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  
  const announcement = MOCK_ANNOUNCEMENTS.find(a => a.id === unwrappedParams.id);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (announcement) {
        setCourseId(MOCK_INSTRUCTOR_COURSES[0].id); // MOCK_ANNOUNCEMENTS don't actually hold courseId in mock model, so just default to first
        setTitle(announcement.title);
        setDescription(announcement.content);
        setIsPublished(!!announcement.publishedAt);
    }
  }, [announcement]);

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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !courseId) {
        toast.error("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
        try { toast.success("Announcement successfully updated!"); } catch(e) {}
        router.push("/instructor/announcements");
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
          <Breadcrumb 
            showHome={false}
            items={[
              { label: "Dashboard", href: "/instructor" },
              { label: "Announcements", href: "/instructor/announcements" },
              { label: "Edit" }
            ]} 
          />
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/instructor/announcements">
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* PREMIUM CARD HEADER */}
        <div className="p-6 md:p-8 border-b bg-gradient-to-b from-background to-muted/10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 shadow-sm">
                <img src="https://img.icons8.com/color/96/commercial.png" alt="Edit" className="h-7 w-7 filter drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">Edit Announcement</h1>
              <p className="text-muted-foreground mt-1 text-sm">Make changes to your existing announcement below.</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
                
                <div className="space-y-2">
                    <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
                    <Select value={courseId} onValueChange={setCourseId} required>
                        <SelectTrigger className="w-full bg-muted/50 focus:bg-background">
                            <SelectValue placeholder="Select the course for which announcement is to be created for..." />
                        </SelectTrigger>
                        <SelectContent>
                            {MOCK_INSTRUCTOR_COURSES.map(course => (
                                <SelectItem key={course.id} value={course.id}>
                                    {course.code} - {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Announcement Title <span className="text-red-500">*</span></Label>
                    <Input 
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter the title of your announcement"
                        required
                        className="bg-muted/50 focus:bg-background"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Write your announcement details here..."
                        required
                        className="min-h-[200px] bg-muted/50 focus:bg-background resize-y"
                    />
                </div>

                <div className="flex items-center justify-between p-5 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Publish Announcement</Label>
                        <p className="text-sm text-muted-foreground">
                            Set to "Yes" to make the announcement immediately available to students. Set to "No" to save as a draft.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${!isPublished ? "text-muted-foreground" : ""}`}>No</span>
                        <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                        <span className={`text-sm font-medium ${isPublished ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>Yes</span>
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t mt-8">
                    <Button type="button" variant="ghost" asChild>
                        <Link href="/instructor/announcements">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px] shadow-sm">
                        {isSubmitting ? "Updating..." : "Update Announcement"}
                    </Button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
