import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";

export type ProductImage = {
  id: string;
  url: string;
  createdAt: string;
};

export type ProductProvider = {
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

export type ProductCategory = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  costPrice?: number | null;
  discountType?: "PERCENTAGE" | "FIXED" | null;
  discountValue?: number | null;
  stock: number;
  lowStockThreshold: number;
  sku?: string | null;
  barcode?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  provider: ProductProvider;
  images: ProductImage[];
};

export type ManagedProductsResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: Product[];
};

export type ManagedProductResponse = {
  success: boolean;
  message?: string;
  data: Product;
};

export type ManagedProductQuery = {
  search?: string;
  categoryId?: string;
  providerId?: string;
  archivedOnly?: boolean;
  published?: boolean;
  isFeatured?: boolean;
  isDiscount?: boolean;
  status?: "published" | "draft";
  sortBy?: "price" | "date" | "name";
  sortOrder?: "asc" | "desc";
  priceSort?: "low-to-high" | "high-to-low";
  dateSort?: "new-to-old" | "old-to-new";
  page?: number;
  limit?: number;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      ManagedProductsResponse,
      ManagedProductQuery | void
    >({
      query: (args) => ({
        url: "/products",
        method: "GET",
        params: cleanObject(args || {}),
      }),
      providesTags: [tagTypes.PRODUCTS],
    }),
    getManagedProducts: builder.query<
      ManagedProductsResponse,
      ManagedProductQuery | void
    >({
      query: (args) => ({
        url: "/products/manage",
        method: "GET",
        params: cleanObject(args || {}),
      }),
      providesTags: [tagTypes.PRODUCTS],
    }),
    getManagedProduct: builder.query<ManagedProductResponse, string>({
      query: (id) => ({
        url: `/products/manage/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        tagTypes.PRODUCTS,
        `${tagTypes.PRODUCTS}-${id}`,
      ],
    }),
    createProduct: builder.mutation<ManagedProductResponse, FormData>({
      query: (payload) => ({
        url: "/products",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.PRODUCTS],
    }),
    updateProduct: builder.mutation<
      ManagedProductResponse,
      { id: string; payload: FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        tagTypes.PRODUCTS,
        `${tagTypes.PRODUCTS}-${id}`,
      ],
    }),
    deleteProduct: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.PRODUCTS],
    }),
    restoreProduct: builder.mutation<ManagedProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.PRODUCTS],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetManagedProductsQuery,
  useGetManagedProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
