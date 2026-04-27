import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "@/redux/api/baseApi";

export type CheckoutPaymentMethod = "COD" | "ONLINE";
export type CheckoutPaymentProvider = "COD" | "SSLCOMMERZ" | "BKASH";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentAttemptStatus =
  | "INITIATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  deliveryZoneId: string;
  deliveryMode: "NORMAL" | "EXPRESS";
  paymentMethod: CheckoutPaymentMethod;
  idempotencyKey: string;
};

export type PaymentAttempt = {
  id: string;
  provider: CheckoutPaymentProvider;
  transactionId: string;
  externalPaymentId?: string | null;
  amount: number;
  status: PaymentAttemptStatus;
  gatewayUrl?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
  orderGroup?: {
    groupNumber?: string;
  };
};

export type OrderItemRecord = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: {
    id: string;
    name: string;
    slug?: string;
    images?: { id: string; url: string }[];
  };
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProvider?: string | null;
  courier?: string | null;
  trackingNumber?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
  providerNames?: string[];
  workflow?: {
    currentStatus: OrderStatus;
    recommendedNextStatus?: OrderStatus | null;
    availableStatuses: OrderStatus[];
    allowedPaymentStatuses: PaymentStatus[];
    canEditPaymentStatus: boolean;
    blockers: string[];
  };
  receipt?: {
    id: string;
    receiptNumber: string;
  } | null;
};

type CheckoutResponse = {
  success: boolean;
  message?: string;
  data: {
    order: OrderRecord;
    payment?: {
      provider: CheckoutPaymentProvider;
      transactionId: string;
      redirectUrl?: string | null;
    } | null;
    nextAction: {
      type: "CONFIRMED" | "REDIRECT";
    };
  };
};

type OrderListResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: OrderRecord[];
};

type PaymentListResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: PaymentAttempt[];
};

export type ManagementOrderQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
};

type ManagementOrderListResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  summary?: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    paidOrders: number;
    codOrders: number;
    onlineOrders: number;
    totalRevenue: number;
  };
  data: OrderRecord[];
};

type ManagementOrderUpdatePayload = {
  status?: string;
  paymentStatus?: string;
  courier?: string;
  trackingNumber?: string;
  internalNotes?: string;
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<CheckoutResponse, CheckoutPayload>({
      query: (payload) => ({
        url: "/orders/checkout",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        tagTypes.CART,
        { type: tagTypes.PRODUCT, id: "LIST" },
        { type: tagTypes.INVENTORY, id: "LIST" },
      ],
    }),
    getMyOrders: builder.query<OrderListResponse, void>({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
    }),
    getMyPayments: builder.query<PaymentListResponse, void>({
      query: () => ({
        url: "/orders/my-payments",
        method: "GET",
      }),
    }),
    getManagementOrders: builder.query<
      ManagementOrderListResponse,
      ManagementOrderQuery | void
    >({
      query: (query) => ({
        url: "/orders/management",
        method: "GET",
        params: query,
      }),
    }),
    getManagementPayments: builder.query<
      PaymentListResponse,
      ManagementOrderQuery | void
    >({
      query: (query) => ({
        url: "/orders/management/payments",
        method: "GET",
        params: query,
      }),
    }),
    updateManagementOrder: builder.mutation<
      { success: boolean; message?: string; data: OrderRecord },
      { orderId: string; payload: ManagementOrderUpdatePayload }
    >({
      query: ({ orderId, payload }) => ({
        url: `/orders/${orderId}/manage`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetMyPaymentsQuery,
  useGetManagementOrdersQuery,
  useGetManagementPaymentsQuery,
  useUpdateManagementOrderMutation,
} = orderApi;
