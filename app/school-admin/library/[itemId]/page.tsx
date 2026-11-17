"use client";

import { useParams } from "next/navigation";
import { LibraryDetailSkeleton, LibraryItemDetail, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";

export default function SchoolLibraryItemPage() {
  const params = useParams<{ itemId: string }>();
  const { items, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  if (!ready) return <LibraryDetailSkeleton />;
  if (!item) return <LibraryMissingItem href="/school-admin/library" />;

  return <LibraryItemDetail item={item} items={items} role="school-admin" basePath="/school-admin/library" canEdit showStats />;
}
