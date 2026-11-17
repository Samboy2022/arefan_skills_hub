"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LibraryEditor } from "@/components/library/library-editor";
import { LibraryDetailSkeleton, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";
import { COURSE_OPTIONS, instructorOwns } from "@/components/library/library-access";

export default function InstructorLibraryEditPage() {
  const params = useParams<{ itemId: string }>();
  const { items, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  if (!ready) return <LibraryDetailSkeleton />;
  if (!item || !instructorOwns(item)) return <LibraryMissingItem href="/instructor/library" />;

  return (
    <div className="pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Library", href: "/instructor/library" },
          { label: item.title, href: `/instructor/library/${item.id}` },
          { label: "Edit" },
        ]}
        className="mb-6"
      />
      <PageHeader title="Edit material" description={item.courseTitle ? `Reserved for ${item.courseCode} · ${item.courseTitle}` : undefined} />
      <LibraryEditor item={item} uploader="instructor" courses={COURSE_OPTIONS} requireCourse backHref="/instructor/library" />
    </div>
  );
}
