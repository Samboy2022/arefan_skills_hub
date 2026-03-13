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

export default function CreateCurriculumPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/curriculum");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Subject"
        description="Fill in the details below to add a new subject to the curriculum."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/curriculum">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Curriculum
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Subject Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="subjectName">Subject Name <span className="text-destructive">*</span></Label>
                  <Input id="subjectName" placeholder="e.g. Advanced Mathematics" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subjectCode">Subject Code <span className="text-destructive">*</span></Label>
                  <Input id="subjectCode" placeholder="e.g. MATH-101" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade Level <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                        <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Credits / Hours</Label>
                  <Input id="credits" type="number" min={1} placeholder="e.g. 4" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Subject Type</Label>
                  <Select defaultValue="core">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="elective">Elective</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the subject..." rows={3} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea id="objectives" placeholder="Key learning objectives for this subject..." rows={3} />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Assignment</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="teacher">Assigned Teacher</Label>
                  <Input id="teacher" placeholder="Teacher name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="textbook">Textbook / Reference</Label>
                  <Input id="textbook" placeholder="e.g. NCERT Class 10" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="periodsPerWeek">Periods Per Week</Label>
                  <Input id="periodsPerWeek" type="number" min={1} max={10} placeholder="e.g. 5" />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Subject"}
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
