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
    images?: { id: string; url: string }[];
  };
};

export type ChildOrderRecord = {
  id: string;
  orderNumber: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  paymentProvider: CheckoutPaymentProvider;
  paymentStatus: PaymentStatus;
  createdAt: string;
  provider?: {
    id: string;
    name: string;
    providerProfile?: {
      id: string;
      shopName: string;
    } | null;
  };
  items: OrderItemRecord[];
  receipt?: {
    id: string;
    receiptNumber: string;
  } | null;
};

export type OrderGroupRecord = {
  id: string;
  groupNumber: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  shippingCity?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  paymentProvider: CheckoutPaymentProvider;
  paymentStatus: PaymentStatus;
  idempotencyKey: string;
  gatewayTransactionId?: string | null;
  createdAt: string;
  orders: ChildOrderRecord[];
  paymentAttempts: PaymentAttempt[];
};

type CheckoutResponse = {
  success: boolean;
  message?: string;
  data: {
    orderGroup: OrderGroupRecord;
    payment?: {
      provider: CheckoutPaymentProvider;
      transactionId: string;
      externalPaymentId?: string | null;
      redirectUrl?: string | null;
    } | null;
    nextAction: {
      type: "CONFIRMED" | "REDIRECT" | "RETRY_REQUIRED";
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
  data: ChildOrderRecord[];
};

type OrderGroupResponse = {
  success: boolean;
  message?: string;
  data: OrderGroupRecord;
};

type PaymentListResponse = {
  success: boolean;
  message?: string;
  data: PaymentAttempt[];
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<CheckoutResponse, CheckoutPayload>({
      query: (payload) => ({
        url: "/orders/checkout",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    retryPayment: builder.mutation<
      CheckoutResponse,
      { orderGroupId: string; paymentProvider?: "SSLCOMMERZ" | "BKASH" }
    >({
      query: ({ orderGroupId, paymentProvider }) => ({
        url: `/orders/${orderGroupId}/retry-payment`,
        method: "POST",
        body: paymentProvider ? { paymentProvider } : {},
      }),
    }),
    getOrderGroup: builder.query<OrderGroupResponse, string>({
      query: (orderGroupId) => ({
        url: `/orders/groups/${orderGroupId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.CART],
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
  }),
});

export const {
  useCheckoutMutation,
  useRetryPaymentMutation,
  useGetOrderGroupQuery,
  useGetMyOrdersQuery,
  useGetMyPaymentsQuery,
} = orderApi;
