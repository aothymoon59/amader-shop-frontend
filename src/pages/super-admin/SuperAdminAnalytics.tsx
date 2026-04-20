import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AnalyticsDateFilterBar from "@/components/reports/AnalyticsDateFilterBar";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type AnalyticsPeriod,
  type SuperAdminAnalytics as SuperAdminAnalyticsData,
  useGetSuperAdminAnalyticsQuery,
} from "@/redux/features/reports/dashboardApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  DollarSign,
  Store,
  ReceiptText,
  Percent,
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
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const SuperAdminAnalytics = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const [customRange, setCustomRange] = useState({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const { data, isLoading, isFetching, isError } =
    useGetSuperAdminAnalyticsQuery(
      period === "custom" ? { period, ...customRange } : { period },
    );
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const analytics = data?.data as SuperAdminAnalyticsData | undefined;

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatCurrencyAmount(
        Number(analytics?.summary?.totalRevenue?.value || 0),
        currency,
      ),
      icon: DollarSign,
    },
    {
      title: "Active Vendors",
      value: String(analytics?.summary?.activeVendors?.value || 0),
      icon: Store,
    },
    {
      title: "Total Orders",
      value: String(analytics?.summary?.totalOrders?.value || 0),
      icon: ReceiptText,
    },
    {
      title: "Conversion Rate",
      value: `${Number(analytics?.summary?.conversionRate?.value || 0)}%`,
      icon: Percent,
    },
  ];

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Marketplace health, provider approval mix, and payment quality across the platform.
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
            message="Unable to load system analytics right now."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.title} className="rounded-xl border bg-card p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{card.title}</div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <card.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 xl:col-span-2">
                <div className="mb-4">
                    <h2 className="font-semibold">Platform Revenue Trend</h2>
                    <p className="text-sm text-muted-foreground">
                    Paid orders and revenue activity across the selected period.
                    </p>
                  </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.charts?.performance || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") {
                            return formatCurrencyAmount(Number(value || 0), currency);
                          }

                          return value;
                        }}
                      />
                      <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="#bfdbfe" />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="#bbf7d0" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4">
                  <h2 className="font-semibold">Provider Status Mix</h2>
                    <p className="text-sm text-muted-foreground">
                    Distribution of provider approval states in the selected period.
                    </p>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.charts?.providerStatuses || []}
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {(analytics?.charts?.providerStatuses || []).map((entry, index) => (
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
                  {(analytics?.charts?.providerStatuses || []).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 xl:col-span-2">
                <div className="mb-4">
                  <h2 className="font-semibold">Order Status Distribution</h2>
                    <p className="text-sm text-muted-foreground">
                    How orders moved through the system in the selected period.
                    </p>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.charts?.orderStatuses || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4">
                  <h2 className="font-semibold">System Insights</h2>
                  <p className="text-sm text-muted-foreground">
                    Operational highlights from current platform data.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Provider health</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.providerHealth?.approvalRate || 0}% approved
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analytics?.insights?.providerHealth?.pendingApplications || 0} pending,{" "}
                      {analytics?.insights?.providerHealth?.rejectedProviders || 0} rejected
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Best revenue day</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.bestRevenuePoint?.label || "No data yet"}
                    </p>
                    <p className="text-sm text-green-600">
                      {formatCurrencyAmount(
                        Number(analytics?.insights?.bestRevenuePoint?.revenue || 0),
                        currency,
                      )}{" "}
                      from {analytics?.insights?.bestRevenuePoint?.orders || 0} orders
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Top order status</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.topOrderStatus?.name || "No data yet"}
                    </p>
                    <p className="text-sm text-primary">
                      {analytics?.insights?.topOrderStatus?.value || 0} orders in this state
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Payment health</p>
                    <p className="mt-1 text-lg font-semibold">
                      {analytics?.insights?.paymentHealth?.paidOrderRate || 0}% converted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analytics?.insights?.paymentHealth?.paidOrders || 0} paid,{" "}
                      {analytics?.insights?.paymentHealth?.unpaidOrders || 0} unpaid
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

export default SuperAdminAnalytics;
