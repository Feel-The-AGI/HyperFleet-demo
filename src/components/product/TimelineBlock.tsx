import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  detail?: string;
  time?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

interface TimelineBlockProps {
  items: TimelineItem[];
  className?: string;
}

const dotTone: Record<NonNullable<TimelineItem["tone"]>, string> = {
  default: "bg-fleet-info",
  success: "bg-fleet-success",
  warning: "bg-fleet-warning",
  danger: "bg-fleet-danger",
};

export function TimelineBlock({ items, className }: TimelineBlockProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", dotTone[item.tone ?? "default"])} />
            <span className="h-full w-px bg-border/80" />
          </div>
          <div className="min-w-0 pb-3">
            <p className="text-sm font-medium">{item.title}</p>
            {item.detail ? <p className="text-xs text-muted-foreground">{item.detail}</p> : null}
            {item.time ? <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
