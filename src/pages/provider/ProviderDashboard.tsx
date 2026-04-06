import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  Store,
  Clock3,
  Wallet,
  Eye,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "$12,450",
    icon: DollarSign,
    change: "+15%",
    note: "from last month",
  },
  {
    title: "Products",
    value: "45",
    icon: Package,
    change: "+3",
    note: "new this month",
  },
  {
    title: "Orders",
    value: "128",
    icon: ShoppingCart,
    change: "+12",
    note: "new orders",
  },
  {
    title: "Growth",
    value: "+24%",
    icon: TrendingUp,
    change: "+6.2%",
    note: "vs last month",
  },
];

const recentSales = [
  {
    product: "Wireless Headphones",
    amount: "$89.99",
    time: "2 hours ago",
    status: "Paid",
  },
  {
    product: "Smart Speaker",
    amount: "$129.99",
    time: "5 hours ago",
    status: "Paid",
  },
  {
    product: "USB-C Cable",
    amount: "$19.99",
    time: "1 day ago",
    status: "Paid",
  },
  {
    product: "Bluetooth Mouse",
    amount: "$34.99",
    time: "1 day ago",
    status: "Pending",
  },
];

const topProducts = [
  { name: "Wireless Headphones", sold: 38, stock: 12 },
  { name: "Smart Speaker", sold: 26, stock: 8 },
  { name: "USB-C Cable", sold: 64, stock: 40 },
];

const statusColors: Record<string, string> = {
  Paid: "bg-green-500/10 text-green-600 dark:text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
};

const ProviderDashboard = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vendor Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, TechStore. Here’s your business performance overview.
          </p>
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Store Summary</p>
            <h2 className="mt-1 text-2xl font-bold">
              Your sales are growing steadily
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Orders are increasing, revenue trend looks healthy, and your top
              products are continuing to perform well this month.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Today Sales</p>
              <p className="mt-1 text-lg font-bold">$456</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Pending Orders</p>
              <p className="mt-1 text-lg font-bold">9</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Active Products</p>
              <p className="mt-1 text-lg font-bold">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
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

            <div className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
              <ArrowUp className="h-3.5 w-3.5" />
              {s.change}
              <span className="text-muted-foreground">{s.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Sales */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent Sales</h2>
              <p className="text-sm text-muted-foreground">
                Latest sales from your store
              </p>
            </div>
            <button className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div
                key={`${sale.product}-${sale.time}`}
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
                        {sale.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-sm">{sale.amount}</div>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[sale.status]}`}
                  >
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side widgets */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Quick Summary</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="mt-1 text-2xl font-bold">$3,280</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Items Low in Stock
                </p>
                <p className="mt-1 text-2xl font-bold">6</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Store Rating</p>
                <p className="mt-1 text-2xl font-bold">4.8/5</p>
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} sold • {product.stock} left
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
                  <p className="font-medium">TechStore</p>
                  <p className="text-xs text-muted-foreground">
                    Store is active and visible
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Payout</p>
                  <p className="text-sm font-semibold">Weekly</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-green-600">
                    Healthy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderDashboard;
