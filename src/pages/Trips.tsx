import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trips, getDriverById, getVehicleById, type TripStatus } from "@/data/mock-data";
import { useState } from "react";

const statusBadge: Record<TripStatus, string> = {
  in_progress: "bg-fleet-success text-fleet-success-foreground",
  scheduled: "bg-fleet-info text-fleet-info-foreground",
  completed: "bg-muted text-muted-foreground",
  delayed: "bg-fleet-warning text-fleet-warning-foreground",
};

export default function Trips() {
  const [filter, setFilter] = useState<TripStatus | "all">("all");
  const filtered = filter === "all" ? trips : trips.filter(t => t.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trip Management</h1>
        <p className="text-sm text-muted-foreground">{trips.length} trips across the fleet</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "in_progress", "scheduled", "completed", "delayed"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
          >
            {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())} ({s === "all" ? trips.length : trips.filter(t => t.status === s).length})
          </button>
        ))}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead className="w-32">Progress</TableHead>
              <TableHead>Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(t => {
              const driver = getDriverById(t.driverId);
              const vehicle = getVehicleById(t.vehicleId);
              return (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{t.id.toUpperCase()}</TableCell>
                  <TableCell className="text-sm">{t.origin} → {t.destination}</TableCell>
                  <TableCell className="text-sm">{driver?.name ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{vehicle?.registration ?? "—"}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusBadge[t.status]}`}>{t.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="text-sm">{t.eta}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={t.progress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">{t.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.cargo}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
