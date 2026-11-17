"use client";

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | ((props: { className?: string }) => React.ReactNode);
  trend?: number;
  unit?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  hint?: string;
}

const variantStyles = {
  default: {
    value: "text-foreground",
    art: "text-violet-500 fill-rose-200 dark:text-violet-400 dark:fill-rose-900",
  },
  info: {
    value: "text-sky-600 dark:text-sky-400",
    art: "text-amber-400 fill-amber-200 dark:text-amber-500 dark:fill-amber-900",
  },
  success: {
    value: "text-emerald-600 dark:text-emerald-400",
    art: "text-green-500 fill-green-200 dark:text-green-400 dark:fill-green-900",
  },
  warning: {
    value: "text-orange-600 dark:text-orange-400",
    art: "text-stone-500 fill-amber-200 dark:text-stone-400 dark:fill-amber-900",
  },
  danger: {
    value: "text-red-600 dark:text-red-400",
    art: "text-red-500 fill-red-200 dark:text-red-400 dark:fill-red-900",
  },
  purple: {
    value: "text-purple-600 dark:text-purple-400",
    art: "text-purple-500 fill-purple-200 dark:text-purple-400 dark:fill-purple-900",
  },
};

export function StudentKPICard({
  title,
  value,
  icon: Icon,
  trend,
  unit,
  variant = "default",
  hint,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const tones = variantStyles[variant] ?? variantStyles.default;

  return (
    <Card className="relative gap-0 overflow-hidden rounded-2xl border-border p-4 shadow-sm sm:p-6 transition-shadow hover:shadow-md">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -right-3 opacity-30 sm:-bottom-4 dark:opacity-25"
      >
        <Icon className={cn("h-16 w-16 stroke-[1.5] sm:h-24 sm:w-24", tones.art)} />
      </div>

      <div className="relative min-w-0 pr-6 sm:pr-16">
        <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className={cn("text-3xl font-extrabold sm:text-4xl leading-none tabular-nums", tones.value)}>{value}</p>
          {unit ? <span className="text-sm font-medium text-muted-foreground">{unit}</span> : null}
        </div>
        {hint ? <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">{hint}</p> : null}
        {trend !== undefined && (
          <p className={cn("mt-2 text-xs font-medium", isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </Card>
  );
}
