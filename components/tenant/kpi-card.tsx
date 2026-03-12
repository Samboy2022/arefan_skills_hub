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
  blue: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  orange: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  red: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  purple: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  unit,
  color = "blue",
}: KPICardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend !== undefined && (
            <p
              className={`text-sm font-medium mt-2 ${
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
