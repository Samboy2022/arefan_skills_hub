import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown on every registration page when this browser has no application yet. */
export function RegistrationEmpty({ what }: { what: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://img.icons8.com/scribby/96/graduation-cap.png" alt="" className="mb-4 h-16 w-16" />
      <h1 className="text-xl font-semibold">No school application yet</h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Register your school first, then come back here to {what}.</p>
      <div className="mt-6 flex gap-3">
        <Button asChild size="lg">
          <Link href="/register">Register a school</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}

export function RegistrationLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
