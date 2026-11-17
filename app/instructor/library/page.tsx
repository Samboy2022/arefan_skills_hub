"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { LibraryManager } from "@/components/library/library-manager";
import { LibrarySkeleton } from "@/components/library/library-browser";
import { useLibrary } from "@/components/library/use-library";
import { INSTRUCTOR_COURSE_CODES, instructorOwns } from "@/components/library/library-access";

export default function InstructorLibraryPage() {
  const { items, ready } = useLibrary();

  return (
    <div className="space-y-2">
      <PageHeader
        title="Course library"
        description="Create books and materials for the courses you teach. They appear on the course shelf for enrolled students."
        action={
          <Button asChild size="lg">
            <Link href="/instructor/library/upload">
              <Plus className="mr-1.5 h-4 w-4" /> Create material
            </Link>
          </Button>
        }
      />
      {ready ? (
        <LibraryManager
          items={items}
          basePath="/instructor/library"
          uploadHref="/instructor/library/upload"
          canManage={instructorOwns}
          manageLabel="My materials"
          myCourseCodes={INSTRUCTOR_COURSE_CODES}
        />
      ) : (
        <LibrarySkeleton />
      )}
    </div>
  );
}
