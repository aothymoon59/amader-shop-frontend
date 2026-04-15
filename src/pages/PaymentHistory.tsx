import PublicLayout from "@/components/layouts/PublicLayout";
import { Button, Empty, Spin } from "antd";
import { Link } from "react-router-dom";

import { useGetMyPaymentsQuery } from "@/redux/features/orders/orderApi";

const PaymentHistory = () => {
  const { data, isLoading } = useGetMyPaymentsQuery();
  const payments = data?.data ?? [];

  return (
    <PublicLayout>
      <div className="container space-y-6 py-8 lg:py-12">
        <Button type="link" className="px-0">
          <Link to="/account/settings" className="flex items-center gap-1">
            &larr; Back to Account Settings
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="mt-2 text-muted-foreground">
            Review payment attempts, gateway transactions, and retry outcomes.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Spin />
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-xl border bg-card p-8">
            <Empty description="No payment attempts found yet." />
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold">{payment.transactionId}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()} ·{" "}
                    {payment.provider} · ${payment.amount.toFixed(2)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Order Number: {payment.orderGroup?.groupNumber || "N/A"}
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default PaymentHistory;
