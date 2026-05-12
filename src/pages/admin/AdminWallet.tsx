// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMemo, useState, type ReactNode } from "react";
// import {
//   Alert,
//   Button,
//   Card,
//   Form,
//   Input,
//   Modal,
//   Select,
//   Spin,
//   Statistic,
//   Table,
//   Tag,
//   Typography,
// } from "antd";

// import { toast } from "@/components/ui/use-toast";
// import { useSystemCurrency } from "@/hooks/useSystemCurrency";
// import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
// import {
//   useGetAdminWalletOverviewQuery,
//   useReviewWithdrawRequestMutation,
//   type WithdrawRequest,
// } from "@/redux/features/wallet/walletApi";
// import { formatCurrencyAmount } from "@/utils/currency";

// const { Title, Paragraph, Text, Link } = Typography;

// const mobileBankLabels: Record<string, string> = {
//   BKASH: "bKash",
//   NAGAD: "Nagad",
//   ROCKET: "Rocket",
//   NONE: "Not added",
// };

// const getMobileBankLabel = (type?: string | null) =>
//   mobileBankLabels[type || "NONE"] || type || "Not added";

// const getDefaultPayoutMethod = (request: WithdrawRequest) => {
//   const paymentSettings = request.paymentSettings;

//   if (!paymentSettings) {
//     return "";
//   }

//   if (
//     paymentSettings.mobileBankType &&
//     paymentSettings.mobileBankType !== "NONE" &&
//     paymentSettings.mobileBankNumber
//   ) {
//     return getMobileBankLabel(paymentSettings.mobileBankType);
//   }

//   if (paymentSettings.bankName) {
//     return `Bank - ${paymentSettings.bankName}`;
//   }

//   return "";
// };

// const DetailRow = ({ label, value }: { label: string; value?: ReactNode }) => {
//   const hasValue = value !== undefined && value !== null && value !== "";

//   return (
//     <div className="grid gap-1 rounded-md border border-slate-100 bg-white px-3 py-2 sm:grid-cols-[150px_1fr]">
//       <Text type="secondary">{label}</Text>
//       <div className="min-w-0 break-words text-sm">
//         {hasValue ? value : <Text type="secondary">Not provided</Text>}
//       </div>
//     </div>
//   );
// };

// const AdminWallet = () => {
//   const [selectedRequest, setSelectedRequest] =
//     useState<WithdrawRequest | null>(null);
//   const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">(
//     "APPROVED",
//   );
//   const [form] = Form.useForm<{
//     adminNotes?: string;
//     payoutMethod?: string;
//     payoutReference?: string;
//   }>();
//   const { currency = defaultSystemCurrency } = useSystemCurrency();
//   const { data, isLoading, isFetching } = useGetAdminWalletOverviewQuery();
//   const [reviewWithdrawRequest, { isLoading: isReviewing }] =
//     useReviewWithdrawRequestMutation();

//   const summary = data?.data.summary;
//   const wallets = useMemo(() => data?.data.wallets ?? [], [data]);
//   const requests = useMemo(() => data?.data.withdrawRequests ?? [], [data]);
//   const selectedPaymentSettings = selectedRequest?.paymentSettings || null;

//   const handleReview = async () => {
//     if (!selectedRequest) {
//       return;
//     }

//     try {
//       const values = await form.validateFields();
//       await reviewWithdrawRequest({
//         id: selectedRequest.id,
//         status: reviewStatus,
//         adminNotes: values.adminNotes,
//         payoutMethod:
//           reviewStatus === "APPROVED" ? values.payoutMethod : undefined,
//         payoutReference:
//           reviewStatus === "APPROVED" ? values.payoutReference : undefined,
//       }).unwrap();

//       toast({
//         title: `Withdraw ${reviewStatus.toLowerCase()}`,
//         description: "The withdraw request has been updated successfully.",
//       });
//       setSelectedRequest(null);
//       form.resetFields();
//     } catch (error: unknown) {
//       const message =
//         typeof error === "object" &&
//         error !== null &&
//         "data" in error &&
//         typeof error.data === "object" &&
//         error.data !== null &&
//         "message" in error.data
//           ? String(error.data.message)
//           : "Unable to update the withdraw request.";

//       toast({
//         title: "Review failed",
//         description: message,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <div>
//           <Title level={2} className="!mb-2">
//             Wallet & Earnings
//           </Title>
//           <Paragraph className="!mb-0 text-muted-foreground">
//             Review provider balances, approve or reject withdraw requests, and
//             monitor marketplace payout exposure.
//           </Paragraph>
//         </div>

//         {isLoading || isFetching ? (
//           <div className="flex min-h-[320px] items-center justify-center">
//             <Spin size="large" />
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
//               <Card bordered={false} className="shadow-sm">
//                 <Statistic
//                   title="Available"
//                   value={summary?.totalAvailableBalance || 0}
//                   formatter={(value) =>
//                     formatCurrencyAmount(Number(value || 0), currency)
//                   }
//                 />
//               </Card>
//               <Card bordered={false} className="shadow-sm">
//                 <Statistic
//                   title="Pending"
//                   value={summary?.totalPendingBalance || 0}
//                   formatter={(value) =>
//                     formatCurrencyAmount(Number(value || 0), currency)
//                   }
//                 />
//               </Card>
//               <Card bordered={false} className="shadow-sm">
//                 <Statistic
//                   title="Locked"
//                   value={summary?.totalLockedBalance || 0}
//                   formatter={(value) =>
//                     formatCurrencyAmount(Number(value || 0), currency)
//                   }
//                 />
//               </Card>
//               <Card bordered={false} className="shadow-sm">
//                 <Statistic
//                   title="Total Earned"
//                   value={summary?.totalEarned || 0}
//                   formatter={(value) =>
//                     formatCurrencyAmount(Number(value || 0), currency)
//                   }
//                 />
//               </Card>
//               <Card bordered={false} className="shadow-sm">
//                 <Statistic
//                   title="Total Withdrawn"
//                   value={summary?.totalWithdrawn || 0}
//                   formatter={(value) =>
//                     formatCurrencyAmount(Number(value || 0), currency)
//                   }
//                 />
//               </Card>
//             </div>

//             <Card bordered={false} className="shadow-sm">
//               <Title level={4}>Withdraw Requests</Title>
//               <Table<WithdrawRequest>
//                 rowKey="id"
//                 dataSource={requests}
//                 pagination={{ pageSize: 10 }}
//                 columns={[
//                   {
//                     title: "Provider",
//                     key: "provider",
//                     render: (_, record) => (
//                       <div>
//                         <div className="font-medium">
//                           {record.providerName || "Provider"}
//                         </div>
//                         <Text type="secondary">
//                           {record.providerEmail || ""}
//                         </Text>
//                       </div>
//                     ),
//                   },
//                   {
//                     title: "Amount",
//                     key: "amount",
//                     render: (_, record) =>
//                       formatCurrencyAmount(
//                         Number(record.amount || 0),
//                         currency,
//                       ),
//                   },
//                   {
//                     title: "Status",
//                     dataIndex: "status",
//                     render: (status: string) => <Tag>{status}</Tag>,
//                   },
//                   {
//                     title: "Requested",
//                     dataIndex: "requestedAt",
//                     render: (value: string) => new Date(value).toLocaleString(),
//                   },
//                   {
//                     title: "Action",
//                     key: "action",
//                     render: (_, record) => (
//                       <Button
//                         disabled={record.status !== "PENDING"}
//                         onClick={() => {
//                           setSelectedRequest(record);
//                           setReviewStatus("APPROVED");
//                           form.resetFields();
//                           form.setFieldsValue({
//                             payoutMethod: getDefaultPayoutMethod(record),
//                           });
//                         }}
//                       >
//                         Review
//                       </Button>
//                     ),
//                   },
//                 ]}
//               />
//             </Card>

//             <Card bordered={false} className="shadow-sm">
//               <Title level={4}>Provider Earnings Overview</Title>
//               <Table
//                 rowKey="providerId"
//                 dataSource={wallets}
//                 pagination={{ pageSize: 10 }}
//                 columns={[
//                   {
//                     title: "Provider",
//                     key: "provider",
//                     render: (_, record: any) => (
//                       <div>
//                         <div className="font-medium">
//                           {record.shopName || record.providerName}
//                         </div>
//                         <Text type="secondary">{record.providerEmail}</Text>
//                       </div>
//                     ),
//                   },
//                   {
//                     title: "Available",
//                     key: "available",
//                     render: (_, record: any) =>
//                       formatCurrencyAmount(
//                         Number(record.availableBalance || 0),
//                         currency,
//                       ),
//                   },
//                   {
//                     title: "Pending",
//                     key: "pending",
//                     render: (_, record: any) =>
//                       formatCurrencyAmount(
//                         Number(record.pendingBalance || 0),
//                         currency,
//                       ),
//                   },
//                   {
//                     title: "Locked",
//                     key: "locked",
//                     render: (_, record: any) =>
//                       formatCurrencyAmount(
//                         Number(record.lockedBalance || 0),
//                         currency,
//                       ),
//                   },
//                   {
//                     title: "Total Earned",
//                     key: "totalEarned",
//                     render: (_, record: any) =>
//                       formatCurrencyAmount(
//                         Number(record.totalEarned || 0),
//                         currency,
//                       ),
//                   },
//                 ]}
//               />
//             </Card>
//           </>
//         )}

//         <Modal
//           open={Boolean(selectedRequest)}
//           title="Review Withdraw Request"
//           onCancel={() => {
//             setSelectedRequest(null);
//             form.resetFields();
//           }}
//           onOk={handleReview}
//           confirmLoading={isReviewing}
//           okText={reviewStatus === "APPROVED" ? "Approve" : "Reject"}
//         >
//           <div className="space-y-4 max-h-[70vh] overflow-y-auto">
//             <Select
//               className="w-full"
//               value={reviewStatus}
//               onChange={(value) => {
//                 setReviewStatus(value);
//                 if (value === "APPROVED" && selectedRequest) {
//                   form.setFieldsValue({
//                     payoutMethod:
//                       form.getFieldValue("payoutMethod") ||
//                       getDefaultPayoutMethod(selectedRequest),
//                   });
//                 }
//               }}
//               options={[
//                 { label: "Approve", value: "APPROVED" },
//                 { label: "Reject", value: "REJECTED" },
//               ]}
//             />

//             <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <Text strong>Provider Payment Info</Text>
//               </div>

//               {selectedPaymentSettings ? (
//                 <div className="space-y-2">
//                   <DetailRow
//                     label="Account Holder"
//                     value={selectedPaymentSettings.accountHolderName}
//                   />
//                   <DetailRow
//                     label="Bank"
//                     value={selectedPaymentSettings.bankName}
//                   />
//                   <DetailRow
//                     label="Branch"
//                     value={selectedPaymentSettings.branchName}
//                   />
//                   <DetailRow
//                     label="Routing Number"
//                     value={selectedPaymentSettings.routingNumber}
//                   />
//                   <DetailRow
//                     label="Account Number"
//                     value={selectedPaymentSettings.accountNumber}
//                   />
//                   <DetailRow
//                     label="Account Type"
//                     value={selectedPaymentSettings.accountType}
//                   />
//                   <DetailRow
//                     label="Mobile Banking"
//                     value={
//                       selectedPaymentSettings.mobileBankType !== "NONE"
//                         ? `${getMobileBankLabel(
//                             selectedPaymentSettings.mobileBankType,
//                           )} - ${
//                             selectedPaymentSettings.mobileBankNumber ||
//                             "Not provided"
//                           }`
//                         : "Not added"
//                     }
//                   />
//                   {selectedPaymentSettings.documentUrl ? (
//                     <DetailRow
//                       label="Document"
//                       value={
//                         <Link
//                           href={selectedPaymentSettings.documentUrl}
//                           target="_blank"
//                         >
//                           Open payment document
//                         </Link>
//                       }
//                     />
//                   ) : null}
//                 </div>
//               ) : (
//                 <Alert
//                   type="warning"
//                   showIcon
//                   message="Provider payment settings are not configured."
//                 />
//               )}
//             </div>

//             <Form form={form} layout="vertical">
//               {reviewStatus === "APPROVED" ? (
//                 <>
//                   <Form.Item
//                     label="Payout Method"
//                     name="payoutMethod"
//                     rules={[
//                       { required: true, message: "Please enter payout method" },
//                     ]}
//                   >
//                     <Input placeholder="Bank / bKash / Nagad" />
//                   </Form.Item>
//                   <Form.Item
//                     label="Payout Reference"
//                     name="payoutReference"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please enter payout reference",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Manual transaction reference" />
//                   </Form.Item>
//                 </>
//               ) : null}

//               <Form.Item label="Admin Notes" name="adminNotes">
//                 <Input.TextArea rows={4} placeholder="Optional review notes" />
//               </Form.Item>
//             </Form>
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default AdminWallet;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type ReactNode } from "react";
import {
  Alert,
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

const mobileBankLabels: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  NONE: "Not added",
};

const getMobileBankLabel = (type?: string | null) =>
  mobileBankLabels[type || "NONE"] || type || "Not added";

const DetailRow = ({ label, value }: { label: string; value?: ReactNode }) => {
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div className="grid gap-1 rounded-md border border-slate-100 bg-white px-3 py-2 sm:grid-cols-[150px_1fr]">
      <Text type="secondary">{label}</Text>

      <div className="min-w-0 break-words text-sm">
        {hasValue ? value : <Text type="secondary">Not provided</Text>}
      </div>
    </div>
  );
};

const AdminWallet = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawRequest | null>(null);

  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">(
    "APPROVED",
  );

  const [selectedPayoutType, setSelectedPayoutType] = useState<
    "MOBILE_BANKING" | "BANK" | undefined
  >();

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

  const selectedPaymentSettings = selectedRequest?.paymentSettings || null;

  const payoutOptions = useMemo(() => {
    const options: {
      label: string;
      value: "MOBILE_BANKING" | "BANK";
    }[] = [];

    if (
      selectedPaymentSettings?.mobileBankType &&
      selectedPaymentSettings.mobileBankType !== "NONE"
    ) {
      options.push({
        label: "Mobile Banking",
        value: "MOBILE_BANKING",
      });
    }

    if (selectedPaymentSettings?.bankName) {
      options.push({
        label: "Bank",
        value: "BANK",
      });
    }

    return options;
  }, [selectedPaymentSettings]);

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
        payoutMethod:
          reviewStatus === "APPROVED" ? values.payoutMethod : undefined,
        payoutReference:
          reviewStatus === "APPROVED" ? values.payoutReference : undefined,
      }).unwrap();

      toast({
        title: `Withdraw ${reviewStatus.toLowerCase()}`,
        description: "The withdraw request has been updated successfully.",
      });

      setSelectedRequest(null);
      setSelectedPayoutType(undefined);

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
    <>
      <div className="space-y-6">
        <div>
          <Title level={2} className="!mb-2">
            Wallet & Earnings
          </Title>

          <Paragraph className="!mb-0 text-muted-foreground">
            Review provider balances, approve or reject withdraw requests, and
            monitor marketplace payout and commission exposure.
          </Paragraph>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
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
                  title="Admin Commission"
                  value={summary?.totalCommissionBalance || 0}
                  formatter={(value) =>
                    formatCurrencyAmount(Number(value || 0), currency)
                  }
                />
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <div>
                    Available:{" "}
                    {formatCurrencyAmount(
                      Number(summary?.availableCommissionBalance || 0),
                      currency,
                    )}
                  </div>
                  <div>
                    Pending:{" "}
                    {formatCurrencyAmount(
                      Number(summary?.pendingCommissionBalance || 0),
                      currency,
                    )}
                  </div>
                </div>
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
                        <div className="font-medium">
                          {record.providerName || "Provider"}
                        </div>

                        <Text type="secondary">
                          {record.providerEmail || ""}
                        </Text>
                      </div>
                    ),
                  },
                  {
                    title: "Amount",
                    key: "amount",
                    render: (_, record) =>
                      formatCurrencyAmount(
                        Number(record.amount || 0),
                        currency,
                      ),
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    render: (status: string) => <Tag>{status}</Tag>,
                  },
                  {
                    title: "Payout Method",
                    key: "payoutMethod",
                    render: (_, record) =>
                      record?.payoutMethod ? (
                        <Tag
                          color={
                            record?.payoutMethod?.toLowerCase() == "bank"
                              ? "blue"
                              : "magenta"
                          }
                        >
                          {record.payoutMethod}
                        </Tag>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      ),
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
                          setSelectedPayoutType(undefined);

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
                        <div className="font-medium">
                          {record.shopName || record.providerName}
                        </div>

                        <Text type="secondary">{record.providerEmail}</Text>
                      </div>
                    ),
                  },
                  {
                    title: "Available",
                    key: "available",
                    render: (_, record: any) =>
                      formatCurrencyAmount(
                        Number(record.availableBalance || 0),
                        currency,
                      ),
                  },
                  {
                    title: "Pending",
                    key: "pending",
                    render: (_, record: any) =>
                      formatCurrencyAmount(
                        Number(record.pendingBalance || 0),
                        currency,
                      ),
                  },
                  {
                    title: "Locked",
                    key: "locked",
                    render: (_, record: any) =>
                      formatCurrencyAmount(
                        Number(record.lockedBalance || 0),
                        currency,
                      ),
                  },
                  {
                    title: "Total Earned",
                    key: "totalEarned",
                    render: (_, record: any) =>
                      formatCurrencyAmount(
                        Number(record.totalEarned || 0),
                        currency,
                      ),
                  },
                  {
                    title: "Commission",
                    key: "commission",
                    render: (_, record: any) =>
                      formatCurrencyAmount(
                        Number(record.totalCommissionEarned || 0),
                        currency,
                      ),
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
            setSelectedPayoutType(undefined);

            form.resetFields();
          }}
          onOk={handleReview}
          confirmLoading={isReviewing}
          okText={reviewStatus === "APPROVED" ? "Approve" : "Reject"}
        >
          <div className="max-h-[70vh] space-y-4 overflow-y-auto">
            <Select
              className="w-full"
              value={reviewStatus}
              onChange={(value) => {
                setReviewStatus(value);
              }}
              options={[
                {
                  label: "Approve",
                  value: "APPROVED",
                },
                {
                  label: "Reject",
                  value: "REJECTED",
                },
              ]}
            />

            {!selectedPaymentSettings && reviewStatus === "APPROVED" ? (
              <Alert
                type="warning"
                showIcon
                message="Provider payment settings are not configured."
              />
            ) : null}

            <Form form={form} layout="vertical">
              {reviewStatus === "APPROVED" ? (
                <>
                  <Form.Item label="Select Payout Method" required>
                    <Select
                      placeholder="Choose payout type"
                      value={selectedPayoutType}
                      onChange={(value) => {
                        setSelectedPayoutType(value);

                        if (value === "BANK") {
                          form.setFieldsValue({
                            payoutMethod: "BANK",
                          });
                        }

                        if (
                          value === "MOBILE_BANKING" &&
                          selectedPaymentSettings?.mobileBankType &&
                          selectedPaymentSettings.mobileBankType !== "NONE"
                        ) {
                          form.setFieldsValue({
                            payoutMethod:
                              selectedPaymentSettings.mobileBankType,
                          });
                        }
                      }}
                      options={payoutOptions}
                    />
                  </Form.Item>

                  {selectedPayoutType === "MOBILE_BANKING" && (
                    <div className="mb-4 space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4">
                      <Text strong>Mobile Banking Info</Text>

                      <DetailRow
                        label="Provider"
                        value={getMobileBankLabel(
                          selectedPaymentSettings?.mobileBankType,
                        )}
                      />

                      <DetailRow
                        label="Number"
                        value={selectedPaymentSettings?.mobileBankNumber}
                      />
                    </div>
                  )}

                  {selectedPayoutType === "BANK" && (
                    <div className="mb-4 space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4">
                      <Text strong>Bank Info</Text>

                      <DetailRow
                        label="Account Holder"
                        value={selectedPaymentSettings?.accountHolderName}
                      />

                      <DetailRow
                        label="Bank"
                        value={selectedPaymentSettings?.bankName}
                      />

                      <DetailRow
                        label="Branch"
                        value={selectedPaymentSettings?.branchName}
                      />

                      <DetailRow
                        label="Routing Number"
                        value={selectedPaymentSettings?.routingNumber}
                      />

                      <DetailRow
                        label="Account Number"
                        value={selectedPaymentSettings?.accountNumber}
                      />

                      <DetailRow
                        label="Account Type"
                        value={selectedPaymentSettings?.accountType}
                      />
                    </div>
                  )}

                  <Form.Item
                    hidden
                    name="payoutMethod"
                    rules={[
                      {
                        required: true,
                        message: "Please select payout method",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Payout Reference"
                    name="payoutReference"
                    rules={[
                      {
                        required: true,
                        message: "Please enter payout reference",
                      },
                    ]}
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
    </>
  );
};

export default AdminWallet;
