import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  unit?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-brand-light/30 text-brand-dark dark:bg-brand/10 dark:text-brand",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  unit,
  color = "blue",
  hint,
}: KPICardProps & { hint?: string }) {
  const isPositive = trend && trend >= 0;
  
  const borderTones = {
    blue: "border-sky-200 dark:border-sky-900",
    green: "border-green-200 dark:border-green-900",
    orange: "border-amber-200 dark:border-amber-900",
    red: "border-red-200 dark:border-red-900",
    purple: "border-purple-200 dark:border-purple-900",
  };
  
  const iconTones = {
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    orange: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const borderTone = borderTones[color] || borderTones.blue;
  const iconTone = iconTones[color] || iconTones.blue;
  const subtextTone = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  return (
    <Card className={`${borderTone} p-4 hover:shadow-md transition-shadow`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={`rounded-full p-2 ${iconTone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold leading-none">{value}</p>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend !== undefined && (
        <p className={`mt-2 text-xs font-medium ${subtextTone}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(trend)}% from last month
        </p>
      )}
    </Card>
  );
}
