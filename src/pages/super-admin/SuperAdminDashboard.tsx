import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Shield, Users, Store, BarChart3, ArrowUp } from "lucide-react";

const SuperAdminDashboard = () => (
  <DashboardLayout role="super-admin">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Overview</h1>
        <p className="text-muted-foreground text-sm">Super Admin Dashboard</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: "Total Admins", value: "8", icon: Shield },
          { title: "Total Providers", value: "156", icon: Store },
          { title: "Total Users", value: "2,456", icon: Users },
          { title: "System Health", value: "99.9%", icon: BarChart3 },
        ].map((s) => (
          <div key={s.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.title}</span>
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <s.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">System Activity</h2>
        <div className="space-y-3">
          {[
            { action: "New provider application", time: "2 min ago" },
            { action: "Admin 'Sarah' updated products", time: "15 min ago" },
            { action: "Provider 'EcoWear' approved", time: "1 hour ago" },
            { action: "System backup completed", time: "3 hours ago" },
          ].map((a, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span>{a.action}</span>
              <span className="text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default SuperAdminDashboard;
