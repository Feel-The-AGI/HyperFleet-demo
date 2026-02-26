import {
  LayoutDashboard,
  Map,
  Navigation,
  Columns3,
  Truck,
  Users,
  Fuel,
  Wrench,
  Brain,
  ListChecks,
  AlertTriangle,
  BarChart3,
  FileCheck,
  DollarSign,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-transparent">
      <div className="mx-2 mt-2 flex h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 shadow-[0_10px_28px_rgba(2,6,23,0.28)] backdrop-blur-xl">
        <Zap className="h-5 w-5 text-cyan-300 shrink-0" />
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-slate-100">
            HyperFleet
          </span>
        )}
      </div>

      <SidebarContent className="pt-3 px-1 scrollbar-thin">
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-slate-300/70 font-semibold px-3">
                {section.label}
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-lg"
                      >
                        <NavLink
                          to={item.url}
                          end
                          className="rounded-lg border border-transparent text-slate-200/90 transition-all hover:border-white/25 hover:bg-white/10"
                          activeClassName="border-white/35 bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
    </Sidebar>
  );
}
