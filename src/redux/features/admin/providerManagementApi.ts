import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

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
  }),
});

export const { useGetAllProvidersQuery } = providerManagementApi;
