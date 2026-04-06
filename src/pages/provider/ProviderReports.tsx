import DashboardLayout from "@/components/layouts/DashboardLayout";

const ProviderReports = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Today's Sales", value: "$456.00" },
          { title: "This Month", value: "$12,450" },
          { title: "This Year", value: "$89,230" },
        ].map((r) => (
          <div key={r.title} className="rounded-xl border bg-card p-6 text-center">
            <div className="text-sm text-muted-foreground mb-1">{r.title}</div>
            <div className="text-3xl font-bold text-primary">{r.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6 h-64 flex items-center justify-center text-muted-foreground">
        📊 Sales chart visualization
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderReports;
