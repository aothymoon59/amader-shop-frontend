import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DollarSign, Package, ShoppingCart, TrendingUp, ArrowUp } from "lucide-react";

const ProviderDashboard = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, TechStore</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: "Revenue", value: "$12,450", icon: DollarSign, change: "+15%" },
          { title: "Products", value: "45", icon: Package, change: "+3" },
          { title: "Orders", value: "128", icon: ShoppingCart, change: "+12" },
          { title: "Growth", value: "+24%", icon: TrendingUp, change: "vs last month" },
        ].map((s) => (
          <div key={s.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <s.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUp className="h-3 w-3" /> {s.change}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Recent Sales</h2>
        <div className="space-y-3">
          {[
            { product: "Wireless Headphones", amount: "$89.99", time: "2 hours ago" },
            { product: "Smart Speaker", amount: "$129.99", time: "5 hours ago" },
            { product: "USB-C Cable", amount: "$19.99", time: "1 day ago" },
          ].map((sale) => (
            <div key={sale.product} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="font-medium text-sm">{sale.product}</div>
                <div className="text-xs text-muted-foreground">{sale.time}</div>
              </div>
              <span className="font-semibold text-sm">{sale.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderDashboard;
