import { useEffect, useMemo, useState } from "react";
import { Activity, Fuel, Gauge, Wrench } from "lucide-react";
import { vehicles, getDriverById, maintenanceItems, type VehicleStatus } from "@/data/mock-data";
import { DataToolbar, FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

const statusTone: Record<VehicleStatus, "success" | "warning" | "danger" | "neutral"> = {
  moving: "success",
  idle: "warning",
  stopped: "danger",
  offline: "neutral",
};

const statusOrder: Array<VehicleStatus | "all"> = ["all", "moving", "idle", "stopped", "offline"];

export default function Vehicles() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(vehicles[0]?.id ?? "");

  useEffect(() => {
    const requestedVehicleId = searchParams.get("vehicle");
    if (!requestedVehicleId) return;

    const exists = vehicles.some((vehicle) => vehicle.id === requestedVehicleId);
    if (!exists) return;

    setFilter("all");
    setSearch("");
    setSelectedId(requestedVehicleId);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("vehicle");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const counts = useMemo(
    () => ({
      all: vehicles.length,
      moving: vehicles.filter((vehicle) => vehicle.status === "moving").length,
      idle: vehicles.filter((vehicle) => vehicle.status === "idle").length,
      stopped: vehicles.filter((vehicle) => vehicle.status === "stopped").length,
      offline: vehicles.filter((vehicle) => vehicle.status === "offline").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const pool = filter === "all" ? vehicles : vehicles.filter((vehicle) => vehicle.status === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((vehicle) => {
      const driver = vehicle.assignedDriver ? getDriverById(vehicle.assignedDriver) : null;
      return [vehicle.registration, vehicle.make, vehicle.model, vehicle.type, driver?.name, vehicle.lastLocation.label]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [filter, search]);

  const selected = filtered.find((vehicle) => vehicle.id === selectedId) ?? filtered[0] ?? null;
  const selectedDriver = selected?.assignedDriver ? getDriverById(selected.assignedDriver) : null;
  const selectedMaintenance = selected
    ? maintenanceItems.filter((item) => item.vehicleId === selected.id).slice(0, 3)
    : [];

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Asset Control"
        title="Vehicle Management"
        description="Track fleet health, location coverage, and maintenance exposure at the vehicle level."
      />

      <FilterChipBar
        items={statusOrder.map((status) => ({ key: status, label: status, count: counts[status] }))}
        active={filter}
        onChange={(value) => setFilter(value as VehicleStatus | "all")}
      />

      <DataToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search registration, model, type, location, assigned driver"
      />

      <section className="workspace-grid with-inspector">
        <div className="surface-raised rounded-2xl p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vehicle) => {
                const driver = vehicle.assignedDriver ? getDriverById(vehicle.assignedDriver) : null;

                return (
                  <TableRow
                    key={vehicle.id}
                    onClick={() => setSelectedId(vehicle.id)}
                    className={`cursor-pointer ${selected?.id === vehicle.id ? "bg-accent/65" : ""}`}
                  >
                    <TableCell className="font-mono text-xs font-semibold">{vehicle.registration}</TableCell>
                    <TableCell>
                      <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.year}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.type}</TableCell>
                    <TableCell>
                      <StatusPill label={vehicle.status} tone={statusTone[vehicle.status]} className="capitalize" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={vehicle.healthScore} className="h-2.5 w-20" />
                        <span className="text-xs">{vehicle.healthScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>{driver?.name ?? "--"}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.lastLocation.label}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selected ? (
          <InspectorPanel title={selected.registration} subtitle={`${selected.make} ${selected.model} | ${selected.type}`}>
            <StatusPill label={selected.status} tone={statusTone[selected.status]} className="capitalize" />

            <div className="surface-raised rounded-xl p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Health score</span>
                <span className="font-semibold">{selected.healthScore}/100</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Fuel level</span>
                <span className="font-semibold">{selected.fuelLevel}%</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Odometer</span>
                <span className="font-semibold">{selected.odometer.toLocaleString()} km</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-muted-foreground">Current speed</p>
                <p className="mt-1 flex items-center gap-1 font-semibold"><Gauge className="h-3.5 w-3.5" />{selected.speed} km/h</p>
              </div>
              <div className="surface-raised rounded-xl p-2.5">
                <p className="text-muted-foreground">Fuel reserve</p>
                <p className="mt-1 flex items-center gap-1 font-semibold"><Fuel className="h-3.5 w-3.5" />{selected.fuelLevel}%</p>
              </div>
            </div>

            <div className="surface-raised rounded-xl p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Assigned Driver</p>
              {selectedDriver ? (
                <div>
                  <p className="text-sm font-semibold">{selectedDriver.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDriver.phone}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Behavior score {selectedDriver.behaviorScore}/100</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No active assignment</p>
              )}
            </div>

            <div className="surface-raised rounded-xl p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Maintenance Watch</p>
              {selectedMaintenance.length ? (
                <div className="space-y-1.5 text-xs">
                  {selectedMaintenance.map((item) => (
                    <p key={item.id} className="flex items-center gap-1 text-muted-foreground">
                      <Wrench className="h-3.5 w-3.5" />
                      {item.type} ({item.status})
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No maintenance records found.</p>
              )}
            </div>

            <Button className="w-full" onClick={() => navigate(`/maintenance?vehicle=${selected.id}`)}>
              <Activity className="mr-1 h-4 w-4" />
              Open Vehicle Health View
            </Button>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
