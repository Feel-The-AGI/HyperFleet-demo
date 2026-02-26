import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fuelConsumptionTrend, fuelLogs, getDriverById, getVehicleById } from "@/data/mock-data";
import { DataToolbar, InspectorPanel, KpiTile, PageHeader, StatusPill } from "@/components/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function FuelManagement() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(fuelLogs[0]?.id ?? "");

  const totals = useMemo(() => {
    const litres = fuelConsumptionTrend.reduce((acc, day) => acc + day.litres, 0);
    const cost = fuelConsumptionTrend.reduce((acc, day) => acc + day.cost, 0);
    return {
      litres,
      cost,
      avgPerVehiclePerDay: Math.round(litres / 7 / 25),
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return fuelLogs;
    const q = search.toLowerCase();
    return fuelLogs.filter((log) => {
      const driver = getDriverById(log.driverId);
      const vehicle = getVehicleById(log.vehicleId);
      return [log.station, log.location, log.country, driver?.name, vehicle?.registration, log.currency]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [search]);

  const selected = filtered.find((entry) => entry.id === selectedId) ?? filtered[0] ?? null;
  const driver = selected ? getDriverById(selected.driverId) : null;
  const vehicle = selected ? getVehicleById(selected.vehicleId) : null;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Spend Intelligence"
        title="Fuel Management"
        description="Track multi-country fuel spend, detect anomalies, and keep refueling behavior predictable."
      />

      <section className="metric-grid">
        <KpiTile label="Total Litres" value={`${totals.litres.toLocaleString()} L`} detail="Last 7 days" trend="+3.1%" tone="warning" />
        <KpiTile label="Total Cost" value={`GHS ${totals.cost.toLocaleString()}`} detail="GHS-denominated trend" trend="+4.8%" tone="warning" />
        <KpiTile label="Avg per Vehicle / Day" value={`${totals.avgPerVehiclePerDay} L`} detail="Across 25 vehicles" trend="Stable" tone="neutral" />
      </section>

      <DataToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search by station, city, country, driver, registration"
        rightSlot={<Button size="sm">Export Fuel Sheet</Button>}
      />

      <section className="workspace-grid with-inspector">
        <div className="space-y-4">
          <div className="surface-raised rounded-2xl p-4">
            <p className="mb-2 text-sm font-semibold">Weekly Consumption Profile</p>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fuelConsumptionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="litres" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-raised rounded-2xl p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Litres</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Region</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => {
                  const rowDriver = getDriverById(entry.driverId);
                  const rowVehicle = getVehicleById(entry.vehicleId);

                  return (
                    <TableRow
                      key={entry.id}
                      onClick={() => setSelectedId(entry.id)}
                      className={`cursor-pointer ${selected?.id === entry.id ? "bg-accent/65" : ""}`}
                    >
                      <TableCell>{entry.date}</TableCell>
                      <TableCell className="font-mono text-xs">{rowVehicle?.registration ?? "--"}</TableCell>
                      <TableCell>{rowDriver?.name ?? "--"}</TableCell>
                      <TableCell>{entry.litres} L</TableCell>
                      <TableCell>
                        {entry.currency === "GHS"
                          ? `GHS ${entry.cost.toLocaleString()}`
                          : `${entry.cost.toLocaleString()} ${entry.currency}`}
                      </TableCell>
                      <TableCell>{entry.station}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.location}, {entry.country}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {selected ? (
          <InspectorPanel title={`Fuel Log ${selected.id.toUpperCase()}`} subtitle={`${selected.date} | ${selected.station}`}>
            <StatusPill label={selected.currency} tone={selected.currency === "GHS" ? "success" : "info"} />

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="text-muted-foreground">Vehicle</p>
              <p className="font-semibold">{vehicle?.registration ?? "--"}</p>
              <p className="mt-2 text-muted-foreground">Driver</p>
              <p className="font-semibold">{driver?.name ?? "--"}</p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-semibold">{selected.litres} L</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-semibold">
                  {selected.currency === "GHS"
                    ? `GHS ${selected.cost.toLocaleString()}`
                    : `${selected.cost.toLocaleString()} ${selected.currency}`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Region</span>
                <span className="font-semibold">{selected.location}, {selected.country}</span>
              </div>
            </div>

            <Button className="w-full">Open Fuel Anomaly Check</Button>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
