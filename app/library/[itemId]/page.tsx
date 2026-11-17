"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LibraryDetailSkeleton, LibraryItemDetail, LibraryMissingItem } from "@/components/library/library-item-detail";
import { useLibrary } from "@/components/library/use-library";
import { recordLibraryView } from "@/lib/library";

export default function PublicLibraryItemPage() {
  const params = useParams<{ itemId: string }>();
  const { items, shelf, progress, ready } = useLibrary();
  const item = items.find((entry) => entry.id === params.itemId);

  useEffect(() => {
    if (item) recordLibraryView(params.itemId);
  }, [item, params.itemId]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!ready ? (
          <LibraryDetailSkeleton />
        ) : !item ? (
          <LibraryMissingItem href="/library" />
        ) : (
          <LibraryItemDetail
            item={item}
            items={items}
            role="public"
            basePath="/library"
            saved={shelf.includes(item.id)}
            progress={progress[item.id]}
            shelf={shelf}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
