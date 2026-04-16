"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: "Dashboard", href: "/student" }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center flex-wrap gap-y-1 text-sm text-muted-foreground", className)}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground/50 shrink-0" />
            )}

            {isLast ? (
              <span
                className="text-foreground font-medium truncate max-w-[200px]"
                style={{ cursor: item.onClick ? "pointer" : "default" }}
                onClick={item.onClick}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors truncate max-w-[160px] shrink-0"
                onClick={item.onClick}
              >
                {item.label}
              </Link>
            ) : item.onClick ? (
              <button
                type="button"
                className="hover:text-primary transition-colors cursor-pointer truncate max-w-[160px]"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <span className="truncate max-w-[160px]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}