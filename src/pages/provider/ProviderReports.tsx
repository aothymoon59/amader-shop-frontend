import { useState } from "react";
import AnalyticsDateFilterBar from "@/components/reports/AnalyticsDateFilterBar";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type AnalyticsPeriod,
  type ProviderReportsAnalytics,
  useGetProviderReportsAnalyticsQuery,
} from "@/redux/features/reports/dashboardApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUp,
  ArrowDown,
  Package,
  ReceiptText,
  Activity,
} from "lucide-react";
import { Alert, Spin } from "antd";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
  YAxis,
} from "recharts";

const ProviderReports = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const [customRange, setCustomRange] = useState({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const { data, isLoading, isFetching, isError } =
    useGetProviderReportsAnalyticsQuery(
      period === "custom" ? { period, ...customRange } : { period },
    );
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const analytics = data?.data as ProviderReportsAnalytics | undefined;

  const reportStats = [
    {
      title: "Sales",
      value: formatCurrencyAmount(
        Number(analytics?.summary?.sales?.value || 0),
        currency,
      ),
      change: Number(analytics?.summary?.sales?.change || 0),
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: String(analytics?.summary?.orders?.value || 0),
      change: Number(analytics?.summary?.orders?.change || 0),
      icon: TrendingUp,
    },
    {
      title: "Avg. Order Value",
      value: formatCurrencyAmount(
        Number(analytics?.summary?.averageOrderValue?.value || 0),
        currency,
      ),
      change: Number(analytics?.summary?.averageOrderValue?.change || 0),
      icon: ReceiptText,
    },
    {
      title: "Items Sold",
      value: String(analytics?.summary?.itemsSold?.value || 0),
      change: Number(analytics?.summary?.itemsSold?.change || 0),
      icon: Wallet,
    },
  ];

  const growthChange = Number(analytics?.insights?.growthNote?.change || 0);

  return (
    
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Deeper sales analytics for {analytics?.profile?.shopName || "your store"} beyond the dashboard snapshot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AnalyticsDateFilterBar
              period={period}
              onPeriodChange={setPeriod}
              startDate={customRange.startDate}
              endDate={customRange.endDate}
              onRangeChange={setCustomRange}
            />
            <div className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-primary" />
              {analytics?.periodLabel || "Current period"}
            </div>
            <div className="rounded-xl border bg-background px-4 py-2 text-sm text-muted-foreground">
              Updated{" "}
              {analytics?.generatedAt
                ? new Date(analytics.generatedAt).toLocaleString()
                : "just now"}
            </div>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Alert
            type="error"
            showIcon
            message="Unable to load vendor reports right now."
          />
        ) : (
          <>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Performance Summary
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {analytics?.banner?.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {analytics?.banner?.text}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Orders In Range</p>
                    <p className="mt-1 text-lg font-bold">
                      {analytics?.banner?.ordersInRange || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="mt-1 text-lg font-bold">
                      {analytics?.banner?.deliveredOrders || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="mt-1 text-lg font-bold">
                      {analytics?.banner?.pendingOrders || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {reportStats.map((stat) => {
                const positive = stat.change >= 0;

                return (
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
                        positive
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {positive ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(stat.change)}%
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
                    <h3 className="text-lg font-semibold">Weekly Sales Trend</h3>
                    <p className="text-sm text-muted-foreground">
                      Sales performance over the selected period
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
                    <AreaChart data={analytics?.charts?.performance || []}>
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
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "sales") {
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
                      Best performers by quantity sold in the selected period
                    </p>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.charts?.topProductsByQuantity || []}>
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
                  {(analytics?.charts?.topProductsByQuantity || []).map((item) => (
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

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold">Product Performance</h3>
                    <p className="text-sm text-muted-foreground">
                    Revenue generated by your strongest products in the selected period
                    </p>
                </div>

                <div className="space-y-4">
                  {(analytics?.charts?.topProductsByRevenue || []).map((product) => (
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
                        <p className="font-semibold">
                          {formatCurrencyAmount(Number(product.revenue || 0), currency)}
                        </p>
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
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.bestSalesPoint?.label || "No data yet"}
                    </p>
                    <p className="text-sm text-green-600">
                      Reached{" "}
                      {formatCurrencyAmount(
                        Number(analytics?.insights?.bestSalesPoint?.sales || 0),
                        currency,
                      )}{" "}
                      in sales
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Top product</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.topProduct?.name || "No data yet"}
                    </p>
                    <p className="text-sm text-primary">
                      {analytics?.insights?.topProduct?.sold || 0} units sold
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
                      {analytics?.insights?.growthNote?.text}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Fulfillment</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.fulfillment?.rate || 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analytics?.insights?.fulfillment?.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    
  );
};

export default ProviderReports;
