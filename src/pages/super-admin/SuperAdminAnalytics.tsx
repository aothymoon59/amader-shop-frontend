import DashboardLayout from "@/components/layouts/DashboardLayout";

const SuperAdminAnalytics = () => (
  <DashboardLayout role="super-admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Total Revenue", value: "$234,567" },
          { title: "Active Vendors", value: "156" },
          { title: "Total Orders", value: "12,345" },
          { title: "Conversion Rate", value: "3.2%" },
        ].map((m) => (
          <div key={m.title} className="rounded-xl border bg-card p-6">
            <div className="text-sm text-muted-foreground mb-1">{m.title}</div>
            <div className="text-3xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6 h-64 flex items-center justify-center text-muted-foreground">
        📊 System-wide analytics chart
      </div>
    </div>
  </DashboardLayout>
);

export default SuperAdminAnalytics;
