import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Columns3,
  DollarSign,
  FileCheck,
  Fuel,
  LayoutDashboard,
  ListChecks,
  Map,
  Navigation,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { alerts, trips } from "@/data/mock-data";
import { ThemeToggle } from "@/components/ThemeToggle";

const navSections = [
  {
    label: "Operations",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Fleet Map", url: "/fleet-map", icon: Map },
      { title: "Trips", url: "/trips", icon: Navigation },
      { title: "Dispatch Board", url: "/dispatch", icon: Columns3 },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Vehicles", url: "/vehicles", icon: Truck },
      { title: "Drivers", url: "/drivers", icon: Users },
      { title: "Fuel", url: "/fuel", icon: Fuel },
      { title: "Maintenance", url: "/maintenance", icon: Wrench },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "AI Insights", url: "/ai-insights", icon: Brain },
      { title: "Agent Queue", url: "/agent-queue", icon: ListChecks },
      { title: "Alerts", url: "/alerts", icon: AlertTriangle },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Compliance", url: "/compliance", icon: FileCheck },
      { title: "Cost Breakdown", url: "/costs", icon: DollarSign },
    ],
  },
] as const;

const badgeByRoute: Record<string, number> = {
  "/alerts": alerts.filter((alert) => !alert.acknowledged).length,
  "/trips": trips.filter((trip) => trip.status === "delayed").length,
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-transparent">
      <div className="app-sidebar-frame m-2 mb-1 flex h-[calc(100svh-1rem)] flex-col rounded-2xl">
        <div className="mx-2 mt-2 flex h-14 items-center justify-between gap-2 rounded-xl border border-sidebar-border/75 bg-sidebar-accent/45 px-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-4 w-4" />
            </span>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-sidebar-foreground">HyperFleet V2</p>
                <p className="truncate text-[11px] text-sidebar-muted">Emerald control center</p>
              </div>
            ) : null}
          </div>
          {!collapsed ? <ThemeToggle /> : null}
        </div>

        <SidebarContent className="px-2 py-2">
          {navSections.map((section) => (
            <SidebarGroup key={section.label}>
              {!collapsed ? (
                <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
                  {section.label}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.url;
                    const badgeCount = badgeByRoute[item.url];

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="h-9 rounded-xl">
                          <NavLink
                            to={item.url}
                            end
                            className="group flex items-center gap-2 rounded-xl border border-transparent px-2.5 text-sidebar-foreground/95 transition-all"
                            activeClassName="border-primary/35 bg-primary/14 text-primary"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                            {!collapsed && badgeCount ? (
                              <Badge className="ml-auto border-0 bg-fleet-danger text-fleet-danger-foreground text-[10px]">
                                {badgeCount}
                              </Badge>
                            ) : null}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="px-3 py-3">
          <div className="surface-raised rounded-xl p-3 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-2 text-foreground">
              <Activity className="h-3.5 w-3.5 text-fleet-success" />
              <span className="font-semibold">System status</span>
            </div>
            <p>{alerts.length - alerts.filter((alert) => alert.acknowledged).length} active signals in queue.</p>
          </div>
          {collapsed ? (
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          ) : null}
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
