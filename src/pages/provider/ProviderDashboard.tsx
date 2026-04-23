import {
  type ProviderDashboardOverview,
  type ProviderRecentSale,
  type ProviderTopProduct,
  useGetDashboardOverviewQuery,
} from "@/redux/features/reports/dashboardApi";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  Store,
  Clock3,
} from "lucide-react";
import { Spin } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusColors: Record<string, string> = {
  Paid: "bg-green-500/10 text-green-600",
  PENDING: "bg-yellow-500/10 text-yellow-600",
  PROCESSING: "bg-blue-500/10 text-blue-600",
  DELIVERED: "bg-green-500/10 text-green-600",
};

const ProviderDashboard = () => {
  const { data, isLoading, isFetching } = useGetDashboardOverviewQuery();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const overview = data?.data as ProviderDashboardOverview | undefined;

  const stats = [
    {
      title: "Revenue",
      value: formatCurrencyAmount(Number(overview?.stats?.revenue?.value || 0), currency),
      icon: DollarSign,
      change: Number(overview?.stats?.revenue?.change || 0),
      note: "from last month",
    },
    {
      title: "Products",
      value: String(overview?.stats?.products?.value || 0),
      icon: Package,
      change: Number(overview?.stats?.products?.change || 0),
      note: "new this month",
    },
    {
      title: "Orders",
      value: String(overview?.stats?.orders?.value || 0),
      icon: ShoppingCart,
      change: Number(overview?.stats?.orders?.change || 0),
      note: "new orders",
    },
    {
      title: "Growth",
      value: `${Number(overview?.stats?.growth?.value || 0).toFixed(1)}%`,
      icon: TrendingUp,
      change: Number(overview?.stats?.growth?.change || 0),
      note: "vs last month",
    },
  ];

  return (
    
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {overview?.profile?.shopName || "Provider"}. Here&apos;s your business performance overview.
            </p>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Store Summary</p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {overview?.spotlight?.summaryTitle || "Your sales are growing steadily"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {overview?.spotlight?.summaryText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Today Sales</p>
                    <p className="mt-1 text-lg font-bold">
                      {formatCurrencyAmount(Number(overview?.spotlight?.todaySales || 0), currency)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Pending Orders</p>
                    <p className="mt-1 text-lg font-bold">{overview?.spotlight?.pendingOrders || 0}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Active Products</p>
                    <p className="mt-1 text-lg font-bold">{overview?.spotlight?.activeProducts || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.title}</p>
                      <h3 className="mt-2 text-3xl font-bold">{s.value}</h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                    <ArrowUp className="h-3.5 w-3.5" />
                    {Math.abs(s.change)}%
                    <span className="text-muted-foreground">{s.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Recent Sales</h2>
                    <p className="text-sm text-muted-foreground">
                      Latest sales from your store
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(overview?.recentSales || []).map((sale: ProviderRecentSale) => (
                    <div
                      key={`${sale.id}-${sale.createdAt}`}
                      className="flex items-center justify-between rounded-xl border bg-background p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{sale.product}</div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {new Date(sale.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {formatCurrencyAmount(Number(sale.amount || 0), currency)}
                        </div>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[sale.status] || "bg-muted text-foreground"}`}
                        >
                          {sale.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h2 className="font-semibold">Quick Summary</h2>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Wallet Balance</p>
                      <p className="mt-1 text-2xl font-bold">
                        {formatCurrencyAmount(Number(overview?.quickSummary?.walletBalance || 0), currency)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Pending Balance</p>
                      <p className="mt-1 text-2xl font-bold">
                        {formatCurrencyAmount(Number(overview?.quickSummary?.pendingBalance || 0), currency)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Items Low in Stock</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.quickSummary?.itemsLowInStock || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h2 className="font-semibold">Top Products</h2>
                  <div className="mt-4 space-y-4">
                    {(overview?.charts?.topProducts || []).map((product: ProviderTopProduct) => (
                      <div
                        key={product.name}
                        className="flex items-center justify-between rounded-xl border bg-background p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.sold} sold | {product.stock} left
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h2 className="font-semibold">Store Status</h2>
                  <div className="mt-4 rounded-xl border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{overview?.profile?.shopName || "Store"}</p>
                        <p className="text-xs text-muted-foreground">
                          {overview?.profile?.isActive ? "Store is active and visible" : "Store access is limited"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Payout</p>
                        <p className="text-sm font-semibold">On Request</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-semibold text-green-600">
                          {overview?.profile?.status || "PENDING"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold">7 Day Sales Trend</h2>
                <p className="text-sm text-muted-foreground">
                  Sales and order volume over the last seven days.
                </p>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview?.charts?.performance || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#0f766e" fill="#99f6e4" />
                    <Area type="monotone" dataKey="orders" stroke="#f59e0b" fill="#fde68a" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    
  );
};

export default ProviderDashboard;
