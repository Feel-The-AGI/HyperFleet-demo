import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface InspectorPanelProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function InspectorPanel({ title, subtitle, onClose, children, className }: InspectorPanelProps) {
  return (
    <aside className={cn("inspector-panel", className)}>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {onClose ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close details">
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </aside>
  );
}
