import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type WalletSummary = {
  id: string;
  providerId: string;
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
};

export type WalletTransaction = {
  id: string;
  providerId: string;
  orderId?: string | null;
  withdrawalRequestId?: string | null;
  type: string;
  status: string;
  amount: number;
  grossAmount?: number | null;
  commissionAmount?: number | null;
  netAmount?: number | null;
  description?: string | null;
  availableAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WithdrawRequestPaymentSettings = {
  id: string;
  providerId: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  mobileBankType: "BKASH" | "NAGAD" | "ROCKET" | "NONE";
  mobileBankNumber: string | null;
  documentUrl: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPaymentConfigured: true;
};

export type WithdrawRequest = {
  id: string;
  providerId: string;
  amount: number;
  status: string;
  adminNotes?: string | null;
  payoutMethod?: string | null;
  payoutReference?: string | null;
  reviewedById?: string | null;
  requestedAt: string;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  providerName?: string;
  providerEmail?: string;
  paymentSettings?: WithdrawRequestPaymentSettings | null;
};

export type EffectiveCommission = {
  source: "GLOBAL" | "PROVIDER";
  enabled: boolean;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  providerBalanceReleaseDelayDays: number;
  useCustomCommission: boolean;
};

type ProviderWalletResponse = {
  success: boolean;
  message?: string;
  data: {
    wallet: WalletSummary;
    commission: EffectiveCommission;
    transactions: WalletTransaction[];
    withdrawRequests: WithdrawRequest[];
  };
};

type AdminWalletOverviewResponse = {
  success: boolean;
  message?: string;
  data: {
    summary: {
      totalAvailableBalance: number;
      totalPendingBalance: number;
      totalLockedBalance: number;
      totalEarned: number;
      totalWithdrawn: number;
      totalCommissionBalance: number;
      pendingCommissionBalance: number;
      availableCommissionBalance: number;
    };
    commission: {
      enabled: boolean;
      type: "PERCENTAGE" | "FIXED";
      value: number;
      balanceReleaseDelayDays: number;
    };
    wallets: Array<WalletSummary & {
      providerName?: string;
      providerEmail?: string;
      shopName?: string;
      totalCommissionEarned?: number;
    }>;
    withdrawRequests: WithdrawRequest[];
  };
};

type ProviderCommissionResponse = {
  success: boolean;
  message?: string;
  data: {
    providerId: string;
    useCustomCommission: boolean;
    commissionEnabled: boolean;
    commissionType: "PERCENTAGE" | "FIXED";
    commissionValue: number;
    effectiveCommission: EffectiveCommission;
  };
};

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWallet: builder.query<ProviderWalletResponse, void>({
      query: () => ({
        url: "/wallet/me",
        method: "GET",
      }),
      providesTags: [tagTypes.USER_INFO, tagTypes.WALLET],
    }),
    createWithdrawRequest: builder.mutation<
      { success: boolean; message?: string; data: WithdrawRequest },
      { amount: number }
    >({
      query: (body) => ({
        url: "/wallet/withdraw-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.USER_INFO, tagTypes.WALLET],
    }),
    getAdminWalletOverview: builder.query<AdminWalletOverviewResponse, void>({
      query: () => ({
        url: "/wallet/admin-overview",
        method: "GET",
      }),
      providesTags: [tagTypes.WALLET, tagTypes.PROVIDERS],
    }),
    reviewWithdrawRequest: builder.mutation<
      { success: boolean; message?: string; data: WithdrawRequest },
      {
        id: string;
        status: "APPROVED" | "REJECTED";
        adminNotes?: string;
        payoutMethod?: string;
        payoutReference?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/wallet/withdraw-requests/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.WALLET, tagTypes.PROVIDERS],
    }),
    getProviderCommissionSettings: builder.query<ProviderCommissionResponse, string>({
      query: (providerId) => ({
        url: `/wallet/provider-commission/${providerId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PROVIDERS, tagTypes.SYSTEM_SETTINGS],
    }),
    updateProviderCommissionSettings: builder.mutation<
      ProviderCommissionResponse,
      {
        providerId: string;
        useCustomCommission: boolean;
        commissionEnabled: boolean;
        commissionType: "PERCENTAGE" | "FIXED";
        commissionValue: number;
      }
    >({
      query: ({ providerId, ...body }) => ({
        url: `/wallet/provider-commission/${providerId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.PROVIDERS, tagTypes.SYSTEM_SETTINGS],
    }),
  }),
});

export const {
  useGetMyWalletQuery,
  useCreateWithdrawRequestMutation,
  useGetAdminWalletOverviewQuery,
  useReviewWithdrawRequestMutation,
  useGetProviderCommissionSettingsQuery,
  useUpdateProviderCommissionSettingsMutation,
} = walletApi;
