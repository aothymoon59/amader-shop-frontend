import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";
import { baseApi } from "../../api/baseApi";

type AdminActor = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminRecord = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  isActive: boolean;
  createdById: string | null;
  archivedAt: string | null;
  archivedById: string | null;
  personalContact: string | null;
  personalAddress: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: AdminActor | null;
  archivedBy: AdminActor | null;
};

type AdminListResponse = {
  success: boolean;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data: AdminRecord[];
};

type AdminResponse = {
  success: boolean;
  message: string;
  data: AdminRecord;
};

type GetAdminsArgs = {
  search?: string;
  archived?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

type CreateAdminPayload = {
  name: string;
  email: string;
  password: string;
  personalContact?: string;
  personalAddress?: string;
};

type UpdateAdminPayload = {
  id: string;
  payload: {
    name?: string;
    email?: string;
    password?: string;
    personalContact?: string;
    personalAddress?: string;
  };
};

export const adminManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminListResponse, GetAdminsArgs | void>({
      query: (args) => ({
        url: "/super-admin/admins",
        method: "GET",
        params: cleanObject({
          search: args?.search,
          archived:
            typeof args?.archived === "boolean" ? String(args.archived) : undefined,
          isActive:
            typeof args?.isActive === "boolean" ? String(args.isActive) : undefined,
          page: args?.page,
          limit: args?.limit,
        }),
      }),
      providesTags: [tagTypes.ADMINS],
    }),
    createAdmin: builder.mutation<AdminResponse, CreateAdminPayload>({
      query: (payload) => ({
        url: "/super-admin/admins",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.ADMINS],
    }),
    updateAdmin: builder.mutation<AdminResponse, UpdateAdminPayload>({
      query: ({ id, payload }) => ({
        url: `/super-admin/admins/${id}`,
        method: "PATCH",
        body: cleanObject(payload),
      }),
      invalidatesTags: [tagTypes.ADMINS],
    }),
    updateAdminActive: builder.mutation<
      AdminResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/super-admin/admins/${id}/active`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: [tagTypes.ADMINS],
    }),
    archiveAdmin: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/super-admin/admins/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.ADMINS],
    }),
    restoreAdmin: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/super-admin/admins/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.ADMINS],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminActiveMutation,
  useArchiveAdminMutation,
  useRestoreAdminMutation,
} = adminManagementApi;
