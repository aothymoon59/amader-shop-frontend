import { Link } from "react-router-dom";
import { Badge, Button } from "antd";
import { MessageCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useGetChatConversationsQuery } from "@/redux/features/chat/chatApi";

const getChatPath = (role?: string) => {
  if (role === "customer") return "/account/chat";
  if (role === "provider") return "/provider/chat";
  if (role === "admin") return "/admin/chat";
  if (role === "super-admin") return "/super-admin/chat";
  return "/login";
};

const ChatNavButton = () => {
  const { user, isAuthenticated } = useAuth();
  const { data } = useGetChatConversationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const unreadCount =
    data?.data?.reduce(
      (total, conversation) => total + Number(conversation.unreadCount || 0),
      0,
    ) || 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link to={getChatPath(user?.role)} aria-label="Live chat">
      <Button type="text" shape="circle" className="grid place-items-center">
        <Badge count={unreadCount} size="small" overflowCount={99}>
          <MessageCircle className="h-5 w-5" />
        </Badge>
      </Button>
    </Link>
  );
};

export default ChatNavButton;
