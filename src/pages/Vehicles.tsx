import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { vehicles, getDriverById, type VehicleStatus } from "@/data/mock-data";

const statusBadge: Record<VehicleStatus, string> = {
  moving: "bg-fleet-success text-fleet-success-foreground",
  idle: "bg-fleet-warning text-fleet-warning-foreground",
  stopped: "bg-fleet-danger text-fleet-danger-foreground",
  offline: "bg-muted text-muted-foreground",
};

export default function Vehicles() {
  return (
    <div className="page-shell p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Management</h1>
        <p className="text-sm text-muted-foreground">{vehicles.length} vehicles in fleet</p>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Make / Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map(v => {
              const driver = v.assignedDriver ? getDriverById(v.assignedDriver) : null;
              return (
                <TableRow key={v.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-medium">{v.registration}</TableCell>
                  <TableCell className="text-sm">{v.make} {v.model}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.type}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusBadge[v.status]}`}>{v.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={v.healthScore} className="h-2 w-16" />
                      <span className="text-xs">{v.healthScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{driver?.name ?? "--"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.lastLocation.label}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

