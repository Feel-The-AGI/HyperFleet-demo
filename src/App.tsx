import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import FleetMap from "./pages/FleetMap";
import Trips from "./pages/Trips";
import DispatchBoard from "./pages/DispatchBoard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import FuelManagement from "./pages/FuelManagement";
import MaintenancePage from "./pages/Maintenance";
import AIInsights from "./pages/AIInsights";
import AgentQueue from "./pages/AgentQueue";
import AlertsPage from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Compliance from "./pages/Compliance";
import CostBreakdown from "./pages/CostBreakdown";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
