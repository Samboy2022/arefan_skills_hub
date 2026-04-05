import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  titleAction?: ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  actions,
  titleAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <div className="shrink-0">{titleAction}</div>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {children && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {children}
        </div>
      )}

      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
