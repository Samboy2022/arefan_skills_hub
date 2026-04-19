import { z } from "zod";

export const courseFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(120),
  code: z.string().max(20).optional(),
  category_id: z.string().min(1, "Please select a category"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().min(1, "Please select a language"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  duration_weeks: z.coerce.number().int().positive().optional(),
  credit_units: z.coerce.number().int().positive().optional(),
  max_students: z.coerce.number().int().positive().optional(),
  prerequisites: z.string().optional(),
  description: z.string().optional(),
  learning_outcomes: z.array(z.string().min(1)).min(1, "Add at least one learning outcome"),
  target_audience: z.string().optional(),
  
  // Media endpoints will be handled mostly outside of strict zod string requirements
  // since they are file uploads, but we can store their URLs or File objects roughly if needed.
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
