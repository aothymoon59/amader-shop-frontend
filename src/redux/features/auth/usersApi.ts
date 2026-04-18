import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";
import { setUser, type TUser } from "./authSlice";
import type { RootState } from "../../store";

type GetMeResponse = {
  success: boolean;
  message?: string;
  data: TUser;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "CUSTOMER";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  archivedAt: string | null;
  personalContact: string | null;
  personalAddress: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  createdAt: string;
  isPaymentConfigured?: boolean;
  providerProfile?: unknown | null;
};

type UsersListResponse = {
  success: boolean;
  message: string;
  meta?: {
    paginate?: boolean;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: UserRecord[];
};

type GetUsersArgs = {
  search?: string;
  role?: UserRole;
  paginate?: boolean;
  page?: number;
  limit?: number;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, GetUsersArgs | void>({
      query: (args) => ({
        url: "/users",
        method: "GET",
        params: cleanObject({
          search: args?.search,
          role: args?.role,
          paginate:
            typeof args?.paginate === "boolean"
              ? String(args.paginate)
              : undefined,
          page: args?.page,
          limit: args?.limit,
        }),
      }),
      providesTags: [tagTypes.USERS],
    }),
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
    updateMe: builder.mutation<GetMeResponse, FormData>({
      query: (payload) => ({
        url: "/users/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [tagTypes.USER_INFO],
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
          // Keep current state on failed profile update.
        }
      },
    }),
    changePassword: builder.mutation<
      { success: boolean; message?: string; data: { updated: boolean } },
      ChangePasswordPayload
    >({
      query: (payload) => ({
        url: "/users/change-password",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
} = usersApi;
