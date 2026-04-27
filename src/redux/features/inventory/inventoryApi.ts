import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";

export type InventoryMovementType = "IN" | "OUT" | "ADJUSTMENT";

export type InventoryMovementProduct = {
  id: string;
  providerId: string;
  name: string;
  slug: string;
  sku?: string | null;
  stock: number;
  lowStockThreshold: number;
  provider?: {
    id: string;
    name: string;
    email: string;
    providerProfile?: {
      id: string;
      shopName: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      isActive: boolean;
    } | null;
  };
};

export type InventoryMovementActor = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "CUSTOMER";
};

export type InventoryMovement = {
  id: string;
  productId: string;
  createdById?: string | null;
  type: InventoryMovementType;
  quantity: number;
  previousStock?: number | null;
  currentStock?: number | null;
  note?: string | null;
  createdAt: string;
  product: InventoryMovementProduct;
  createdBy?: InventoryMovementActor | null;
};

export type InventoryMovementQuery = {
  page?: number;
  limit?: number;
  search?: string;
  providerId?: string;
  productId?: string;
  type?: InventoryMovementType;
  dateFrom?: string;
  dateTo?: string;
};

export type InventoryMovementPayload = {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  note?: string;
};

export type InventoryAdjustmentPayload = {
  productId: string;
  stock: number;
  note?: string;
};

type InventoryMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type InventoryMovementListResponse = {
  success: boolean;
  message?: string;
  meta?: InventoryMeta;
  data: InventoryMovement[];
};

export type InventoryMutationResponse = {
  success: boolean;
  message?: string;
  data: {
    movement: InventoryMovement;
    product: InventoryMovementProduct;
    previousStock: number;
    currentStock: number;
  };
};

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryMovements: builder.query<
      InventoryMovementListResponse,
      InventoryMovementQuery | void
    >({
      query: (query) => ({
        url: "/inventory/movements",
        method: "GET",
        params: cleanObject(query || {}),
      }),
      providesTags: (result) => [
        { type: tagTypes.INVENTORY, id: "LIST" },
        ...(result?.data?.map((movement) => ({
          type: tagTypes.INVENTORY,
          id: movement.id,
        })) || []),
      ],
    }),

    createInventoryMovement: builder.mutation<
      InventoryMutationResponse,
      InventoryMovementPayload
    >({
      query: (payload) => ({
        url: "/inventory/movements",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result) => [
        { type: tagTypes.INVENTORY, id: "LIST" },
        { type: tagTypes.PRODUCT, id: "LIST" },
        ...(result?.data?.product?.id
          ? [{ type: tagTypes.PRODUCT, id: result.data.product.id }]
          : []),
      ],
    }),

    adjustInventoryStock: builder.mutation<
      InventoryMutationResponse,
      InventoryAdjustmentPayload
    >({
      query: (payload) => ({
        url: "/inventory/adjust",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result) => [
        { type: tagTypes.INVENTORY, id: "LIST" },
        { type: tagTypes.PRODUCT, id: "LIST" },
        ...(result?.data?.product?.id
          ? [{ type: tagTypes.PRODUCT, id: result.data.product.id }]
          : []),
      ],
    }),
  }),
});

export const {
  useGetInventoryMovementsQuery,
  useCreateInventoryMovementMutation,
  useAdjustInventoryStockMutation,
} = inventoryApi;
