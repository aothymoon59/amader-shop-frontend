import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type SystemCurrency = {
  code: string;
  symbol: string;
  name: string;
};

export type SystemSettings = {
  id: string;
  currency: SystemCurrency;
  commission: {
    enabled: boolean;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    balanceReleaseDelayDays: number;
  };
  createdAt: string;
  updatedAt: string;
};

type SystemSettingsResponse = {
  success: boolean;
  message?: string;
  data: SystemSettings;
};

type UpdateSystemSettingsPayload = {
  currency?: SystemCurrency;
  commission?: SystemSettings["commission"];
};

export const defaultSystemCurrency: SystemCurrency = {
  code: "BDT",
  symbol: "৳",
  name: "Bangladeshi Taka",
};

export const systemSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSettings: builder.query<SystemSettingsResponse, void>({
      query: () => ({
        url: "/system-settings",
        method: "GET",
      }),
      providesTags: [tagTypes.SYSTEM_SETTINGS],
    }),
    updateSystemSettings: builder.mutation<
      SystemSettingsResponse,
      UpdateSystemSettingsPayload
    >({
      query: (body) => ({
        url: "/system-settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.SYSTEM_SETTINGS, tagTypes.WALLET],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = systemSettingsApi;
