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
  ChevronLeft,
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
  SidebarTrigger,
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
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <Zap className="h-6 w-6 text-sidebar-primary shrink-0" />
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-sidebar-accent-foreground">
            HyperFleet
          </span>
        )}
      </div>

      <SidebarContent className="pt-2 scrollbar-thin">
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-muted font-semibold px-4">
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
                      >
                        <NavLink
                          to={item.url}
                          end
                          className="hover:bg-sidebar-accent/50"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
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
