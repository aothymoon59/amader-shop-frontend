import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type AdminReportsAnalytics,
  useGetAdminReportsAnalyticsQuery,
} from "@/redux/features/reports/dashboardApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  Wallet,
  Activity,
} from "lucide-react";
import { Alert, Spin } from "antd";
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
  YAxis,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

const AdminReports = () => {
  const { data, isLoading, isFetching, isError } =
    useGetAdminReportsAnalyticsQuery();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const analytics = data?.data as AdminReportsAnalytics | undefined;

  const reportCards = [
    {
      title: "Daily Sales",
      value: formatCurrencyAmount(
        analytics?.summary?.dailySales?.value || 0,
        currency,
      ),
      change: Number(analytics?.summary?.dailySales?.change || 0),
      icon: DollarSign,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrencyAmount(
        analytics?.summary?.monthlyRevenue?.value || 0,
        currency,
      ),
      change: Number(analytics?.summary?.monthlyRevenue?.change || 0),
      icon: TrendingUp,
    },
    {
      title: "Orders Today",
      value: String(analytics?.summary?.ordersToday?.value || 0),
      change: Number(analytics?.summary?.ordersToday?.change || 0),
      icon: ShoppingCart,
    },
    {
      title: "Net Profit",
      value: formatCurrencyAmount(
        analytics?.summary?.netProfit?.value || 0,
        currency,
      ),
      change: Number(analytics?.summary?.netProfit?.change || 0),
      icon: Wallet,
    },
  ];

  const weeklySales = analytics?.charts?.weeklySales || [];
  const categoryData = analytics?.charts?.salesByCategory || [];
  const providerPerformance = analytics?.charts?.topProviders || [];
  const growthChange = Number(analytics?.insights?.growthNote?.change || 0);

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

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-primary" />
              {analytics?.periodLabel || "Last 7 days"}
            </div>
            <div className="rounded-lg border bg-background px-4 py-2 text-sm text-muted-foreground">
              Updated{" "}
              {analytics?.generatedAt
                ? new Date(analytics.generatedAt).toLocaleString()
                : "just now"}
            </div>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Alert
            type="error"
            showIcon
            message="Unable to load reports analytics right now."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {reportCards.map((card) => {
                const positive = card.change >= 0;

                return (
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
                          positive
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {positive ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(card.change)}%
                      </span>
                      <span className="text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                );
              })}
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
                  <div
                    className={`rounded-lg px-3 py-1 text-sm font-medium ${
                      growthChange >= 0
                        ? "bg-primary/10 text-primary"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {growthChange >= 0 ? "+" : ""}
                    {growthChange}% growth
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklySales}>
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
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") {
                            return formatCurrencyAmount(Number(value || 0), currency);
                          }

                          return value;
                        }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid hsl(var(--border))",
                          background: "hsl(var(--background))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
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
                    Contribution by product segment this month
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
                      <Tooltip
                        formatter={(value, _name, item) => [
                          `${value}%`,
                          item?.payload?.name || "Share",
                        ]}
                      />
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
                      <YAxis tickFormatter={(value) => `${value}`} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") {
                            return formatCurrencyAmount(Number(value || 0), currency);
                          }

                          return value;
                        }}
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
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.bestSalesDay?.label || "No data yet"}
                    </p>
                    <p className="text-sm text-green-600">
                      Revenue peaked at{" "}
                      {formatCurrencyAmount(
                        analytics?.insights?.bestSalesDay?.revenue || 0,
                        currency,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Top category</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.topCategory?.name || "No data yet"}
                    </p>
                    <p className="text-sm text-primary">
                      {Number(analytics?.insights?.topCategory?.share || 0)}% of total
                      sales share
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Provider leader</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.providerLeader?.name || "No data yet"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrencyAmount(
                        analytics?.insights?.providerLeader?.revenue || 0,
                        currency,
                      )}{" "}
                      monthly revenue
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Growth note</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.growthNote?.title || "No trend available"}
                    </p>
                    <p
                      className={`text-sm ${
                        growthChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {analytics?.insights?.growthNote?.text} ({growthChange >= 0 ? "+" : ""}
                      {growthChange}% vs last month)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
