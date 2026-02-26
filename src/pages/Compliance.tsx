import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drivers } from "@/data/mock-data";
import { FileCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default function Compliance() {
  const expiring = drivers.filter(d => d.licenseStatus === "expiring");
  const expired = drivers.filter(d => d.licenseStatus === "expired");
  const valid = drivers.filter(d => d.licenseStatus === "valid");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compliance</h1>
        <p className="text-sm text-muted-foreground">Document status and regulatory compliance</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-fleet-success" /><div><p className="text-2xl font-bold">{valid.length}</p><p className="text-xs text-muted-foreground">Valid Licenses</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-fleet-warning" /><div><p className="text-2xl font-bold">{expiring.length}</p><p className="text-xs text-muted-foreground">Expiring Soon</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><FileCheck className="h-5 w-5 text-fleet-danger" /><div><p className="text-2xl font-bold">{expired.length}</p><p className="text-xs text-muted-foreground">Expired</p></div></CardContent></Card>
      </div>

      {expired.length > 0 && (
        <Card className="border-fleet-danger/30">
          <CardHeader className="pb-2"><CardTitle className="text-base text-fleet-danger">Expired Documents — Immediate Action Required</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {expired.map(d => (
              <div key={d.id} className="flex items-center justify-between p-2 rounded bg-fleet-danger/5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">{d.avatar}</div>
                  <div><p className="text-sm font-medium">{d.name}</p><p className="text-[10px] text-muted-foreground">License: {d.licenseNumber}</p></div>
                </div>
                <Badge className="bg-fleet-danger text-fleet-danger-foreground text-[10px]">Expired {d.licenseExpiry}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {expiring.length > 0 && (
        <Card className="border-fleet-warning/30">
          <CardHeader className="pb-2"><CardTitle className="text-base text-fleet-warning">Expiring Soon</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {expiring.map(d => (
              <div key={d.id} className="flex items-center justify-between p-2 rounded bg-fleet-warning/5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">{d.avatar}</div>
                  <div><p className="text-sm font-medium">{d.name}</p><p className="text-[10px] text-muted-foreground">License: {d.licenseNumber}</p></div>
                </div>
                <Badge className="bg-fleet-warning text-fleet-warning-foreground text-[10px]">Expires {d.licenseExpiry}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
