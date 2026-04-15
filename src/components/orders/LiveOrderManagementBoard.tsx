import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DollarSign,
  MapPin,
  PackageCheck,
  Phone,
  Search,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Alert, Button, Drawer, Input, Select, Steps, Tag } from "antd";

import CustomTable from "@/components/shared/table/CustomTable";
import { toast } from "@/components/ui/use-toast";
import {
  useGetManagementOrdersQuery,
  useGetManagementPaymentsQuery,
  useUpdateManagementOrderMutation,
  type ManagementOrderQuery,
  type OrderStatus,
  type PaymentStatus,
  type OrderRecord,
} from "@/redux/features/orders/orderApi";

const orderStatusOptions: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatusOptions: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const livePipelineStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];
const courierOptions = [
  "Pathao",
  "Sundarban",
  "RedX",
  "Steadfast",
  "eCourier",
  "Paperfly",
];
const customCourierValue = "__custom__";

const statusColors: Record<OrderStatus, string> = {
  PENDING: "gold",
  CONFIRMED: "blue",
  PROCESSING: "processing",
  SHIPPED: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
};

const paymentColors: Record<PaymentStatus, string> = {
  PENDING: "gold",
  PAID: "green",
  FAILED: "red",
  REFUNDED: "volcano",
};

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "N/A";

const generateTrackingNumber = (orderNumber: string, courier?: string | null) => {
  const normalizedOrderNumber = orderNumber
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(-8);
  const courierCode =
    courier?.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 4) || "GEN";
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${courierCode}-${normalizedOrderNumber}-${dateCode}${randomCode}`;
};

const getStepIndex = (status: OrderStatus) => {
  if (status === "CANCELLED") {
    return 0;
  }

  const index = livePipelineStatuses.indexOf(status);
  return index === -1 ? 0 : index;
};

const LiveOrderManagementBoard = ({
  role,
  section = "orders",
}: {
  role: "provider" | "admin" | "super-admin";
  section?: "orders" | "payments";
}) => {
  const [query, setQuery] = useState<ManagementOrderQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    paymentMethod: "",
    paymentStatus: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [draftOrder, setDraftOrder] = useState<OrderRecord | null>(null);
  const [customCourierDraft, setCustomCourierDraft] = useState("");

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
  const ordersSummary = ordersResponse?.summary;
  const paymentsMeta = paymentsResponse?.meta;
  const selectedOrderFromList = selectedOrder
    ? orders.find((order) => order.id === selectedOrder.id) || selectedOrder
    : null;

  useEffect(() => {
    if (!selectedOrderFromList) {
      setDraftOrder(null);
      setCustomCourierDraft("");
      return;
    }

    setDraftOrder(selectedOrderFromList);
    setCustomCourierDraft(
      selectedOrderFromList.courier &&
        !courierOptions.includes(selectedOrderFromList.courier)
        ? selectedOrderFromList.courier
        : ""
    );
  }, [selectedOrderFromList]);

  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: ordersSummary?.totalOrders ?? 0,
        accent: "from-slate-900 via-slate-800 to-slate-700",
        icon: ShoppingBag,
        helper: `${ordersSummary?.codOrders ?? 0} COD / ${ordersSummary?.onlineOrders ?? 0} online`,
      },
      {
        label: "Pending Queue",
        value: ordersSummary?.pendingOrders ?? 0,
        accent: "from-amber-500 via-orange-500 to-amber-600",
        icon: CalendarDays,
        helper: `${ordersSummary?.processingOrders ?? 0} processing now`,
      },
      {
        label: "Delivered",
        value: ordersSummary?.deliveredOrders ?? 0,
        accent: "from-emerald-500 via-green-500 to-emerald-600",
        icon: PackageCheck,
        helper: `${ordersSummary?.shippedOrders ?? 0} still in transit`,
      },
      {
        label: "Collected Revenue",
        value: `$${Number(ordersSummary?.totalRevenue ?? 0).toFixed(2)}`,
        accent: "from-sky-500 via-cyan-500 to-blue-600",
        icon: DollarSign,
        helper: `${ordersSummary?.paidOrders ?? 0} paid orders`,
      },
    ],
    [ordersSummary]
  );

  const roleLabel =
    role === "provider" ? "Provider Operations" : role === "super-admin" ? "Marketplace Control" : "Admin Operations";
  const sectionTitle = section === "orders" ? "Orders Desk" : "Payments Desk";
  const sectionDescription =
    section === "orders"
      ? role === "provider"
        ? "Work your live orders like a production fulfillment queue: confirm, pack, assign courier, ship, and close delivery."
        : "Review marketplace-wide order flow, monitor payment state, and unblock fulfillment with clear operational controls."
      : role === "provider"
        ? "Monitor only your payment activity, COD collection progress, and online payment outcomes."
        : "Track marketplace payment activity, paid order movement, and settlement-related exceptions.";

  const currentAvailableStatuses = useMemo(() => {
    if (!draftOrder) {
      return orderStatusOptions;
    }

    return Array.from(
      new Set([draftOrder.status, ...(draftOrder.workflow?.availableStatuses || [])])
    );
  }, [draftOrder]);

  const currentAvailablePaymentStatuses = useMemo(() => {
    if (!draftOrder) {
      return paymentStatusOptions;
    }

    return Array.from(
      new Set([
        draftOrder.paymentStatus,
        ...(draftOrder.workflow?.allowedPaymentStatuses || []),
      ])
    );
  }, [draftOrder]);

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
      render: (status: OrderStatus) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: PaymentStatus) => (
        <Tag color={paymentColors[status]}>
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
      title: "Next Step",
      key: "nextStep",
      render: (_: unknown, order: OrderRecord) =>
        order.workflow?.recommendedNextStatus ? (
          <Tag>{order.workflow.recommendedNextStatus}</Tag>
        ) : (
          <span className="text-xs text-muted-foreground">Completed</span>
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
    if (!selectedOrder || !draftOrder) return;

    try {
      await updateManagementOrder({
        orderId: selectedOrder.id,
        payload: {
          status: draftOrder.status,
          paymentStatus: draftOrder.paymentStatus,
          courier: draftOrder.courier || "",
          trackingNumber: draftOrder.trackingNumber || "",
          internalNotes: draftOrder.internalNotes || "",
        },
      }).unwrap();

      toast({
        title: "Order updated",
        description: `${draftOrder.orderNumber} has been updated.`,
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

  const handleRecommendedAction = (status: OrderStatus) => {
    setDraftOrder((current) => (current ? { ...current, status } : current));
  };

  const selectedCourierOption = useMemo(() => {
    if (!draftOrder?.courier) {
      return undefined;
    }

    return courierOptions.includes(draftOrder.courier)
      ? draftOrder.courier
      : customCourierValue;
  }, [draftOrder?.courier]);

  const applyCourierChange = (courierValue: string) => {
    setDraftOrder((current) => {
      if (!current) {
        return current;
      }

      const nextTrackingNumber =
        current.trackingNumber?.trim() ||
        generateTrackingNumber(current.orderNumber, courierValue);

      return {
        ...current,
        courier: courierValue,
        trackingNumber: nextTrackingNumber,
      };
    });
  };

  const setTablePagination = (
    value:
      | { page: number; per_page: number }
      | ((prev: { page: number; per_page: number }) => { page: number; per_page: number })
  ) => {
    setQuery((current) => {
      const previous = {
        page: current.page || 1,
        per_page: current.limit || 10,
      };
      const next = typeof value === "function" ? value(previous) : value;

      return {
        ...current,
        page: next.page,
        limit: next.per_page,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            {roleLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {sectionTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{sectionDescription}</p>
        </div>
        <div className="max-w-xl rounded-2xl border bg-card p-5 shadow-sm">
          <p className="mb-3 font-medium">Operational flow</p>
          {section === "orders" ? (
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="rounded-lg bg-secondary/50 p-3">1. Confirm after stock review</div>
              <div className="rounded-lg bg-secondary/50 p-3">2. Move into processing while packing</div>
              <div className="rounded-lg bg-secondary/50 p-3">3. Add courier and tracking before ship</div>
              <div className="rounded-lg bg-secondary/50 p-3">4. Close delivery and settle payment</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="rounded-lg bg-secondary/50 p-3">1. Watch COD vs online mix</div>
              <div className="rounded-lg bg-secondary/50 p-3">2. Track paid order movement</div>
              <div className="rounded-lg bg-secondary/50 p-3">3. Spot failed or refunded payments</div>
              <div className="rounded-lg bg-secondary/50 p-3">4. Reconcile receipts and settlements</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.accent} p-[1px] shadow-sm`}
          >
            <div className="rounded-[15px] bg-background/95 p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight">{stat.value}</div>
                </div>
                <div className="rounded-xl bg-secondary/80 p-2.5 text-foreground shadow-sm">
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{stat.helper}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
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
          <Input
            type="date"
            value={query.dateFrom || ""}
            onChange={(event) =>
              setQuery((current) => ({ ...current, dateFrom: event.target.value, page: 1 }))
            }
          />
          <Input
            type="date"
            value={query.dateTo || ""}
            onChange={(event) =>
              setQuery((current) => ({ ...current, dateTo: event.target.value, page: 1 }))
            }
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
                dateFrom: "",
                dateTo: "",
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {section === "orders" ? (
        <div className="rounded-xl border bg-card p-2">
          <CustomTable
            rowKey="id"
            columns={orderColumns}
            dataSource={orders}
            loading={isOrdersLoading}
            setPagination={setTablePagination}
            totaldata={ordersMeta?.total || 0}
            currentPage={ordersMeta?.page || query.page || 1}
            pageSize={ordersMeta?.limit || query.limit || 10}
          />
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-2">
          <CustomTable
            rowKey="id"
            columns={paymentColumns}
            dataSource={payments}
            loading={isPaymentsLoading}
            setPagination={setTablePagination}
            totaldata={paymentsMeta?.total || 0}
            currentPage={paymentsMeta?.page || query.page || 1}
            pageSize={paymentsMeta?.limit || query.limit || 10}
          />
        </div>
      )}

      {section === "orders" ? (
        <Drawer
          open={Boolean(selectedOrder && draftOrder)}
          onClose={() => setSelectedOrder(null)}
          width={960}
          title={draftOrder ? `Manage ${draftOrder.orderNumber}` : "Manage Order"}
          extra={
            <div className="flex gap-2">
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              <Button type="primary" onClick={handleSave} loading={isUpdating}>
                Save Updates
              </Button>
            </div>
          }
        >
          {draftOrder ? (
            <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag color={statusColors[draftOrder.status]}>{draftOrder.status}</Tag>
                    <Tag color={paymentColors[draftOrder.paymentStatus]}>
                      {draftOrder.paymentStatus}
                    </Tag>
                    <Tag>{draftOrder.paymentMethod}</Tag>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold">{draftOrder.orderNumber}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Created {formatDateTime(draftOrder.createdAt)} and last updated{" "}
                    {formatDateTime(draftOrder.updatedAt)}.
                  </p>
                </div>
                {draftOrder.workflow?.recommendedNextStatus ? (
                  <div className="rounded-xl bg-secondary/70 p-4 text-sm">
                    <div className="font-medium">Recommended next move</div>
                    <div className="mt-1 text-muted-foreground">
                      Move this order to{" "}
                      <span className="font-semibold text-foreground">
                        {draftOrder.workflow.recommendedNextStatus}
                      </span>
                      {" "}after your checklist is complete.
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <div className="mb-4 flex items-center gap-2 font-medium">
                <PackageCheck className="h-4 w-4" /> Fulfillment timeline
              </div>
              <Steps
                current={getStepIndex(draftOrder.status)}
                status={draftOrder.status === "CANCELLED" ? "error" : "process"}
                responsive
                items={livePipelineStatuses.map((status) => ({
                  title: status,
                  description:
                    draftOrder.status === status
                      ? "Current"
                      : draftOrder.workflow?.recommendedNextStatus === status
                        ? "Recommended"
                        : undefined,
                }))}
              />
            </div>

            {draftOrder.workflow?.blockers?.length ? (
              <Alert
                type="warning"
                showIcon
                message="Action blockers"
                description={
                  <div className="space-y-1">
                    {draftOrder.workflow.blockers.map((blocker) => (
                      <div key={blocker}>{blocker}</div>
                    ))}
                  </div>
                }
              />
            ) : (
              <Alert
                type="success"
                showIcon
                message="Order is ready for the next guided action"
              />
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border p-5">
                  <div className="mb-4 flex items-center gap-2 font-medium">
                    <ShoppingBag className="h-4 w-4" /> Order items
                  </div>
                  <div className="space-y-3">
                    {draftOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 rounded-xl border bg-secondary/30 p-4"
                      >
                        <div className="min-w-0">
                          <div className="font-medium">
                            {item.product?.name || item.productName}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            Qty {item.quantity} x ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right text-sm font-medium">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-4 flex items-center gap-2 font-medium">
                    <Truck className="h-4 w-4" /> Fulfillment controls
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Select
                      value={draftOrder.status}
                      onChange={(value) =>
                        setDraftOrder((current) =>
                          current ? { ...current, status: value } : current
                        )
                      }
                      options={currentAvailableStatuses.map((status) => ({
                        label: status,
                        value: status,
                      }))}
                    />
                    <Select
                      value={draftOrder.paymentStatus}
                      disabled={!draftOrder.workflow?.canEditPaymentStatus}
                      onChange={(value) =>
                        setDraftOrder((current) =>
                          current ? { ...current, paymentStatus: value } : current
                        )
                      }
                      options={currentAvailablePaymentStatuses.map((status) => ({
                        label: status,
                        value: status,
                      }))}
                    />
                    <Select
                      allowClear
                      placeholder="Courier"
                      value={selectedCourierOption}
                      onChange={(value) => {
                        if (!value) {
                          setCustomCourierDraft("");
                          setDraftOrder((current) =>
                            current ? { ...current, courier: "" } : current
                          );
                          return;
                        }

                        if (value === customCourierValue) {
                          applyCourierChange(customCourierDraft || "");
                          return;
                        }

                        setCustomCourierDraft("");
                        applyCourierChange(value);
                      }}
                      options={[
                        ...courierOptions.map((courier) => ({
                          label: courier,
                          value: courier,
                        })),
                        {
                          label: "Other courier",
                          value: customCourierValue,
                        },
                      ]}
                    />
                    <Input
                      placeholder="Tracking number"
                      value={draftOrder.trackingNumber || ""}
                      onChange={(event) =>
                        setDraftOrder((current) =>
                          current
                            ? { ...current, trackingNumber: event.target.value }
                            : current
                        )
                      }
                    />
                  </div>

                  {selectedCourierOption === customCourierValue ? (
                    <Input
                      className="mt-4"
                      placeholder="Write courier name manually"
                      value={customCourierDraft}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCustomCourierDraft(value);
                        applyCourierChange(value);
                      }}
                    />
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(draftOrder.workflow?.availableStatuses || []).map((status) => (
                      <Button
                        key={status}
                        onClick={() => handleRecommendedAction(status)}
                        type={
                          draftOrder.workflow?.recommendedNextStatus === status
                            ? "primary"
                            : "default"
                        }
                      >
                        Move to {status}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Input.TextArea
                      rows={5}
                      placeholder="Internal notes for support, operations, or delivery follow-up"
                      value={draftOrder.internalNotes || ""}
                      onChange={(event) =>
                        setDraftOrder((current) =>
                          current
                            ? { ...current, internalNotes: event.target.value }
                            : current
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border p-5">
                  <div className="mb-4 font-medium">Customer & destination</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{draftOrder.customerName}</div>
                        <div className="text-muted-foreground">
                          {draftOrder.customerEmail || "Email not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>{draftOrder.customerPhone}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>{draftOrder.shippingAddress}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-4 font-medium">Commercial snapshot</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Total amount</span>
                      <span className="font-semibold">${draftOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Receipt</span>
                      <span className="font-medium">
                        {draftOrder.receipt?.receiptNumber || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Payment method</span>
                      <span>{draftOrder.paymentMethod}</span>
                    </div>
                    {(role !== "provider" && draftOrder.providerNames?.length) ? (
                      <div className="flex items-start gap-3">
                        <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>{draftOrder.providerNames.join(", ")}</div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-4 font-medium">Operator checklist</div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4" />
                      Review order time, address, and contact before confirming.
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-4 w-4" />
                      Attach courier and tracking before shipping to keep support aligned.
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-4 w-4" />
                      Keep payment state consistent with COD collection or online validation.
                    </div>
                    <div className="flex items-start gap-3">
                      {draftOrder.workflow?.blockers?.length ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                      )}
                      {draftOrder.workflow?.blockers?.length
                        ? "Resolve blockers before moving to the next fulfillment stage."
                        : "This order is ready for the next operational step."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          ) : null}
        </Drawer>
      ) : null}
    </div>
  );
};

export default LiveOrderManagementBoard;
