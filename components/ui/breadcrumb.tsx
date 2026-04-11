"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
            )}
            
            {isLast ? (
              <span className="text-foreground font-medium" onClick={item.onClick} style={{ cursor: item.onClick ? 'pointer' : 'default' }}>
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
                onClick={item.onClick}
              >
                {item.label}
              </Link>
            ) : item.onClick ? (
              <button
                type="button"
                className="hover:text-primary transition-colors cursor-pointer"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <span>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}