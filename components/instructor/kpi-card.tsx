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
  default: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800",
  success: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800",
  warning: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800",
  danger: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800",
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
