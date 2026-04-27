import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";
import { cleanObject } from "@/utils/cleanObject";

export type ContactMessageStatus = "NEW" | "READ" | "REPLIED";

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  adminReply?: string | null;
  repliedAt?: string | null;
  repliedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ListResponse<T> = {
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data: T[];
};

export type CreateContactMessagePayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

type ContactMessageQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactMessageStatus;
};

export const contactMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContactMessage: builder.mutation<
      ApiResponse<ContactMessageRecord>,
      CreateContactMessagePayload
    >({
      query: (body) => ({
        url: "/contact-messages",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: tagTypes.CONTACT_MESSAGES, id: "LIST" }],
    }),
    getContactMessages: builder.query<
      ListResponse<ContactMessageRecord>,
      ContactMessageQuery | void
    >({
      query: (query) => ({
        url: "/contact-messages/management",
        method: "GET",
        params: cleanObject(query || {}),
      }),
      providesTags: (result) => [
        { type: tagTypes.CONTACT_MESSAGES, id: "LIST" },
        ...(result?.data?.map((message) => ({
          type: tagTypes.CONTACT_MESSAGES,
          id: message.id,
        })) || []),
      ],
    }),
    getContactMessageById: builder.query<ApiResponse<ContactMessageRecord>, string>({
      query: (messageId) => ({
        url: `/contact-messages/${messageId}`,
        method: "GET",
      }),
      providesTags: (result, error, messageId) => [
        { type: tagTypes.CONTACT_MESSAGES, id: messageId },
      ],
    }),
    replyToContactMessage: builder.mutation<
      ApiResponse<ContactMessageRecord>,
      { messageId: string; reply: string }
    >({
      query: ({ messageId, reply }) => ({
        url: `/contact-messages/${messageId}/reply`,
        method: "PATCH",
        body: { reply },
      }),
      invalidatesTags: (result, error, payload) => [
        { type: tagTypes.CONTACT_MESSAGES, id: "LIST" },
        { type: tagTypes.CONTACT_MESSAGES, id: payload.messageId },
      ],
    }),
  }),
});

export const {
  useCreateContactMessageMutation,
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useReplyToContactMessageMutation,
} = contactMessagesApi;
