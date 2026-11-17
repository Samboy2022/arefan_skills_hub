"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/tenant/page-header";
import { LibraryManager } from "@/components/library/library-manager";
import { LibrarySkeleton } from "@/components/library/library-browser";
import { useLibrary } from "@/components/library/use-library";
import { INSTRUCTOR_COURSE_CODES, schoolAdminOwns } from "@/components/library/library-access";

export default function SchoolLibraryPage() {
  const router = useRouter();
  const { items, ready } = useLibrary();

  return (
    <div className="space-y-2">
      <PageHeader
        title="School library"
        description="Manage the whole catalog: categories, the home slider, and every title. Lecturers add books for the courses they teach."
        action={{ label: "Upload material", onClick: () => router.push("/school-admin/library/upload") }}
      />
      {ready ? (
        <LibraryManager
          items={items}
          basePath="/school-admin/library"
          uploadHref="/school-admin/library/upload"
          canManage={schoolAdminOwns}
          manageLabel="Catalog"
          myCourseCodes={INSTRUCTOR_COURSE_CODES}
          catalogAdmin
          organizeHref="/school-admin/library/organize"
        />
      ) : (
        <LibrarySkeleton />
      )}
    </div>
  );
}
