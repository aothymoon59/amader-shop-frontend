import { tagTypes } from "@/redux/tagTypes";
import { baseApi } from "../../api/baseApi";

export type MobileBankType = "BKASH" | "NAGAD" | "ROCKET" | "NONE";
export type AccountType = "SAVINGS" | "CURRENT";

export type ProviderPaymentSettings = {
  id: string;
  providerId: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: AccountType;
  mobileBankType: MobileBankType;
  mobileBankNumber: string | null;
  documentUrl: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPaymentConfigured: true;
};

type ProviderPaymentSettingsResponse = {
  success: boolean;
  message?: string;
  data:
    | ProviderPaymentSettings
    | {
        isPaymentConfigured: false;
        paymentSettings: null;
      };
};

export const providerPaymentSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPaymentSettings: builder.query<ProviderPaymentSettingsResponse, void>({
      query: () => ({
        url: "/provider-payment-settings/me",
        method: "GET",
      }),
      providesTags: [
        tagTypes.PROVIDER_PAYMENT_SETTINGS,
        tagTypes.USER_INFO,
      ],
    }),
    upsertMyPaymentSettings: builder.mutation<
      ProviderPaymentSettingsResponse,
      FormData
    >({
      query: (payload) => ({
        url: "/provider-payment-settings/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        tagTypes.PROVIDER_PAYMENT_SETTINGS,
        tagTypes.USER_INFO,
      ],
    }),
  }),
});

export const {
  useGetMyPaymentSettingsQuery,
  useUpsertMyPaymentSettingsMutation,
} = providerPaymentSettingsApi;
