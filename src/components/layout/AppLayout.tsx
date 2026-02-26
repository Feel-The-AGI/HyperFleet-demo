import { Outlet, useLocation } from "react-router-dom";
import { Bell, Command, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/data/mock-data";
import { ThemeToggle } from "@/components/ThemeToggle";

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Operations", subtitle: "Live control center" },
  "/fleet-map": { title: "Fleet Map", subtitle: "Live geospatial tracking" },
  "/trips": { title: "Trips", subtitle: "Dispatch execution and ETA control" },
  "/dispatch": { title: "Dispatch Board", subtitle: "Workload and lane orchestration" },
  "/vehicles": { title: "Vehicles", subtitle: "Asset status and utilization" },
  "/drivers": { title: "Drivers", subtitle: "Compliance and behavior" },
  "/fuel": { title: "Fuel", subtitle: "Consumption, spend, and anomaly watch" },
  "/maintenance": { title: "Maintenance", subtitle: "Service risk and due workflows" },
  "/ai-insights": { title: "AI Insights", subtitle: "Agent intelligence workspace" },
  "/agent-queue": { title: "Agent Queue", subtitle: "Proposal triage" },
  "/alerts": { title: "Alerts", subtitle: "Incident inbox" },
  "/analytics": { title: "Analytics", subtitle: "Operational report library" },
  "/compliance": { title: "Compliance", subtitle: "Regulatory readiness" },
  "/costs": { title: "Cost Breakdown", subtitle: "Spend attribution" },
};

export function AppLayout() {
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? { title: "HyperFleet", subtitle: "Fleet intelligence" };
  const unacknowledged = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <SidebarProvider>
      <div className="app-shell flex w-full">
        <AppSidebar />

        <div className="min-w-0 flex-1">
          <header className="app-topbar flex h-[4.25rem] items-center gap-3 px-3 sm:px-5">
            <SidebarTrigger className="h-9 w-9 rounded-lg border border-border/90 bg-background/70" />

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold">{meta.title}</p>
              <p className="truncate text-xs text-muted-foreground">{meta.subtitle}</p>
            </div>

            <div className="command-pill ml-auto hidden lg:flex">
              <Search className="h-3.5 w-3.5" />
              <span className="truncate">Search fleet, drivers, vehicles, trips...</span>
              <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px]">Ctrl+K</span>
            </div>

            <button
              type="button"
              className="surface-raised grid h-9 w-9 place-items-center rounded-lg"
              aria-label="Command palette"
              title="Command palette"
            >
              <Command className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="surface-raised relative grid h-9 w-9 place-items-center rounded-lg"
              aria-label="Alerts"
              title="Alerts"
            >
              <Bell className="h-4 w-4" />
              {unacknowledged > 0 ? (
                <Badge className="absolute -right-2 -top-2 h-4 min-w-4 justify-center rounded-full border-0 bg-fleet-danger px-1 text-[10px] text-fleet-danger-foreground">
                  {unacknowledged}
                </Badge>
              ) : null}
            </button>

            <ThemeToggle />

            <div className="surface-raised hidden items-center gap-2 rounded-lg px-2.5 py-1.5 sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">FM</span>
              <div className="text-xs leading-tight">
                <p className="font-semibold">Fleet Manager</p>
                <p className="text-muted-foreground">Operations</p>
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100svh-4.25rem)]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
