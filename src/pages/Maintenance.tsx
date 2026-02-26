import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CircleCheck, Wrench } from "lucide-react";
import { maintenanceItems, getVehicleById } from "@/data/mock-data";
import { DataToolbar, FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const filters = ["all", "overdue", "scheduled", "completed"] as const;
type MaintenanceFilter = (typeof filters)[number];

const tone = {
  overdue: "danger",
  scheduled: "info",
  completed: "success",
} as const;

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<MaintenanceFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(maintenanceItems[0]?.id ?? "");

  useEffect(() => {
    const requestedVehicleId = searchParams.get("vehicle");
    if (!requestedVehicleId) return;

    const firstMatch = maintenanceItems.find((item) => item.vehicleId === requestedVehicleId);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("vehicle");

    if (!firstMatch) {
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setFilter("all");
    setSearch("");
    setSelectedId(firstMatch.id);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const counts = useMemo(
    () => ({
      all: maintenanceItems.length,
      overdue: maintenanceItems.filter((item) => item.status === "overdue").length,
      scheduled: maintenanceItems.filter((item) => item.status === "scheduled").length,
      completed: maintenanceItems.filter((item) => item.status === "completed").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const pool = filter === "all" ? maintenanceItems : maintenanceItems.filter((item) => item.status === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((item) => {
      const vehicle = getVehicleById(item.vehicleId);
      return [item.type, item.status, item.notes, item.workshop, vehicle?.registration]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [filter, search]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;
  const selectedVehicle = selected ? getVehicleById(selected.vehicleId) : null;

  const handleAssignBay = () => {
    if (!selectedVehicle || !selected) return;
    toast.success(`Bay assignment started for ${selectedVehicle.registration}`);
    navigate(`/dispatch?vehicle=${selected.vehicleId}&maintenance=${selected.id}`);
  };

  const handleNotifyOps = () => {
    if (!selectedVehicle || !selected) return;
    toast.success(`Operations notified for ${selectedVehicle.registration}`);
    navigate(`/alerts?vehicle=${selected.vehicleId}&maintenance=${selected.id}`);
  };

  const handleOpenFullHistory = () => {
    if (!selected) return;
    navigate(`/vehicles?vehicle=${selected.vehicleId}`);
  };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Service Readiness"
        title="Maintenance Control"
        description="Prioritize overdue work, schedule interventions, and reduce preventable downtime."
      />

      <FilterChipBar
        items={filters.map((status) => ({ key: status, label: status, count: counts[status] }))}
        active={filter}
        onChange={(value) => setFilter(value as MaintenanceFilter)}
      />

      <DataToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search by type, registration, workshop, notes"
        rightSlot={<Button size="sm">Create Work Order</Button>}
      />

      <section className="workspace-grid with-inspector">
        <div className="surface-raised rounded-2xl p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const vehicle = getVehicleById(item.vehicleId);
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer ${selected?.id === item.id ? "bg-accent/65" : ""}`}
                  >
                    <TableCell className="font-mono text-xs">{vehicle?.registration ?? "--"}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <StatusPill label={item.status} tone={tone[item.status]} className="capitalize" />
                    </TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.completedDate ?? "--"}</TableCell>
                    <TableCell>{item.cost ? `GHS ${item.cost.toLocaleString()}` : "--"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.notes ?? item.workshop ?? "--"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selected ? (
          <InspectorPanel title={selected.type} subtitle={`Vehicle ${selectedVehicle?.registration ?? "--"}`}>
            <StatusPill label={selected.status} tone={tone[selected.status]} className="capitalize" />

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="flex items-center gap-1 text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" /> Due {selected.dueDate}</p>
              <p className="mt-2 flex items-center gap-1 text-muted-foreground"><CircleCheck className="h-3.5 w-3.5" /> Completed {selected.completedDate ?? "Pending"}</p>
              <p className="mt-2 flex items-center gap-1 text-muted-foreground"><Wrench className="h-3.5 w-3.5" /> Workshop {selected.workshop ?? "Not assigned"}</p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Details</p>
              <p className="text-muted-foreground">{selected.notes ?? "No additional notes"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={handleAssignBay}>Assign Bay</Button>
              <Button size="sm" variant="outline" onClick={handleNotifyOps}>Notify Ops</Button>
              <Button size="sm" variant="secondary" className="col-span-2" onClick={handleOpenFullHistory}>Open Full History</Button>
            </div>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
