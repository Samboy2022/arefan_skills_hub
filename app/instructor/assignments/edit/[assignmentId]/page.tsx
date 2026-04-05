"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MOCK_ASSIGNMENTS } from "@/lib/instructor-mock-data";

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const assignment = useMemo(
    () => MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  );

  if (!assignment) {
    notFound();
  }

  const [description, setDescription] = useState(assignment.description || "");
  const [date, setDate] = useState<Date | undefined>(assignment.dueDate);
  const [title, setTitle] = useState(assignment.title);
  
  const handleSave = () => {
    // Demo save
    window.alert("Assignment updated! (Demo)");
    router.push("/instructor/assignments");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Assignments", href: "/instructor/assignments" },
            { label: `Edit ${assignment.title}` }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Edit Assignment"
          description={`Make changes to ${assignment.title}. Modify due dates, scoring, and rubrics below.`}
        />
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Assignment Details
          </CardTitle>
          <CardDescription>Update the information for this student assignment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-semibold">Assignment Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Midterm Essay" className="max-w-xl" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Assignment Category</Label>
              <Select defaultValue={assignment.type || "file"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="essay">Text Entry (Essay)</SelectItem>
                  <SelectItem value="quiz">Interactive Quiz</SelectItem>
                  <SelectItem value="external">External Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="points" className="text-sm font-semibold">Maximum Score / Points</Label>
              <Input id="points" type="number" defaultValue={assignment.maxScore} min={1} />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Status</Label>
              <Select defaultValue={assignment.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Published)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Detailed Instructions</Label>
            <div className="border border-border/50 rounded-md overflow-hidden">
              <ForumRichEditor
                content={description}
                onChange={setDescription}
                placeholder="Give students specific contexts, references, and rubrics."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-3 border-t bg-muted/20 p-6">
          <Button variant="ghost" asChild>
            <Link href="/instructor/assignments">Cancel</Link>
          </Button>
          <Button type="button" onClick={handleSave} className="min-w-[120px]">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
