import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  EyeOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, Modal, Select, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import TableActionMenu from "@/components/shared/table/TableActionMenu";
import { toast } from "@/components/ui/use-toast";
import {
  useGetContactMessageByIdQuery,
  useGetContactMessagesQuery,
  useReplyToContactMessageMutation,
  type ContactMessageRecord,
  type ContactMessageStatus,
} from "@/redux/features/contact/contactMessagesApi";

type ContactMessagesBoardProps = {
  role: "admin" | "super-admin";
};

const statusColors: Record<ContactMessageStatus, string> = {
  NEW: "blue",
  READ: "gold",
  REPLIED: "green",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
};

const ContactMessagesBoard = ({ role }: ContactMessagesBoardProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContactMessageStatus | undefined>();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessageRecord | null>(null);
  const [reply, setReply] = useState("");

  const query = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status,
    }),
    [limit, page, search, status],
  );

  const { data, isLoading, isFetching } = useGetContactMessagesQuery(query);
  const { data: selectedMessageData, isFetching: isFetchingMessage } =
    useGetContactMessageByIdQuery(selectedMessageId || "", {
      skip: !selectedMessageId,
    });
  const [replyToContactMessage, { isLoading: isReplying }] =
    useReplyToContactMessageMutation();

  const messages = data?.data ?? [];
  const meta = data?.meta;
  const selectedMessage = selectedMessageData?.data;

  const openReply = (message: ContactMessageRecord) => {
    setReplyTarget(message);
    setReply("");
  };

  const submitReply = async () => {
    if (!replyTarget) {
      return;
    }

    try {
      await replyToContactMessage({
        messageId: replyTarget.id,
        reply: reply.trim(),
      }).unwrap();

      toast({
        title: "Reply sent",
        description: "The response was emailed and saved with the message.",
      });
      setReplyTarget(null);
      setReply("");
    } catch (error) {
      toast({
        title: "Reply failed",
        description: getErrorMessage(error, "Could not send the reply."),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnsType<ContactMessageRecord> = [
    {
      title: "Sender",
      key: "sender",
      render: (_, message) => (
        <div>
          <div className="font-semibold">{message.name}</div>
          <div className="text-xs text-muted-foreground">{message.email}</div>
          {message.phone ? (
            <div className="text-xs text-muted-foreground">{message.phone}</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      render: (_, message) => (
        <div>
          <div className="font-medium">{message.subject}</div>
          <div className="max-w-md text-xs text-muted-foreground">
            {message.message.length > 120
              ? `${message.message.slice(0, 120)}...`
              : message.message}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: ContactMessageStatus) => (
        <Tag color={statusColors[value] || "default"}>{value}</Tag>
      ),
    },
    {
      title: "Submitted",
      key: "createdAt",
      render: (_, message) => dayjs(message.createdAt).format("MMM D, YYYY h:mm A"),
    },
    {
      title: "Reply",
      key: "reply",
      render: (_, message) =>
        message.repliedAt ? (
          <div>
            <Tag color="green">SENT</Tag>
            <div className="text-xs text-muted-foreground">
              {dayjs(message.repliedAt).format("MMM D, YYYY")}
            </div>
          </div>
        ) : (
          <Tag>Pending</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, message) => (
        <TableActionMenu
          items={[
            {
              key: "view",
              label: "View message",
              icon: <EyeOutlined />,
              onClick: () => setSelectedMessageId(message.id),
            },
            {
              key: "reply",
              label: message.status === "REPLIED" ? "Reply again" : "Reply",
              icon: <MailOutlined />,
              onClick: () => openReply(message),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Messages submitted from the public Contact page are stored here for the{" "}
          {role === "admin" ? "admin" : "super admin"} team, with replies sent by email.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input.Search
            allowClear
            enterButton="Search"
            placeholder="Search by sender, email, subject, or message"
            onSearch={(value) => {
              setSearch(value.trim());
              setPage(1);
            }}
          />
          <Select
            allowClear
            placeholder="Filter by status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { value: "NEW", label: "New" },
              { value: "READ", label: "Read" },
              { value: "REPLIED", label: "Replied" },
            ]}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10">
            <Empty description="No contact messages found." />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={messages}
            loading={isFetching}
            pagination={{
              current: meta?.page || page,
              pageSize: meta?.limit || limit,
              total: meta?.total || messages.length,
              showSizeChanger: true,
              onChange: (nextPage, nextPageSize) => {
                setPage(nextPage);
                setLimit(nextPageSize);
              },
            }}
            scroll={{ x: 980 }}
          />
        )}
      </div>

      <Modal
        open={Boolean(selectedMessageId)}
        title="Contact message"
        onCancel={() => setSelectedMessageId(null)}
        footer={null}
        width={760}
      >
        {isFetchingMessage || !selectedMessage ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border bg-secondary/30 p-4">
              <Space wrap>
                <Tag color={statusColors[selectedMessage.status]}>
                  {selectedMessage.status}
                </Tag>
                <span className="text-sm text-muted-foreground">
                  {dayjs(selectedMessage.createdAt).format("MMMM D, YYYY h:mm A")}
                </span>
              </Space>
              <h3 className="mt-4 text-lg font-semibold">
                {selectedMessage.subject}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedMessage.name} - {selectedMessage.email}
                {selectedMessage.phone ? ` - ${selectedMessage.phone}` : ""}
              </p>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-muted-foreground">
                {selectedMessage.message}
              </p>
            </div>

            {selectedMessage.adminReply ? (
              <div className="rounded-xl border p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Tag color="green">Reply sent</Tag>
                  {selectedMessage.repliedAt ? (
                    <span className="text-sm text-muted-foreground">
                      {dayjs(selectedMessage.repliedAt).format("MMMM D, YYYY h:mm A")}
                    </span>
                  ) : null}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {selectedMessage.adminReply}
                </p>
              </div>
            ) : null}

            <Button
              type="primary"
              icon={<MailOutlined />}
              onClick={() => openReply(selectedMessage)}
            >
              {selectedMessage.status === "REPLIED" ? "Reply Again" : "Reply"}
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(replyTarget)}
        title={replyTarget ? `Reply to ${replyTarget.name}` : "Reply"}
        onCancel={() => setReplyTarget(null)}
        onOk={submitReply}
        okText="Send Reply"
        okButtonProps={{
          icon: <SendOutlined />,
          loading: isReplying,
          disabled: reply.trim().length < 3,
        }}
        width={720}
      >
        <div className="space-y-4">
          {replyTarget ? (
            <div className="rounded-xl border bg-secondary/30 p-4">
              <div className="font-semibold">{replyTarget.subject}</div>
              <p className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {replyTarget.message}
              </p>
            </div>
          ) : null}
          <Input.TextArea
            rows={8}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Write your reply to the customer"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ContactMessagesBoard;
