import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import type { HomePageSection, HomePageSectionsPayload } from "@/types/homePageCms";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type HeroBannerUploadPayload = {
  bannerImageUrls: string[];
  files: Array<{
    url: string;
    publicId: string;
    resourceType: string;
    format: string | null;
    bytes: number;
    originalName: string;
    mimeType: string;
  }>;
};

type UpdateHomePageSectionsPayload = {
  sections: HomePageSection[];
};

export const homePageCmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHomePageSections: builder.query<ApiResponse<HomePageSectionsPayload>, void>({
      query: () => ({
        url: "/system-settings/home-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    updateHomePageSections: builder.mutation<
      ApiResponse<HomePageSectionsPayload>,
      UpdateHomePageSectionsPayload
    >({
      query: (body) => ({
        url: "/system-settings/home-page",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.HOME_PAGE_CMS, tagTypes.SYSTEM_SETTINGS],
    }),
    uploadHeroBannerImages: builder.mutation<ApiResponse<HeroBannerUploadPayload>, FormData>({
      query: (body) => ({
        url: "/system-settings/home-page/hero-banners",
        method: "POST",
        body,
      }),
    }),
    getPublicHomePageSections: builder.query<ApiResponse<HomePageSectionsPayload>, void>({
      query: () => ({
        url: "/system-settings/public/home-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
  }),
});

export const {
  useGetAdminHomePageSectionsQuery,
  useGetPublicHomePageSectionsQuery,
  useUpdateHomePageSectionsMutation,
  useUploadHeroBannerImagesMutation,
} = homePageCmsApi;
