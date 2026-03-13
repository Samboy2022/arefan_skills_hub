"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/classes");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Class"
        description="Fill in the details below to create a new class."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/classes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Class Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="className">Class Name <span className="text-destructive">*</span></Label>
                  <Input id="className" placeholder="e.g. Class 10" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Section <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="roomNo">Room Number</Label>
                  <Input id="roomNo" placeholder="e.g. Room 101" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Student Capacity</Label>
                  <Input id="capacity" type="number" min={1} max={100} placeholder="e.g. 40" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="classTeacher">Class Teacher</Label>
                  <Input id="classTeacher" placeholder="Teacher's name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input id="academicYear" placeholder="e.g. 2024-2025" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Schedule</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" defaultValue="08:00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" defaultValue="14:00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="days">Working Days</Label>
                  <Select defaultValue="mon-fri">
                    <SelectTrigger id="days">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon-fri">Monday - Friday</SelectItem>
                      <SelectItem value="mon-sat">Monday - Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Class"}
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
