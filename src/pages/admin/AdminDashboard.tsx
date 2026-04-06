import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Download,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    up: true,
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "1,234",
    change: "+8.2%",
    up: true,
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "856",
    change: "+3.1%",
    up: true,
    icon: Package,
  },
  {
    title: "Customers",
    value: "2,456",
    change: "-2.4%",
    up: false,
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    amount: "$125.00",
    status: "Completed",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    amount: "$89.50",
    status: "Processing",
  },
  {
    id: "#ORD-003",
    customer: "Bob Wilson",
    amount: "$234.00",
    status: "Pending",
  },
  {
    id: "#ORD-004",
    customer: "Alice Brown",
    amount: "$67.99",
    status: "Completed",
  },
  {
    id: "#ORD-005",
    customer: "Charlie Davis",
    amount: "$156.00",
    status: "Shipped",
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-500/10 text-green-600 dark:text-green-400",
  Processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Shipped: "bg-primary/10 text-primary",
};

const topProducts = [
  { name: "Rice Bag 25kg", sales: 145, stock: 32 },
  { name: "Cooking Oil 5L", sales: 118, stock: 21 },
  { name: "Soft Drinks Pack", sales: 96, stock: 54 },
  { name: "Biscuits Combo", sales: 84, stock: 19 },
];

const AdminDashboard = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Admin. Here’s what’s happening in your shop today.
          </p>
        </div>
      </div>

      {/* Highlight banner */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Today’s Overview</p>
            <h2 className="mt-1 text-2xl font-bold">
              Your store performance is growing steadily
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Revenue is up this month, order volume remains healthy, and your
              top-selling products continue to perform well.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Today Sales</p>
              <p className="mt-1 text-lg font-bold">$2,340</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">New Orders</p>
              <p className="mt-1 text-lg font-bold">48</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Visitors</p>
              <p className="mt-1 text-lg font-bold">1,204</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
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
                stat.up
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {stat.up ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" />
              )}
              {stat.change}
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent orders */}
        <div className="rounded-2xl border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">
                Latest customer purchases and order statuses
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted">
              <Eye className="h-4 w-4" />
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-right font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/20"
                  >
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4 text-muted-foreground">
                      {order.customer}
                    </td>
                    <td className="p-4 font-semibold">{order.amount}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="rounded-lg p-2 transition hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Quick Summary</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="mt-1 text-2xl font-bold">23</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Low Stock Products
                </p>
                <p className="mt-1 text-2xl font-bold">14</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">New Customers</p>
                <p className="mt-1 text-2xl font-bold">89</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Top Products</h2>
            <div className="mt-4 space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between rounded-xl border bg-background p-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sold • {product.stock} in stock
                    </p>
                  </div>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
