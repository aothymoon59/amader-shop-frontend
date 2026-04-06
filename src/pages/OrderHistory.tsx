import PublicLayout from "@/components/layouts/PublicLayout";

const orders = [
  { id: "#ORD-1001", date: "2026-04-06", items: 2, total: "$149.98", status: "Shipped" },
  { id: "#ORD-0998", date: "2026-04-02", items: 1, total: "$89.99", status: "Delivered" },
  { id: "#ORD-0991", date: "2026-03-28", items: 3, total: "$214.97", status: "Processing" },
];

const OrderHistory = () => (
  <PublicLayout>
    <div className="container py-8 lg:py-12 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-muted-foreground mt-2">Track your past and current marketplace orders.</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold">{order.id}</div>
              <div className="text-sm text-muted-foreground">{order.date} · {order.items} items · {order.total}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </PublicLayout>
);

export default OrderHistory;
