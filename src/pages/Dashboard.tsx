import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Fuel,
  Navigation,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activityFeed,
  agentProposals,
  driverScoreDistribution,
  fuelConsumptionTrend,
  getFleetStats,
  type AgentProposal,
} from "@/data/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  InspectorPanel,
  KpiTile,
  PageHeader,
  StatusPill,
  TimelineBlock,
  type TimelineItem,
} from "@/components/product";

const stats = getFleetStats();

const kpiCards = [
  {
    label: "Fleet Units",
    value: stats.total,
    detail: `${stats.active} moving | ${stats.idle} idle | ${stats.offline} offline`,
    trend: "+2 this week",
    tone: "positive" as const,
    icon: Truck,
  },
  {
    label: "Active Trips",
    value: stats.activeTrips,
    detail: "Running now",
    trend: "1 delayed",
    tone: "warning" as const,
    icon: Navigation,
  },
  {
    label: "Fuel Spend",
    value: `GHS ${stats.totalFuelCostGHS.toLocaleString()}`,
    detail: "Rolling 7 days",
    trend: "+4.8%",
    tone: "warning" as const,
    icon: Fuel,
  },
  {
    label: "Open Alerts",
    value: stats.pendingAlerts,
    detail: "Needs acknowledgement",
    trend: "3 critical",
    tone: "danger" as const,
    icon: AlertTriangle,
  },
  {
    label: "Fleet Health",
    value: `${stats.avgHealthScore}%`,
    detail: "Average score",
    trend: "+1.9%",
    tone: "positive" as const,
    icon: Activity,
  },
];

const urgencyTone: Record<AgentProposal["urgency"], "danger" | "warning" | "info"> = {
  critical: "danger",
  warning: "warning",
  info: "info",
};

export default function Dashboard() {
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(agentProposals[0]?.id ?? null);

  const pendingProposals = useMemo(
    () => agentProposals.filter((proposal) => proposal.status === "pending"),
    [],
  );

  const selectedProposal =
    pendingProposals.find((proposal) => proposal.id === selectedProposalId) ?? pendingProposals[0] ?? null;

  const activityItems: TimelineItem[] = activityFeed.slice(0, 8).map((event) => ({
    id: event.id,
    title: event.message,
    time: new Date(event.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    tone:
      event.type === "incident" || event.type === "alert"
        ? "danger"
        : event.type === "maintenance"
          ? "warning"
          : event.type === "trip_completed"
            ? "success"
            : "default",
  }));

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Mission Control"
        title="Operations Command Center"
        description="Monitor critical fleet signals, triage AI recommendations, and keep active deliveries on plan."
        actions={
          <>
            <Button variant="outline">Export Snapshot</Button>
            <Button>Open Fleet Map</Button>
          </>
        }
      />

      <section className="metric-grid">
        {kpiCards.map((kpi) => (
          <KpiTile
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            detail={kpi.detail}
            trend={kpi.trend}
            tone={kpi.tone}
            icon={kpi.icon}
          />
        ))}
      </section>

      <section className="workspace-grid with-inspector">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Proposal Queue
                  </CardTitle>
                  <CardDescription>{pendingProposals.length} recommendations waiting for operator action</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  Open Queue
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingProposals.length === 0 ? (
                <EmptyState
                  title="No pending recommendations"
                  description="All proposals are already resolved. New recommendations will appear here."
                />
              ) : (
                pendingProposals.slice(0, 5).map((proposal) => (
                  <button
                    key={proposal.id}
                    type="button"
                    onClick={() => setSelectedProposalId(proposal.id)}
                    className={`surface-raised w-full rounded-xl border p-3 text-left transition ${
                      selectedProposal?.id === proposal.id ? "border-primary/45" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StatusPill label={proposal.urgency} tone={urgencyTone[proposal.urgency]} />
                      <span className="text-[11px] text-muted-foreground">{proposal.agentName}</span>
                      <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
                        {proposal.confidence}% confidence
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{proposal.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{proposal.explanation}</p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fuel Trend (7 days)</CardTitle>
                <CardDescription>Litres consumed across operating units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fuelConsumptionTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="litres" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Driver Score Distribution</CardTitle>
                <CardDescription>Current behavior score spread</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverScoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Live Operations Feed</CardTitle>
              <CardDescription>Latest telemetry and compliance events</CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineBlock items={activityItems} />
            </CardContent>
          </Card>
        </div>

        {selectedProposal ? (
          <InspectorPanel
            title={selectedProposal.title}
            subtitle={`${selectedProposal.agentName} | ${new Date(selectedProposal.timestamp).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          >
            <StatusPill label={selectedProposal.urgency} tone={urgencyTone[selectedProposal.urgency]} />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Recommendation</p>
              <p className="text-sm leading-relaxed">{selectedProposal.explanation}</p>
            </div>
            <div className="surface-raised rounded-xl p-3 text-xs text-muted-foreground">
              <p>Vehicle ref: {selectedProposal.vehicleId ?? "N/A"}</p>
              <p>Driver ref: {selectedProposal.driverId ?? "N/A"}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
              <Button size="sm" variant="secondary">
                Defer
              </Button>
            </div>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
