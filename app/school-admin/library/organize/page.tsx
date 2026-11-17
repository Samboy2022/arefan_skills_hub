"use client";

import Link from "next/link";
import { PageHeader } from "@/components/tenant/page-header";
import { Button } from "@/components/ui/button";
import { LibraryOrganize } from "@/components/library/library-organize";
import { LibrarySkeleton } from "@/components/library/library-browser";
import { useLibrary } from "@/components/library/use-library";

export default function OrganizeLibraryPage() {
  const { items, collections, slider, ready } = useLibrary();

  return (
    <div className="space-y-2">
      <PageHeader
        title="Organize the library"
        description="Add categories and subcategories, choose the home slider, move titles, and restore anything hidden from readers."
      />
      <div className="-mt-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/school-admin/library/upload">Upload material</Link>
        </Button>
      </div>
      {ready ? <LibraryOrganize items={items} collections={collections} sliderIds={slider} /> : <LibrarySkeleton />}
    </div>
  );
}
