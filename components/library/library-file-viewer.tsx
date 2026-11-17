"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, Headphones, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LibraryItem, formatFileSize } from "@/lib/library";
import { LibraryFileKind, downloadLibraryFile, libraryFileKind, loadLibraryFile } from "@/lib/library-files";
import { BookCover } from "@/components/library/book-cover";

export function LibraryFileViewer({ item }: { item: LibraryItem }) {
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [url, setUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [kind, setKind] = useState<LibraryFileKind>("other");

  useEffect(() => {
    let alive = true;
    let objectUrl: string | null = null;
    setStatus("loading");
    setUrl(null);
    setText("");

    loadLibraryFile(item.id)
      .then(async (record) => {
        if (!alive) return;
        if (!record) {
          setStatus("missing");
          return;
        }
        objectUrl = URL.createObjectURL(record.blob);
        const nextKind = libraryFileKind(item.format, record.type || item.fileMime || "", record.name || item.fileName);
        if (nextKind === "text") setText(await record.blob.text());
        if (!alive) return;
        setKind(nextKind);
        setUrl(objectUrl);
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("missing");
      });

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [item.id, item.fileMime, item.fileName, item.format]);

  async function download() {
    const saved = await downloadLibraryFile(item.id, item.fileName);
    if (!saved) {
      toast.error("This file is not on this browser", { description: "Open the library on the computer where it was uploaded, or upload it again." });
    }
  }

  if (status === "loading") {
    return <div className="h-[420px] animate-pulse rounded-xl bg-muted" aria-busy="true" />;
  }

  if (status === "missing" || !url) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">The original file is not on this browser</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {item.fileName} was uploaded on another computer. The written summary is still here.
        </p>
        {item.previewText && <p className="mx-auto mt-6 max-w-prose text-left text-sm leading-7 text-foreground/85">{item.previewText}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.fileName}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(item.fileSize)} · Open it here or save a copy</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Open
            </a>
          </Button>
          <Button type="button" size="sm" onClick={() => void download()}>
            <Download className="mr-1.5 h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {kind === "pdf" && (
        <iframe title={item.title} src={url} className="h-[75vh] w-full rounded-xl border border-border bg-white" />
      )}

      {kind === "video" && (
        <video key={url} controls playsInline className="max-h-[75vh] w-full rounded-xl bg-black" src={url} />
      )}

      {kind === "audio" && (
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card px-6 py-10">
          <div className="w-36">
            <BookCover item={item} size="md" />
          </div>
          <div className="text-center">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.author}</p>
          </div>
          <audio key={url} controls className="w-full max-w-md" src={url} />
        </div>
      )}

      {kind === "text" && (
        <article className="mx-auto max-w-2xl whitespace-pre-wrap rounded-sm bg-[#fbf8f1] px-8 py-10 font-serif text-[17px] leading-[1.85] text-stone-800 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] ring-1 ring-stone-200 sm:px-14 sm:py-14 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800">
          {text}
        </article>
      )}

      {kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={item.title} className="mx-auto max-h-[75vh] rounded-xl border border-border object-contain" />
      )}

      {kind === "other" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/20 px-6 py-14 text-center">
          {item.format === "audio" ? <Headphones className="h-8 w-8 text-muted-foreground" /> : item.format === "video" ? <Play className="h-8 w-8 text-muted-foreground" /> : <FileText className="h-8 w-8 text-muted-foreground" />}
          <p className="font-semibold">Ready to open</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {item.fileName} can be opened in a new tab or downloaded. Word, PowerPoint, EPUB, and zip files open with the app on your computer.
          </p>
        </div>
      )}
    </div>
  );
}
