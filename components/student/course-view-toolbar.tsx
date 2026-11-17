"use client";

import { LayoutGrid, List, Table as TableIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

export type ViewMode = "grid" | "list" | "table";
export type SortOption = "recent" | "name" | "progress_desc" | "code" | "due_assignments";

interface CourseViewToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function CourseViewToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: CourseViewToolbarProps) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full bg-background pl-9"
          aria-label="Search courses"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden lg:inline-block">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="h-10 w-[170px] whitespace-nowrap bg-background px-3" aria-label="Sort courses">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Enrolled</SelectItem>
              <SelectItem value="due_assignments">Pending Tasks</SelectItem>
              <SelectItem value="progress_desc">Highest Progress</SelectItem>
              <SelectItem value="name">Course Name (A-Z)</SelectItem>
              <SelectItem value="code">Course Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="hidden rounded-lg border border-border bg-muted/40 p-1 sm:flex">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => { if(v) onViewModeChange(v as ViewMode) }}>
            <ToggleGroupItem value="grid" aria-label="Grid View" className="h-8 w-8 rounded-md p-0">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List View" className="h-8 w-8 rounded-md p-0">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table View" className="h-8 w-8 rounded-md p-0">
              <TableIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
