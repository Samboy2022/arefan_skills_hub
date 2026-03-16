"use client";

import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon | ((props: any) => React.ReactNode)
  trend?: number
  unit?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  hint?: string
}

const borderTones = {
  default: "border-sky-200 dark:border-sky-900",
  info: "border-sky-200 dark:border-sky-900",
  success: "border-green-200 dark:border-green-900",
  warning: "border-amber-200 dark:border-amber-900",
  danger: "border-red-200 dark:border-red-900",
  purple: "border-purple-200 dark:border-purple-900",
};

const iconTones = {
  default: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function StudentKPICard({
  title,
  value,
  icon: Icon,
  trend,
  unit,
  variant = 'default',
  hint,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0
  const borderTone = borderTones[variant] || borderTones.default
  const iconTone = iconTones[variant] || iconTones.default
  const subtextTone = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  return (
    <Card className={cn("p-4 shadow-none border border-border bg-card")}>
      <div className="flex items-center gap-3">
        <div className={cn("rounded-md p-2 shrink-0", iconTone)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">{title}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-xl font-bold leading-none">{value}</p>
            {hint && <span className="text-[10px] text-muted-foreground font-medium truncate">{hint}</span>}
          </div>
          {trend !== undefined && (
            <p className={cn("mt-1 text-[10px] font-medium", subtextTone)}>
              {isPositive ? "↑" : "↓"} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
