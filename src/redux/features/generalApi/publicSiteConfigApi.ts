import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import type {
  SeoConfigRecord,
  SystemSettings,
} from "@/redux/features/generalApi/systemSettingsApi";
import type {
  AboutPageSection,
  CommonCmsSection,
  HomePageSection,
} from "@/types/cmsSections";

export type PublicSiteConfig = {
  siteOverview: SystemSettings["siteOverview"];
  homePageSections: HomePageSection[];
  aboutPageSections: AboutPageSection[];
  commonSections: CommonCmsSection[];
  seoConfigs: SeoConfigRecord[];
  gaGtmConfig: SystemSettings["gaGtmConfig"];
  socialMediaConfig: SystemSettings["socialMediaConfig"];
  updatedAt: string;
};

type PublicSiteConfigResponse = {
  success: boolean;
  message?: string;
  data: PublicSiteConfig;
};

export const publicSiteConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicSiteConfig: builder.query<PublicSiteConfigResponse, void>({
      query: () => ({
        url: "/system-settings/public",
        method: "GET",
      }),
      providesTags: [tagTypes.SYSTEM_SETTINGS],
    }),
  }),
});

export const { useGetPublicSiteConfigQuery } = publicSiteConfigApi;
