/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { businessTypes } from "@/constants/businessType";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useUpdateProviderProfileMutation } from "@/redux/features/provider/providerApi";
import {
  useGetMyPaymentSettingsQuery,
  useUpsertMyPaymentSettingsMutation,
  type AccountType,
  type MobileBankType,
} from "@/redux/features/provider/providerPaymentSettingsApi";
import type { UploadFile } from "antd/es/upload/interface";

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type ProviderSettingsFormValues = {
  shopName?: string;
  businessType?: string;
  phone?: string;
  address?: string;
  description?: string;
  tradeLicense?: UploadFile[];
};

type PaymentSettingsFormValues = {
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: AccountType;
  mobileBankType?: MobileBankType;
  mobileBankNumber?: string;
  document?: UploadFile[];
};

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const statusConfig = {
  APPROVED: {
    color: "success" as const,
    icon: <CheckCircleOutlined />,
    label: "Approved",
  },
  PENDING: {
    color: "warning" as const,
    icon: <ClockCircleOutlined />,
    label: "Pending Review",
  },
  REJECTED: {
    color: "error" as const,
    icon: <StopOutlined />,
    label: "Rejected",
  },
};

const ProviderSettings = () => {
  const [businessForm] = Form.useForm<ProviderSettingsFormValues>();
  const [paymentForm] = Form.useForm<PaymentSettingsFormValues>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const redirectTimerRef = useRef<number | null>(null);
  const { userData } = useAuth();
  const [updateProviderProfile, { isLoading: isBusinessSaving }] =
    useUpdateProviderProfileMutation();
  const [upsertMyPaymentSettings, { isLoading: isPaymentSaving }] =
    useUpsertMyPaymentSettingsMutation();

  const providerProfile: any = userData?.providerProfile;
  const activeTab = searchParams.get("tab") || "personal-profile";
  const redirectTo = searchParams.get("redirect");

  const { data: paymentSettingsResponse, isLoading: isPaymentSettingsLoading } =
    useGetMyPaymentSettingsQuery(undefined, {
      skip: !providerProfile,
    });

  const paymentSettings = useMemo(() => {
    const response = paymentSettingsResponse?.data;
    if (!response || "paymentSettings" in response) {
      return null;
    }
    return response;
  }, [paymentSettingsResponse]);

  useEffect(() => {
    if (!providerProfile) return;

    businessForm.setFieldsValue({
      shopName: providerProfile.shopName || "",
      businessType: providerProfile.businessType || "",
      phone: providerProfile.phone || "",
      address: providerProfile.address || "",
      description: providerProfile.description || "",
      tradeLicense: [],
    });
  }, [providerProfile, businessForm]);

  useEffect(() => {
    paymentForm.setFieldsValue({
      accountHolderName: paymentSettings?.accountHolderName || "",
      bankName: paymentSettings?.bankName || "",
      branchName: paymentSettings?.branchName || "",
      routingNumber: paymentSettings?.routingNumber || "",
      accountNumber: paymentSettings?.accountNumber || "",
      accountType: paymentSettings?.accountType || "SAVINGS",
      mobileBankType: paymentSettings?.mobileBankType || "NONE",
      mobileBankNumber: paymentSettings?.mobileBankNumber || "",
      document: [],
    });
  }, [paymentSettings, paymentForm]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleTabChange = (key: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", key);
    setSearchParams(nextParams);
  };

  const onBusinessFinish = async (values: ProviderSettingsFormValues) => {
    if (!providerProfile?.id) return;

    try {
      const payload = new FormData();
      const tradeLicenseFile = values.tradeLicense?.[0]?.originFileObj;

      const fields: Array<keyof ProviderSettingsFormValues> = [
        "shopName",
        "businessType",
        "phone",
        "address",
        "description",
      ];

      fields.forEach((field) => {
        const nextValue = (values[field] || "").toString().trim();
        const currentValue = (providerProfile[field] || "").toString().trim();

        if (nextValue !== currentValue) {
          payload.append(field, nextValue);
        }
      });

      if (tradeLicenseFile) {
        payload.append("tradeLicense", tradeLicenseFile);
      }

      if (!Array.from(payload.keys()).length) {
        toast({
          title: "No changes detected",
          description: "Update at least one field before saving.",
        });
        return;
      }

      const res = await updateProviderProfile({
        id: providerProfile.id,
        payload,
      }).unwrap();

      toast({
        title: "Profile updated",
        description:
          res?.message ||
          "Your provider profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onPaymentFinish = async (values: PaymentSettingsFormValues) => {
    try {
      const payload = new FormData();
      payload.append("accountHolderName", values.accountHolderName?.trim() || "");
      payload.append("bankName", values.bankName?.trim() || "");
      payload.append("branchName", values.branchName?.trim() || "");
      payload.append("routingNumber", values.routingNumber?.trim() || "");
      payload.append("accountNumber", values.accountNumber?.trim() || "");
      payload.append("accountType", values.accountType || "SAVINGS");
      payload.append("mobileBankType", values.mobileBankType || "NONE");

      if (values.mobileBankType && values.mobileBankType !== "NONE") {
        payload.append("mobileBankNumber", values.mobileBankNumber?.trim() || "");
      }

      const documentFile = values.document?.[0]?.originFileObj;
      if (documentFile) {
        payload.append("document", documentFile);
      }

      const res = await upsertMyPaymentSettings(payload).unwrap();
      setPaymentSuccessMessage(
        "Payment settings saved successfully. Your product listing access is now enabled."
      );

      toast({
        title: "Payment settings saved",
        description:
          res?.message ||
          "Your provider payment settings were updated successfully.",
      });

      if (redirectTo) {
        redirectTimerRef.current = window.setTimeout(() => {
          navigate(redirectTo);
        }, 1400);
      }
    } catch (error: any) {
      toast({
        title: "Payment settings failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (!providerProfile) {
    return (
      
        <div className="mx-auto max-w-3xl">
          <Card bordered={false} className="shadow-sm">
            <Title level={3} className="!mb-2">
              Provider Settings
            </Title>
            <Paragraph className="!mb-0 text-muted-foreground">
              No provider profile is linked to this account yet.
            </Paragraph>
          </Card>
        </div>
      
    );
  }

  const currentStatus =
    statusConfig[
      (providerProfile.status as keyof typeof statusConfig) || "PENDING"
    ];

  return (
    
      <div className="mx-auto space-y-4 lg:space-y-6">
        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <ShopOutlined />
                Provider Account
              </div>
              <Title level={3} className="!mb-1">
                Provider Settings
              </Title>
              <Paragraph className="!mb-0 text-muted-foreground">
                Update your shop details, password, and payment configuration from one place.
              </Paragraph>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag color={currentStatus.color} icon={currentStatus.icon}>
                {currentStatus.label}
              </Tag>
              <Tag color={providerProfile.isActive ? "blue" : "default"}>
                {providerProfile.isActive ? "Active" : "Inactive"}
              </Tag>
              <Tag color={userData?.isPaymentConfigured ? "green" : "orange"}>
                {userData?.isPaymentConfigured ? "Payment Ready" : "Payment Setup Needed"}
              </Tag>
            </div>
          </div>
        </Card>

        <SettingsTabs
          title={null}
          description={null}
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "personal-profile",
              label: "Personal Profile",
              children: <ProfileSettingsSection title="My Account" />,
            },
            {
              key: "change-password",
              label: "Change Password",
              children: <ChangePasswordSection />,
            },
            {
              key: "business-profile",
              label: "Business Profile",
              children: (
                <div className="space-y-4">
                  <Card
                    bordered={false}
                    className="overflow-hidden shadow-sm"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/40 px-5 py-5 sm:px-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            <ShopOutlined />
                            Business Profile
                          </div>
                          <Title level={4} className="!mb-1">
                            {providerProfile.shopName}
                          </Title>
                          <Paragraph className="!mb-0 max-w-2xl text-muted-foreground">
                            Keep your storefront information accurate so admins and customers see the right business details.
                          </Paragraph>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                          <div className="rounded-2xl border border-border/80 bg-background/90 p-3">
                            <Text type="secondary">Status</Text>
                            <div className="mt-2">
                              <Tag color={currentStatus.color} icon={currentStatus.icon}>
                                {currentStatus.label}
                              </Tag>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/80 bg-background/90 p-3">
                            <Text type="secondary">Account</Text>
                            <div className="mt-2">
                              <Tag color={providerProfile.isActive ? "blue" : "default"}>
                                {providerProfile.isActive ? "Active" : "Inactive"}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={9}>
                      <div className="space-y-4">
                        <Card bordered={false} className="shadow-sm">
                          <div className="mb-4">
                            <Text type="secondary">Current Snapshot</Text>
                            <Title level={5} className="!mb-1 !mt-1">
                              Business details on file
                            </Title>
                            <Paragraph className="!mb-0 text-muted-foreground">
                              Review the information currently saved for your provider account.
                            </Paragraph>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                              <Text type="secondary">Business Type</Text>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {providerProfile.businessType}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                              <Text type="secondary">Contact Phone</Text>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {providerProfile.phone}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 sm:col-span-2 xl:col-span-1">
                              <Text type="secondary">Address</Text>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {providerProfile.address}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 sm:col-span-2 xl:col-span-1">
                              <Text type="secondary">Account Email</Text>
                              <p className="mt-1 break-all text-sm font-semibold text-foreground">
                                {userData?.email}
                              </p>
                            </div>
                          </div>
                        </Card>

                        {providerProfile.tradeLicense && (
                          <Card bordered={false} className="shadow-sm" title="Trade License">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-secondary/20 p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <FileTextOutlined />
                                </div>
                                <div className="min-w-0">
                                  <Text className="block font-medium">
                                    Current trade license file
                                  </Text>
                                  <Text type="secondary">
                                    Open the uploaded file or replace it from the update form.
                                  </Text>
                                </div>
                              </div>

                              <Link
                                href={providerProfile.tradeLicense}
                                target="_blank"
                                className="inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-center sm:w-auto"
                              >
                                View Current File
                              </Link>
                            </div>
                          </Card>
                        )}
                      </div>
                    </Col>

                    <Col xs={24} xl={15}>
                      <Card bordered={false} className="shadow-sm">
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">
                            Update Business Profile
                          </Title>
                          <Paragraph className="!mb-0 text-muted-foreground">
                            Edit your shop details below. Only changed values will be submitted.
                          </Paragraph>
                        </div>

                        <Form
                          form={businessForm}
                          layout="vertical"
                          onFinish={onBusinessFinish}
                          className="space-y-1"
                        >
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Shop Name"
                                name="shopName"
                                rules={[
                                  {
                                    min: 2,
                                    message: "Shop name must be at least 2 characters long",
                                  },
                                ]}
                              >
                                <Input
                                  size="large"
                                  prefix={<ShopOutlined className="text-muted-foreground" />}
                                  placeholder="Rahim Store"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item label="Business Type" name="businessType">
                                <Select size="large" placeholder="Select business type">
                                  {businessTypes.map((type) => (
                                    <Option key={type} value={type}>
                                      {type}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[
                                  {
                                    pattern: /^01[0-9]{9}$/,
                                    message: "Enter a valid Bangladeshi phone number",
                                  },
                                ]}
                              >
                                <Input
                                  size="large"
                                  prefix={<UserOutlined className="text-muted-foreground" />}
                                  placeholder="01700111222"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Trade License"
                                name="tradeLicense"
                                valuePropName="fileList"
                                getValueFromEvent={normalizeUploadValue}
                                extra="Upload a new file only if you want to replace the existing one."
                              >
                                <Upload
                                  beforeUpload={() => false}
                                  maxCount={1}
                                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                                >
                                  <Button size="large" className="w-full md:w-auto">
                                    Replace Trade License
                                  </Button>
                                </Upload>
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                  {
                                    min: 5,
                                    message: "Address must be at least 5 characters long",
                                  },
                                ]}
                              >
                                <Input size="large" placeholder="Dhaka, Bangladesh" />
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item label="Description" name="description">
                                <TextArea
                                  rows={5}
                                  placeholder="Describe your shop, product focus, and service area..."
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <Text className="block font-medium">
                                Save business profile updates
                              </Text>
                              <Text type="secondary">
                                Changes will update your provider profile immediately.
                              </Text>
                            </div>

                            <Button
                              type="primary"
                              htmlType="submit"
                              size="large"
                              loading={isBusinessSaving}
                              className="w-full sm:w-auto"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </Form>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: "payment-settings",
              label: "Payment Settings",
              children: (
                <div className="space-y-4">
                  {redirectTo ? (
                    <Alert
                      type="info"
                      showIcon
                      message="Complete payment setup to unlock product listing"
                      description="After you save your payment information, we will redirect you back to the products page automatically."
                    />
                  ) : null}

                  {paymentSuccessMessage ? (
                    <Alert
                      type="success"
                      showIcon
                      message={paymentSuccessMessage}
                      description={
                        redirectTo
                          ? "Redirecting you back to product listing..."
                          : "You can now manage products and update these settings any time."
                      }
                    />
                  ) : null}

                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={9}>
                      <div className="space-y-4">
                        <Card bordered={false} className="shadow-sm">
                          <div className="mb-4">
                            <Text type="secondary">Payment Access</Text>
                            <Title level={5} className="!mb-1 !mt-1">
                              Product listing readiness
                            </Title>
                            <Paragraph className="!mb-0 text-muted-foreground">
                              Providers must complete payment details before listing products.
                            </Paragraph>
                          </div>

                          <div className="space-y-3">
                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                              <Text type="secondary">Status</Text>
                              <div className="mt-2">
                                <Tag color={userData?.isPaymentConfigured ? "green" : "orange"}>
                                  {userData?.isPaymentConfigured
                                    ? "Payment Configured"
                                    : "Setup Required"}
                                </Tag>
                              </div>
                            </div>

                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                              <Text type="secondary">Verification</Text>
                              <div className="mt-2">
                                <Tag color={paymentSettings?.isVerified ? "green" : "default"}>
                                  {paymentSettings?.isVerified ? "Verified" : "Not Verified"}
                                </Tag>
                              </div>
                            </div>

                            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                              <Text type="secondary">Saved Document</Text>
                              <div className="mt-2 text-sm font-medium text-foreground">
                                {paymentSettings?.documentUrl ? "Available" : "Not uploaded"}
                              </div>
                              {paymentSettings?.documentUrl ? (
                                <Link href={paymentSettings.documentUrl} target="_blank">
                                  View payment document
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>

                    <Col xs={24} xl={15}>
                      <Card bordered={false} className="shadow-sm">
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">
                            Provider Payment Settings
                          </Title>
                          <Paragraph className="!mb-0 text-muted-foreground">
                            Add or update the account details you want to use for provider payouts.
                          </Paragraph>
                        </div>

                        <Form
                          form={paymentForm}
                          layout="vertical"
                          onFinish={onPaymentFinish}
                          initialValues={{
                            accountType: "SAVINGS",
                            mobileBankType: "NONE",
                          }}
                        >
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Account Holder Name"
                                name="accountHolderName"
                                rules={[
                                  { required: true, message: "Please enter account holder name" },
                                ]}
                              >
                                <Input
                                  size="large"
                                  prefix={<UserOutlined className="text-muted-foreground" />}
                                  placeholder="Md. Rahim Uddin"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Bank Name"
                                name="bankName"
                                rules={[{ required: true, message: "Please enter bank name" }]}
                              >
                                <Input
                                  size="large"
                                  prefix={<BankOutlined className="text-muted-foreground" />}
                                  placeholder="Sonali Bank"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Branch Name"
                                name="branchName"
                                rules={[{ required: true, message: "Please enter branch name" }]}
                              >
                                <Input size="large" placeholder="Dhanmondi Branch" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Routing Number"
                                name="routingNumber"
                                rules={[{ required: true, message: "Please enter routing number" }]}
                              >
                                <Input
                                  size="large"
                                  prefix={<SafetyCertificateOutlined className="text-muted-foreground" />}
                                  placeholder="123456789"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Account Number"
                                name="accountNumber"
                                rules={[{ required: true, message: "Please enter account number" }]}
                              >
                                <Input
                                  size="large"
                                  prefix={<CreditCardOutlined className="text-muted-foreground" />}
                                  placeholder="001234567890"
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Account Type"
                                name="accountType"
                                rules={[{ required: true, message: "Please select account type" }]}
                              >
                                <Select size="large">
                                  <Option value="SAVINGS">Savings</Option>
                                  <Option value="CURRENT">Current</Option>
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Mobile Banking Type"
                                name="mobileBankType"
                              >
                                <Select size="large">
                                  <Option value="NONE">None</Option>
                                  <Option value="BKASH">bKash</Option>
                                  <Option value="NAGAD">Nagad</Option>
                                  <Option value="ROCKET">Rocket</Option>
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                shouldUpdate={(prevValues, currentValues) =>
                                  prevValues.mobileBankType !== currentValues.mobileBankType
                                }
                                noStyle
                              >
                                {({ getFieldValue }) => (
                                  <Form.Item
                                    label="Mobile Banking Number"
                                    name="mobileBankNumber"
                                    rules={
                                      getFieldValue("mobileBankType") !== "NONE"
                                        ? [
                                            {
                                              required: true,
                                              message: "Please enter mobile banking number",
                                            },
                                          ]
                                        : []
                                    }
                                  >
                                    <Input
                                      size="large"
                                      disabled={getFieldValue("mobileBankType") === "NONE"}
                                      prefix={<MobileOutlined className="text-muted-foreground" />}
                                      placeholder="01700111222"
                                    />
                                  </Form.Item>
                                )}
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Supporting Document"
                                name="document"
                                valuePropName="fileList"
                                getValueFromEvent={normalizeUploadValue}
                                extra="Upload an optional bank document, cheque image, or payment proof."
                              >
                                <Upload
                                  beforeUpload={() => false}
                                  maxCount={1}
                                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                                >
                                  <Button size="large">Upload Payment Document</Button>
                                </Upload>
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <Text className="block font-medium">
                                Save payment configuration
                              </Text>
                              <Text type="secondary">
                                You can update these payment details any time from this page.
                              </Text>
                            </div>

                            <Button
                              type="primary"
                              htmlType="submit"
                              size="large"
                              loading={isPaymentSaving || isPaymentSettingsLoading}
                              className="w-full sm:w-auto"
                            >
                              Save Payment Settings
                            </Button>
                          </div>
                        </Form>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>
    
  );
};

export default ProviderSettings;
