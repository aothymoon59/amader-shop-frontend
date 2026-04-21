import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type ReceiptListItem = {
  id: string;
  receiptNumber: string;
  totalAmount: number;
  issuedAt: string;
  orderId?: string | null;
  posSaleId?: string | null;
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
    paymentMethod: string;
  } | null;
  posSale?: {
    id: string;
    totalAmount: number;
    providerId: string;
    customerName: string;
    customerMobile: string;
    customerEmail?: string | null;
    paymentMethod: string;
  } | null;
};

export type ReceiptsResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: ReceiptListItem[];
};

export type ReceiptDetailResponse = {
  success: boolean;
  message?: string;
  data: {
    id: string;
    receiptNumber: string;
    totalAmount: number;
    issuedAt: string;
    order?: {
      id: string;
      orderNumber: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string | null;
      paymentMethod: string;
      totalAmount: number;
      items: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        product: {
          id: string;
          name: string;
          sku?: string | null;
        };
      }>;
    } | null;
    posSale?: {
      id: string;
      customerName: string;
      customerMobile: string;
      customerEmail?: string | null;
      paymentMethod: string;
      subtotalAmount: number;
      discountPercent: number;
      discountAmount: number;
      totalAmount: number;
      createdAt: string;
      items: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        product: {
          id: string;
          name: string;
          sku?: string | null;
        };
      }>;
    } | null;
  };
};

export const receiptsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceipts: builder.query<ReceiptsResponse, { search?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/receipts",
        method: "GET",
        params,
      }),
      providesTags: (result) => [
        { type: tagTypes.RECEIPTS, id: "LIST" },
        ...(result?.data?.map((receipt) => ({
          type: tagTypes.RECEIPTS,
          id: receipt.receiptNumber,
        })) || []),
      ],
    }),
    getReceiptByNumber: builder.query<ReceiptDetailResponse, string>({
      query: (receiptNumber) => ({
        url: `/receipts/${receiptNumber}`,
        method: "GET",
      }),
      providesTags: (result, _error, receiptNumber) => [
        { type: tagTypes.RECEIPTS, id: result?.data?.receiptNumber || receiptNumber },
      ],
    }),
  }),
});

export const { useGetReceiptsQuery, useGetReceiptByNumberQuery } = receiptsApi;
