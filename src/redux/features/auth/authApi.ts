import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "../../api/baseApi";
import { setUser, type TUser } from "./authSlice";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  meta: unknown;
  data: {
    user: TUser;
    accessToken: string;
  };
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.USER_INFO],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              user: data.data.user,
              token: data.data.accessToken,
            }),
          );
        } catch {
          // do nothing
        }
      },
    }),
    registerUser: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register-user",
        method: "POST",
        body: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.USER_INFO],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setUser({ user: null, token: null }));
        } catch {
          // do nothing
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterUserMutation, useLogoutMutation } =
  authApi;
