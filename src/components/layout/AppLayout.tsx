import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/data/mock-data";

export function AppLayout() {
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  return (
    <SidebarProvider>
      <div className="app-root min-h-screen flex w-full">
        <AppSidebar />

        <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="app-bg-orb app-bg-orb-a" aria-hidden="true" />
          <div className="app-bg-orb app-bg-orb-b" aria-hidden="true" />
          <div className="app-bg-orb app-bg-orb-c" aria-hidden="true" />

          <header className="app-topbar relative z-10 h-14 flex items-center justify-between px-3 sm:px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-8 w-8 rounded-lg border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20" />
              <div className="app-search hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 w-64">
                <Search className="h-4 w-4 text-slate-300" />
                <span>Search fleet...</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative rounded-lg border border-white/20 bg-white/10 px-2.5 py-2">
                <Bell className="h-4 w-4 text-slate-200" />
                {unacknowledged > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-fleet-danger text-fleet-danger-foreground border-0">
                    {unacknowledged}
                  </Badge>
                )}
              </div>

              <div className="h-8 w-8 rounded-full border border-white/30 bg-white/15 backdrop-blur-md flex items-center justify-center text-xs font-medium text-slate-100">
                FM
              </div>
            </div>
          </header>

          <main className="app-main relative z-10 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
