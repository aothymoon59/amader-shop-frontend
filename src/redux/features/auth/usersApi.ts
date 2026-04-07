import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "../../api/baseApi";
import { setUser, type TUser } from "./authSlice";
import type { RootState } from "../../store";

type GetMeResponse = {
  success: boolean;
  message?: string;
  data: TUser;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }),
      providesTags: [tagTypes.USER_INFO],
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = (getState() as RootState).auth.token;

          dispatch(
            setUser({
              user: data.data,
              token,
            }),
          );
        } catch {
          // Keep existing auth state when profile fetch fails.
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = usersApi;
