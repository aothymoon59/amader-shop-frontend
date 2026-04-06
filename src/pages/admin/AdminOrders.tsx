import DashboardLayout from "@/components/layouts/DashboardLayout";

const AdminOrders = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Order</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#001", customer: "John Doe", date: "2026-04-05", amount: "$125.00", status: "Completed" },
              { id: "#002", customer: "Jane Smith", date: "2026-04-04", amount: "$89.50", status: "Processing" },
              { id: "#003", customer: "Bob Wilson", date: "2026-04-03", amount: "$234.00", status: "Pending" },
            ].map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3 text-muted-foreground">{o.date}</td>
                <td className="p-3 font-medium">{o.amount}</td>
                <td className="p-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminOrders;
