import { useMemo, useState } from "react";
import { CalendarDays, CreditCard, Search, Truck } from "lucide-react";
import { Button, Input, Modal, Select, Table, Tabs, Tag } from "antd";

import { toast } from "@/components/ui/use-toast";
import {
  useGetManagementOrdersQuery,
  useGetManagementPaymentsQuery,
  useUpdateManagementOrderMutation,
  type ManagementOrderQuery,
  type OrderRecord,
} from "@/redux/features/orders/orderApi";

const orderStatusOptions = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatusOptions = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const LiveOrderManagementBoard = ({
  role,
}: {
  role: "provider" | "admin" | "super-admin";
}) => {
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [query, setQuery] = useState<ManagementOrderQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    paymentMethod: "",
    paymentStatus: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const { data: ordersResponse, isLoading: isOrdersLoading, refetch: refetchOrders } =
    useGetManagementOrdersQuery(query);
  const {
    data: paymentsResponse,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetManagementPaymentsQuery(query);
  const [updateManagementOrder, { isLoading: isUpdating }] =
    useUpdateManagementOrderMutation();

  const orders = ordersResponse?.data ?? [];
  const payments = paymentsResponse?.data ?? [];
  const ordersMeta = ordersResponse?.meta;
  const paymentsMeta = paymentsResponse?.meta;

  const stats = useMemo(
    () => [
      { label: "Orders", value: ordersMeta?.total ?? 0 },
      {
        label: "Paid Payments",
        value: payments.filter((payment) => payment.status === "SUCCESS").length,
      },
      {
        label: "Pending Orders",
        value: orders.filter((order) => order.status === "PENDING").length,
      },
      {
        label: "Delivered",
        value: orders.filter((order) => order.status === "DELIVERED").length,
      },
    ],
    [orders, ordersMeta?.total, payments]
  );

  const orderColumns = [
    {
      title: "Order",
      key: "order",
      render: (_: unknown, order: OrderRecord) => (
        <div>
          <div className="font-semibold">{order.orderNumber}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: unknown, order: OrderRecord) => (
        <div>
          <div>{order.customerName}</div>
          <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
        </div>
      ),
    },
    ...(role !== "provider"
      ? [
          {
            title: "Providers",
            key: "providers",
            render: (_: unknown, order: OrderRecord) =>
              order.providerNames?.join(", ") || "N/A",
          },
        ]
      : []),
    {
      title: "Items",
      key: "items",
      render: (_: unknown, order: OrderRecord) => `${order.items.length} item(s)`,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: unknown, order: OrderRecord) => `$${order.totalAmount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <Tag color={status === "PAID" ? "green" : status === "FAILED" ? "red" : "gold"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Tracking",
      key: "tracking",
      render: (_: unknown, order: OrderRecord) =>
        order.trackingNumber ? (
          <div className="text-xs">
            <div className="font-medium">{order.trackingNumber}</div>
            <div className="text-muted-foreground">{order.courier || "Courier pending"}</div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not assigned</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, order: OrderRecord) => (
        <Button type="link" onClick={() => setSelectedOrder(order)}>
          Manage
        </Button>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: "Transaction",
      key: "transaction",
      render: (_: unknown, payment: (typeof payments)[number]) => (
        <div>
          <div className="font-semibold">{payment.transactionId}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(payment.createdAt).toLocaleString()}
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
      key: "order",
      render: (_: unknown, payment: (typeof payments)[number]) =>
        payment.orderGroup?.groupNumber || "N/A",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: unknown, payment: (typeof payments)[number]) =>
        `$${payment.amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "SUCCESS" ? "green" : status === "FAILED" ? "red" : "gold"}>
          {status}
        </Tag>
      ),
    },
  ];

  const handleSave = async () => {
    if (!selectedOrder) return;

    try {
      await updateManagementOrder({
        orderId: selectedOrder.id,
        payload: {
          status: selectedOrder.status,
          paymentStatus: selectedOrder.paymentStatus,
          courier: selectedOrder.courier || "",
          trackingNumber: selectedOrder.trackingNumber || "",
          internalNotes: selectedOrder.internalNotes || "",
        },
      }).unwrap();

      toast({
        title: "Order updated",
        description: `${selectedOrder.orderNumber} has been updated.`,
      });
      setSelectedOrder(null);
      void refetchOrders();
      void refetchPayments();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to update the order right now.";

      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {role === "provider" ? "Provider Orders" : "Order & Payment Management"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "provider"
              ? "Review only your own orders and payments, then manage fulfillment with tracking and notes."
              : "Review all marketplace orders and payments with role-aware filters and workflow updates."}
          </p>
        </div>
        <div className="max-w-xl rounded-xl border bg-card p-4">
          <p className="mb-2 font-medium">Order flow</p>
          <p className="text-sm text-muted-foreground">
            Confirm incoming orders, process them, assign courier and tracking, then move them through shipped and delivered states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Input
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            placeholder="Search order, customer, product, receipt"
            value={query.search}
            onChange={(event) =>
              setQuery((current) => ({ ...current, search: event.target.value, page: 1 }))
            }
          />
          <Select
            allowClear
            placeholder="Order status"
            value={query.status || undefined}
            onChange={(value) =>
              setQuery((current) => ({ ...current, status: value || "", page: 1 }))
            }
            options={orderStatusOptions.map((status) => ({ label: status, value: status }))}
          />
          <Select
            allowClear
            placeholder="Payment method"
            value={query.paymentMethod || undefined}
            onChange={(value) =>
              setQuery((current) => ({ ...current, paymentMethod: value || "", page: 1 }))
            }
            options={[
              { label: "COD", value: "COD" },
              { label: "ONLINE", value: "ONLINE" },
            ]}
          />
          <Select
            allowClear
            placeholder="Payment status"
            value={query.paymentStatus || undefined}
            onChange={(value) =>
              setQuery((current) => ({ ...current, paymentStatus: value || "", page: 1 }))
            }
            options={paymentStatusOptions.map((status) => ({ label: status, value: status }))}
          />
          <Button
            onClick={() =>
              setQuery({
                page: 1,
                limit: query.limit || 10,
                search: "",
                status: "",
                paymentMethod: "",
                paymentStatus: "",
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "orders" | "payments")}
        items={[
          {
            key: "orders",
            label: "Orders",
            children: (
              <div className="rounded-xl border bg-card p-2">
                <Table
                  rowKey="id"
                  columns={orderColumns}
                  dataSource={orders}
                  loading={isOrdersLoading}
                  pagination={{
                    current: ordersMeta?.page || query.page || 1,
                    pageSize: ordersMeta?.limit || query.limit || 10,
                    total: ordersMeta?.total || 0,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: (page, limit) =>
                      setQuery((current) => ({ ...current, page, limit })),
                  }}
                  scroll={{ x: 1320 }}
                />
              </div>
            ),
          },
          {
            key: "payments",
            label: "Payments",
            children: (
              <div className="rounded-xl border bg-card p-2">
                <Table
                  rowKey="id"
                  columns={paymentColumns}
                  dataSource={payments}
                  loading={isPaymentsLoading}
                  pagination={{
                    current: paymentsMeta?.page || query.page || 1,
                    pageSize: paymentsMeta?.limit || query.limit || 10,
                    total: paymentsMeta?.total || 0,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: (page, limit) =>
                      setQuery((current) => ({ ...current, page, limit })),
                  }}
                  scroll={{ x: 920 }}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={Boolean(selectedOrder)}
        onCancel={() => setSelectedOrder(null)}
        onOk={handleSave}
        okText={isUpdating ? "Saving..." : "Save Updates"}
        okButtonProps={{ loading: isUpdating }}
        width={880}
        title={selectedOrder ? `Manage ${selectedOrder.orderNumber}` : "Manage Order"}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-3 font-medium">Order Details</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Customer: <span className="text-foreground">{selectedOrder.customerName}</span></div>
                  <div>Phone: <span className="text-foreground">{selectedOrder.customerPhone}</span></div>
                  <div>Email: <span className="text-foreground">{selectedOrder.customerEmail || "N/A"}</span></div>
                  <div>Address: <span className="text-foreground">{selectedOrder.shippingAddress}</span></div>
                  <div>Amount: <span className="text-foreground">${selectedOrder.totalAmount.toFixed(2)}</span></div>
                  <div>Receipt: <span className="text-foreground">{selectedOrder.receipt?.receiptNumber || "Pending"}</span></div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-3 font-medium">Workflow Guide</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Confirm order after review</div>
                  <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Add courier and tracking when shipped</div>
                  <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Keep payment state aligned with delivery progress</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Select
                value={selectedOrder.status}
                onChange={(value) =>
                  setSelectedOrder((current) =>
                    current ? { ...current, status: value } : current
                  )
                }
                options={orderStatusOptions.map((status) => ({ label: status, value: status }))}
              />
              <Select
                value={selectedOrder.paymentStatus}
                onChange={(value) =>
                  setSelectedOrder((current) =>
                    current ? { ...current, paymentStatus: value } : current
                  )
                }
                options={paymentStatusOptions.map((status) => ({ label: status, value: status }))}
              />
              <Input
                placeholder="Courier"
                value={selectedOrder.courier || ""}
                onChange={(event) =>
                  setSelectedOrder((current) =>
                    current ? { ...current, courier: event.target.value } : current
                  )
                }
              />
              <Input
                placeholder="Tracking number"
                value={selectedOrder.trackingNumber || ""}
                onChange={(event) =>
                  setSelectedOrder((current) =>
                    current ? { ...current, trackingNumber: event.target.value } : current
                  )
                }
              />
            </div>

            <Input.TextArea
              rows={5}
              placeholder="Internal notes"
              value={selectedOrder.internalNotes || ""}
              onChange={(event) =>
                setSelectedOrder((current) =>
                  current ? { ...current, internalNotes: event.target.value } : current
                )
              }
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default LiveOrderManagementBoard;
