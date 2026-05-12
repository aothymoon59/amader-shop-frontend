import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Reply,
  Search,
  Send,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Empty, Input, Spin, Typography } from "antd";

import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  chatApi,
  type ChatConversation,
  type ChatMessage,
  useGetChatConversationsQuery,
  useGetChatMessagesQuery,
  useMarkChatReadMutation,
  useSendChatMessageMutation,
} from "@/redux/features/chat/chatApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { tagTypes } from "@/redux/tagTypes";
import { cn } from "@/lib/utils";

const socketUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const formatTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const getConversationLabel = (
  conversation: ChatConversation,
  currentUserId?: string,
) => {
  const otherParticipants = conversation.participants.filter(
    (participant) => participant.id !== currentUserId,
  );

  if (conversation.type === "ADMIN_SUPPORT") {
    const provider =
      conversation.participants.find((participant) => participant.role === "PROVIDER") ||
      otherParticipants[0];
    return provider?.shopName || provider?.name || conversation.title || "Admin support";
  }

  const other = otherParticipants[0];
  return conversation.title || other?.shopName || other?.name || "Order chat";
};

const getOtherParticipant = (
  conversation: ChatConversation,
  currentUserId?: string,
) =>
  conversation.participants.find((participant) => participant.id !== currentUserId) ||
  conversation.participants[0] ||
  null;

const getConversationSubtitle = (
  conversation: ChatConversation,
  currentUserId?: string,
) => {
  const others = conversation.participants.filter(
    (participant) => participant.id !== currentUserId,
  );

  if (conversation.type === "ADMIN_SUPPORT") {
    return "Provider and admin support";
  }

  return others
    .map((participant) => participant.shopName || participant.name)
    .join(", ");
};

const getConversationDetails = (
  conversation: ChatConversation,
  currentUserId?: string,
) => {
  const other = getOtherParticipant(conversation, currentUserId);
  const provider = conversation.participants.find(
    (participant) => participant.role === "PROVIDER",
  );
  const orderName = conversation.type === "ORDER" ? conversation.title : null;
  const shopName = provider?.shopName || null;
  const oppositeName = other?.name || other?.shopName || getConversationLabel(conversation, currentUserId);

  return {
    oppositeName,
    shopName,
    orderName,
    subtitle:
      [shopName, orderName].filter(Boolean).join(" • ") ||
      getConversationSubtitle(conversation, currentUserId),
    lastMessage:
      conversation.lastMessage?.body ||
      conversation.lastMessage?.attachments?.[0]?.name ||
      "No messages yet",
  };
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (data?.message) return String(data.message);
  }

  return "Message could not be sent.";
};

const ChatStatus = ({ message }: { message: ChatMessage }) => {
  if (message.status === "SEEN") {
    return <CheckCheck className="h-3.5 w-3.5 text-sky-500" />;
  }

  if (message.status === "DELIVERED") {
    return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  }

  return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
};

const ChatPage = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(useCurrentToken);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(true);

  const { data: conversationsResponse, isLoading: conversationsLoading } =
    useGetChatConversationsQuery();
  const conversations = conversationsResponse?.data ?? [];
  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ||
    conversations[0] ||
    null;
  const activeConversationId = selectedConversation?.id || "";

  const { data: messagesResponse, isLoading: messagesLoading } =
    useGetChatMessagesQuery(
      { conversationId: activeConversationId, limit: 80 },
      { skip: !activeConversationId },
    );
  const [sendChatMessage, { isLoading: sending }] = useSendChatMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();
  const messages = messagesResponse?.data ?? [];

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;

    return conversations.filter((conversation) => {
      const label = getConversationLabel(conversation, user?.id).toLowerCase();
      const subtitle = getConversationSubtitle(conversation, user?.id).toLowerCase();
      return label.includes(normalizedQuery) || subtitle.includes(normalizedQuery);
    });
  }, [conversations, query, user?.id]);

  useEffect(() => {
    if (!selectedConversationId && conversations[0]) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    void markChatRead(activeConversationId).catch(() => null);
  }, [activeConversationId, markChatRead, messages.length]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeConversationId]);

  useEffect(() => {
    if (!token || !socketUrl) return;

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("chat:message:new", (payload: { conversationId: string }) => {
      dispatch(chatApi.util.invalidateTags([tagTypes.CHAT]));
      dispatch(
        chatApi.util.invalidateTags([
          { type: tagTypes.CHAT, id: payload.conversationId },
        ]),
      );
    });

    socket.on("chat:read", (payload: { conversationId: string }) => {
      dispatch(chatApi.util.invalidateTags([tagTypes.CHAT]));
      dispatch(
        chatApi.util.invalidateTags([
          { type: tagTypes.CHAT, id: payload.conversationId },
        ]),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, token]);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setAttachments((current) => [...current, ...Array.from(files)].slice(0, 5));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!activeConversationId || sending) return;
    if (!draft.trim() && !attachments.length) return;

    try {
      await sendChatMessage({
        conversationId: activeConversationId,
        body: draft.trim(),
        attachments,
        replyToMessageId: replyTo?.id,
      }).unwrap();

      setDraft("");
      setAttachments([]);
      setReplyTo(null);
    } catch (error) {
      toast({
        title: "Message failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100dvh-5rem)] min-h-0 overflow-hidden rounded-xl border bg-card md:h-[calc(100dvh-8rem)]">
      <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)]">
        <aside
          className={cn(
            "flex h-full min-h-0 flex-col border-r bg-background md:flex",
            mobileListOpen ? "flex" : "hidden",
          )}
        >
          <div className="shrink-0 border-b p-4">
            <Typography.Title level={4} className="!mb-3">
              Chats
            </Typography.Title>
            <Input
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              placeholder="Search conversations"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {conversationsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spin />
              </div>
            ) : filteredConversations.length ? (
              filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const details = getConversationDetails(conversation, user?.id);
                const avatarText = details.oppositeName.charAt(0).toUpperCase();

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      setSelectedConversationId(conversation.id);
                      setMobileListOpen(false);
                    }}
                    className={cn(
                      "mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-secondary/60",
                      isActive && "bg-secondary",
                    )}
                  >
                    <Badge count={conversation.unreadCount} size="small">
                      <Avatar>{avatarText}</Avatar>
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {details.oppositeName}
                      </div>
                      {details.subtitle ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {details.subtitle}
                        </div>
                      ) : null}
                      <div className="mt-0.5 truncate text-xs text-muted-foreground/80">
                        {details.lastMessage}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <Empty description="No conversations yet" />
            )}
          </div>
        </aside>

        <section
          className={cn(
            "h-full min-h-0 min-w-0 flex-col",
            mobileListOpen ? "hidden md:flex" : "flex",
          )}
        >
          {selectedConversation ? (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
                <Button
                  type="text"
                  shape="circle"
                  className="md:hidden"
                  onClick={() => setMobileListOpen(true)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  {getConversationLabel(selectedConversation, user?.id)
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-semibold">
                    {getConversationDetails(selectedConversation, user?.id).oppositeName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {getConversationDetails(selectedConversation, user?.id).subtitle}
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-secondary/20 p-4">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Spin />
                  </div>
                ) : messages.length ? (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isMine = message.senderId === user?.id;

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[86%] rounded-2xl border px-3 py-2 shadow-sm md:max-w-[68%]",
                              isMine
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md bg-background",
                            )}
                          >
                            {!isMine ? (
                              <div className="mb-1 text-xs font-medium text-muted-foreground">
                                {message.sender?.name || "User"}
                              </div>
                            ) : null}

                            {message.replyTo ? (
                              <div
                                className={cn(
                                  "mb-2 rounded-lg border-l-2 px-2 py-1 text-xs",
                                  isMine
                                    ? "border-primary-foreground/70 bg-primary-foreground/10"
                                    : "border-primary bg-secondary",
                                )}
                              >
                                <div className="font-medium">
                                  {message.replyTo.sender?.name || "Reply"}
                                </div>
                                <div className="line-clamp-2 opacity-80">
                                  {message.replyTo.body ||
                                    message.replyTo.attachments?.[0]?.name ||
                                    "Attachment"}
                                </div>
                              </div>
                            ) : null}

                            {message.body ? (
                              <div className="whitespace-pre-wrap text-sm">
                                {message.body}
                              </div>
                            ) : null}

                            {message.attachments.length ? (
                              <div className="mt-2 grid gap-2">
                                {message.attachments.map((attachment) =>
                                  attachment.type === "image" ? (
                                    <a
                                      key={attachment.url}
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block overflow-hidden rounded-lg border bg-background"
                                    >
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="max-h-56 w-full object-cover"
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      key={attachment.url}
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={cn(
                                        "flex items-center gap-2 rounded-lg border p-2 text-sm",
                                        isMine
                                          ? "bg-primary-foreground/10 text-primary-foreground"
                                          : "bg-secondary text-foreground",
                                      )}
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="truncate">{attachment.name}</span>
                                    </a>
                                  ),
                                )}
                              </div>
                            ) : null}

                            <div
                              className={cn(
                                "mt-1 flex items-center justify-end gap-1 text-[11px]",
                                isMine
                                  ? "text-primary-foreground/75"
                                  : "text-muted-foreground",
                              )}
                            >
                              <Button
                                type="text"
                                size="small"
                                className={cn(
                                  "h-6 px-1",
                                  isMine && "text-primary-foreground/80",
                                )}
                                onClick={() => setReplyTo(message)}
                              >
                                <Reply className="h-3.5 w-3.5" />
                              </Button>
                              <span>{formatTime(message.createdAt)}</span>
                              {isMine ? <ChatStatus message={message} /> : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Empty description="Start the conversation" />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t bg-background p-3">
                {replyTo ? (
                  <div className="mb-2 flex items-start justify-between gap-3 rounded-lg border bg-secondary/50 p-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium">
                        Replying to {replyTo.sender?.name || "message"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {replyTo.body || replyTo.attachments?.[0]?.name || "Attachment"}
                      </div>
                    </div>
                    <Button type="text" size="small" onClick={() => setReplyTo(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}

                {attachments.length ? (
                  <div className="mb-2 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
                    {attachments.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1 text-xs"
                      >
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-3.5 w-3.5" />
                        ) : (
                          <FileText className="h-3.5 w-3.5" />
                        )}
                        <span className="max-w-[160px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments((current) =>
                              current.filter((item) => item !== file),
                            )
                          }
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-end gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.zip"
                    className="hidden"
                    onChange={(event) => handleFiles(event.target.files)}
                  />
                  <Button
                    shape="circle"
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input.TextArea
                    className="min-w-0 flex-1"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Write a message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onPressEnter={(event) => {
                      if (!event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    className="shrink-0"
                    loading={sending}
                    onClick={handleSend}
                    disabled={!draft.trim() && !attachments.length}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Empty description="No chat selected" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatPage;
