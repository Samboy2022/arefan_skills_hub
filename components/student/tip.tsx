import { Lightbulb } from "lucide-react";
import { tipBoxClass } from "@/lib/student-ui";

/** Short, practical note under a page header or inside a form section. */
export function StudentTip({ children }: { children: React.ReactNode }) {
  return (
    <p className={tipBoxClass}>
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </p>
  );
}
