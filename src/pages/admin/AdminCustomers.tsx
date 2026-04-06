import DashboardLayout from "@/components/layouts/DashboardLayout";

const AdminCustomers = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Orders</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Spent</th>
          </tr></thead>
          <tbody>
            {[
              { name: "John Doe", email: "john@example.com", orders: 12, spent: "$1,234" },
              { name: "Jane Smith", email: "jane@example.com", orders: 8, spent: "$867" },
              { name: "Bob Wilson", email: "bob@example.com", orders: 23, spent: "$3,456" },
            ].map((c) => (
              <tr key={c.email} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3">{c.orders}</td>
                <td className="p-3 font-medium">{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminCustomers;
