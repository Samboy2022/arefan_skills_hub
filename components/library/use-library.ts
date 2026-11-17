"use client";

import { useCallback, useEffect, useState } from "react";
import { LibraryCollection, LibraryItem, ReadingProgress, loadCollections, loadLibrary, loadProgress, loadShelf, loadSlider } from "@/lib/library";

export function useLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [collections, setCollections] = useState<LibraryCollection[]>([]);
  const [slider, setSlider] = useState<string[]>([]);
  const [shelf, setShelf] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, ReadingProgress>>({});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(loadLibrary());
    setCollections(loadCollections());
    setSlider(loadSlider());
    setShelf(loadShelf());
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("fnskills-library", refresh);
    return () => window.removeEventListener("fnskills-library", refresh);
  }, [refresh]);

  return { items, collections, slider, shelf, progress, ready, refresh };
}
