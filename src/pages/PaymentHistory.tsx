import PublicLayout from "@/components/layouts/PublicLayout";

const payments = [
  { id: "PAY-1001", date: "2026-04-06", method: "Card", amount: "$149.98", status: "Paid" },
  { id: "PAY-0998", date: "2026-04-02", method: "Mobile Banking", amount: "$89.99", status: "Paid" },
  { id: "PAY-0991", date: "2026-03-28", method: "Cash on Delivery", amount: "$214.97", status: "Pending" },
];

const PaymentHistory = () => (
  <PublicLayout>
    <div className="container py-8 lg:py-12 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground mt-2">Review your recent payment activity and statuses.</p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold">{payment.id}</div>
              <div className="text-sm text-muted-foreground">{payment.date} · {payment.method} · {payment.amount}</div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              {payment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </PublicLayout>
);

export default PaymentHistory;
