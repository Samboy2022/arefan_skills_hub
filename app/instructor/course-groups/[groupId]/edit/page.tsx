"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_COURSE_GROUPS, MOCK_STUDENTS } from "@/lib/instructor-mock-data";

export default function EditGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  const group = MOCK_COURSE_GROUPS.find((g) => g.id === groupId);

  const courseStudents = group
    ? MOCK_STUDENTS.filter((s) => s.enrolledCourses.includes(group.courseId))
    : [];

  const [groupName, setGroupName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(group?.members.map((m) => m.studentId) ?? [])
  );
  const [memberSearch, setMemberSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredStudents = courseStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: PATCH /api/course-groups/:id
    setSubmitted(true);
    setTimeout(() => router.push("/instructor/course-groups/list"), 1200);
  };

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-muted-foreground mb-4">Group not found.</p>
        <Link href="/instructor/course-groups/list">
          <Button variant="outline">Back to All Groups</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto space-y-8">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses", href: "/instructor/courses" },
          { label: "Course Groups", href: "/instructor/course-groups" },
          { label: "All Groups", href: "/instructor/course-groups/list" },
          { label: group.name, href: `/instructor/course-groups/${groupId}` },
          { label: "Edit" },
        ]}
        className="mb-2"
      />

      <div>
        <Link
          href={`/instructor/course-groups/${groupId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Details
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Group</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Editing{" "}
          <span className="font-semibold text-foreground">{group.name}</span> in{" "}
          <span className="font-semibold text-foreground">
            {group.courseCode} — {group.courseTitle}
          </span>
        </p>
      </div>

      {submitted ? (
        <Card className="flex flex-col items-center justify-center py-16 gap-4 border-green-200 bg-green-50/30 dark:bg-green-950/20 dark:border-green-900">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-semibold text-foreground">Group updated successfully!</p>
          <p className="text-sm text-muted-foreground">Redirecting to All Groups…</p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 border-border space-y-5">
            <div className="space-y-2">
              <Label htmlFor="group-name">
                Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-background resize-none"
              />
            </div>
          </Card>

          {/* Member Picker */}
          <Card className="p-6 border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">Group Members</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Toggle learners to add or remove from this group
                </p>
              </div>
              {selectedIds.size > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                  {selectedIds.size} selected
                </Badge>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search learners…"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="divide-y divide-border rounded-md border border-border overflow-hidden">
              {filteredStudents.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No learners found</p>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = selectedIds.has(student.id);
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => toggleMember(student.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "bg-primary/5 dark:bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Avatar className="h-9 w-9 border border-border shrink-0">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={!groupName.trim() || selectedIds.size === 0}
              className="gap-2"
            >
              Update Group
            </Button>
            <Link href={`/instructor/course-groups/${groupId}`}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
