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
  Sparkles,
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
import { formatDateTime } from "@/utils/dateFormatter";

const socketUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const maxAttachmentSize = 10 * 1024 * 1024;
const maxAttachmentCount = 5;
const acceptedAttachmentTypes = [
  "image/",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
];

const getConversationLabel = (
  conversation: ChatConversation,
  currentUserId?: string,
) => {
  const otherParticipants = conversation.participants.filter(
    (participant) => participant.id !== currentUserId,
  );

  if (conversation.type === "ADMIN_SUPPORT") {
    const provider =
      conversation.participants.find(
        (participant) => participant.role === "PROVIDER",
      ) || otherParticipants[0];
    return (
      provider?.shopName ||
      provider?.name ||
      conversation.title ||
      "Admin support"
    );
  }

  const other = otherParticipants[0];
  return conversation.title || other?.shopName || other?.name || "Order chat";
};

const getOtherParticipant = (
  conversation: ChatConversation,
  currentUserId?: string,
) =>
  conversation.participants.find(
    (participant) => participant.id !== currentUserId,
  ) ||
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
  const oppositeName =
    other?.name ||
    other?.shopName ||
    getConversationLabel(conversation, currentUserId);

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
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(true);

  const { data: conversationsResponse, isLoading: conversationsLoading } =
    useGetChatConversationsQuery();
  const conversations = conversationsResponse?.data ?? [];
  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ||
    conversations[0] ||
    null;
  const activeConversationId = selectedConversation?.id || "";

  const { data: messagesResponse, isLoading: messagesLoading } =
    useGetChatMessagesQuery(
      { conversationId: activeConversationId, limit: 80 },
      { skip: !activeConversationId },
    );
  const [sendChatMessage, { isLoading: sending }] =
    useSendChatMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();
  const messages = messagesResponse?.data ?? [];

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;

    return conversations.filter((conversation) => {
      const label = getConversationLabel(conversation, user?.id).toLowerCase();
      const subtitle = getConversationSubtitle(
        conversation,
        user?.id,
      ).toLowerCase();
      return (
        label.includes(normalizedQuery) || subtitle.includes(normalizedQuery)
      );
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

    const incomingFiles = Array.from(files);
    const validFiles = incomingFiles.filter((file) => {
      const isAccepted =
        !file.type ||
        acceptedAttachmentTypes.some((type) =>
          type.endsWith("/") ? file.type.startsWith(type) : file.type === type,
        );

      if (!isAccepted) {
        toast({
          title: "File not supported",
          description: `${file.name} is not a supported attachment type.`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxAttachmentSize) {
        toast({
          title: "File too large",
          description: `${file.name} must be 10MB or smaller.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setAttachments((current) => {
      const next = [...current, ...validFiles].slice(0, maxAttachmentCount);
      if (current.length + validFiles.length > maxAttachmentCount) {
        toast({
          title: "Attachment limit",
          description: `You can attach up to ${maxAttachmentCount} files at once.`,
        });
      }
      return next;
    });

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
    <div className="h-[calc(100dvh-5rem)] min-h-0 overflow-hidden rounded-xl border bg-background shadow-sm md:h-[calc(100dvh-8rem)]">
      <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)]">
        <aside
          className={cn(
            "flex h-full min-h-0 flex-col border-r bg-card md:flex",
            mobileListOpen ? "flex" : "hidden",
          )}
        >
          <div className="shrink-0 border-b bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <Typography.Title level={4} className="!mb-0">
                  Messages
                </Typography.Title>
                <div className="text-xs text-muted-foreground">
                  Orders, customers, and support
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
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
                      "mb-1 flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-border hover:bg-secondary/50",
                      isActive &&
                        "border-primary/20 bg-primary/5 shadow-sm hover:bg-primary/5",
                    )}
                  >
                    <Badge count={conversation.unreadCount} size="small">
                      <Avatar className={cn(isActive && "bg-primary")}>
                        {avatarText}
                      </Avatar>
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate font-semibold">
                          {details.oppositeName}
                        </div>
                        {conversation.lastMessage?.createdAt ? (
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {formatDateTime(conversation.lastMessage.createdAt)}
                          </span>
                        ) : null}
                      </div>
                      {details.subtitle ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {details.subtitle}
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          "mt-1 truncate text-xs",
                          conversation.unreadCount
                            ? "font-medium text-foreground"
                            : "text-muted-foreground/80",
                        )}
                      >
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
              <div className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3">
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
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">
                    {
                      getConversationDetails(selectedConversation, user?.id)
                        .oppositeName
                    }
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {
                      getConversationDetails(selectedConversation, user?.id)
                        .subtitle
                    }
                  </div>
                </div>
                <div className="hidden rounded-full border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground sm:block">
                  {selectedConversation.type === "ORDER"
                    ? "Order chat"
                    : "Support chat"}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,hsl(var(--secondary)/0.35),hsl(var(--background)))] p-4">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Spin />
                  </div>
                ) : messages.length ? (
                  <div className="mx-auto max-w-5xl space-y-3">
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
                              "max-w-[86%] rounded-2xl border px-3.5 py-2.5 shadow-sm md:max-w-[68%]",
                              isMine
                                ? "rounded-br-md border-primary bg-primary text-primary-foreground"
                                : "rounded-bl-md border-border/70 bg-card",
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
                                    : "border-primary bg-secondary/70",
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
                                      <span className="truncate">
                                        {attachment.name}
                                      </span>
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
                              <span>{formatDateTime(message.createdAt)}</span>
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
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Start the conversation"
                    />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t bg-card p-3">
                {replyTo ? (
                  <div className="mb-2 flex items-start justify-between gap-3 rounded-xl border bg-secondary/50 p-2.5 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium">
                        Replying to {replyTo.sender?.name || "message"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {replyTo.body ||
                          replyTo.attachments?.[0]?.name ||
                          "Attachment"}
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => setReplyTo(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}

                {attachments.length ? (
                  <div className="mb-2 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
                    {attachments.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="flex items-center gap-2 rounded-full border bg-secondary/60 px-3 py-1 text-xs"
                      >
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-3.5 w-3.5" />
                        ) : (
                          <FileText className="h-3.5 w-3.5" />
                        )}
                        <span className="max-w-[160px] truncate">
                          {file.name}
                        </span>
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

                <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.ppt,.pptx,.zip"
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
                    className="min-w-0 flex-1 border-0 shadow-none focus:shadow-none"
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
