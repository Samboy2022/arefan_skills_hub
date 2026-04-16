"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_COURSE_GROUPS } from "@/lib/instructor-mock-data";

export default function ViewGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  const group = MOCK_COURSE_GROUPS.find((g) => g.id === groupId);

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

  const handleDelete = () => {
    // In production: DELETE /api/course-groups/:id
    router.push("/instructor/course-groups/list");
  };

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto space-y-8">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses", href: "/instructor/courses" },
          { label: "Course Groups", href: "/instructor/course-groups" },
          { label: "All Groups", href: "/instructor/course-groups/list" },
          { label: group.name },
        ]}
        className="mb-2"
      />

      <div>
        <Link
          href="/instructor/course-groups/list"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Groups
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{group.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded">
                {group.courseCode}
              </span>
              <span className="text-sm text-muted-foreground">{group.courseTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/instructor/course-groups/${groupId}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <Card className="p-6 border-border space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h2>
        <p className="text-foreground leading-relaxed">
          {group.description || (
            <span className="text-muted-foreground italic">No description provided.</span>
          )}
        </p>
        <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
          <span>
            Created:{" "}
            {group.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </Card>

      {/* Members */}
      <Card className="p-6 border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group Members
          </h2>
          <Badge variant="outline" className="text-xs">
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {group.members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No members assigned.</p>
        ) : (
          <div className="divide-y divide-border rounded-md border border-border overflow-hidden">
            {group.members.map((member) => (
              <div key={member.studentId} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-9 w-9 border border-border shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course Group?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently delete{" "}
              <span className="font-semibold text-foreground">{group.name}</span>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              Yes, Continue to Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
