import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const costByCategory = [
  { category: "Fuel", cost: 79450 },
  { category: "Maintenance", cost: 23400 },
  { category: "Tyres", cost: 12800 },
  { category: "Insurance", cost: 8500 },
  { category: "Tolls & Fees", cost: 5200 },
  { category: "Permits", cost: 3100 },
];

const costByRoute = [
  { route: "Accra–Kumasi", cost: 34200 },
  { route: "Tema–Lagos", cost: 28900 },
  { route: "Accra–Lomé", cost: 18700 },
  { route: "Kumasi–Tamale", cost: 15400 },
  { route: "Lomé–Cotonou", cost: 12300 },
];

const COLORS = ["hsl(210, 80%, 55%)", "hsl(152, 60%, 40%)", "hsl(36, 90%, 50%)", "hsl(280, 60%, 55%)", "hsl(0, 72%, 51%)", "hsl(180, 50%, 45%)"];

export default function CostBreakdown() {
  const total = costByCategory.reduce((a, c) => a + c.cost, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cost Breakdown</h1>
        <p className="text-sm text-muted-foreground">Operational cost analysis — ₵{total.toLocaleString()} total this month</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Cost by Category</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ cost: { label: "Cost (GHS)", color: "hsl(var(--chart-1))" } }} className="h-[260px] w-full">
              <BarChart data={costByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={80} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cost" fill="var(--color-cost)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Cost by Route</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ cost: { label: "Cost (GHS)", color: "hsl(var(--chart-2))" } }} className="h-[260px] w-full">
              <BarChart data={costByRoute}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="route" className="text-[10px]" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
