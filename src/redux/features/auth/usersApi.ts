import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "../../api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: [tagTypes.USER_INFO],
    }),
  }),
});

export const { useGetMeQuery } = usersApi;
