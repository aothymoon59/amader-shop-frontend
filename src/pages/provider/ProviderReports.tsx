import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const reportStats = [
  {
    title: "Today's Sales",
    value: "$456.00",
    change: "+8.4%",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "This Month",
    value: "$12,450",
    change: "+14.2%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "This Year",
    value: "$89,230",
    change: "+21.1%",
    positive: true,
    icon: Wallet,
  },
  {
    title: "Orders",
    value: "328",
    change: "-2.3%",
    positive: false,
    icon: ShoppingBag,
  },
];

const salesData = [
  { name: "Mon", sales: 120 },
  { name: "Tue", sales: 180 },
  { name: "Wed", sales: 140 },
  { name: "Thu", sales: 220 },
  { name: "Fri", sales: 260 },
  { name: "Sat", sales: 310 },
  { name: "Sun", sales: 240 },
];

const productSales = [
  { name: "Rice Bag", sold: 65 },
  { name: "Cooking Oil", sold: 54 },
  { name: "Snacks Box", sold: 40 },
  { name: "Soft Drinks", sold: 33 },
];

const topProducts = [
  { name: "Rice Bag 25kg", sold: 65, revenue: "$1,950" },
  { name: "Cooking Oil 5L", sold: 54, revenue: "$1,620" },
  { name: "Snacks Box", sold: 40, revenue: "$800" },
  { name: "Soft Drinks Pack", sold: 33, revenue: "$660" },
];

const ProviderReports = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Track your sales, products, and performance overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
            This Week
          </button>
          <button className="rounded-xl border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
            Export Report
          </button>
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Performance Summary
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Your shop is performing well this month
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Sales are growing steadily, your best-selling products are active,
              and revenue trend looks healthy across the current period.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Today Orders</p>
              <p className="mt-1 text-lg font-bold">18</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="mt-1 text-lg font-bold">12</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="mt-1 text-lg font-bold">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportStats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                stat.positive
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {stat.positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {stat.change}
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Weekly Sales Trend</h3>
              <p className="text-sm text-muted-foreground">
                Sales performance over the last 7 days
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              +14.2% growth
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient
                    id="providerSalesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.03}
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
                  fill="url(#providerSalesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
            <p className="text-sm text-muted-foreground">
              Best performers by quantity sold
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--background))",
                  }}
                />
                <Bar
                  dataKey="sold"
                  radius={[10, 10, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {productSales.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.name}</span>
                <span className="font-medium">{item.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h3 className="text-lg font-semibold">Product Performance</h3>
            <p className="text-sm text-muted-foreground">
              Revenue generated by your most popular products
            </p>
          </div>

          <div className="space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between rounded-xl border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sold} items sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.revenue}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold">Quick Insights</h3>
            <p className="text-sm text-muted-foreground">
              Key highlights from your report
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Best sales day</p>
              <p className="mt-1 text-lg font-semibold">Saturday</p>
              <p className="text-sm text-green-600">
                Reached highest weekly sales
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Top product</p>
              <p className="mt-1 text-lg font-semibold">Rice Bag 25kg</p>
              <p className="text-sm text-primary">65 units sold</p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Monthly growth</p>
              <p className="mt-1 text-lg font-semibold">Strong momentum</p>
              <p className="text-sm text-green-600">Sales increased by 14.2%</p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Yearly revenue</p>
              <p className="mt-1 text-lg font-semibold">$89,230</p>
              <p className="text-sm text-muted-foreground">
                Excellent annual performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderReports;
