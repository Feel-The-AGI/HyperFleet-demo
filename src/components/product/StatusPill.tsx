import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  label: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const byTone: Record<StatusPillProps["tone"], string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-fleet-success/18 text-fleet-success border-fleet-success/30",
  warning: "bg-fleet-warning/18 text-fleet-warning border-fleet-warning/30",
  danger: "bg-fleet-danger/18 text-fleet-danger border-fleet-danger/30",
  info: "bg-fleet-info/18 text-fleet-info border-fleet-info/30",
};

export function StatusPill({ label, tone, className }: StatusPillProps) {
  return <Badge className={cn("capitalize", byTone[tone], className)}>{label}</Badge>;
}
