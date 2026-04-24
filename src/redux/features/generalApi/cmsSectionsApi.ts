import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import type {
  AboutPageSection,
  CommonCmsSection,
  ProductsPageSection,
} from "@/types/cmsSections";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type CmsSectionsPayload<T> = {
  sections: T[];
  updatedAt: string;
};

type CmsBannerUploadPayload = {
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

export const cmsSectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAboutPageSections: builder.query<
      ApiResponse<CmsSectionsPayload<AboutPageSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/about-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    updateAboutPageSections: builder.mutation<
      ApiResponse<CmsSectionsPayload<AboutPageSection>>,
      { sections: AboutPageSection[] }
    >({
      query: (body) => ({
        url: "/system-settings/about-page",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.HOME_PAGE_CMS, tagTypes.SYSTEM_SETTINGS],
    }),
    getPublicAboutPageSections: builder.query<
      ApiResponse<CmsSectionsPayload<AboutPageSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/public/about-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    getAdminCommonSections: builder.query<
      ApiResponse<CmsSectionsPayload<CommonCmsSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/common-sections",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    updateCommonSections: builder.mutation<
      ApiResponse<CmsSectionsPayload<CommonCmsSection>>,
      { sections: CommonCmsSection[] }
    >({
      query: (body) => ({
        url: "/system-settings/common-sections",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.HOME_PAGE_CMS, tagTypes.SYSTEM_SETTINGS],
    }),
    getPublicCommonSections: builder.query<
      ApiResponse<CmsSectionsPayload<CommonCmsSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/public/common-sections",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    getAdminProductsPageSections: builder.query<
      ApiResponse<CmsSectionsPayload<ProductsPageSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/products-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
    updateProductsPageSections: builder.mutation<
      ApiResponse<CmsSectionsPayload<ProductsPageSection>>,
      { sections: ProductsPageSection[] }
    >({
      query: (body) => ({
        url: "/system-settings/products-page",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.HOME_PAGE_CMS, tagTypes.SYSTEM_SETTINGS],
    }),
    uploadProductsPageHeroBannerImages: builder.mutation<
      ApiResponse<CmsBannerUploadPayload>,
      FormData
    >({
      query: (body) => ({
        url: "/system-settings/products-page/hero-banners",
        method: "POST",
        body,
      }),
    }),
    getPublicProductsPageSections: builder.query<
      ApiResponse<CmsSectionsPayload<ProductsPageSection>>,
      void
    >({
      query: () => ({
        url: "/system-settings/public/products-page",
        method: "GET",
      }),
      providesTags: [tagTypes.HOME_PAGE_CMS],
    }),
  }),
});

export const {
  useGetAdminAboutPageSectionsQuery,
  useUpdateAboutPageSectionsMutation,
  useGetPublicAboutPageSectionsQuery,
  useGetAdminCommonSectionsQuery,
  useUpdateCommonSectionsMutation,
  useGetPublicCommonSectionsQuery,
  useGetAdminProductsPageSectionsQuery,
  useUpdateProductsPageSectionsMutation,
  useUploadProductsPageHeroBannerImagesMutation,
  useGetPublicProductsPageSectionsQuery,
} = cmsSectionsApi;
