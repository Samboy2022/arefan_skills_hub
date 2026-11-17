"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LibraryCollection,
  LibraryItem,
  addCollection,
  collectionLabel,
  orderedCollections,
  removeCollection,
  saveSlider,
  updateCollection,
  updateLibraryItem,
} from "@/lib/library";
import { BookCover } from "@/components/library/book-cover";

export function LibraryOrganize({
  items,
  collections,
  sliderIds,
}: {
  items: LibraryItem[];
  collections: LibraryCollection[];
  sliderIds: string[];
}) {
  const parents = collections.filter((collection) => !collection.parentId);
  const slider = sliderIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is LibraryItem => Boolean(item));
  const hidden = items.filter((item) => item.hidden);

  return (
    <div className="space-y-6 pb-12">
      <CategoryEditor collections={collections} parents={parents} />
      <SliderEditor items={items} slider={slider} />
      <PlacementEditor items={items} collections={collections} />
      <HiddenEditor hidden={hidden} />
    </div>
  );
}

function CategoryEditor({ collections, parents }: { collections: LibraryCollection[]; parents: LibraryCollection[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Give the category a name.");
      return;
    }
    addCollection({ name, description, parentId: parentId || undefined });
    setName("");
    setDescription("");
    setParentId("");
    setError("");
    toast.success(parentId ? "Subcategory added" : "Category added", { description: name.trim() });
  }

  function remove(collection: LibraryCollection) {
    const result = removeCollection(collection.id);
    if (!result.ok) {
      toast.error(result.reason);
      return;
    }
    toast.success("Category removed", { description: collection.name });
  }

  return (
    <Card className="border border-border p-6">
      <h2 className="text-base font-semibold">Categories</h2>
      <p className="mt-1 text-sm text-muted-foreground">Top-level categories group the catalog. A subcategory sits inside one of them.</p>
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Textbooks" />
        </div>
        <div className="space-y-2">
          <Label>Parent</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={parentId} onChange={(event) => setParentId(event.target.value)}>
            <option value="">None — this is a category</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>{parent.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} placeholder="What belongs here" />
        </div>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div>
          <Button type="submit" size="sm">{parentId ? "Add subcategory" : "Add category"}</Button>
        </div>
      </form>
      <ul className="mt-6 divide-y divide-border">
        {orderedCollections(collections).map((collection) => (
          <li key={collection.id} className="flex items-start justify-between gap-3 py-3">
            <div className={collection.parentId ? "pl-4" : ""}>
              <p className="text-sm font-semibold">{collectionLabel(collection, collections)}</p>
              <p className="text-xs text-muted-foreground">{collection.description || "No description"}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const next = window.prompt("Category name", collection.name);
                if (next && next.trim().length > 1) updateCollection(collection.id, { name: next.trim() });
              }}>
                Rename
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${collection.name}`} onClick={() => remove(collection)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SliderEditor({ items, slider }: { items: LibraryItem[]; slider: LibraryItem[] }) {
  const available = items.filter((item) => !item.hidden && !slider.some((slide) => slide.id === item.id));
  const [pick, setPick] = useState("");
  const availableIds = available.map((item) => item.id).join("|");

  useEffect(() => {
    const ids = availableIds ? availableIds.split("|") : [];
    setPick((current) => (ids.includes(current) ? current : ids[0] ?? ""));
  }, [availableIds]);

  function write(next: LibraryItem[]) {
    saveSlider(next.map((item) => item.id));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slider.length) return;
    const next = [...slider];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    write(next);
  }

  return (
    <Card className="border border-border p-6">
      <h2 className="text-base font-semibold">Home slider</h2>
      <p className="mt-1 text-sm text-muted-foreground">These titles rotate at the top of the public library and the student library. Eight is the limit.</p>
      <ul className="mt-4 divide-y divide-border">
        {slider.length === 0 && <li className="py-3 text-sm text-muted-foreground">The slider is empty. Add a title below.</li>}
        {slider.map((item, index) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <div className="w-8 shrink-0"><BookCover item={item} size="xs" showBadge={false} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.author}</p>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => write(slider.filter((entry) => entry.id !== item.id))}>Remove</Button>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (!pick || slider.length >= 8) return;
          saveSlider([...slider.map((item) => item.id), pick]);
          toast.success("Added to the slider");
        }}
      >
        <select className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm" value={pick} onChange={(event) => setPick(event.target.value)}>
          {available.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <Button type="submit" size="sm" disabled={available.length === 0 || slider.length >= 8}>Add to slider</Button>
      </form>
    </Card>
  );
}

function PlacementEditor({ items, collections }: { items: LibraryItem[]; collections: LibraryCollection[] }) {
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");

  return (
    <Card className="border border-border p-6">
      <h2 className="text-base font-semibold">Move a title</h2>
      <p className="mt-1 text-sm text-muted-foreground">Place any catalog title into a category or subcategory.</p>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (!itemId || !collectionId) return;
          updateLibraryItem(itemId, { collectionId });
          toast.success("Category updated");
        }}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={itemId} onChange={(event) => setItemId(event.target.value)}>
            {items.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={collectionId} onChange={(event) => setCollectionId(event.target.value)}>
            {orderedCollections(collections).map((collection) => (
              <option key={collection.id} value={collection.id}>{collectionLabel(collection, collections)}</option>
            ))}
          </select>
        </div>
        <Button type="submit" size="sm">Move</Button>
      </form>
    </Card>
  );
}

function HiddenEditor({ hidden }: { hidden: LibraryItem[] }) {
  return (
    <Card className="border border-border p-6">
      <h2 className="text-base font-semibold">Hidden from readers</h2>
      <p className="mt-1 text-sm text-muted-foreground">Hidden titles stay here until you show them again. Readers never see them on the public library or in a dashboard.</p>
      {hidden.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nothing is hidden.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {hidden.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.author}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => updateLibraryItem(item.id, { hidden: false })}>Show again</Button>
            </li>
          ))}
        </ul>
      )}
      <Button asChild variant="ghost" size="sm" className="mt-4">
        <Link href="/school-admin/library">Back to the catalog</Link>
      </Button>
    </Card>
  );
}
