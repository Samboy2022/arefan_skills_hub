"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  COURSE_CATEGORIES,
  type CourseMetadataInput,
  type SchoolAdminCourse,
} from "@/lib/school-admin-courses";
import type { Faculty } from "@/lib/tenant-types";

type FormState = {
  title: string;
  code: string;
  description: string;
  categoryId: string;
  level: CourseMetadataInput["level"];
  language: string;
  status: CourseMetadataInput["status"];
  credits: string;
  durationWeeks: string;
  maxStudents: string;
  semester: string;
  prerequisites: string;
  instructorIds: string[];
};

function fromCourse(course?: SchoolAdminCourse | null): FormState {
  return {
    title: course?.title || "",
    code: course?.code || "",
    description: course?.description || "",
    categoryId: course?.categoryId || "cat-1",
    level: course?.level || "beginner",
    language: course?.language || "english",
    status: course?.status === "archived" ? "archived" : course?.status === "active" ? "active" : "draft",
    credits: course?.credits ? String(course.credits) : "",
    durationWeeks: course?.durationWeeks ? String(course.durationWeeks) : "",
    maxStudents: course?.maxStudents ? String(course.maxStudents) : "",
    semester: course?.semester || "",
    prerequisites: course?.prerequisites || "",
    instructorIds: course?.instructorIds || [],
  };
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.round(parsed);
}

export function CourseMetadataForm({
  course,
  faculty,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  course?: SchoolAdminCourse | null;
  faculty: Faculty[];
  submitLabel: string;
  onSubmit: (input: CourseMetadataInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => fromCourse(course));
  const [error, setError] = useState("");

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleInstructor = (id: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      instructorIds: checked
        ? Array.from(new Set([...current.instructorIds, id]))
        : current.instructorIds.filter((instructorId) => instructorId !== id),
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const code = form.code.trim().toUpperCase();
    if (title.length < 3) {
      setError("Course name needs at least 3 characters.");
      return;
    }
    if (!code) {
      setError("Enter a course code.");
      return;
    }
    setError("");
    onSubmit({
      title,
      code,
      description: form.description.trim(),
      categoryId: form.categoryId,
      level: form.level,
      language: form.language,
      status: form.status,
      credits: optionalNumber(form.credits) ?? 0,
      durationWeeks: optionalNumber(form.durationWeeks),
      maxStudents: optionalNumber(form.maxStudents),
      semester: form.semester.trim(),
      prerequisites: form.prerequisites.trim(),
      instructorIds: form.instructorIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="course-title">Course name</Label>
          <Input
            id="course-title"
            value={form.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder="Introduction to Computer Science"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-code">Course code</Label>
          <Input
            id="course-code"
            value={form.code}
            onChange={(event) => setField("code", event.target.value.toUpperCase())}
            placeholder="CS101"
            autoComplete="off"
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-status">Status</Label>
          <Select value={form.status} onValueChange={(value: FormState["status"]) => setField("status", value)}>
            <SelectTrigger id="course-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="course-description">Description</Label>
          <Textarea
            id="course-description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="What this course covers"
            rows={4}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="course-category">Category</Label>
          <Select value={form.categoryId} onValueChange={(value) => setField("categoryId", value)}>
            <SelectTrigger id="course-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-level">Level</Label>
          <Select value={form.level} onValueChange={(value: FormState["level"]) => setField("level", value)}>
            <SelectTrigger id="course-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-language">Language</Label>
          <Select value={form.language} onValueChange={(value) => setField("language", value)}>
            <SelectTrigger id="course-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-semester">Semester</Label>
          <Input
            id="course-semester"
            value={form.semester}
            onChange={(event) => setField("semester", event.target.value)}
            placeholder="Fall 2026"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-credits">Credits</Label>
          <Input
            id="course-credits"
            type="number"
            min={1}
            value={form.credits}
            onChange={(event) => setField("credits", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-duration">Duration in weeks</Label>
          <Input
            id="course-duration"
            type="number"
            min={1}
            value={form.durationWeeks}
            onChange={(event) => setField("durationWeeks", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-capacity">Student capacity</Label>
          <Input
            id="course-capacity"
            type="number"
            min={1}
            value={form.maxStudents}
            onChange={(event) => setField("maxStudents", event.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="course-prerequisites">Prerequisites</Label>
          <Input
            id="course-prerequisites"
            value={form.prerequisites}
            onChange={(event) => setField("prerequisites", event.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Instructors</legend>
        <p className="text-sm text-muted-foreground">
          Assign one or more instructors. They teach the course; this form does not add lessons.
        </p>
        {faculty.length === 0 ? (
          <p className="text-sm text-muted-foreground">No instructors are on file yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {faculty.map((member) => {
              const checked = form.instructorIds.includes(member.id);
              return (
                <label
                  key={member.id}
                  className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => toggleInstructor(member.id, value === true)}
                    aria-label={`Assign ${member.name}`}
                    className="mt-0.5"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{member.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {member.department} · {member.role}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
