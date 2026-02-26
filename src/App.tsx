import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const FleetMap = lazy(() => import("./pages/FleetMap"));
const Trips = lazy(() => import("./pages/Trips"));
const DispatchBoard = lazy(() => import("./pages/DispatchBoard"));
const Vehicles = lazy(() => import("./pages/Vehicles"));
const Drivers = lazy(() => import("./pages/Drivers"));
const FuelManagement = lazy(() => import("./pages/FuelManagement"));
const MaintenancePage = lazy(() => import("./pages/Maintenance"));
const AIInsights = lazy(() => import("./pages/AIInsights"));
const AgentQueue = lazy(() => import("./pages/AgentQueue"));
const AlertsPage = lazy(() => import("./pages/Alerts"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Compliance = lazy(() => import("./pages/Compliance"));
const CostBreakdown = lazy(() => import("./pages/CostBreakdown"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="page-shell">
      <div className="surface-raised rounded-2xl p-5">
        <Skeleton className="mb-4 h-6 w-60" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fleet-map" element={<FleetMap />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/dispatch" element={<DispatchBoard />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/fuel" element={<FuelManagement />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/agent-queue" element={<AgentQueue />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/costs" element={<CostBreakdown />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
