"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { Copy, Eye, Globe, Share2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default function CoursePublishSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const course = useMemo(
    () => MOCK_INSTRUCTOR_COURSES.find((c) => c.id === courseId),
    [courseId]
  );

  if (!course) {
    notFound();
  }

  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    (course.status === "active" ? "published" : course.status as any) || "draft"
  );
  const [openEnrollment, setOpenEnrollment] = useState(true);
  const [maxStudents, setMaxStudents] = useState<number | "">(course.maxStudents || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API Call
      await new Promise(r => setTimeout(r, 600));
      
      console.log("Publish settings updated:", { status, openEnrollment, maxStudents });
      
      if (typeof window !== "undefined") {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Settings Saved",
            description: `Course is now set to ${status}.`,
          });
        }).catch(() => console.log("Mock toast: saved"));
      }

      router.push(`/instructor/courses/${course.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/courses/${course.id}` : `https://platform.com/courses/${course.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    if (typeof window !== "undefined") {
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "Link Copied",
          description: "Course link copied to clipboard.",
        });
      }).catch();
    }
  };

  return (
    <div className="font-sans mx-auto max-w-4xl space-y-4 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "My Courses", href: "/instructor/courses" },
            { label: course.title.length > 30 ? course.title.slice(0, 30) + "…" : course.title, href: `/instructor/courses/${course.id}` },
            { label: "Publish Settings" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Publish & Enrollment"
          description={`Control the visibility and access settings for ${course.code}.`}
          action={
            <Button variant="outline" className="gap-2" onClick={() => router.push(`/instructor/courses/${course.id}`)}>
              <Eye className="w-4 h-4" /> Preview
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <form id="publishForm" onSubmit={handleSubmit}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Visibility Status</CardTitle>
                <CardDescription>Determine who can see this course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={status} 
                  onValueChange={(v: any) => setStatus(v)}
                  className="space-y-3"
                >
                  <label className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${status === 'draft' ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                    <RadioGroupItem value="draft" id="draft" className="mt-1" />
                    <div className="space-y-1">
                      <Label className="font-semibold cursor-pointer">Draft</Label>
                      <p className="text-sm text-muted-foreground leading-snug">
                        Only instructors and admins can see this course. Students cannot find it or enroll.
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${status === 'published' ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                    <RadioGroupItem value="published" id="published" className="mt-1" />
                    <div className="space-y-1">
                      <Label className="font-semibold cursor-pointer flex items-center gap-2">
                        Published <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-0 text-[10px]">Active</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground leading-snug">
                        Available in the catalog. Students can find and access the course.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${status === 'archived' ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                    <RadioGroupItem value="archived" id="archived" className="mt-1" />
                    <div className="space-y-1">
                      <Label className="font-semibold cursor-pointer">Archived</Label>
                      <p className="text-sm text-muted-foreground leading-snug">
                        Hidden from catalog. Existing students retain access, but no new enrollments are allowed.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Enrollment Rules</CardTitle>
                <CardDescription>Configure how students join this course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="openEnrollment" className="flex flex-col space-y-1">
                    <span>Open Enrollment</span>
                    <span className="font-normal text-sm text-muted-foreground">Allow students to enroll themselves from the course page.</span>
                  </Label>
                  <Switch 
                    id="openEnrollment" 
                    checked={openEnrollment}
                    onCheckedChange={setOpenEnrollment}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <Label htmlFor="maxStudents" className="flex flex-col space-y-1 mb-2">
                    <span>Maximum Students</span>
                    <span className="font-normal text-sm text-muted-foreground">Cap the number of enrolled students. Leave blank for unlimited.</span>
                  </Label>
                  <Input 
                    id="maxStudents" 
                    type="number" 
                    placeholder="e.g. 50" 
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value ? parseInt(e.target.value) : "")}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" /> Share Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy the direct link to share with prospective students.
              </p>
              <div className="flex gap-2">
                <Input readOnly value={shareLink} className="text-xs text-muted-foreground" />
                <Button variant="outline" size="icon" onClick={copyLink} className="shrink-0" title="Copy Link">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" onClick={() => router.push(`/instructor/courses/${course.id}`)}>
          Cancel
        </Button>
        <Button type="submit" form="publishForm" className="gap-2 px-8">
          <Globe className="w-4 h-4" /> Save Preferences
        </Button>
      </div>

    </div>
  );
}

// Badge dependency for local file
function Badge({ children, className, variant }: any) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}
