import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { drivers, getVehicleById } from "@/data/mock-data";

const licenseColors: Record<string, string> = {
  valid: "bg-fleet-success text-fleet-success-foreground",
  expiring: "bg-fleet-warning text-fleet-warning-foreground",
  expired: "bg-fleet-danger text-fleet-danger-foreground",
};

export default function Drivers() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Driver Management</h1>
        <p className="text-sm text-muted-foreground">{drivers.length} registered drivers</p>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Behavior Score</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Active Trip</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map(d => {
              const vehicle = d.assignedVehicle ? getVehicleById(d.assignedVehicle) : null;
              return (
                <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">{d.avatar}</div>
                      <span className="text-sm font-medium">{d.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${licenseColors[d.licenseStatus]}`}>{d.licenseStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${d.behaviorScore >= 85 ? "bg-fleet-success" : d.behaviorScore >= 70 ? "bg-fleet-warning" : "bg-fleet-danger"}`} />
                      <span className="text-sm font-medium">{d.behaviorScore}/100</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{vehicle?.registration ?? "—"}</TableCell>
                  <TableCell className="text-sm">{d.activeTrip ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.phone}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
