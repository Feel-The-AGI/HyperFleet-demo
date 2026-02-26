import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface EntityRowCardProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function EntityRowCard({ title, subtitle, right, footer, onClick, className }: EntityRowCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "surface-raised group w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </button>
  );
}
