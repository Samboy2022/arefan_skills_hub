"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/assessments");
  };

  const assessmentTypes = ["Quiz", "Unit Test", "Mid-term Exam", "Final Exam", "Assignment", "Project", "Practical"];
  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Computer Science", "Physics", "Chemistry", "Biology"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Assessment"
        description="Fill in the details below to schedule a new assessment."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/assessments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessments
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Assessment Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="title">Assessment Title <span className="text-destructive">*</span></Label>
                  <Input id="title" placeholder="e.g. Mid-term Mathematics Exam" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Assessment Type <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                        <SelectItem key={g} value={String(g)}>Class {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Select>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="All sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {["A", "B", "C", "D"].map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="description">Description / Instructions</Label>
                  <Textarea id="description" placeholder="Assessment instructions and scope..." rows={3} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Schedule & Marking</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="examDate">Assessment Date <span className="text-destructive">*</span></Label>
                  <Input id="examDate" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" min={15} placeholder="e.g. 90" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxMarks">Maximum Marks <span className="text-destructive">*</span></Label>
                  <Input id="maxMarks" type="number" min={1} placeholder="e.g. 100" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passingMarks">Passing Marks</Label>
                  <Input id="passingMarks" type="number" min={1} placeholder="e.g. 35" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="scheduled">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Additional Info</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="invigilator">Invigilator</Label>
                  <Input id="invigilator" placeholder="Teacher's name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue / Room</Label>
                  <Input id="venue" placeholder="e.g. Hall A, Room 202" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="syllabus">Syllabus Coverage</Label>
                  <Textarea id="syllabus" placeholder="Chapters / topics covered..." rows={4} />
                </div>
              </div>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Assessment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
