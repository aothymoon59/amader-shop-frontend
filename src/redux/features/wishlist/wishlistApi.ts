import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import type { Product } from "@/redux/features/products/productApi";

export type WishlistItem = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
};

export type WishlistData = {
  items: WishlistItem[];
  productIds: string[];
  total: number;
};

type WishlistResponse = {
  success: boolean;
  message?: string;
  data: WishlistData;
};

type ToggleWishlistResponse = {
  success: boolean;
  message?: string;
  data: {
    action: "added" | "removed";
    wishlist: WishlistData;
  };
};

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: [tagTypes.WISHLIST],
    }),
    addWishlistItem: builder.mutation<WishlistResponse, string>({
      query: (productId) => ({
        url: "/wishlist/items",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
    removeWishlistItem: builder.mutation<WishlistResponse, string>({
      query: (productId) => ({
        url: `/wishlist/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
    toggleWishlistItem: builder.mutation<ToggleWishlistResponse, string>({
      query: (productId) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
  useToggleWishlistItemMutation,
} = wishlistApi;
