import { baseApi } from "../../api/baseApi";

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyProvider: builder.mutation({
      query: (providerInfo) => ({
        url: "/providers/apply",
        method: "POST",
        body: providerInfo,
      }),
    }),
  }),
});

export const { useApplyProviderMutation } = providerApi;
