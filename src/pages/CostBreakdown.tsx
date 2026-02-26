import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiTile, PageHeader } from "@/components/product";

const costByCategory = [
  { category: "Fuel", cost: 79450 },
  { category: "Maintenance", cost: 23400 },
  { category: "Tires", cost: 12800 },
  { category: "Insurance", cost: 8500 },
  { category: "Tolls", cost: 5200 },
  { category: "Permits", cost: 3100 },
];

const costByRoute = [
  { route: "Accra-Kumasi", cost: 34200 },
  { route: "Tema-Lagos", cost: 28900 },
  { route: "Accra-Lome", cost: 18700 },
  { route: "Kumasi-Tamale", cost: 15400 },
  { route: "Lome-Cotonou", cost: 12300 },
];

const pieColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "#10b981"];

export default function CostBreakdown() {
  const total = useMemo(() => costByCategory.reduce((acc, item) => acc + item.cost, 0), []);

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Finance Intelligence"
        title="Cost Breakdown"
        description="Analyze operational spend by category and route to identify priority optimization targets."
      />

      <section className="metric-grid">
        <KpiTile label="Total Spend" value={`GHS ${total.toLocaleString()}`} detail="Current month" tone="warning" />
        <KpiTile
          label="Largest Category"
          value={costByCategory[0].category}
          detail={`GHS ${costByCategory[0].cost.toLocaleString()}`}
          tone="warning"
        />
        <KpiTile
          label="Highest Route Cost"
          value={costByRoute[0].route}
          detail={`GHS ${costByRoute[0].cost.toLocaleString()}`}
          tone="danger"
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cost by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByCategory} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={92} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="hsl(var(--chart-1))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cost Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costByCategory} dataKey="cost" nameKey="category" cx="50%" cy="50%" outerRadius={96}>
                    {costByCategory.map((entry, index) => (
                      <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Route Cost Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByRoute}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="route" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
