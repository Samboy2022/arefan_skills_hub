"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LibraryBrowser, LibrarySkeleton } from "@/components/library/library-browser";
import { useLibrary } from "@/components/library/use-library";

export default function PublicLibraryPage() {
  const { items, shelf, progress, ready } = useLibrary();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-primary">Public library</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Browse the catalog</h1>
          <p className="mt-2 text-muted-foreground">
            Anyone can read this shelf. Instructors and school admins publish the PDFs, files, video, and audio.
          </p>
        </div>
        {ready ? (
          <LibraryBrowser items={items} basePath="/library" shelf={shelf} progress={progress} readerMode showHero />
        ) : (
          <LibrarySkeleton />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
