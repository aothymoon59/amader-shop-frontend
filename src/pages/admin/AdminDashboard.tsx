import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TrendingUp, ShoppingCart, Package, Users, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$45,231", change: "+12.5%", up: true, icon: DollarSign },
  { title: "Orders", value: "1,234", change: "+8.2%", up: true, icon: ShoppingCart },
  { title: "Products", value: "856", change: "+3.1%", up: true, icon: Package },
  { title: "Customers", value: "2,456", change: "-2.4%", up: false, icon: Users },
];

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", amount: "$125.00", status: "Completed" },
  { id: "#ORD-002", customer: "Jane Smith", amount: "$89.50", status: "Processing" },
  { id: "#ORD-003", customer: "Bob Wilson", amount: "$234.00", status: "Pending" },
  { id: "#ORD-004", customer: "Alice Brown", amount: "$67.99", status: "Completed" },
  { id: "#ORD-005", customer: "Charlie Davis", amount: "$156.00", status: "Shipped" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  Processing: "bg-info/10 text-info",
  Pending: "bg-warning/10 text-warning",
  Shipped: "bg-primary/10 text-primary",
};

const AdminDashboard = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${stat.up ? "text-success" : "text-destructive"}`}>
              {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{order.id}</td>
                  <td className="p-3 text-muted-foreground">{order.customer}</td>
                  <td className="p-3 font-medium">{order.amount}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
