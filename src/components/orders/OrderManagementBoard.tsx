import { useMemo, useState } from "react";
import { Eye, Search, Truck } from "lucide-react";

import { demoOrders, providerDemoOrders, type OrderRecord, type OrderStatus, type PaymentStatus } from "@/data/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const statusStyles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-info/10 text-info",
  Processing: "bg-primary/10 text-primary",
  Packed: "bg-accent/10 text-accent",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
  Paid: "bg-success/10 text-success",
  Failed: "bg-destructive/10 text-destructive",
  Refunded: "bg-warning/10 text-warning",
};

const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentStatuses: PaymentStatus[] = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const getSeedOrders = (role: "provider" | "admin") =>
  role === "provider" ? providerDemoOrders : demoOrders;

const OrderManagementBoard = ({ role }: { role: "provider" | "admin" }) => {
  const [orders, setOrders] = useState<OrderRecord[]>(() => getSeedOrders(role));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch = [
          order.id,
          order.customer,
          order.product,
          order.vendor,
          order.trackingNumber,
        ].some((value) => value.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [orders, search, statusFilter],
  );

  const stats = useMemo(
    () => [
      { label: "Total Orders", value: orders.length },
      {
        label: "In Progress",
        value: orders.filter((order) =>
          ["Confirmed", "Processing", "Packed", "Shipped"].includes(order.status),
        ).length,
      },
      {
        label: "Delivered",
        value: orders.filter((order) => order.status === "Delivered").length,
      },
      {
        label: "Pending Payment",
        value: orders.filter((order) => order.paymentStatus === "Pending").length,
      },
    ],
    [orders],
  );

  const updateOrder = (updatedOrder: OrderRecord) => {
    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
    );
    setSelectedOrder(updatedOrder);
    toast({
      title: "Order updated",
      description: `${updatedOrder.id} has been updated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {role === "provider" ? "Online Orders" : "Order Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "provider"
              ? "Track online sales, update fulfillment status, and share tracking details with customers."
              : "Monitor marketplace orders and manage provider fulfillment from one place."}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 max-w-xl">
          <p className="font-medium mb-2">Suggested order flow</p>
          <p className="text-sm text-muted-foreground">
            New order comes in, confirm it, process and pack it, assign courier and tracking, then mark it shipped and delivered.
            Admin can monitor the same flow now, and we can enforce API-based role permissions later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order, customer, product, vendor, tracking"
            className="pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="All">All statuses</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Order</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
              {role === "admin" && (
                <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
              )}
              <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Payment</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Tracking</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{order.id}</div>
                  <div className="text-xs text-muted-foreground">{order.date}</div>
                </td>
                <td className="p-3">
                  <div>{order.customer}</div>
                  <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                </td>
                <td className="p-3">{order.product}</td>
                {role === "admin" && <td className="p-3">{order.vendor}</td>}
                <td className="p-3 font-medium">${order.amount.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  {order.trackingNumber ? (
                    <div className="text-xs">
                      <div className="font-medium">{order.trackingNumber}</div>
                      <div className="text-muted-foreground">{order.courier}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not assigned</span>
                  )}
                </td>
                <td className="p-3">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                    <Eye className="mr-2 h-4 w-4" /> Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Manage {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Update order status, courier details, and internal notes for this online order.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="font-medium mb-2">Order Details</div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Customer: <span className="text-foreground">{selectedOrder.customer}</span></div>
                      <div>Phone: <span className="text-foreground">{selectedOrder.customerPhone}</span></div>
                      <div>Product: <span className="text-foreground">{selectedOrder.product}</span></div>
                      <div>Quantity: <span className="text-foreground">{selectedOrder.quantity}</span></div>
                      <div>Amount: <span className="text-foreground">${selectedOrder.amount.toFixed(2)}</span></div>
                      <div>Address: <span className="text-foreground">{selectedOrder.shippingAddress}</span></div>
                      {role === "admin" && (
                        <div>Vendor: <span className="text-foreground">{selectedOrder.vendor}</span></div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="font-medium mb-3">Workflow Steps</div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> 1. Confirm the order after review</div>
                      <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> 2. Process and pack the items</div>
                      <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> 3. Add courier and tracking number</div>
                      <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> 4. Mark shipped, then delivered</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(event) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          status: event.target.value as OrderStatus,
                        })
                      }
                      className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(event) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          paymentStatus: event.target.value as PaymentStatus,
                        })
                      }
                      className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Courier</label>
                    <Input
                      className="mt-1.5"
                      value={selectedOrder.courier}
                      placeholder="Pathao Courier"
                      onChange={(event) =>
                        setSelectedOrder({ ...selectedOrder, courier: event.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tracking Number</label>
                    <Input
                      className="mt-1.5"
                      value={selectedOrder.trackingNumber}
                      placeholder="TRK-1001"
                      onChange={(event) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          trackingNumber: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Internal Notes</label>
                    <textarea
                      className="mt-1.5 min-h-28 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedOrder.notes}
                      onChange={(event) =>
                        setSelectedOrder({ ...selectedOrder, notes: event.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button
                  variant="hero"
                  onClick={() => {
                    updateOrder(selectedOrder);
                  }}
                >
                  Save Updates
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagementBoard;
