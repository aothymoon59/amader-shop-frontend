import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type ChatUser = {
  id: string;
  name: string;
  email?: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";
  profileImage?: string | null;
  shopName?: string | null;
};

export type ChatAttachment = {
  url: string;
  publicId?: string;
  type: "image" | "file";
  resourceType?: string;
  name: string;
  mimeType?: string;
  size?: number;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body?: string | null;
  attachments: ChatAttachment[];
  replyToMessageId?: string | null;
  status: "SENT" | "DELIVERED" | "SEEN";
  deliveredAt?: string | null;
  seenAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: ChatUser | null;
  replyTo?: {
    id: string;
    body?: string | null;
    attachments: ChatAttachment[];
    sender?: Pick<ChatUser, "id" | "name" | "role"> | null;
  } | null;
};

export type ChatConversation = {
  id: string;
  type: "ORDER" | "ADMIN_SUPPORT";
  orderId?: string | null;
  providerId?: string | null;
  customerId?: string | null;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage | null;
  unreadCount: number;
};

type ChatConversationResponse = {
  success: boolean;
  message?: string;
  data: ChatConversation[];
};

type ChatMessagesResponse = {
  success: boolean;
  message?: string;
  data: ChatMessage[];
};

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatConversations: builder.query<ChatConversationResponse, void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      providesTags: [tagTypes.CHAT],
    }),
    getChatMessages: builder.query<
      ChatMessagesResponse,
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, arg) => [
        { type: tagTypes.CHAT, id: arg.conversationId },
      ],
    }),
    sendChatMessage: builder.mutation<
      { success: boolean; message?: string; data: ChatMessage },
      {
        conversationId: string;
        body?: string;
        replyToMessageId?: string | null;
        attachments?: File[];
      }
    >({
      query: ({ conversationId, body, replyToMessageId, attachments = [] }) => {
        const formData = new FormData();
        if (body) formData.append("body", body);
        if (replyToMessageId) formData.append("replyToMessageId", replyToMessageId);
        attachments.forEach((file) => formData.append("attachments", file));

        return {
          url: `/chat/conversations/${conversationId}/messages`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        tagTypes.CHAT,
        { type: tagTypes.CHAT, id: arg.conversationId },
      ],
    }),
    markChatRead: builder.mutation<
      { success: boolean; message?: string; data: { success: boolean } },
      string
    >({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        tagTypes.CHAT,
        { type: tagTypes.CHAT, id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetChatConversationsQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatReadMutation,
} = chatApi;
