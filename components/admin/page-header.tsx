import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  titleAction?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  children,
  actions,
  titleAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
          )}
        </div>
        {titleAction && (
          <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-end">
            {titleAction}
          </div>
        )}
      </div>

      {children && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {children}
        </div>
      )}

      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
