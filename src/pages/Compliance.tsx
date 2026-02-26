import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, FileWarning } from "lucide-react";
import { drivers } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiTile, PageHeader, StatusPill } from "@/components/product";
import { Button } from "@/components/ui/button";

export default function Compliance() {
  const valid = useMemo(() => drivers.filter((driver) => driver.licenseStatus === "valid"), []);
  const expiring = useMemo(() => drivers.filter((driver) => driver.licenseStatus === "expiring"), []);
  const expired = useMemo(() => drivers.filter((driver) => driver.licenseStatus === "expired"), []);

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Regulatory Readiness"
        title="Compliance Workspace"
        description="Identify immediate documentation risk and clear expiring credentials before dispatch impact."
      />

      <section className="metric-grid">
        <KpiTile label="Valid Licenses" value={valid.length} detail="Fully compliant drivers" tone="positive" icon={CheckCircle2} />
        <KpiTile label="Expiring Soon" value={expiring.length} detail="Needs renewal scheduling" tone="warning" icon={AlertTriangle} />
        <KpiTile label="Expired" value={expired.length} detail="Immediate assignment block" tone="danger" icon={FileWarning} />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Immediate Action Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expired.length ? (
              expired.map((driver) => (
                <div key={driver.id} className="surface-raised rounded-xl border border-fleet-danger/25 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">License {driver.licenseNumber}</p>
                    </div>
                    <StatusPill label="expired" tone="danger" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Expired on {driver.licenseExpiry}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No expired licenses detected.</p>
            )}
            <Button className="w-full">Start Renewal Workflow</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Renewal Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiring.length ? (
              expiring.map((driver) => (
                <div key={driver.id} className="surface-raised rounded-xl border border-fleet-warning/25 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">License {driver.licenseNumber}</p>
                    </div>
                    <StatusPill label="expiring" tone="warning" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Expires on {driver.licenseExpiry}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming renewals in this cycle.</p>
            )}
            <Button variant="outline" className="w-full">Notify Drivers</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
