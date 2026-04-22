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
  siteOverview: {
    name: string;
    description: string;
    copyrights: string;
    logoUrl: string;
    faviconUrl: string;
  };
  seoConfigs: SeoConfigRecord[];
  gaGtmConfig: {
    googleAnalyticsMeasurementId: string;
    googleTagManagerId: string;
  };
  emailCloudinaryConfig: {
    emailFromName: string;
    emailFromAddress: string;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSecure: boolean;
    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;
    cloudinaryUploadPreset: string;
    cloudinaryFolder: string;
  };
  socialMediaConfig: {
    facebookUrl: string;
    instagramUrl: string;
    xUrl: string;
    youtubeUrl: string;
    linkedinUrl: string;
    tiktokUrl: string;
    whatsappUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type SeoConfigRecord = {
  id?: number;
  page: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  twitter_card_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  robots_directive?: string;
  created_at?: string;
  updated_at?: string;
};

type SystemSettingsResponse = {
  success: boolean;
  message?: string;
  data: SystemSettings;
};

type UpdateSystemSettingsPayload = {
  currency?: SystemCurrency;
  commission?: SystemSettings["commission"];
  siteOverview?: Partial<SystemSettings["siteOverview"]>;
  seoConfigs?: SeoConfigRecord[];
  gaGtmConfig?: Partial<SystemSettings["gaGtmConfig"]>;
  emailCloudinaryConfig?: Partial<SystemSettings["emailCloudinaryConfig"]>;
  socialMediaConfig?: Partial<SystemSettings["socialMediaConfig"]>;
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
    updateSiteOverviewSettings: builder.mutation<SystemSettingsResponse, FormData>({
      query: (body) => ({
        url: "/system-settings/site-overview",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.SYSTEM_SETTINGS],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useUpdateSiteOverviewSettingsMutation,
} = systemSettingsApi;
