import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.USER_INFO],
    }),
  }),
});

export const { useGetProfileQuery } = authApi;
