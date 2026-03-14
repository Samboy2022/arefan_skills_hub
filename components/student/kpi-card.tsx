import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export function StudentKPICard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  variant = "default",
}: KPICardProps) {
  const variantStyles = {
    default: "bg-white border-border border-t-brand/40 border-t-2 shadow-sm",
    success: "bg-brand/5 border-brand/20 border-t-brand border-t-2 shadow-sm",
    warning: "bg-amber-50/30 border-amber-200 border-t-amber-500 border-t-2 shadow-sm",
    danger: "bg-red-50/30 border-red-200 border-t-red-500 border-t-2 shadow-sm",
  };

  return (
    <Card className={cn("p-6 border", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
        </div>
        <Icon className="h-8 w-8 opacity-20" />
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium">
          <span className={trend.direction === "up" ? "text-green-600" : "text-red-600"}>
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        </div>
      )}
    </Card>
  );
}
