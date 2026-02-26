import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { maintenanceItems, getVehicleById } from "@/data/mock-data";

const statusBadge: Record<string, string> = {
  overdue: "bg-fleet-danger text-fleet-danger-foreground",
  scheduled: "bg-fleet-info text-fleet-info-foreground",
  completed: "bg-fleet-success text-fleet-success-foreground",
};

export default function MaintenancePage() {
  return (
    <div className="page-shell p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-sm text-muted-foreground">Vehicle service schedules and history</p>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceItems.map(m => {
              const vehicle = getVehicleById(m.vehicleId);
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{vehicle?.registration ?? "--"}</TableCell>
                  <TableCell className="text-sm">{m.type}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusBadge[m.status]}`}>{m.status}</Badge></TableCell>
                  <TableCell className="text-sm">{m.dueDate}</TableCell>
                  <TableCell className="text-sm">{m.completedDate ?? "--"}</TableCell>
                  <TableCell className="text-sm">{m.cost ? `GHS ${m.cost.toLocaleString()}` : "--"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-48 truncate">{m.notes ?? m.workshop ?? "--"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

