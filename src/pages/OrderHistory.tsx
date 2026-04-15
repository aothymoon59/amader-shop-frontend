import PublicLayout from "@/components/layouts/PublicLayout";
import { Button, Empty, Spin, Table, Tag } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetMyOrdersQuery } from "@/redux/features/orders/orderApi";
import dayjs from "dayjs";

const OrderHistory = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.data ?? [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: "Order",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (value: string) => (
        <span className="font-semibold text-foreground">{value}</span>
      ),
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (_: unknown, order: (typeof orders)[number]) => (
        <div>
          <div>{dayjs(order.createdAt).format("MMMM D, YYYY")}</div>
          <div className="text-xs text-muted-foreground">
            {dayjs(order.createdAt).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_: unknown, order: (typeof orders)[number]) => (
        <div>
          <div className="font-medium">{order.items.length} item(s)</div>
          <div className="text-xs text-muted-foreground">
            {order.items
              .slice(0, 2)
              .map((item) => item.product?.name || item.productName)
              .join(", ") || "Order items"}
          </div>
        </div>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Total",
      key: "total",
      render: (_: unknown, order: (typeof orders)[number]) => (
        <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
      ),
    },
    {
      title: "Receipt",
      dataIndex: ["receipt", "receiptNumber"],
      key: "receipt",
      render: (value: string | undefined) => value || "Pending",
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <Tag
          color={
            status === "PAID" ? "green" : status === "FAILED" ? "red" : "gold"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <PublicLayout>
      <div className="container space-y-6 py-8 lg:py-12">
        <Button type="link" className="px-0">
          <Link to="/account/settings" className="flex items-center gap-1">
            &larr; Back to Account Settings
          </Link>
        </Button>

        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Customer Order History</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review all your placed orders, payment states, receipt numbers, and
            delivery progress from this dedicated page.
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
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={orders}
              pagination={{
                current: page,
                pageSize,
                total: orders.length,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} orders`,
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setPageSize(nextPageSize);
                },
                hideOnSinglePage: false,
              }}
              scroll={{ x: 980 }}
            />
            <div className="hidden">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{order.orderNumber}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.items.length} item(s) · $
                      {order.totalAmount.toFixed(2)}
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
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default OrderHistory;
