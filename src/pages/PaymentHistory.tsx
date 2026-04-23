
import { Button, Empty, Spin, Table, Tag } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { useGetMyPaymentsQuery } from "@/redux/features/orders/orderApi";
import { formatCurrencyAmount } from "@/utils/currency";
import dayjs from "dayjs";

const PaymentHistory = () => {
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data, isLoading } = useGetMyPaymentsQuery();
  const payments = data?.data ?? [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: "Transaction",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (value: string) => (
        <span className="font-semibold text-foreground">{value}</span>
      ),
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (_: unknown, payment: (typeof payments)[number]) => (
        <div>
          <div>{dayjs(payment.createdAt).format("MMMM D, YYYY")}</div>
          <div className="text-xs text-muted-foreground">
            {dayjs(payment.createdAt).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Order Number",
      key: "orderNumber",
      render: (_: unknown, payment: (typeof payments)[number]) =>
        payment.orderGroup?.groupNumber || "N/A",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: unknown, payment: (typeof payments)[number]) => (
        <span className="font-medium">{formatCurrencyAmount(payment.amount, currency)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "SUCCESS"
              ? "green"
              : status === "FAILED"
                ? "red"
                : "gold"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    
      <div className="container space-y-6 py-8 lg:py-12">
        <Button type="link" className="px-0">
          <Link to="/account/settings" className="flex items-center gap-1">
            &larr; Back to Account Settings
          </Link>
        </Button>
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Customer Payment History</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Track payment attempts, transaction references, order numbers, and
            final payment results from this dedicated page.
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
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={payments}
              pagination={{
                current: page,
                pageSize,
                total: payments.length,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} payments`,
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setPageSize(nextPageSize);
                },
                hideOnSinglePage: false,
              }}
              scroll={{ x: 840 }}
            />
            <div className="hidden">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{payment.transactionId}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()} Ã‚Â·{" "}
                      {payment.provider} Ã‚Â· ${payment.amount.toFixed(2)}
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
          </div>
        )}
      </div>
    
  );
};

export default PaymentHistory;
