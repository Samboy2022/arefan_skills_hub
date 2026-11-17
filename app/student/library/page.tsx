"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/student/page-header";
import { LibraryBrowser, LibrarySkeleton } from "@/components/library/library-browser";
import { useLibrary } from "@/components/library/use-library";
import { STUDENT_COURSES } from "@/lib/student-mock-data";
import { pageStackClass } from "@/lib/student-ui";

const MY_COURSE_CODES = STUDENT_COURSES.map((course) => course.code);

export default function StudentLibraryPage() {
  const { items, shelf, progress, ready } = useLibrary();

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Library" }]} />
      <PageHeader
        title="Library"
        description="Browse the school catalog, find the readings your lecturers reserved, and keep titles on your own shelf."
      />
      {ready ? (
        <LibraryBrowser
          items={items}
          basePath="/student/library"
          shelf={shelf}
          progress={progress}
          myCourseCodes={MY_COURSE_CODES}
          readerMode
          showHero={false}
        />
      ) : (
        <LibrarySkeleton />
      )}
    </div>
  );
}
