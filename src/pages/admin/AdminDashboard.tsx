import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  type AdminDashboardOverview,
  type AdminRecentOrder,
  type AdminTopProduct,
  useGetDashboardOverviewQuery,
} from "@/redux/features/reports/dashboardApi";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Package2,
} from "lucide-react";
import { Spin } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-500/10 text-green-600",
  PROCESSING: "bg-blue-500/10 text-blue-600",
  PENDING: "bg-yellow-500/10 text-yellow-600",
  SHIPPED: "bg-primary/10 text-primary",
  CONFIRMED: "bg-cyan-500/10 text-cyan-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

const AdminDashboard = () => {
  const { data, isLoading, isFetching } = useGetDashboardOverviewQuery();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const overview = data?.data as AdminDashboardOverview | undefined;

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrencyAmount(
        Number(overview?.stats?.totalRevenue?.value || 0),
        currency,
      ),
      change: Number(overview?.stats?.totalRevenue?.change || 0),
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: String(overview?.stats?.orders?.value || 0),
      change: Number(overview?.stats?.orders?.change || 0),
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: String(overview?.stats?.products?.value || 0),
      change: Number(overview?.stats?.products?.change || 0),
      icon: Package,
    },
    {
      title: "Customers",
      value: String(overview?.stats?.customers?.value || 0),
      change: Number(overview?.stats?.customers?.change || 0),
      icon: Users,
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Admin. Here&apos;s what&apos;s happening in your shop today.
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
                  <p className="text-sm font-medium text-primary">Today&apos;s Overview</p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {overview?.spotlight?.summaryTitle || "Your store performance is growing steadily"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {overview?.spotlight?.summaryText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Today Sales</p>
                    <p className="mt-1 text-lg font-bold">
                      {formatCurrencyAmount(
                        Number(overview?.spotlight?.todaySales || 0),
                        currency,
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">New Orders</p>
                    <p className="mt-1 text-lg font-bold">
                      {overview?.spotlight?.newOrders || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Visitors</p>
                    <p className="mt-1 text-lg font-bold">
                      {overview?.spotlight?.visitors || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
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
                      stat.change >= 0
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {stat.change >= 0 ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(stat.change)}%
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border bg-card shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b p-5">
                  <div>
                    <h2 className="font-semibold">Recent Orders</h2>
                    <p className="text-sm text-muted-foreground">
                      Latest customer purchases and order statuses
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="p-4 text-left font-medium text-muted-foreground">Order ID</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Customer</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Amount</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overview?.recentOrders || []).map((order: AdminRecentOrder) => (
                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="p-4 font-medium">{order.orderNumber}</td>
                          <td className="p-4 text-muted-foreground">{order.customerName}</td>
                          <td className="p-4 font-semibold">
                            {formatCurrencyAmount(Number(order.totalAmount || 0), currency)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || "bg-muted text-foreground"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h2 className="font-semibold">Quick Summary</h2>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Pending Orders</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.quickSummary?.pendingOrders || 0}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Low Stock Products</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.quickSummary?.lowStockProducts || 0}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">New Customers</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.quickSummary?.newCustomers || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h2 className="font-semibold">Top Products</h2>
                  <div className="mt-4 space-y-4">
                    {(overview?.charts?.topProducts || []).map((product: AdminTopProduct) => (
                      <div
                        key={product.name}
                        className="flex items-center justify-between rounded-xl border bg-background p-3"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.quantitySold} sold | {product.stock} in stock
                          </p>
                        </div>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold">7 Day Performance</h2>
                <p className="text-sm text-muted-foreground">
                  Revenue and order volume for the last seven days.
                </p>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.charts?.performance || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#0f766e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
