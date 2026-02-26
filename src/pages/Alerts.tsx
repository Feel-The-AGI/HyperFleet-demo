import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts, type AlertUrgency } from "@/data/mock-data";
import { CheckCircle } from "lucide-react";

const urgencyColors: Record<AlertUrgency, string> = {
  critical: "bg-fleet-danger text-fleet-danger-foreground",
  warning: "bg-fleet-warning text-fleet-warning-foreground",
  info: "bg-fleet-info text-fleet-info-foreground",
};

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alert Center</h1>
        <p className="text-sm text-muted-foreground">{alerts.filter(a => !a.acknowledged).length} unacknowledged alerts</p>
      </div>
      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className={`rounded-lg border p-4 flex items-start gap-4 ${a.acknowledged ? "opacity-60" : ""}`}>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge className={`text-[10px] ${urgencyColors[a.urgency]}`}>{a.urgency}</Badge>
                <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(a.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.message}</p>
            </div>
            {!a.acknowledged && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 shrink-0">
                <CheckCircle className="h-3 w-3" /> Acknowledge
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
