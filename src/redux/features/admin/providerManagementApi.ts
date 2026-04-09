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

export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

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
    updateProvider: builder.mutation({
      query: ({ id, payload }: { id: string; payload: FormData }) => ({
        url: `/providers/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
    updateProviderStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: Exclude<ProviderStatus, "PENDING"> }) => ({
        url: `/providers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
    updateProviderActiveState: builder.mutation({
      query: ({ id, isActive }: { id: string; isActive: boolean }) => ({
        url: `/providers/${id}/active`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: [tagTypes.PROVIDERS],
    }),
  }),
});

export const {
  useGetAllProvidersQuery,
  useCreateProviderByAdminMutation,
  useUpdateProviderMutation,
  useUpdateProviderStatusMutation,
  useUpdateProviderActiveStateMutation,
} = providerManagementApi;
