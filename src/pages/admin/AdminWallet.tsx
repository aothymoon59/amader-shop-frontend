import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/components/ui/use-toast";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  useGetAdminWalletOverviewQuery,
  useReviewWithdrawRequestMutation,
  type WithdrawRequest,
} from "@/redux/features/wallet/walletApi";
import { formatCurrencyAmount } from "@/utils/currency";

const { Title, Paragraph, Text } = Typography;

const AdminWallet = () => {
  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [form] = Form.useForm<{
    adminNotes?: string;
    payoutMethod?: string;
    payoutReference?: string;
  }>();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data, isLoading, isFetching } = useGetAdminWalletOverviewQuery();
  const [reviewWithdrawRequest, { isLoading: isReviewing }] =
    useReviewWithdrawRequestMutation();

  const summary = data?.data.summary;
  const wallets = useMemo(() => data?.data.wallets ?? [], [data]);
  const requests = useMemo(() => data?.data.withdrawRequests ?? [], [data]);

  const handleReview = async () => {
    if (!selectedRequest) {
      return;
    }

    try {
      const values = await form.validateFields();
      await reviewWithdrawRequest({
        id: selectedRequest.id,
        status: reviewStatus,
        adminNotes: values.adminNotes,
        payoutMethod: reviewStatus === "APPROVED" ? values.payoutMethod : undefined,
        payoutReference:
          reviewStatus === "APPROVED" ? values.payoutReference : undefined,
      }).unwrap();

      toast({
        title: `Withdraw ${reviewStatus.toLowerCase()}`,
        description: "The withdraw request has been updated successfully.",
      });
      setSelectedRequest(null);
      form.resetFields();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to update the withdraw request.";

      toast({
        title: "Review failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <Title level={2} className="!mb-2">
            Wallet & Earnings
          </Title>
          <Paragraph className="!mb-0 text-muted-foreground">
            Review provider balances, approve or reject withdraw requests, and monitor marketplace payout exposure.
          </Paragraph>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Available"
                  value={summary?.totalAvailableBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Pending"
                  value={summary?.totalPendingBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Locked"
                  value={summary?.totalLockedBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Total Earned"
                  value={summary?.totalEarned || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Total Withdrawn"
                  value={summary?.totalWithdrawn || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
            </div>

            <Card bordered={false} className="shadow-sm">
              <Title level={4}>Withdraw Requests</Title>
              <Table<WithdrawRequest>
                rowKey="id"
                dataSource={requests}
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: "Provider",
                    key: "provider",
                    render: (_, record) => (
                      <div>
                        <div className="font-medium">{record.providerName || "Provider"}</div>
                        <Text type="secondary">{record.providerEmail || ""}</Text>
                      </div>
                    ),
                  },
                  {
                    title: "Amount",
                    key: "amount",
                    render: (_, record) =>
                      formatCurrencyAmount(Number(record.amount || 0), currency),
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    render: (status: string) => <Tag>{status}</Tag>,
                  },
                  {
                    title: "Requested",
                    dataIndex: "requestedAt",
                    render: (value: string) => new Date(value).toLocaleString(),
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                      <Button
                        disabled={record.status !== "PENDING"}
                        onClick={() => {
                          setSelectedRequest(record);
                          setReviewStatus("APPROVED");
                          form.resetFields();
                        }}
                      >
                        Review
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>

            <Card bordered={false} className="shadow-sm">
              <Title level={4}>Provider Earnings Overview</Title>
              <Table
                rowKey="providerId"
                dataSource={wallets}
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: "Provider",
                    key: "provider",
                    render: (_, record: any) => (
                      <div>
                        <div className="font-medium">{record.shopName || record.providerName}</div>
                        <Text type="secondary">{record.providerEmail}</Text>
                      </div>
                    ),
                  },
                  {
                    title: "Available",
                    key: "available",
                    render: (_, record: any) =>
                      formatCurrencyAmount(Number(record.availableBalance || 0), currency),
                  },
                  {
                    title: "Pending",
                    key: "pending",
                    render: (_, record: any) =>
                      formatCurrencyAmount(Number(record.pendingBalance || 0), currency),
                  },
                  {
                    title: "Locked",
                    key: "locked",
                    render: (_, record: any) =>
                      formatCurrencyAmount(Number(record.lockedBalance || 0), currency),
                  },
                  {
                    title: "Total Earned",
                    key: "totalEarned",
                    render: (_, record: any) =>
                      formatCurrencyAmount(Number(record.totalEarned || 0), currency),
                  },
                ]}
              />
            </Card>
          </>
        )}

        <Modal
          open={Boolean(selectedRequest)}
          title="Review Withdraw Request"
          onCancel={() => {
            setSelectedRequest(null);
            form.resetFields();
          }}
          onOk={handleReview}
          confirmLoading={isReviewing}
          okText={reviewStatus === "APPROVED" ? "Approve" : "Reject"}
        >
          <div className="space-y-4">
            <Select
              className="w-full"
              value={reviewStatus}
              onChange={(value) => setReviewStatus(value)}
              options={[
                { label: "Approve", value: "APPROVED" },
                { label: "Reject", value: "REJECTED" },
              ]}
            />

            <Form form={form} layout="vertical">
              {reviewStatus === "APPROVED" ? (
                <>
                  <Form.Item
                    label="Payout Method"
                    name="payoutMethod"
                    rules={[{ required: true, message: "Please enter payout method" }]}
                  >
                    <Input placeholder="Bank / bKash / Nagad" />
                  </Form.Item>
                  <Form.Item
                    label="Payout Reference"
                    name="payoutReference"
                    rules={[{ required: true, message: "Please enter payout reference" }]}
                  >
                    <Input placeholder="Manual transaction reference" />
                  </Form.Item>
                </>
              ) : null}

              <Form.Item label="Admin Notes" name="adminNotes">
                <Input.TextArea rows={4} placeholder="Optional review notes" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminWallet;
