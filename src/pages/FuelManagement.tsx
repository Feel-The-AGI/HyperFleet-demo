import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fuelLogs, getDriverById, getVehicleById, fuelConsumptionTrend } from "@/data/mock-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function FuelManagement() {
  return (
    <div className="page-shell p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fuel Management</h1>
        <p className="text-sm text-muted-foreground">Fleet fuel consumption and cost tracking</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Litres (Week)</p><p className="text-2xl font-bold">{fuelConsumptionTrend.reduce((a, d) => a + d.litres, 0).toLocaleString()} L</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Cost (GHS)</p><p className="text-2xl font-bold">â‚µ{fuelConsumptionTrend.reduce((a, d) => a + d.cost, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg per Vehicle/Day</p><p className="text-2xl font-bold">{Math.round(fuelConsumptionTrend.reduce((a, d) => a + d.litres, 0) / 7 / 25)} L</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Weekly Consumption</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ litres: { label: "Litres", color: "hsl(var(--chart-1))" } }} className="h-[220px] w-full">
            <BarChart data={fuelConsumptionTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="litres" fill="var(--color-litres)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Litres</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fuelLogs.map(f => {
              const driver = getDriverById(f.driverId);
              const vehicle = getVehicleById(f.vehicleId);
              return (
                <TableRow key={f.id}>
                  <TableCell className="text-sm">{f.date}</TableCell>
                  <TableCell className="font-mono text-xs">{vehicle?.registration ?? "â€”"}</TableCell>
                  <TableCell className="text-sm">{driver?.name ?? "â€”"}</TableCell>
                  <TableCell className="text-sm font-medium">{f.litres} L</TableCell>
                  <TableCell className="text-sm">{f.currency === "GHS" ? "â‚µ" : ""}{f.cost.toLocaleString()} {f.currency}</TableCell>
                  <TableCell className="text-sm">{f.station}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.location}, {f.country}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

