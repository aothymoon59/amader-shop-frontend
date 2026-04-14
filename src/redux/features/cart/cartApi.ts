import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "@/redux/api/baseApi";
import type { Product } from "@/redux/features/products/productApi";

export type CartProduct = Product;

export type CartApiItem = {
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
};

export type CartApiCart = {
  id: string;
  userId: string;
  items: CartApiItem[];
};

type CartResponse = {
  success: boolean;
  message?: string;
  data: CartApiCart;
};

type AddCartItemPayload = {
  productId: string;
  quantity: number;
};

type UpdateCartItemPayload = {
  productId: string;
  quantity: number;
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: [tagTypes.CART],
    }),
    addCartItem: builder.mutation<CartResponse, AddCartItemPayload>({
      query: (payload) => ({
        url: "/cart/items",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    updateCartItem: builder.mutation<CartResponse, UpdateCartItemPayload>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.CART],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
