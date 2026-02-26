import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Truck, Navigation, Fuel, AlertTriangle, Activity, CheckCircle, MapPin,
  ShieldAlert, Wrench, Brain, ThumbsUp, ThumbsDown, Clock,
} from "lucide-react";
import {
  getFleetStats, agentProposals, activityFeed, fuelConsumptionTrend,
  tripCompletionData, driverScoreDistribution, type AgentProposal, type ActivityEvent,
} from "@/data/mock-data";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";

const stats = getFleetStats();

const kpiCards = [
  { label: "Total Vehicles", value: stats.total, sub: `${stats.active} active | ${stats.idle} idle | ${stats.offline} offline`, icon: Truck, color: "text-fleet-info" },
  { label: "Active Trips", value: stats.activeTrips, sub: "In progress now", icon: Navigation, color: "text-fleet-success" },
  { label: "Fuel Spend (GHS)", value: `GHS ${stats.totalFuelCostGHS.toLocaleString()}`, sub: "This week", icon: Fuel, color: "text-fleet-warning" },
  { label: "Pending Alerts", value: stats.pendingAlerts, sub: "Unacknowledged", icon: AlertTriangle, color: "text-fleet-danger" },
  { label: "Fleet Health", value: `${stats.avgHealthScore}%`, sub: "Average score", icon: Activity, color: "text-fleet-info" },
];

const urgencyColors: Record<string, string> = {
  critical: "bg-fleet-danger text-fleet-danger-foreground",
  warning: "bg-fleet-warning text-fleet-warning-foreground",
  info: "bg-fleet-info text-fleet-info-foreground",
};

const eventIcons: Record<string, React.ElementType> = {
  "check-circle": CheckCircle,
  "map-pin": MapPin,
  fuel: Fuel,
  "alert-triangle": AlertTriangle,
  wrench: Wrench,
  "shield-alert": ShieldAlert,
};

function ProposalCard({ p }: { p: AgentProposal }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] shrink-0">{p.agentName}</Badge>
            <Badge className={`text-[10px] ${urgencyColors[p.urgency]}`}>{p.urgency}</Badge>
          </div>
          <p className="font-medium text-sm leading-tight">{p.title}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold">{p.confidence}%</div>
          <div className="text-[10px] text-muted-foreground">confidence</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.explanation}</p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="default" className="h-7 text-xs gap-1">
          <ThumbsUp className="h-3 w-3" /> Approve
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
          <ThumbsDown className="h-3 w-3" /> Reject
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
          <Clock className="h-3 w-3" /> Defer
        </Button>
      </div>
    </div>
  );
}

function EventItem({ e }: { e: ActivityEvent }) {
  const Icon = eventIcons[e.icon] || Activity;
  const time = new Date(e.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 rounded-full bg-muted p-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-tight">{e.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="page-shell p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time fleet overview - {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Proposals */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-fleet-info" />
              <div>
                <CardTitle className="text-base">AI Agent Proposals</CardTitle>
                <CardDescription>Recommendations requiring your action</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[420px] overflow-auto scrollbar-thin">
            {agentProposals.filter(p => p.status === "pending").slice(0, 4).map(p => (
              <ProposalCard key={p.id} p={p} />
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activity Feed</CardTitle>
            <CardDescription>Latest fleet events</CardDescription>
          </CardHeader>
          <CardContent className="divide-y max-h-[420px] overflow-auto scrollbar-thin">
            {activityFeed.map(e => <EventItem key={e.id} e={e} />)}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fuel trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fuel Consumption (7-day)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ litres: { label: "Litres", color: "hsl(var(--chart-1))" }, cost: { label: "Cost (GHS)", color: "hsl(var(--chart-3))" } }} className="h-[220px] w-full">
              <BarChart data={fuelConsumptionTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="litres" fill="var(--color-litres)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Driver score distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Driver Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Drivers", color: "hsl(var(--chart-2))" } }} className="h-[220px] w-full">
              <BarChart data={driverScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

