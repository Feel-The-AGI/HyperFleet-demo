import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { drivers, getVehicleById } from "@/data/mock-data";
import { DataToolbar, FilterChipBar, InspectorPanel, PageHeader, StatusPill } from "@/components/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const statusOrder = ["all", "valid", "expiring", "expired"] as const;

type LicenseFilter = (typeof statusOrder)[number];

const statusTone = {
  valid: "success",
  expiring: "warning",
  expired: "danger",
} as const;

export default function Drivers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<LicenseFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(drivers[0]?.id ?? "");

  useEffect(() => {
    const requestedDriverId = searchParams.get("driver");
    if (!requestedDriverId) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("driver");
    const target = drivers.find((driver) => driver.id === requestedDriverId);

    if (!target) {
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setFilter("all");
    setSearch("");
    setSelectedId(target.id);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const counts = useMemo(
    () => ({
      all: drivers.length,
      valid: drivers.filter((driver) => driver.licenseStatus === "valid").length,
      expiring: drivers.filter((driver) => driver.licenseStatus === "expiring").length,
      expired: drivers.filter((driver) => driver.licenseStatus === "expired").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const pool = filter === "all" ? drivers : drivers.filter((driver) => driver.licenseStatus === filter);
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter((driver) => {
      const vehicle = driver.assignedVehicle ? getVehicleById(driver.assignedVehicle) : null;
      return [driver.name, driver.phone, driver.licenseNumber, vehicle?.registration]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [filter, search]);

  const selected = filtered.find((driver) => driver.id === selectedId) ?? filtered[0] ?? null;
  const selectedVehicle = selected?.assignedVehicle ? getVehicleById(selected.assignedVehicle) : null;

  const handleOpenDriverWorkspace = () => {
    if (!selected) return;

    if (selected.activeTrip) {
      navigate(`/trips?trip=${selected.activeTrip}`);
      return;
    }

    if (selected.assignedVehicle) {
      navigate(`/fleet-map?vehicle=${selected.assignedVehicle}`);
      return;
    }

    toast.info("This driver has no active assignment yet.");
  };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="People Operations"
        title="Driver Management"
        description="Manage license compliance, behavior quality, and active vehicle assignments."
      />

      <FilterChipBar
        items={statusOrder.map((status) => ({ key: status, label: status, count: counts[status] }))}
        active={filter}
        onChange={(value) => setFilter(value as LicenseFilter)}
      />

      <DataToolbar value={search} onChange={setSearch} placeholder="Search by driver, phone, license, registration" />

      <section className="workspace-grid with-inspector">
        <div className="surface-raised rounded-2xl p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Behavior</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Active Trip</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((driver) => {
                const vehicle = driver.assignedVehicle ? getVehicleById(driver.assignedVehicle) : null;
                return (
                  <TableRow
                    key={driver.id}
                    onClick={() => setSelectedId(driver.id)}
                    className={`cursor-pointer ${selected?.id === driver.id ? "bg-accent/65" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {driver.avatar}
                        </span>
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">Joined {driver.joinDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill label={driver.licenseStatus} tone={statusTone[driver.licenseStatus]} className="capitalize" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={driver.behaviorScore} className="h-2.5 w-20" />
                        <span className="text-xs">{driver.behaviorScore}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{vehicle?.registration ?? "--"}</TableCell>
                    <TableCell>{driver.activeTrip ?? "--"}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selected ? (
          <InspectorPanel title={selected.name} subtitle={`License ${selected.licenseNumber}`}>
            <StatusPill label={selected.licenseStatus} tone={statusTone[selected.licenseStatus]} className="capitalize" />

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Driver Profile</p>
              <p className="flex items-center gap-1 text-muted-foreground"><UserRound className="h-3.5 w-3.5" /> Joined {selected.joinDate}</p>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {selected.phone}</p>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Expires {selected.licenseExpiry}</p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Behavior Score</p>
              <Progress value={selected.behaviorScore} className="h-2.5" />
              <p className="mt-2 text-muted-foreground">Current score {selected.behaviorScore}/100</p>
            </div>

            <div className="surface-raised rounded-xl p-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Assignment</p>
              <p className="text-muted-foreground">Vehicle {selectedVehicle?.registration ?? "Unassigned"}</p>
              <p className="text-muted-foreground">Active trip {selected.activeTrip ?? "None"}</p>
            </div>

            {selected.licenseStatus !== "valid" ? (
              <div className="rounded-xl border border-fleet-warning/35 bg-fleet-warning/10 p-3 text-xs text-fleet-warning">
                <p className="flex items-center gap-1 font-semibold"><AlertTriangle className="h-3.5 w-3.5" /> Compliance action required</p>
                <p className="mt-1">Resolve license status before assigning additional long-haul routes.</p>
              </div>
            ) : null}

            <Button className="w-full" onClick={handleOpenDriverWorkspace}>Open Driver Workspace</Button>
          </InspectorPanel>
        ) : null}
      </section>
    </div>
  );
}
