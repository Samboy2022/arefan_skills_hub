"use client";

import Link from "next/link";
import { Users, BookOpen, Plus, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { MOCK_COURSE_GROUPS } from "@/lib/instructor-mock-data";

export default function CourseGroupsPage() {
  const activeCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => c.status === "active");

  return (
    <div className="font-sans min-h-screen px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "My Courses", href: "/instructor/courses" },
          { label: "Course Groups" },
        ]}
        className="mb-2"
      />

      <PageHeader
        title="Course Groups"
        description="Select a course to create a group, or manage existing groups"
        action={
          <Link href="/instructor/course-groups/list">
            <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
              <Users className="h-4 w-4" />
              List All Groups
            </Button>
          </Link>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Groups</p>
          <p className="text-2xl font-bold text-foreground">{MOCK_COURSE_GROUPS.length}</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-xs text-muted-foreground mb-1">Active Courses</p>
          <p className="text-2xl font-bold text-primary">{activeCourses.length}</p>
        </Card>
        <Card className="p-4 border-border col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">Total Members</p>
          <p className="text-2xl font-bold text-foreground">
            {MOCK_COURSE_GROUPS.reduce((sum, g) => sum + g.members.length, 0)}
          </p>
        </Card>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Select a Course to Manage Groups
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCourses.map((course) => {
            const groupsForCourse = MOCK_COURSE_GROUPS.filter(
              (g) => g.courseId === course.id
            );

            return (
              <Card
                key={course.id}
                className="group border-border hover:border-primary/40 transition-all duration-200 hover:shadow-md overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded">
                        {course.code}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                      {groupsForCourse.length} group{groupsForCourse.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-base text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {course.enrollmentCount} enrolled &middot; {course.credits} credits
                  </p>

                  {groupsForCourse.length > 0 && (
                    <div className="mb-4 space-y-1">
                      {groupsForCourse.map((g) => (
                        <Link
                          key={g.id}
                          href={`/instructor/course-groups/${g.id}`}
                          className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-sm text-foreground transition-colors"
                        >
                          <span className="font-medium truncate">{g.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">
                            {g.members.length} members
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link href={`/instructor/course-groups/create?courseId=${course.id}`}>
                    <Button size="sm" className="w-full gap-2 mt-auto">
                      <Plus className="h-3.5 w-3.5" />
                      New Group
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
