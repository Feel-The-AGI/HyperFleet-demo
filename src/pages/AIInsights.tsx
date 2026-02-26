import { type ElementType, useMemo, useState } from "react";
import {
  Brain,
  FileCheck,
  Fuel,
  Navigation,
  ThumbsDown,
  ThumbsUp,
  Users,
  Wrench,
} from "lucide-react";
import { agentProposals, type AgentType } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterChipBar, PageHeader, StatusPill } from "@/components/product";

const agentInfo: Record<
  AgentType,
  {
    icon: ElementType;
    label: string;
    blurb: string;
  }
> = {
  fuel: {
    icon: Fuel,
    label: "Fuel Anomaly Agent",
    blurb: "Detects abnormal fuel usage and potential leakage or theft patterns.",
  },
  maintenance: {
    icon: Wrench,
    label: "Predictive Maintenance Agent",
    blurb: "Forecasts component wear and schedules preventative interventions.",
  },
  route: {
    icon: Navigation,
    label: "Route Intelligence Agent",
    blurb: "Suggests lane improvements and border-aware ETA optimization.",
  },
  behavior: {
    icon: Users,
    label: "Driver Behavior Agent",
    blurb: "Tracks safety profile changes and coaching opportunities.",
  },
  compliance: {
    icon: FileCheck,
    label: "Compliance Agent",
    blurb: "Monitors regulatory gaps and document validity.",
  },
};

const urgencyTone = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

export default function AIInsights() {
  const [activeAgent, setActiveAgent] = useState<AgentType | "all">("all");

  const grouped = useMemo(
    () =>
      Object.entries(agentInfo).map(([agentType, info]) => ({
        key: agentType as AgentType,
        ...info,
        proposals: agentProposals.filter((proposal) => proposal.agentType === agentType),
      })),
    [],
  );

  const visible = activeAgent === "all" ? grouped : grouped.filter((group) => group.key === activeAgent);

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Autonomous Intelligence"
        title="AI Insight Hub"
        description="Review recommendation quality by specialist agent and clear pending actions from one workspace."
      />

      <FilterChipBar
        items={[
          { key: "all", label: "all", count: agentProposals.length },
          ...grouped.map((group) => ({ key: group.key, label: group.key, count: group.proposals.length })),
        ]}
        active={activeAgent}
        onChange={(value) => setActiveAgent(value as AgentType | "all")}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {visible.map((group) => (
          <Card key={group.key}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <group.icon className="h-4 w-4 text-primary" />
                {group.label}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{group.blurb}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.proposals.slice(0, 4).map((proposal) => (
                <div key={proposal.id} className="surface-raised rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <StatusPill label={proposal.urgency} tone={urgencyTone[proposal.urgency]} className="capitalize" />
                    <span className="ml-auto text-xs font-semibold text-muted-foreground">{proposal.confidence}%</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{proposal.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{proposal.explanation}</p>
                  <div className="mt-3 flex gap-1">
                    <Button size="sm"><ThumbsUp className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="outline"><ThumbsDown className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-primary" />
            Model Confidence Summary
          </CardTitle>
          <p className="text-xs text-muted-foreground">Average confidence across all pending proposals</p>
        </CardHeader>
        <CardContent>
          <div className="surface-raised rounded-xl p-4">
            <p className="text-2xl font-semibold">
              {Math.round(agentProposals.reduce((acc, proposal) => acc + proposal.confidence, 0) / agentProposals.length)}%
            </p>
            <p className="text-xs text-muted-foreground">Recommendation confidence mean</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
