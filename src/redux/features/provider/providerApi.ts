import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "../../api/baseApi";

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyProvider: builder.mutation({
      query: (providerInfo) => ({
        url: "/providers/apply",
        method: "POST",
        body: providerInfo,
      }),
      invalidatesTags: [tagTypes.USER_INFO, tagTypes.PROVIDERS],
    }),
    updateProviderProfile: builder.mutation({
      query: ({
        id,
        payload,
      }: {
        id: string;
        payload: FormData;
      }) => ({
        url: `/providers/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [tagTypes.USER_INFO, tagTypes.PROVIDERS],
    }),
  }),
});

export const { useApplyProviderMutation, useUpdateProviderProfileMutation } =
  providerApi;
