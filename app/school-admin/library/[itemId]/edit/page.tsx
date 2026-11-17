"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/tenant/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LibraryEditor } from "@/components/library/library-editor";
import { LibraryDetailSkeleton, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";
import { COURSE_OPTIONS } from "@/components/library/library-access";

export default function EditSchoolLibraryItemPage() {
  const params = useParams<{ itemId: string }>();
  const { items, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  if (!ready) return <LibraryDetailSkeleton />;
  if (!item) return <LibraryMissingItem href="/school-admin/library" />;

  return (
    <div className="pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Library", href: "/school-admin/library" },
          { label: item.title, href: `/school-admin/library/${item.id}` },
          { label: "Edit" },
        ]}
        className="mb-6"
      />
      <PageHeader title="Edit library record" description="School admins can change any record in the catalog." />
      <LibraryEditor item={item} uploader="school-admin" courses={COURSE_OPTIONS} requireCourse={false} backHref="/school-admin/library" />
    </div>
  );
}
