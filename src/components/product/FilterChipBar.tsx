import { cn } from "@/lib/utils";

export interface FilterChip {
  key: string;
  label: string;
  count?: number;
  colorClassName?: string;
}

interface FilterChipBarProps {
  items: FilterChip[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function FilterChipBar({ items, active, onChange, className }: FilterChipBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={isActive}
            className={cn("filter-chip", isActive && "filter-chip-active")}
          >
            {item.colorClassName ? <span className={cn("h-2 w-2 rounded-full", item.colorClassName)} /> : null}
            <span>{item.label}</span>
            {typeof item.count === "number" ? <span className="text-[11px] opacity-80">({item.count})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
