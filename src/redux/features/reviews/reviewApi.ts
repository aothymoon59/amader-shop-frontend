import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
};

export type ReviewReply = {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    role: string;
    shopName?: string | null;
  };
};

export type ReviewRecord = {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email?: string | null;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
    shopName?: string | null;
  } | null;
  replies: ReviewReply[];
};

export type ReviewEligibility = {
  canReview: boolean;
  reason?: string | null;
  hasReviewed: boolean;
  deliveredPurchaseExists: boolean;
  orderId?: string;
  orderNumber?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ListResponse<T> = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: T[];
};

type ProductReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
};

type ReviewListQuery = {
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<
      ApiResponse<{
        product: {
          id: string;
          name: string;
          slug: string;
        };
        summary: ReviewSummary;
        reviews: ReviewRecord[];
      }>,
      string
    >({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: tagTypes.REVIEWS, id: `PRODUCT-${productId}` },
        ...(result?.data?.reviews?.map((review) => ({
          type: tagTypes.REVIEWS,
          id: review.id,
        })) || []),
      ],
    }),
    getReviewEligibility: builder.query<ApiResponse<ReviewEligibility>, string>({
      query: (productId) => ({
        url: `/reviews/product/${productId}/eligibility`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: tagTypes.REVIEWS, id: `ELIGIBILITY-${productId}` },
      ],
    }),
    createReview: builder.mutation<ApiResponse<ReviewRecord>, ProductReviewPayload>({
      query: (payload) => ({
        url: "/reviews",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: tagTypes.REVIEWS, id: `PRODUCT-${payload.productId}` },
        { type: tagTypes.REVIEWS, id: `ELIGIBILITY-${payload.productId}` },
        { type: tagTypes.REVIEWS, id: "FEATURED-LIST" },
        { type: tagTypes.PRODUCT, id: payload.productId },
        { type: tagTypes.PRODUCT, id: "LIST" },
      ],
    }),
    createReply: builder.mutation<
      ApiResponse<ReviewReply>,
      { reviewId: string; comment: string; productId: string }
    >({
      query: ({ reviewId, comment }) => ({
        url: `/reviews/${reviewId}/replies`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, payload) => [
        { type: tagTypes.REVIEWS, id: payload.reviewId },
        { type: tagTypes.REVIEWS, id: `PRODUCT-${payload.productId}` },
      ],
    }),
    getFeaturedReviews: builder.query<ApiResponse<ReviewRecord[]>, { limit?: number } | void>({
      query: (query) => ({
        url: "/reviews/featured",
        method: "GET",
        params: cleanObject(query || {}),
      }),
      providesTags: [{ type: tagTypes.REVIEWS, id: "FEATURED-LIST" }],
    }),
    getAdminReviews: builder.query<ListResponse<ReviewRecord>, ReviewListQuery | void>({
      query: (query) => ({
        url: "/reviews/management",
        method: "GET",
        params: cleanObject(query || {}),
      }),
      providesTags: (result) => [
        { type: tagTypes.REVIEWS, id: "ADMIN-LIST" },
        ...(result?.data?.map((review) => ({
          type: tagTypes.REVIEWS,
          id: review.id,
        })) || []),
      ],
    }),
    getProviderReviews: builder.query<ListResponse<ReviewRecord>, ReviewListQuery | void>({
      query: (query) => ({
        url: "/reviews/provider",
        method: "GET",
        params: cleanObject(query || {}),
      }),
      providesTags: (result) => [
        { type: tagTypes.REVIEWS, id: "PROVIDER-LIST" },
        ...(result?.data?.map((review) => ({
          type: tagTypes.REVIEWS,
          id: review.id,
        })) || []),
      ],
    }),
    getReviewById: builder.query<ApiResponse<ReviewRecord>, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "GET",
      }),
      providesTags: (result, error, reviewId) => [
        { type: tagTypes.REVIEWS, id: reviewId },
      ],
    }),
    toggleFeaturedReview: builder.mutation<
      ApiResponse<ReviewRecord>,
      { reviewId: string; isFeatured: boolean; productId: string }
    >({
      query: ({ reviewId, isFeatured }) => ({
        url: `/reviews/${reviewId}/feature`,
        method: "PATCH",
        body: { isFeatured },
      }),
      invalidatesTags: (result, error, payload) => [
        { type: tagTypes.REVIEWS, id: payload.reviewId },
        { type: tagTypes.REVIEWS, id: "ADMIN-LIST" },
        { type: tagTypes.REVIEWS, id: "PROVIDER-LIST" },
        { type: tagTypes.REVIEWS, id: "FEATURED-LIST" },
        { type: tagTypes.REVIEWS, id: `PRODUCT-${payload.productId}` },
      ],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
  useCreateReplyMutation,
  useGetFeaturedReviewsQuery,
  useGetAdminReviewsQuery,
  useGetProviderReviewsQuery,
  useGetReviewByIdQuery,
  useToggleFeaturedReviewMutation,
} = reviewApi;
