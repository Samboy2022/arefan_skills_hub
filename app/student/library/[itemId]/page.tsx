"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { LibraryDetailSkeleton, LibraryItemDetail, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";
import { recordLibraryView } from "@/lib/library";

export default function StudentLibraryItemPage() {
  const params = useParams<{ itemId: string }>();
  const { items, shelf, progress, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  useEffect(() => {
    recordLibraryView(params.itemId);
  }, [params.itemId]);

  if (!ready) return <LibraryDetailSkeleton />;
  if (!item) return <LibraryMissingItem href="/student/library" />;

  return (
    <LibraryItemDetail
      item={item}
      items={items}
      role="student"
      basePath="/student/library"
      saved={shelf.includes(item.id)}
      progress={progress[item.id]}
      shelf={shelf}
    />
  );
}
