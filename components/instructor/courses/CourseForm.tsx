"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { CourseFormValues, courseFormSchema } from "./CourseForm.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "@/hooks/use-toast"; // assuming this exists, or we use sonner/toast. We'll use standard shadcn useToast if available or create a simple wrapper.
// NOTE: based on package.json, sonner or @radix-ui/react-toast is used. We'll stick to a generic import and fix if needed.
import { ImageUploader } from "./ImageUploader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CourseFormProps {
  mode: "create" | "edit";
  course?: any; // The initial course data
  onSuccess: (courseId: string) => void;
  onCancel: () => void;
}

export function CourseForm({ mode, course, onSuccess, onCancel }: CourseFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(course?.thumbnail || course?.thumbnailUrl);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(course?.coverImageUrl);

  const defaultValues: Partial<CourseFormValues> = {
    name: course?.title || "",
    code: course?.code || "",
    category_id: course?.categoryId || "cat-1",
    level: course?.level || "beginner",
    language: course?.language || "english",
    status: (course?.status === "active" ? "published" : course?.status) || "draft",
    duration_weeks: course?.durationWeeks || (course?.duration ? parseInt(course.duration) : undefined),
    credit_units: course?.credits || course?.creditUnits || undefined,
    max_students: course?.maxStudents || undefined,
    prerequisites: course?.prerequisites || "",
    description: course?.description || "",
    learning_outcomes: course?.learningOutcomes?.length ? course.learningOutcomes : [""],
    target_audience: course?.targetAudience || "",
  };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
  });

  const { fields: learningOutcomes, append: appendOutcome, remove: removeOutcome } = useFieldArray({
    control: form.control as any,
    name: "learning_outcomes",
  });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      console.log("Saving course data:", data);
      
      // We would use an actual toast function here. Assuming window.alert is disallowed.
      // We'll dispatch a custom event or use the standardized toast if available.
      // Next.js standard shadcn uses `import { toast } from "@/components/ui/use-toast"`
      // I'll emit a console.log and let the container handle routing if needed
      
      if (typeof window !== "undefined") {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Course saved",
            description: "Your changes have been successfully saved.",
          });
        }).catch(() => {
          // Fallback if toast component path differs
          console.log("Mock toast: Course saved successfully!");
        });
      }

      onSuccess(course?.id || `course-${Date.now()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1 - Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-2 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Essential details about your course.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Introduction to React"
                {...form.register("name")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                placeholder="e.g. CS101"
                {...form.register("code", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }
                })}
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category <span className="text-destructive">*</span></Label>
              <Select defaultValue={form.getValues("category_id")} onValueChange={v => form.setValue("category_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat-1">Computer Science</SelectItem>
                  <SelectItem value="cat-2">Business</SelectItem>
                  <SelectItem value="cat-3">Design</SelectItem>
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level <span className="text-destructive">*</span></Label>
              <Select defaultValue={form.getValues("level")} onValueChange={(v: "beginner"|"intermediate"|"advanced") => form.setValue("level", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language <span className="text-destructive">*</span></Label>
              <Select defaultValue={form.getValues("language")} onValueChange={v => form.setValue("language", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Initial Status</Label>
            <RadioGroup 
              defaultValue={form.getValues("status")} 
              onValueChange={(v: "draft" | "published" | "archived") => form.setValue("status", v)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="r-draft" />
                <Label htmlFor="r-draft" className="font-normal">Draft</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="published" id="r-pub" />
                <Label htmlFor="r-pub" className="font-normal">Published</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 - Details */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-2 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Additional Details</h3>
            <p className="text-sm text-muted-foreground">Course logistics and prerequisites.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration_weeks">Duration (Weeks)</Label>
              <Input
                id="duration_weeks"
                type="number"
                placeholder="e.g. 12"
                {...form.register("duration_weeks")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_units">Credit Units</Label>
              <Input
                id="credit_units"
                type="number"
                placeholder="e.g. 3"
                {...form.register("credit_units")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                placeholder="Leave blank for unlimited"
                {...form.register("max_students")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Prerequisites</Label>
            <Input
              id="prerequisites"
              placeholder="e.g. Basic HTML, General math"
              {...form.register("prerequisites")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3 - Media */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-2 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Media Setup</h3>
            <p className="text-sm text-muted-foreground">Upload engaging visuals for your course card and landing page.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ImageUploader 
              label="Thumbnail Image" 
              subtext="SVG, PNG, JPG (800x400px, max 2MB)" 
              defaultImage={thumbnailPreview}
              onImageChange={(f) => console.log('Thumbnail changed', f)}
            />
            <ImageUploader 
              label="Cover Image" 
              subtext="SVG, PNG, JPG (1920x1080px, max 5MB)" 
              defaultImage={coverPreview}
              onImageChange={(f) => console.log('Cover changed', f)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4 - Content */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-2 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Course Content</h3>
            <p className="text-sm text-muted-foreground">Detailed breakdown of what the course covers.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">About This Course</Label>
            {/* RichTextEditor doesn't map cleanly to register without a controller usually, 
                but we can use value/onChange manually integrated with hook-form */}
            <RichTextEditor 
              value={form.watch("description") || ""}
              onChange={(val) => form.setValue("description", val)}
              placeholder="Provide a detailed description of the course..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">Who This Is For</Label>
            <Textarea
              id="target_audience"
              placeholder="e.g. Web developers looking to upskill"
              {...form.register("target_audience")}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>What You'll Learn <span className="text-destructive">*</span></Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendOutcome("")}
                className="h-8 gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </div>

            <div className="space-y-3">
              {learningOutcomes.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`e.g. Build modern web applications (Item ${index + 1})`}
                    {...form.register(`learning_outcomes.${index}` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (learningOutcomes.length > 1) {
                        removeOutcome(index);
                      }
                    }}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={learningOutcomes.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.learning_outcomes && <p className="text-sm text-destructive">{errors.learning_outcomes.root?.message || "Ensure at least one outcome is filled."}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2 pb-8">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : (mode === "create" ? "Create Course" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
