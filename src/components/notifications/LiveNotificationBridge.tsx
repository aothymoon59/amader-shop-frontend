import { useEffect } from "react";
import { io } from "socket.io-client";

import { toast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import {
  notificationApi,
  type AppNotification,
} from "@/redux/features/notifications/notificationApi";
import { chatApi } from "@/redux/features/chat/chatApi";
import { tagTypes } from "@/redux/tagTypes";

const socketUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const LiveNotificationBridge = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(useCurrentToken);

  useEffect(() => {
    if (!token || !socketUrl) {
      return;
    }

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("notification:new", (notification: AppNotification) => {
      toast({
        title: notification.title,
        description: notification.message,
      });
      dispatch(notificationApi.util.invalidateTags([tagTypes.NOTIFICATIONS]));
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

  return null;
};

export default LiveNotificationBridge;
