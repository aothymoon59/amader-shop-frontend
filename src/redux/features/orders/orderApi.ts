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
    images?: { id: string; url: string }[];
  };
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
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
  useGetMyOrdersQuery,
  useGetMyPaymentsQuery,
} = orderApi;
