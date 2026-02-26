import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, Route, Timer } from "lucide-react";
import { trips, getDriverById, getVehicleById, type Trip, type TripStatus } from "@/data/mock-data";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FilterChipBar,
  DataToolbar,
  InspectorPanel,
  PageHeader,
  StatusPill,
  TimelineBlock,
  type TimelineItem,
} from "@/components/product";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const statusOrder: Array<TripStatus | "all"> = ["all", "in_progress", "scheduled", "delayed", "completed"];

const statusTone: Record<TripStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  in_progress: "success",
  scheduled: "info",
  delayed: "warning",
  completed: "neutral",
};

function prettyStatus(status: TripStatus | "all") {
  if (status === "all") return "all";
  return status.replace("_", " ");
}

export default function Trips() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<TripStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(trips[0]?.id ?? "");
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");

  useEffect(() => {
    const requestedTripId = searchParams.get("trip");
    if (!requestedTripId) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("trip");
    const target = trips.find((trip) => trip.id === requestedTripId);

    if (!target) {
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setFilter("all");
    setSearch("");
    setSelectedId(target.id);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    const pool = filter === "all" ? trips : trips.filter((trip) => trip.status === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((trip) => {
      const driver = getDriverById(trip.driverId);
      const vehicle = getVehicleById(trip.vehicleId);
      return [trip.id, trip.origin, trip.destination, trip.cargo, driver?.name, vehicle?.registration]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [filter, search]);

  const selected = filtered.find((trip) => trip.id === selectedId) ?? filtered[0] ?? null;

  const counts = useMemo(
    () => ({
      all: trips.length,
      in_progress: trips.filter((trip) => trip.status === "in_progress").length,
      scheduled: trips.filter((trip) => trip.status === "scheduled").length,
      delayed: trips.filter((trip) => trip.status === "delayed").length,
      completed: trips.filter((trip) => trip.status === "completed").length,
    }),
    [],
  );

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!selected) return [];
    return [
      {
        id: "departed",
        title: selected.departedAt ? "Departed" : "Awaiting departure",
        detail: selected.departedAt
          ? `Vehicle departed from ${selected.origin}`
          : "Trip is not started yet",
        time: selected.departedAt
          ? new Date(selected.departedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          : "--",
      },
      {
        id: "eta",
        title: `ETA ${selected.eta}`,
        detail: selected.status === "delayed" ? "Delay flag active" : "On primary delivery plan",
        tone: selected.status === "delayed" ? "warning" : "default",
      },
      {
        id: "arrived",
        title: selected.arrivedAt ? "Arrived" : "In transit",
        detail: selected.arrivedAt ? `Arrived at ${selected.destination}` : `${selected.progress}% route completion`,
        time: selected.arrivedAt
          ? new Date(selected.arrivedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          : undefined,
        tone: selected.arrivedAt ? "success" : "default",
      },
    ];
  }, [selected]);

  const handleAdjustEta = () => {
    if (!selected) return;
    toast.success(`ETA adjustment started for ${selected.id.toUpperCase()}`);
    navigate(`/dispatch?trip=${selected.id}`);
  };

  const handleReroute = () => {
    if (!selected) return;
    toast.success(`Opening reroute view for ${selected.id.toUpperCase()}`);
    navigate(`/fleet-map?vehicle=${selected.vehicleId}`);
  };

  const handleOpenDispatchTimeline = () => {
    if (!selected) return;
    navigate(`/dispatch?trip=${selected.id}`);
  };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Dispatch Execution"
        title="Trip Operations"
        description="Monitor trip state, detect ETA risks early, and open contextual detail for dispatch decisions."
      />

      <FilterChipBar
        items={statusOrder.map((status) => ({ key: status, label: prettyStatus(status), count: counts[status] }))}
        active={filter}
        onChange={(value) => setFilter(value as TripStatus | "all")}
      />

      <DataToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search by trip, route, driver, vehicle, cargo"
        rightSlot={
          <>
            <Select value={density} onValueChange={(value) => setDensity(value as typeof density)}>
              <SelectTrigger className="w-[155px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable Rows</SelectItem>
                <SelectItem value="compact">Compact Rows</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">Create Trip</Button>
          </>
        }
      />

      <section className="workspace-grid with-inspector">
        <div className="surface-raised rounded-2xl p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="w-48">Progress</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((trip) => {
                const driver = getDriverById(trip.driverId);
                const vehicle = getVehicleById(trip.vehicleId);
                return (
                  <TableRow
                    key={trip.id}
                    onClick={() => setSelectedId(trip.id)}
                    className={`cursor-pointer ${density === "compact" ? "[&_td]:py-2" : ""} ${
                      selected?.id === trip.id ? "bg-accent/65" : ""
                    }`}
                  >
                    <TableCell className="font-mono text-xs font-semibold uppercase">{trip.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>{trip.origin}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{trip.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>{driver?.name ?? "--"}</TableCell>
                    <TableCell className="font-mono text-xs">{vehicle?.registration ?? "--"}</TableCell>
                    <TableCell>
                      <StatusPill label={prettyStatus(trip.status)} tone={statusTone[trip.status]} className="capitalize" />
                    </TableCell>
                    <TableCell>{trip.eta}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={trip.progress} className="h-2.5" />
                        <span className="w-8 text-xs text-muted-foreground">{trip.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{trip.cargo}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selected ? (
          <InspectorPanel title={`${selected.id.toUpperCase()} Route Detail`} subtitle={`${selected.origin} to ${selected.destination}`}>
            <StatusPill label={prettyStatus(selected.status)} tone={statusTone[selected.status]} className="capitalize" />
            <div className="surface-raised rounded-xl p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-semibold">{selected.distance} km</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">ETA</span>
                <span className="font-semibold">{selected.eta}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Cargo</span>
                <span className="font-semibold">{selected.cargo}</span>
              </div>
            </div>

            <div className="surface-raised rounded-xl p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Trip Timeline</p>
              <TimelineBlock items={timeline} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={handleAdjustEta}>
                <Timer className="mr-1 h-3.5 w-3.5" />
                Adjust ETA
              </Button>
              <Button size="sm" variant="outline" onClick={handleReroute}>
                <Route className="mr-1 h-3.5 w-3.5" />
                Reroute
              </Button>
              <Button size="sm" className="col-span-2" onClick={handleOpenDispatchTimeline}>
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                Open Dispatch Timeline
              </Button>
            </div>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
