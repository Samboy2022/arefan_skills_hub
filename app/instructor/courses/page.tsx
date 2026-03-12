import { Eye, Settings, Users, BookOpen, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";

export default function MyCoursesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Courses"
        description="Manage and organize your teaching courses"
      >
        <Button>Create New Course</Button>
      </PageHeader>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_INSTRUCTOR_COURSES.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Course Thumbnail */}
            <div className="h-32 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white opacity-50" />
              </div>
            </div>

            {/* Course Info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.code}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit Course</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Course Stats */}
              <div className="space-y-3 py-4 border-t border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.enrollmentCount} / {course.maxStudents} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{course.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      course.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground capitalize">{course.status}</span>
                </div>
              </div>

              {/* Course Description */}
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{course.description}</p>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Users className="h-4 w-4" />
                  Students
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Settings className="h-4 w-4" />
                  Manage
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Archive Courses Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Archived Courses</h2>
        <p className="text-muted-foreground">No archived courses. Archive courses you're no longer teaching.</p>
      </div>
    </div>
  );
}
