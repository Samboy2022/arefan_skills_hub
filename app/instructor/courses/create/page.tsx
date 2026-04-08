"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/student/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [creditUnit, setCreditUnit] = useState("");
  const [courseOverview, setCourseOverview] = useState("");
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>([""]);

  const handleAddLearningItem = () => {
    setWhatYouLearn([...whatYouLearn, ""]);
  };

  const handleRemoveLearningItem = (index: number) => {
    const newItems = [...whatYouLearn];
    newItems.splice(index, 1);
    // Ensure there's always at least one input
    if (newItems.length === 0) {
      newItems.push("");
    }
    setWhatYouLearn(newItems);
  };

  const handleLearningItemChange = (index: number, value: string) => {
    const newItems = [...whatYouLearn];
    newItems[index] = value;
    setWhatYouLearn(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically send data to the API
    console.log({
      courseName,
      courseCode,
      courseDuration,
      creditUnit,
      courseOverview,
      whatYouLearn: whatYouLearn.filter(item => item.trim() !== "")
    });
    // Stop here as requested by user. We will not proceed to modules/lessons.
    alert("Course created successfully!");
    router.push("/instructor/courses");
  };

  return (
    <div className="font-sans space-y-6 max-w-4xl mx-auto pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses", href: "/instructor/courses" },
          { label: "Create Course" }
        ]}
      />

      <div className="pt-2">
        <PageHeader
          title="Create New Course"
          description="Enter the basic information about your new course."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name <span className="text-destructive">*</span></Label>
                <Input
                  id="courseName"
                  placeholder="e.g. Introduction to React"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g. CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courseDuration">Course Duration (in weeks)</Label>
                <Input
                  id="courseDuration"
                  type="number"
                  placeholder="e.g. 12"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditUnit">Credit Unit</Label>
                <Input
                  id="creditUnit"
                  type="number"
                  placeholder="e.g. 3"
                  value={creditUnit}
                  onChange={(e) => setCreditUnit(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Course Thumbnail Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  <Input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Course Cover Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 1920x1080px)</p>
                  <Input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseOverview">About This Course</Label>
              <RichTextEditor 
                value={courseOverview}
                onChange={setCourseOverview}
                placeholder="Provide a detailed description of the course..." 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>What You'll Learn</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLearningItem}
                  className="h-8 gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </div>

              <div className="space-y-3">
                {whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`e.g. Build modern web applications (Item ${index + 1})`}
                      value={item}
                      onChange={(e) => handleLearningItemChange(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLearningItem(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/instructor/courses')}>
            Cancel
          </Button>
          <Button type="submit">
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
