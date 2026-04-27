import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type PosSaleCreatePayload = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  customerName?: string;
  customerMobile: string;
  customerEmail?: string;
  paymentMethod?: string;
  discountPercent?: number;
};

export type PosSaleItemResponse = {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    sku?: string | null;
    price: number;
  };
};

export type PosSaleResponse = {
  success: boolean;
  message?: string;
  data: {
    id: string;
    customerName: string;
    customerMobile: string;
    customerEmail?: string | null;
    paymentMethod: string;
    subtotalAmount: number;
    discountPercent: number;
    discountAmount: number;
    totalAmount: number;
    items: PosSaleItemResponse[];
    receipt?: {
      id: string;
      receiptNumber: string;
      totalAmount: number;
      issuedAt: string;
    } | null;
  };
};

export const posSalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPosSale: builder.mutation<PosSaleResponse, PosSaleCreatePayload>({
      query: (body) => ({
        url: "/pos-sales",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: tagTypes.PRODUCT, id: "LIST" },
        { type: tagTypes.INVENTORY, id: "LIST" },
        { type: tagTypes.RECEIPTS, id: "LIST" },
        { type: tagTypes.POS_SALES, id: "LIST" },
      ],
    }),
  }),
});

export const { useCreatePosSaleMutation } = posSalesApi;
