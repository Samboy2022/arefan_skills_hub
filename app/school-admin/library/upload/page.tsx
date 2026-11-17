"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LibraryEditor } from "@/components/library/library-editor";
import { COURSE_OPTIONS } from "@/components/library/library-access";

export default function UploadLibraryItemPage() {
  return (
    <div className="pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Library", href: "/school-admin/library" },
          { label: "Upload material" },
        ]}
        className="mb-6"
      />
      <PageHeader
        title="Upload library material"
        description="Available to the whole school unless you reserve it for one course."
      />
      <LibraryEditor uploader="school-admin" courses={COURSE_OPTIONS} requireCourse={false} backHref="/school-admin/library" />
    </div>
  );
}
