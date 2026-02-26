import { useMemo, useState } from "react";
import { GripVertical, MapPin, PlusCircle } from "lucide-react";
import { trips, getDriverById, getVehicleById, type TripStatus } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusPill } from "@/components/product";

const laneConfig: Array<{ key: TripStatus; label: string; tone: "info" | "success" | "warning" | "neutral" }> = [
  { key: "scheduled", label: "Scheduled", tone: "info" },
  { key: "in_progress", label: "In Progress", tone: "success" },
  { key: "delayed", label: "Delayed", tone: "warning" },
  { key: "completed", label: "Completed", tone: "neutral" },
];

export default function DispatchBoard() {
  const [activeTripId, setActiveTripId] = useState<string>(trips[0]?.id ?? "");

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0] ?? null;

  const byLane = useMemo(
    () => laneConfig.map((lane) => ({ ...lane, items: trips.filter((trip) => trip.status === lane.key) })),
    [],
  );

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Lane Orchestration"
        title="Dispatch Board"
        description="Use lane-level visibility to rebalance workload, handle delayed trips, and keep route execution steady."
        actions={
          <Button>
            <PlusCircle className="mr-1 h-4 w-4" />
            New Request
          </Button>
        }
      />

      <section className="workspace-grid with-inspector">
        <div className="grid gap-4 xl:grid-cols-4">
          {byLane.map((lane) => (
            <Card key={lane.key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm">{lane.label}</CardTitle>
                  <StatusPill label={`${lane.items.length}`} tone={lane.tone} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lane.items.map((trip) => {
                  const driver = getDriverById(trip.driverId);
                  const vehicle = getVehicleById(trip.vehicleId);

                  return (
                    <button
                      type="button"
                      key={trip.id}
                      onClick={() => setActiveTripId(trip.id)}
                      className={`surface-raised w-full rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${
                        activeTrip?.id === trip.id ? "border-primary/45" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold uppercase">{trip.id}</span>
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold">{trip.origin} to {trip.destination}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{driver?.name ?? "Unassigned"}</p>
                      <p className="text-xs text-muted-foreground">{vehicle?.registration ?? "--"}</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${trip.progress}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{trip.progress}% complete | ETA {trip.eta}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {activeTrip ? (
          <Card className="inspector-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{activeTrip.id.toUpperCase()} Dispatch Detail</CardTitle>
              <p className="text-xs text-muted-foreground">Live control panel for selected trip</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusPill
                label={activeTrip.status.replace("_", " ")}
                tone={
                  activeTrip.status === "in_progress"
                    ? "success"
                    : activeTrip.status === "delayed"
                      ? "warning"
                      : activeTrip.status === "scheduled"
                        ? "info"
                        : "neutral"
                }
                className="capitalize"
              />

              <div className="surface-raised rounded-xl p-3 text-sm">
                <p className="font-semibold">Route</p>
                <p className="mt-1 text-muted-foreground">{activeTrip.origin} to {activeTrip.destination}</p>
                <p className="mt-1 text-muted-foreground">Distance {activeTrip.distance} km</p>
                <p className="text-muted-foreground">Cargo {activeTrip.cargo}</p>
              </div>

              <div className="surface-raised rounded-xl p-3 text-sm">
                <p className="mb-1 font-semibold">Checkpoint Summary</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Border queue normal</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Fuel stop acknowledged</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> ETA confidence medium</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm">Assign Driver</Button>
                <Button size="sm" variant="outline">Change Route</Button>
                <Button size="sm" variant="secondary" className="col-span-2">Open Trip Workspace</Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
