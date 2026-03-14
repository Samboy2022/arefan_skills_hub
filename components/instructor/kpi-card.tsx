import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  isPositive?: boolean;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-white border-border border-t-brand/40 border-t-2 shadow-sm transition-all hover:shadow-md",
  success: "bg-brand/5 border-brand/20 border-t-brand border-t-2 shadow-sm transition-all hover:shadow-md",
  warning: "bg-amber-50/30 border-amber-200 border-t-amber-500 border-t-2 shadow-sm transition-all hover:shadow-md",
  danger: "bg-red-50/30 border-red-200 border-t-red-500 border-t-2 shadow-sm transition-all hover:shadow-md",
};

const iconColors = {
  default: "text-blue-600 dark:text-blue-400",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
};

export function KPICard({
  title,
  value,
  description,
  change,
  isPositive = true,
  icon,
  variant = "default",
}: KPICardProps) {
  return (
    <div className={cn("rounded-lg border p-6", variantStyles[variant])}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-foreground">{value}</h3>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {icon && <div className={cn("text-2xl flex-shrink-0", iconColors[variant])}>{icon}</div>}
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <span className={cn("text-sm font-medium", isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {Math.abs(change)}% from last month
          </span>
        </div>
      )}
    </div>
  );
}
