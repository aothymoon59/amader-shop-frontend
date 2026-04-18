import { useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import {
  useCreateWithdrawRequestMutation,
  useGetMyWalletQuery,
  type WalletTransaction,
  type WithdrawRequest,
} from "@/redux/features/wallet/walletApi";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

const { Title, Paragraph, Text } = Typography;

const ProviderWallet = () => {
  const [form] = Form.useForm<{ amount: number }>();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data, isLoading, isFetching } = useGetMyWalletQuery();
  const [createWithdrawRequest, { isLoading: isRequesting }] =
    useCreateWithdrawRequestMutation();

  const wallet = data?.data.wallet;
  const commission = data?.data.commission;
  const transactions = useMemo(
    () => data?.data.transactions ?? [],
    [data],
  );
  const withdrawRequests = useMemo(
    () => data?.data.withdrawRequests ?? [],
    [data],
  );

  const handleWithdraw = async (values: { amount: number }) => {
    try {
      await createWithdrawRequest({
        amount: Number(values.amount),
      }).unwrap();

      form.resetFields();
      toast({
        title: "Withdraw request submitted",
        description: "Your withdraw request is now waiting for admin review.",
      });
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to submit your withdraw request right now.";

      toast({
        title: "Withdraw failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div>
          <Title level={2} className="!mb-2">
            Wallet & Earnings
          </Title>
          <Paragraph className="!mb-0 text-muted-foreground">
            Track available balance, pending earnings, and your withdraw requests from one place.
          </Paragraph>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Alert
              type="info"
              showIcon
              message="Commission and release timing"
              description={
                commission
                  ? commission.enabled
                    ? `Current commission: ${commission.type} ${commission.value}. Earnings become available after ${commission.providerBalanceReleaseDelayDays} day(s).`
                    : `Commission is disabled. Earnings become available after ${commission.providerBalanceReleaseDelayDays} day(s).`
                  : "Commission information is unavailable right now."
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Available Balance"
                  value={wallet?.availableBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Pending Balance"
                  value={wallet?.pendingBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Locked for Withdrawal"
                  value={wallet?.lockedBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
              <Card bordered={false} className="shadow-sm">
                <Statistic
                  title="Total Earned"
                  value={wallet?.totalEarned || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card bordered={false} className="shadow-sm xl:col-span-1">
                <Title level={4}>Withdraw</Title>
                <Paragraph className="text-muted-foreground">
                  Request a payout from your available balance. Admin approval is required before money is sent manually.
                </Paragraph>

                <Form form={form} layout="vertical" onFinish={handleWithdraw}>
                  <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[
                      { required: true, message: "Please enter amount" },
                      {
                        validator: (_, value) => {
                          if (!value || value <= 0) {
                            return Promise.reject(
                              new Error("Amount must be greater than zero"),
                            );
                          }
                          if (value > Number(wallet?.availableBalance || 0)) {
                            return Promise.reject(
                              new Error("Amount exceeds available balance"),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isRequesting}
                  >
                    Submit Withdraw Request
                  </Button>
                </Form>
              </Card>

              <Card bordered={false} className="shadow-sm xl:col-span-2">
                <Title level={4}>Recent Transactions</Title>
                <Table<WalletTransaction>
                  rowKey="id"
                  pagination={false}
                  dataSource={transactions}
                  columns={[
                    {
                      title: "Type",
                      dataIndex: "type",
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) =>
                        formatCurrencyAmount(
                          Number(record.netAmount ?? record.amount ?? 0),
                          currency,
                        ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      render: (status: string) => <Tag>{status}</Tag>,
                    },
                    {
                      title: "Details",
                      dataIndex: "description",
                      render: (value: string | null) => value || "N/A",
                    },
                    {
                      title: "Created",
                      dataIndex: "createdAt",
                      render: (value: string) =>
                        new Date(value).toLocaleString(),
                    },
                  ]}
                />
              </Card>
            </div>

            <Card bordered={false} className="shadow-sm">
              <Title level={4}>Withdraw Requests</Title>
              <Table<WithdrawRequest>
                rowKey="id"
                pagination={false}
                dataSource={withdrawRequests}
                columns={[
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
                    title: "Requested At",
                    dataIndex: "requestedAt",
                    render: (value: string) =>
                      new Date(value).toLocaleString(),
                  },
                  {
                    title: "Admin Note",
                    dataIndex: "adminNotes",
                    render: (value: string | null) => value || <Text type="secondary">No note</Text>,
                  },
                  {
                    title: "Payout Ref",
                    dataIndex: "payoutReference",
                    render: (value: string | null) => value || "N/A",
                  },
                ]}
              />
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderWallet;
