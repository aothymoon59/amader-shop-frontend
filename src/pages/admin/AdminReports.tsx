import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";

const AdminReports = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Daily Sales", value: "$2,345", icon: DollarSign },
          { title: "Monthly Revenue", value: "$45,231", icon: TrendingUp },
          { title: "Yearly Growth", value: "+24%", icon: BarChart3 },
        ].map((r) => (
          <div key={r.title} className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <r.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{r.title}</span>
            </div>
            <div className="text-3xl font-bold">{r.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6 h-64 flex items-center justify-center text-muted-foreground">
        📊 Chart visualization will appear here
      </div>
    </div>
  </DashboardLayout>
);

export default AdminReports;
