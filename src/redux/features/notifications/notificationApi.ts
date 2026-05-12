import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type AppNotification = {
  id: string;
  recipientUserId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string | null;
  metadata?: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type NotificationListResponse = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    unreadCount?: number;
  };
  data: AppNotification[];
};

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      NotificationListResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params: params || { page: 1, limit: 10 },
      }),
      providesTags: [tagTypes.NOTIFICATIONS],
    }),
    markNotificationRead: builder.mutation<
      { success: boolean; message?: string; data: AppNotification },
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),
    markAllNotificationsRead: builder.mutation<
      { success: boolean; message?: string; data: { success: boolean } },
      void
    >({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
