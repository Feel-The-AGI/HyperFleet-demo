import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { agentProposals } from "@/data/mock-data";
import { ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { useState } from "react";

const urgencyColors: Record<string, string> = {
  critical: "bg-fleet-danger text-fleet-danger-foreground",
  warning: "bg-fleet-warning text-fleet-warning-foreground",
  info: "bg-fleet-info text-fleet-info-foreground",
};

export default function AgentQueue() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? agentProposals : agentProposals.filter(p => p.agentType === filter);

  return (
    <div className="page-shell p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Proposal Queue</h1>
        <p className="text-sm text-muted-foreground">{agentProposals.filter(p => p.status === "pending").length} pending proposals</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "fuel", "maintenance", "route", "behavior", "compliance"].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`glass-filter-pill ${filter === t ? "glass-filter-pill-active" : "glass-filter-pill-idle"}`}>
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="rounded-lg border p-4 flex gap-4 items-start">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{p.agentName}</Badge>
                <Badge className={`text-[10px] ${urgencyColors[p.urgency]}`}>{p.urgency}</Badge>
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(p.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.explanation}</p>
            </div>
            <div className="text-center shrink-0">
              <div className="text-xl font-bold">{p.confidence}%</div>
              <div className="text-[10px] text-muted-foreground">confidence</div>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="default" className="h-7 text-xs"><ThumbsUp className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" className="h-7 text-xs"><ThumbsDown className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs"><Clock className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

