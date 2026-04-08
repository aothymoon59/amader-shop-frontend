import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type AdminCreateProviderPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  shopName: string;
  businessType: string;
  address: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  description?: string;
};

export const providerManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProviders: builder.query({
      query: (args) => {
        const filteredParams = cleanObject(args);
        return {
          url: "/providers",
          method: "GET",
          params: filteredParams,
        };
      },
      providesTags: [tagTypes.PROVIDERS],
    }),
    createProviderByAdmin: builder.mutation({
      query: (payload: FormData) => ({
        url: "/providers/admin-create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
    approveProvider: builder.mutation({
      query: (id: string) => ({
        url: `/providers/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
    rejectProvider: builder.mutation({
      query: (id: string) => ({
        url: `/providers/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
  }),
});

export const {
  useGetAllProvidersQuery,
  useCreateProviderByAdminMutation,
  useApproveProviderMutation,
  useRejectProviderMutation,
} = providerManagementApi;
