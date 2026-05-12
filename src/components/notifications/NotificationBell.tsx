import { useState } from "react";
import { Bell } from "lucide-react";
import { Badge, Button, Dropdown, Empty, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import {
  type AppNotification,
  useGetMyNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/features/notifications/notificationApi";

const { Text } = Typography;

const formatNotificationTime = (value: string) =>
  new Date(value).toLocaleString();

const NotificationBell = () => {
  const navigate = useNavigate();
  const [visibleLimit, setVisibleLimit] = useState(10);
  const { data, isFetching, isLoading } = useGetMyNotificationsQuery({
    page: 1,
    limit: visibleLimit,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const notifications = data?.data ?? [];
  const totalNotifications = Number(data?.meta?.total || 0);
  const unreadCount = Number(data?.meta?.unreadCount || 0);
  const hasMoreNotifications = notifications.length < totalNotifications;

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.readAt) {
      await markNotificationRead(notification.id).unwrap().catch(() => null);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: [] }}
      dropdownRender={() => (
        <div className="w-[340px] max-w-[calc(100vw-24px)] rounded-xl border bg-card p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <Text strong>Notifications</Text>
              <div className="text-xs text-muted-foreground">
                {unreadCount} unread
                {totalNotifications ? ` • ${notifications.length} of ${totalNotifications}` : ""}
              </div>
            </div>
            <Button
              size="small"
              type="link"
              disabled={!unreadCount}
              loading={isMarkingAll}
              onClick={() => markAllNotificationsRead().unwrap().catch(() => null)}
            >
              Mark all read
            </Button>
          </div>

          {isLoading ? (
            <div className="flex min-h-[160px] items-center justify-center">
              <Spin />
            </div>
          ) : notifications.length ? (
            <div className="max-h-[420px] overflow-y-auto pr-1">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full rounded-lg border p-3 text-left transition hover:bg-secondary/50 ${
                      notification.readAt
                        ? "bg-background"
                        : "border-primary/25 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Text strong className="text-sm">
                        {notification.title}
                      </Text>
                      {!notification.readAt ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {formatNotificationTime(notification.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
              {hasMoreNotifications ? (
                <Button
                  block
                  className="mt-3"
                  loading={isFetching && !isLoading}
                  onClick={() => setVisibleLimit((current) => current + 10)}
                >
                  Load more
                </Button>
              ) : null}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications yet"
            />
          )}
        </div>
      )}
    >
      <Button type="text" shape="circle" className="grid place-items-center">
        <Badge count={unreadCount} size="small" overflowCount={99}>
          <Bell className="h-5 w-5" />
        </Badge>
      </Button>
    </Dropdown>
  );
};

export default NotificationBell;
