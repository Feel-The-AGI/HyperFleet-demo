import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Fuel, Wrench, Navigation, Users, FileCheck, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { agentProposals, type AgentType } from "@/data/mock-data";

const agentInfo: Record<AgentType, { icon: React.ElementType; label: string; description: string }> = {
  fuel: { icon: Fuel, label: "Fuel Anomaly Agent", description: "Monitors fuel consumption patterns and detects anomalies" },
  maintenance: { icon: Wrench, label: "Predictive Maintenance", description: "Predicts vehicle failures and recommends maintenance windows" },
  route: { icon: Navigation, label: "Route Intelligence", description: "Optimizes routes and manages delivery windows" },
  behavior: { icon: Users, label: "Driver Behavior", description: "Builds behavioral profiles and generates coaching prompts" },
  compliance: { icon: FileCheck, label: "Compliance Monitor", description: "Tracks document expiry and regulatory requirements" },
};

const urgencyColors: Record<string, string> = {
  critical: "bg-fleet-danger text-fleet-danger-foreground",
  warning: "bg-fleet-warning text-fleet-warning-foreground",
  info: "bg-fleet-info text-fleet-info-foreground",
};

export default function AIInsights() {
  const byAgent = Object.entries(agentInfo).map(([type, info]) => ({
    type: type as AgentType,
    ...info,
    proposals: agentProposals.filter(p => p.agentType === type),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-fleet-info" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Hub</h1>
          <p className="text-sm text-muted-foreground">Agent insights and proposals across your fleet</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {byAgent.map(agent => (
          <Card key={agent.type}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <agent.icon className="h-5 w-5 text-fleet-info" />
                <div>
                  <CardTitle className="text-sm">{agent.label}</CardTitle>
                  <CardDescription className="text-[10px]">{agent.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agent.proposals.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No active proposals</p>
              ) : (
                agent.proposals.map(p => (
                  <div key={p.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`text-[10px] ${urgencyColors[p.urgency]}`}>{p.urgency}</Badge>
                      <span className="text-xs font-semibold">{p.confidence}%</span>
                    </div>
                    <p className="text-xs font-medium">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{p.explanation}</p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-6 text-[10px] px-2"><ThumbsUp className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2"><ThumbsDown className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2"><Clock className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
