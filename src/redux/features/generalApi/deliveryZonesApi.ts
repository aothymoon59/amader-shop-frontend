import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type DeliveryZone = {
  id: string;
  name: string;
  slug: string;
  normalCharge: number;
  expressCharge: number;
  freeDeliveryThreshold?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type DeliveryZonesResponse = {
  success: boolean;
  message?: string;
  data: DeliveryZone[];
};

type DeliveryZoneResponse = {
  success: boolean;
  message?: string;
  data: DeliveryZone;
};

type DeliveryZonePayload = {
  name: string;
  normalCharge: number;
  expressCharge: number;
  freeDeliveryThreshold?: number | null;
  isActive?: boolean;
};

export const deliveryZonesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryZones: builder.query<DeliveryZonesResponse, void>({
      query: () => ({
        url: "/delivery-zones",
        method: "GET",
      }),
      providesTags: [tagTypes.DELIVERY_ZONES],
    }),
    getManagedDeliveryZones: builder.query<DeliveryZonesResponse, void>({
      query: () => ({
        url: "/delivery-zones/manage",
        method: "GET",
      }),
      providesTags: [tagTypes.DELIVERY_ZONES],
    }),
    createDeliveryZone: builder.mutation<DeliveryZoneResponse, DeliveryZonePayload>({
      query: (body) => ({
        url: "/delivery-zones",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.DELIVERY_ZONES],
    }),
    updateDeliveryZone: builder.mutation<
      DeliveryZoneResponse,
      { id: string; payload: Partial<DeliveryZonePayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/delivery-zones/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [tagTypes.DELIVERY_ZONES],
    }),
  }),
});

export const {
  useGetDeliveryZonesQuery,
  useGetManagedDeliveryZonesQuery,
  useCreateDeliveryZoneMutation,
  useUpdateDeliveryZoneMutation,
} = deliveryZonesApi;
