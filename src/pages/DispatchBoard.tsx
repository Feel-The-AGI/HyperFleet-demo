import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trips, getDriverById, getVehicleById, type TripStatus } from "@/data/mock-data";

const columns: { label: string; status: TripStatus; color: string }[] = [
  { label: "Scheduled", status: "scheduled", color: "bg-fleet-info" },
  { label: "In Progress", status: "in_progress", color: "bg-fleet-success" },
  { label: "Completed", status: "completed", color: "bg-muted-foreground" },
];

export default function DispatchBoard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dispatch Board</h1>
        <p className="text-sm text-muted-foreground">Kanban view of all fleet operations</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTrips = trips.filter(t => t.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <h2 className="text-sm font-semibold">{col.label}</h2>
                <Badge variant="secondary" className="text-[10px] ml-auto">{colTrips.length}</Badge>
              </div>
              <div className="space-y-3">
                {colTrips.map(t => {
                  const driver = getDriverById(t.driverId);
                  const vehicle = getVehicleById(t.vehicleId);
                  return (
                    <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-medium">{t.id.toUpperCase()}</span>
                          <span className="text-xs text-muted-foreground">{t.distance} km</span>
                        </div>
                        <p className="text-sm font-medium">{t.origin} → {t.destination}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{driver?.name ?? "Unassigned"}</span>
                          <span>·</span>
                          <span>{vehicle?.registration ?? "—"}</span>
                        </div>
                        {t.status === "in_progress" && (
                          <div className="flex items-center gap-2">
                            <Progress value={t.progress} className="h-1.5 flex-1" />
                            <span className="text-[10px] text-muted-foreground">{t.progress}%</span>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground">{t.cargo}</p>
                      </CardContent>
                    </Card>
                  );
                })}
                {colTrips.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No trips</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
