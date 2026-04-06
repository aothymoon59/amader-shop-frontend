import DashboardLayout from "@/components/layouts/DashboardLayout";

const ProviderOrders = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Order</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
          </tr></thead>
          <tbody>
            {[
              { id: "#V-001", product: "Headphones Pro", customer: "John D.", amount: "$89.99", status: "Shipped" },
              { id: "#V-002", product: "Smart Speaker", customer: "Jane S.", amount: "$129.99", status: "Processing" },
              { id: "#V-003", product: "USB-C Cable", customer: "Bob W.", amount: "$19.99", status: "Completed" },
            ].map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.product}</td>
                <td className="p-3 text-muted-foreground">{o.customer}</td>
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

export default ProviderOrders;
