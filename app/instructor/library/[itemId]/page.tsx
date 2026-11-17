"use client";

import { useParams } from "next/navigation";
import { LibraryDetailSkeleton, LibraryItemDetail, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";
import { instructorOwns } from "@/components/library/library-access";

export default function InstructorLibraryItemPage() {
  const params = useParams<{ itemId: string }>();
  const { items, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  if (!ready) return <LibraryDetailSkeleton />;
  if (!item) return <LibraryMissingItem href="/instructor/library" />;

  return (
    <LibraryItemDetail
      item={item}
      items={items}
      role="instructor"
      basePath="/instructor/library"
      canEdit={instructorOwns(item)}
      showStats
    />
  );
}
