"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/instructor-types";

// Dynamic schema
const gradingSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      points: z.coerce.number().min(0, "Must be >= 0"),
    })
  ).min(1, "Must have at least one category"),
});

type GradingFormValues = z.infer<typeof gradingSchema>;

interface GradingWeightsFormProps {
  course: Course;
  initialCategories: { name: string; points: number }[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function GradingWeightsForm({ course, initialCategories, onSuccess, onCancel }: GradingWeightsFormProps) {
  const form = useForm<GradingFormValues>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      categories: initialCategories.length > 0 ? initialCategories : [
        { name: "Forum Participation", points: 10 },
        { name: "Quizzes", points: 30 },
        { name: "Assignments", points: 60 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const categories = form.watch("categories");
  const totalPoints = categories?.reduce((sum, cat) => sum + (Number(cat.points) || 0), 0) || 0;
  const isExactly100 = totalPoints === 100;

  const onSubmit = async (data: GradingFormValues) => {
    if (!isExactly100) return;
    
    try {
      // simulate API call
      await new Promise(r => setTimeout(r, 600));
      console.log(`Saved grades for ${course.id}:`, data);
      
      // Toast notification simulation
      if (typeof window !== "undefined") {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Grading Setup Saved",
            description: "Your course grading breakdown has been successfully updated.",
          });
        }).catch(() => console.log("Mock toast: grading saved"));
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Mark Breakdown</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ name: "", points: 0 })}
              className="gap-2 h-8"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </CardTitle>
          <CardDescription>Assign the point weight to different activities in your course. Must equal 100 points.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label className={index > 0 ? "sr-only" : undefined}>Category Name</Label>
                  <Input 
                    placeholder="e.g. Midterm Exam" 
                    {...form.register(`categories.${index}.name`)}
                  />
                  {form.formState.errors.categories?.[index]?.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.categories[index].name.message}</p>
                  )}
                </div>
                <div className="w-32 space-y-2">
                  <Label className={index > 0 ? "sr-only" : undefined}>Points</Label>
                  <Input 
                    type="number" 
                    {...form.register(`categories.${index}.points`)}
                  />
                  {form.formState.errors.categories?.[index]?.points && (
                    <p className="text-xs text-destructive">{form.formState.errors.categories[index].points.message}</p>
                  )}
                </div>
                <div className={index > 0 ? "" : "pt-7"}>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded border transition-colors ${isExactly100 ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}>
            <div className="flex justify-between items-center font-semibold mb-2">
              <span>Total Marks:</span>
              <span>{totalPoints} / 100 pts</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all ${isExactly100 ? 'bg-primary' : (totalPoints > 100 ? 'bg-red-500' : 'bg-amber-500')}`}
                style={{ width: `${Math.min(totalPoints, 100)}%` }}
              />
            </div>
            
            {!isExactly100 && (
              <p className="text-sm mt-1 text-red-500 font-medium">
                Wait! Your marks must perfectly total 100 points to save.
              </p>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2 border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isExactly100 || form.formState.isSubmitting} className="px-8 gap-2">
            <Save className="w-4 h-4" />
            {form.formState.isSubmitting ? "Saving..." : "Save Grading"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
