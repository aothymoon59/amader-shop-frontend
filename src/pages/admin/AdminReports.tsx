import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const salesData = [
  { name: "Mon", sales: 1200, orders: 32 },
  { name: "Tue", sales: 1800, orders: 41 },
  { name: "Wed", sales: 1400, orders: 36 },
  { name: "Thu", sales: 2200, orders: 52 },
  { name: "Fri", sales: 2600, orders: 61 },
  { name: "Sat", sales: 3100, orders: 74 },
  { name: "Sun", sales: 2400, orders: 57 },
];

const categoryData = [
  { name: "Groceries", value: 42 },
  { name: "Beverages", value: 26 },
  { name: "Snacks", value: 18 },
  { name: "Household", value: 14 },
];

const providerPerformance = [
  { name: "Provider A", revenue: 12400 },
  { name: "Provider B", revenue: 9800 },
  { name: "Provider C", revenue: 7600 },
  { name: "Provider D", revenue: 5400 },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

const reportCards = [
  {
    title: "Daily Sales",
    value: "$2,345",
    change: "+12.4%",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+18.2%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Orders Today",
    value: "324",
    change: "+8.1%",
    positive: true,
    icon: ShoppingCart,
  },
  {
    title: "Net Profit",
    value: "$8,420",
    change: "-2.3%",
    positive: false,
    icon: Wallet,
  },
];

const AdminReports = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor revenue, sales performance, providers, and product trends.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition">
              This Week
            </button>
            <button className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${
                    card.positive
                      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {card.positive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {card.change}
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Weekly Sales Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Revenue trend across the last 7 days
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                +16.8% growth
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="currentColor"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="currentColor"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#salesFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Sales by Category</h3>
              <p className="text-sm text-muted-foreground">
                Contribution by product segment
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {categoryData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">
                Top Provider Performance
              </h3>
              <p className="text-sm text-muted-foreground">
                Highest revenue-generating providers this month
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerPerformance}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    radius={[10, 10, 0, 0]}
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Quick Insights</h3>
              <p className="text-sm text-muted-foreground">
                Key highlights from current data
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Best sales day</p>
                <p className="mt-1 text-lg font-semibold">Saturday</p>
                <p className="text-sm text-green-600">
                  Revenue peaked at $3,100
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Top category</p>
                <p className="mt-1 text-lg font-semibold">Groceries</p>
                <p className="text-sm text-primary">42% of total sales share</p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Provider leader</p>
                <p className="mt-1 text-lg font-semibold">Provider A</p>
                <p className="text-sm text-muted-foreground">
                  $12,400 monthly revenue
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Growth note</p>
                <p className="mt-1 text-lg font-semibold">
                  Monthly trend is healthy
                </p>
                <p className="text-sm text-green-600">
                  Revenue increased 18.2% compared to last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
