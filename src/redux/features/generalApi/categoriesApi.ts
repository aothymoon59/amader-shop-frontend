import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoriesResponse = {
  success: boolean;
  message?: string;
  meta?: null;
  data: Category[];
};

export type CategoryResponse = {
  success: boolean;
  message?: string;
  meta?: null;
  data: Category;
};

export type CategoryPayload = {
  name: string;
};

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: [tagTypes.CATEGORIES],
    }),
    createCategory: builder.mutation<CategoryResponse, CategoryPayload>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.CATEGORIES],
    }),
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; payload: CategoryPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [tagTypes.CATEGORIES],
    }),
    deleteCategory: builder.mutation<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.CATEGORIES],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
