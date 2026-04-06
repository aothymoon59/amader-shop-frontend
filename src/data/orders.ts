export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type OrderRecord = {
  id: string;
  date: string;
  customer: string;
  customerPhone: string;
  product: string;
  vendor: string;
  amount: number;
  quantity: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
  courier: string;
  shippingAddress: string;
  notes: string;
};

export const demoOrders: OrderRecord[] = [
  {
    id: "#ORD-1001",
    date: "2026-04-06",
    customer: "John Doe",
    customerPhone: "+8801711000001",
    product: "Wireless Headphones Pro",
    vendor: "TechStore",
    amount: 89.99,
    quantity: 1,
    status: "Shipped",
    paymentStatus: "Paid",
    trackingNumber: "DHK-TRK-1001",
    courier: "Pathao Courier",
    shippingAddress: "Banani, Dhaka",
    notes: "Customer requested afternoon delivery.",
  },
  {
    id: "#ORD-1002",
    date: "2026-04-05",
    customer: "Jane Smith",
    customerPhone: "+8801711000002",
    product: "Smart Speaker Mini",
    vendor: "TechStore",
    amount: 129.99,
    quantity: 1,
    status: "Processing",
    paymentStatus: "Paid",
    trackingNumber: "",
    courier: "",
    shippingAddress: "Dhanmondi, Dhaka",
    notes: "Preparing shipment.",
  },
  {
    id: "#ORD-1003",
    date: "2026-04-04",
    customer: "Bob Wilson",
    customerPhone: "+8801711000003",
    product: "USB-C Cable Pack",
    vendor: "TechStore",
    amount: 39.98,
    quantity: 2,
    status: "Delivered",
    paymentStatus: "Paid",
    trackingNumber: "DHK-TRK-1003",
    courier: "Paperfly",
    shippingAddress: "Uttara, Dhaka",
    notes: "Delivered successfully.",
  },
  {
    id: "#ORD-1004",
    date: "2026-04-05",
    customer: "Alice Brown",
    customerPhone: "+8801711000004",
    product: "Cotton Tee",
    vendor: "EcoWear",
    amount: 34.99,
    quantity: 1,
    status: "Pending",
    paymentStatus: "Pending",
    trackingNumber: "",
    courier: "",
    shippingAddress: "Mirpur, Dhaka",
    notes: "Waiting for order confirmation.",
  },
  {
    id: "#ORD-1005",
    date: "2026-04-03",
    customer: "Charlie Davis",
    customerPhone: "+8801711000005",
    product: "Ceramic Vase",
    vendor: "HomeArt",
    amount: 49.99,
    quantity: 1,
    status: "Confirmed",
    paymentStatus: "Paid",
    trackingNumber: "",
    courier: "",
    shippingAddress: "Mohakhali, Dhaka",
    notes: "Packed carefully for fragile shipping.",
  },
  {
    id: "#ORD-1006",
    date: "2026-04-02",
    customer: "Emma Khan",
    customerPhone: "+8801711000006",
    product: "Running Shoes X1",
    vendor: "FitGear",
    amount: 119.99,
    quantity: 1,
    status: "Cancelled",
    paymentStatus: "Refunded",
    trackingNumber: "",
    courier: "",
    shippingAddress: "Gulshan, Dhaka",
    notes: "Cancelled by customer before dispatch.",
  },
];

export const providerDemoOrders = demoOrders.filter(
  (order) => order.vendor === "TechStore",
);
