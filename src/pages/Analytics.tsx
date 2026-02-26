import { Activity, BarChart3, Download, Fuel, Truck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusPill } from "@/components/product";
import { toast } from "sonner";

const reports = [
  {
    title: "Fuel Summary",
    description: "Weekly fuel usage, region variance, and anomaly signals.",
    icon: Fuel,
    status: "ready",
  },
  {
    title: "Trip Performance",
    description: "On-time score, delay contribution, and route reliability.",
    icon: BarChart3,
    status: "ready",
  },
  {
    title: "Driver Behavior",
    description: "Score distribution, coaching targets, and safety trendline.",
    icon: Users,
    status: "ready",
  },
  {
    title: "Fleet Health",
    description: "Asset condition index and maintenance risk horizon.",
    icon: Truck,
    status: "refreshing",
  },
  {
    title: "Cost Breakdown",
    description: "Spend attribution by lane, category, and asset class.",
    icon: Activity,
    status: "ready",
  },
];

export default function Analytics() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Reporting"
        title="Analytics Library"
        description="Generate operational reports with consistent narrative framing and export-ready summaries."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title} className="transition hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <report.icon className="h-4 w-4 text-primary" />
                  {report.title}
                </CardTitle>
                <StatusPill
                  label={report.status}
                  tone={report.status === "ready" ? "success" : "warning"}
                  className="capitalize"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{report.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => toast.success(`${report.title} generated`)}>Open</Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`${report.title} downloaded`)}
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
