/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ShopOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { businessTypes } from "@/constants/businessType";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useUpdateProviderProfileMutation } from "@/redux/features/provider/providerApi";
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
  const [form] = Form.useForm<ProviderSettingsFormValues>();
  const { userData } = useAuth();
  const [updateProviderProfile, { isLoading }] =
    useUpdateProviderProfileMutation();

  const providerProfile: any = userData?.providerProfile;

  useEffect(() => {
    if (!providerProfile) return;

    form.setFieldsValue({
      shopName: providerProfile.shopName || "",
      businessType: providerProfile.businessType || "",
      phone: providerProfile.phone || "",
      address: providerProfile.address || "",
      description: providerProfile.description || "",
      tradeLicense: [],
    });
  }, [providerProfile, form]);

  const onFinish = async (values: ProviderSettingsFormValues) => {
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

  if (!providerProfile) {
    return (
      <DashboardLayout role="provider">
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
      </DashboardLayout>
    );
  }

  const currentStatus =
    statusConfig[
      (providerProfile.status as keyof typeof statusConfig) || "PENDING"
    ];

  return (
    <DashboardLayout role="provider">
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
                Update your shop details, contact information, and trade license
                from one simple place.
              </Paragraph>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag color={currentStatus.color} icon={currentStatus.icon}>
                {currentStatus.label}
              </Tag>
              <Tag color={providerProfile.isActive ? "blue" : "default"}>
                {providerProfile.isActive ? "Active" : "Inactive"}
              </Tag>
            </div>
          </div>
        </Card>

        {!providerProfile.isActive && (
          <Alert
            showIcon
            type="warning"
            message="Your provider account is inactive"
            description="Profile details can still be reviewed here, but provider actions stay blocked until an administrator reactivates your account."
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={8}>
            <Card bordered={false} className="shadow-sm">
              <div className="mb-5">
                <Title level={4} className="!mb-1">
                  Personal Information
                </Title>
                <Paragraph className="!mb-0 text-muted-foreground">
                  Account-level details linked to your login profile.
                </Paragraph>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                  <Text type="secondary">Full Name</Text>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {userData?.name || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                  <Text type="secondary">Email Address</Text>
                  <p className="mt-1 break-all text-sm font-semibold text-foreground">
                    {userData?.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-background p-4">
                  <Text className="block font-medium">
                    Personal info API will be added next
                  </Text>
                  <Text type="secondary">
                    This section is ready for future fields like personal phone,
                    address, and account profile updates.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={16}>
            <Card bordered={false} className="shadow-sm">
              <div className="mb-5">
                <Title level={4} className="!mb-1">
                  Update Personal Information
                </Title>
                <Paragraph className="!mb-0 text-muted-foreground">
                  Layout prepared for the upcoming personal account update API.
                </Paragraph>
              </div>

              <Form layout="vertical" disabled>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item label="Full Name">
                      <Input
                        size="large"
                        value={String(userData?.name || "")}
                        placeholder="Your full name"
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Email Address">
                      <Input
                        size="large"
                        value={String(userData?.email || "")}
                        placeholder="your@email.com"
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Phone Number">
                      <Input
                        size="large"
                        placeholder="Will be enabled with the personal info API"
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-secondary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Text className="block font-medium">
                      Personal account update is not connected yet
                    </Text>
                    <Text type="secondary">
                      Once the backend API is ready, this form can become fully
                      editable without changing the page structure.
                    </Text>
                  </div>

                  <Button size="large" disabled>
                    Update Personal Info
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card bordered={false} className="shadow-sm">
              <Space direction="vertical" size={14} className="w-full">
                <div>
                  <Text type="secondary">Current Profile</Text>
                  <Title level={4} className="!mb-1 !mt-1">
                    {providerProfile.shopName}
                  </Title>
                  <Paragraph className="!mb-0 text-muted-foreground">
                    Review the profile information currently saved for your
                    provider account.
                  </Paragraph>
                </div>

                <div className="space-y-4">
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

                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                    <Text type="secondary">Address</Text>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {providerProfile.address}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                    <Text type="secondary">Account Email</Text>
                    <p className="mt-1 break-all text-sm font-semibold text-foreground">
                      {userData?.email}
                    </p>
                  </div>
                </div>

                {providerProfile.tradeLicense && (
                  <Card
                    size="small"
                    className="border border-border/80 bg-background shadow-none"
                    title="Trade License"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Space align="start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FileTextOutlined />
                        </div>
                        <div>
                          <Text className="block font-medium">
                            Current trade license
                          </Text>
                          <Text type="secondary">
                            Open the existing file or replace it from the form.
                          </Text>
                        </div>
                      </Space>

                      <Link href={providerProfile.tradeLicense} target="_blank">
                        View File
                      </Link>
                    </div>
                  </Card>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} xl={16}>
            <Card bordered={false} className="shadow-sm">
              <div className="mb-6">
                <Title level={4} className="!mb-1">
                  Update Provider Profile
                </Title>
                <Paragraph className="!mb-0 text-muted-foreground">
                  Only changed values will be submitted.
                </Paragraph>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                          message:
                            "Shop name must be at least 2 characters long",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={
                          <ShopOutlined className="text-muted-foreground" />
                        }
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
                        prefix={
                          <UserOutlined className="text-muted-foreground" />
                        }
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
                      Save profile updates
                    </Text>
                    <Text type="secondary">
                      Changes will update your provider profile immediately.
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isLoading}
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
    </DashboardLayout>
  );
};

export default ProviderSettings;
