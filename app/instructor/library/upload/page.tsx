"use client";

import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LibraryEditor } from "@/components/library/library-editor";
import { COURSE_OPTIONS } from "@/components/library/library-access";

export default function InstructorLibraryUploadPage() {
  return (
    <div className="pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Library", href: "/instructor/library" },
          { label: "Create material" },
        ]}
        className="mb-6"
      />
      <PageHeader
        title="Create a book or material"
        description="Upload the file, add the details students search by, and pick a cover. It goes on the shelf of the course you choose."
      />
      <LibraryEditor uploader="instructor" courses={COURSE_OPTIONS} requireCourse backHref="/instructor/library" />
    </div>
  );
}
