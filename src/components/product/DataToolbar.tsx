import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface DataToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function DataToolbar({
  value,
  onChange,
  placeholder = "Search...",
  leftSlot,
  rightSlot,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn("surface-raised flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center", className)}>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {leftSlot ? <div className="flex flex-wrap items-center gap-2">{leftSlot}</div> : null}
      {rightSlot ? <div className="flex flex-wrap items-center gap-2 md:ml-auto">{rightSlot}</div> : null}
    </div>
  );
}
