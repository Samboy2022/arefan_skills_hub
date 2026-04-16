import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
  actions?: ReactNode;
  titleAction?: ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  action,
  actions,
  titleAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {titleAction && <div className="shrink-0">{titleAction}</div>}
          </div>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        {/* Primary action(s) — shown inline with title on larger screens */}
        {(action || actions) && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {action}
            {actions}
          </div>
        )}
      </div>

      {children && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {children}
        </div>
      )}
    </div>
  );
}
