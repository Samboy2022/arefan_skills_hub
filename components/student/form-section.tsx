import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formIconClass, formSectionClass } from "@/lib/student-ui";

export function FormSection({
  icon: Icon,
  title,
  hint,
  children,
  className,
  id,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn(formSectionClass, className)}>
      <div className="mb-5 flex items-start gap-3">
        <span className={formIconClass}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
