import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Siren, TriangleAlert } from "lucide-react";
import { alerts, type AlertUrgency } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { DataToolbar, FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const urgencyOrder: Array<AlertUrgency | "all"> = ["all", "critical", "warning", "info"];

const urgencyTone: Record<AlertUrgency, "danger" | "warning" | "info"> = {
  critical: "danger",
  warning: "warning",
  info: "info",
};

export default function AlertsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [alertItems, setAlertItems] = useState(alerts);
  const [filter, setFilter] = useState<AlertUrgency | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(alerts[0]?.id ?? "");

  useEffect(() => {
    const requestedAlertId = searchParams.get("alert");
    const requestedVehicleId = searchParams.get("vehicle");
    if (!requestedAlertId && !requestedVehicleId) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("alert");
    nextParams.delete("vehicle");
    nextParams.delete("maintenance");

    const target = requestedAlertId
      ? alertItems.find((alert) => alert.id === requestedAlertId)
      : alertItems.find((alert) => alert.relatedId === requestedVehicleId);

    if (target) {
      setFilter("all");
      setSearch("");
      setSelectedId(target.id);
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setSearchParams(nextParams, { replace: true });
  }, [alertItems, searchParams, setSearchParams]);

  const counts = useMemo(
    () => ({
      all: alertItems.length,
      critical: alertItems.filter((alert) => alert.urgency === "critical").length,
      warning: alertItems.filter((alert) => alert.urgency === "warning").length,
      info: alertItems.filter((alert) => alert.urgency === "info").length,
    }),
    [alertItems],
  );

  const filtered = useMemo(() => {
    const pool = filter === "all" ? alertItems : alertItems.filter((alert) => alert.urgency === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((alert) => [alert.title, alert.message, alert.category].join(" ").toLowerCase().includes(q));
  }, [alertItems, filter, search]);

  const selected = filtered.find((alert) => alert.id === selectedId) ?? filtered[0] ?? null;

  const handleAcknowledge = () => {
    if (!selected) return;
    if (selected.acknowledged) {
      toast.info("Alert is already acknowledged.");
      return;
    }

    setAlertItems((current) =>
      current.map((item) => (item.id === selected.id ? { ...item, acknowledged: true } : item)),
    );
    toast.success(`Acknowledged ${selected.title}`);
  };

  const handleEscalate = () => {
    if (!selected) return;
    toast.warning(`Escalating ${selected.title} to duty queue`);
    navigate(`/agent-queue?alert=${selected.id}`);
  };

  const handleOpenLinkedRecord = () => {
    if (!selected?.relatedId) {
      toast.info("This alert has no linked entity.");
      return;
    }

    if (selected.relatedId.startsWith("v")) {
      if (selected.category === "maintenance") {
        navigate(`/maintenance?vehicle=${selected.relatedId}`);
        return;
      }

      if (selected.category === "geofence" || selected.category === "fuel" || selected.category === "incident") {
        navigate(`/fleet-map?vehicle=${selected.relatedId}`);
        return;
      }

      navigate(`/vehicles?vehicle=${selected.relatedId}`);
      return;
    }

    if (selected.relatedId.startsWith("d")) {
      navigate(`/drivers?driver=${selected.relatedId}`);
      return;
    }

    toast.info("Linked record type is not supported yet.");
  };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Incident Inbox"
        title="Alert Center"
        description="Centralized high-signal alert stream for operations, compliance, and maintenance risks."
      />

      <FilterChipBar
        items={urgencyOrder.map((entry) => ({ key: entry, label: entry, count: counts[entry] }))}
        active={filter}
        onChange={(value) => setFilter(value as AlertUrgency | "all")}
      />

      <DataToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search alerts by title, message, category"
        rightSlot={<Button size="sm">Resolve Selected</Button>}
      />

      <section className="workspace-grid with-inspector">
        <div className="space-y-3">
          {filtered.map((alert) => (
            <button
              type="button"
              key={alert.id}
              onClick={() => setSelectedId(alert.id)}
              className={`surface-raised w-full rounded-2xl border p-4 text-left transition ${
                alert.acknowledged ? "opacity-70" : ""
              } ${selected?.id === alert.id ? "border-primary/45" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill label={alert.urgency} tone={urgencyTone[alert.urgency]} className="capitalize" />
                <StatusPill label={alert.category} tone="neutral" className="capitalize" />
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">{alert.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <InspectorPanel title={selected.title} subtitle={`Category ${selected.category}`}>
            <StatusPill label={selected.urgency} tone={urgencyTone[selected.urgency]} className="capitalize" />

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Incident Context</p>
              <p className="text-muted-foreground">{selected.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">Related reference {selected.relatedId ?? "N/A"}</p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Recommended Response</p>
              <p className="text-muted-foreground">
                {selected.urgency === "critical"
                  ? "Escalate to duty manager, lock related dispatch flow, and request immediate acknowledgement."
                  : selected.urgency === "warning"
                    ? "Assign to operations lead and monitor resolution within SLA window."
                    : "Record event and include in daily summary review."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={handleAcknowledge}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Acknowledge
              </Button>
              <Button size="sm" variant="outline" onClick={handleEscalate}>
                <Siren className="mr-1 h-3.5 w-3.5" />
                Escalate
              </Button>
              <Button size="sm" variant="secondary" className="col-span-2" onClick={handleOpenLinkedRecord}>
                <TriangleAlert className="mr-1 h-3.5 w-3.5" />
                Open Linked Record
              </Button>
            </div>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
