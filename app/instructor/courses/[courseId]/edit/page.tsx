"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { ArrowLeft, Lightbulb, Plus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function InstructorCourseEditPage() {
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

  const [courseName, setCourseName] = useState(course.title || "");
  const [courseCode, setCourseCode] = useState(course.code || "");
  const [courseDuration, setCourseDuration] = useState("");
  const [creditUnit, setCreditUnit] = useState(course.credits?.toString() || "");
  const [courseOverview, setCourseOverview] = useState(course.description || "");
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>([""]);

  const viewHref = `/instructor/courses/${course.id}`;

  const handleAddLearningItem = () => {
    setWhatYouLearn([...whatYouLearn, ""]);
  };

  const handleRemoveLearningItem = (index: number) => {
    const newItems = [...whatYouLearn];
    newItems.splice(index, 1);
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
    console.log({
      courseName,
      courseCode,
      courseDuration,
      creditUnit,
      courseOverview,
      whatYouLearn: whatYouLearn.filter(item => item.trim() !== "")
    });
    alert("Course updated successfully!");
    router.push(viewHref);
  };

  return (
    <div className="font-sans mx-auto max-w-6xl space-y-4 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "My Courses", href: "/instructor/courses" },
            { label: course.title, href: viewHref },
            { label: "Edit Details" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Edit course details"
          description={`Update catalog data for ${course.code}. Make sure your description is detailed and clear.`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              <CardFooter className="flex flex-wrap justify-end gap-2 border-t pt-6">
                <Button type="button" variant="outline" asChild>
                  <Link href={viewHref}>Cancel</Link>
                </Button>
                <Button type="submit" className="px-8">
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Want to manage curriculum instead? Content editing opens from{" "}
            <Link
              href={`/instructor/lessons?courseId=${encodeURIComponent(course.id)}`}
              className="font-medium text-primary hover:underline underline-offset-2"
            >
              Lessons &amp; content
            </Link>{" "}
            or the course overview.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/30 border-primary/10 shadow-sm sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tips for a Great Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <strong className="text-foreground block mb-1">Clear Titles</strong>
                Make sure your course title is catchy yet descriptive. Avoid overly complex jargon.
              </div>
              <div>
                <strong className="text-foreground block mb-1">Engaging Description</strong>
                Use the rich text editor to break up long paragraphs. Use bullet points for prerequisites and bold text for key learning outcomes.
              </div>
              <div>
                <strong className="text-foreground block mb-1">Upload Visuals</strong>
                A compelling cover image dramatically increases interest. Keep it clean and high-quality.
              </div>
              <div className="pt-4 border-t border-border mt-4">
                Need more help? Check out our <a href="#" className="text-primary hover:underline">Instructor Guide</a> for best practices on course creation.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
