import PublicLayout from "@/components/layouts/PublicLayout";
import { Button, Empty, Spin } from "antd";
import { Link } from "react-router-dom";

import { useGetMyOrdersQuery } from "@/redux/features/orders/orderApi";

const OrderHistory = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.data ?? [];

  return (
    <PublicLayout>
      <div className="container space-y-6 py-8 lg:py-12">
        <Button type="link" className="px-0">
          <Link to="/account/settings" className="flex items-center gap-1">
            &larr; Back to Account Settings
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="mt-2 text-muted-foreground">
            Track your provider-split orders and confirmation status.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Spin />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border bg-card p-8">
            <Empty description="No orders found yet." />
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold">{order.orderNumber}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.length} item(s) · ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Payment Method: {order.paymentMethod}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default OrderHistory;
