import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ElementType } from "react";

interface KpiTileProps {
  label: string;
  value: string | number;
  icon?: ElementType;
  detail?: string;
  trend?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
  className?: string;
}

const trendTone: Record<NonNullable<KpiTileProps["tone"]>, string> = {
  neutral: "text-muted-foreground",
  positive: "text-fleet-success",
  warning: "text-fleet-warning",
  danger: "text-fleet-danger",
};

export function KpiTile({
  label,
  value,
  icon: Icon,
  detail,
  trend,
  tone = "neutral",
  className,
}: KpiTileProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          {Icon ? <Icon className={cn("h-4 w-4", trendTone[tone])} /> : null}
        </div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">{detail}</span>
          {trend ? <span className={cn("font-medium", trendTone[tone])}>{trend}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
