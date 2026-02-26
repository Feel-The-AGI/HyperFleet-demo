import { useMemo, useState } from "react";
import { Clock3, ThumbsDown, ThumbsUp } from "lucide-react";
import { agentProposals } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { DataToolbar, FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";

const urgencyTone = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

const filterOptions = ["all", "fuel", "maintenance", "route", "behavior", "compliance"] as const;

type AgentFilter = (typeof filterOptions)[number];

export default function AgentQueue() {
  const [filter, setFilter] = useState<AgentFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(agentProposals[0]?.id ?? "");

  const filtered = useMemo(() => {
    const pool = filter === "all" ? agentProposals : agentProposals.filter((proposal) => proposal.agentType === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((proposal) =>
      [proposal.title, proposal.explanation, proposal.agentName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [filter, search]);

  const selected = filtered.find((proposal) => proposal.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Decision Workflow"
        title="Agent Proposal Queue"
        description="Triage AI recommendations by urgency, confidence, and operational impact."
      />

      <FilterChipBar
        items={filterOptions.map((entry) => ({
          key: entry,
          label: entry,
          count: entry === "all" ? agentProposals.length : agentProposals.filter((item) => item.agentType === entry).length,
        }))}
        active={filter}
        onChange={(value) => setFilter(value as AgentFilter)}
      />

      <DataToolbar value={search} onChange={setSearch} placeholder="Search proposals by title, reason, or agent" />

      <section className="workspace-grid with-inspector">
        <div className="space-y-3">
          {filtered.map((proposal) => (
            <button
              type="button"
              key={proposal.id}
              onClick={() => setSelectedId(proposal.id)}
              className={`surface-raised w-full rounded-2xl border p-4 text-left transition ${
                selected?.id === proposal.id ? "border-primary/45" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill label={proposal.urgency} tone={urgencyTone[proposal.urgency]} className="capitalize" />
                <StatusPill label={proposal.agentType} tone="info" className="capitalize" />
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(proposal.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">{proposal.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{proposal.explanation}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <InspectorPanel title={selected.title} subtitle={`${selected.agentName} | ${selected.confidence}% confidence`}>
            <StatusPill label={selected.urgency} tone={urgencyTone[selected.urgency]} className="capitalize" />
            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Explanation</p>
              <p className="text-muted-foreground">{selected.explanation}</p>
            </div>
            <div className="surface-raised rounded-xl p-3 text-xs text-muted-foreground">
              <p>Vehicle reference: {selected.vehicleId ?? "N/A"}</p>
              <p>Driver reference: {selected.driverId ?? "N/A"}</p>
              <p className="mt-2 flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Logged at {new Date(selected.timestamp).toLocaleString("en-GB")}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm"><ThumbsUp className="mr-1 h-3.5 w-3.5" />Approve</Button>
              <Button size="sm" variant="outline"><ThumbsDown className="mr-1 h-3.5 w-3.5" />Reject</Button>
              <Button size="sm" variant="secondary">Defer</Button>
            </div>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
