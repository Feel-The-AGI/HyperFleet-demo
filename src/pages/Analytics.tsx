import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, Truck, Users, Fuel, Activity } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { title: "Fuel Summary", description: "Weekly fuel consumption and cost analysis across the fleet", icon: Fuel },
  { title: "Trip Performance", description: "On-time delivery rates, delays, and route efficiency", icon: BarChart3 },
  { title: "Driver Behavior", description: "Behavior scores, coaching needs, and safety trends", icon: Users },
  { title: "Fleet Health", description: "Vehicle health scores, maintenance compliance, and downtime", icon: Truck },
  { title: "Cost Breakdown", description: "Operational costs by category, route, and vehicle", icon: Activity },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Pre-built reports and fleet analytics</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <r.icon className="h-5 w-5 text-fleet-info" />
                <CardTitle className="text-sm">{r.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.success("Report downloaded")}>
                <Download className="h-3 w-3" /> Export PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
