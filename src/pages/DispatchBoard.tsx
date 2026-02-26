import { useEffect, useMemo, useState } from "react";
import { GripVertical, MapPin, PlusCircle } from "lucide-react";
import { trips, getDriverById, getVehicleById, type TripStatus } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusPill } from "@/components/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const laneConfig: Array<{ key: TripStatus; label: string; tone: "info" | "success" | "warning" | "neutral" }> = [
  { key: "scheduled", label: "Scheduled", tone: "info" },
  { key: "in_progress", label: "In Progress", tone: "success" },
  { key: "delayed", label: "Delayed", tone: "warning" },
  { key: "completed", label: "Completed", tone: "neutral" },
];

export default function DispatchBoard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTripId, setActiveTripId] = useState<string>(trips[0]?.id ?? "");

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0] ?? null;

  const byLane = useMemo(
    () => laneConfig.map((lane) => ({ ...lane, items: trips.filter((trip) => trip.status === lane.key) })),
    [],
  );

  useEffect(() => {
    const requestedTripId = searchParams.get("trip");
    const requestedVehicleId = searchParams.get("vehicle");
    if (!requestedTripId && !requestedVehicleId) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("trip");
    nextParams.delete("vehicle");
    nextParams.delete("maintenance");

    const targetTrip = requestedTripId
      ? trips.find((trip) => trip.id === requestedTripId)
      : trips.find((trip) => trip.vehicleId === requestedVehicleId);

    if (targetTrip) {
      setActiveTripId(targetTrip.id);
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleAssignDriver = () => {
    if (!activeTrip) return;
    if (!activeTrip.driverId) {
      toast.info("No driver is currently assigned to this trip.");
      navigate("/drivers");
      return;
    }

    toast.success(`Opening driver assignment for ${activeTrip.id.toUpperCase()}`);
    navigate(`/drivers?driver=${activeTrip.driverId}`);
  };

  const handleChangeRoute = () => {
    if (!activeTrip) return;
    toast.success(`Opening route controls for ${activeTrip.id.toUpperCase()}`);
    navigate(`/fleet-map?vehicle=${activeTrip.vehicleId}`);
  };

  const handleOpenTripWorkspace = () => {
    if (!activeTrip) return;
    navigate(`/trips?trip=${activeTrip.id}`);
  };

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
                <Button size="sm" onClick={handleAssignDriver}>Assign Driver</Button>
                <Button size="sm" variant="outline" onClick={handleChangeRoute}>Change Route</Button>
                <Button size="sm" variant="secondary" className="col-span-2" onClick={handleOpenTripWorkspace}>Open Trip Workspace</Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
