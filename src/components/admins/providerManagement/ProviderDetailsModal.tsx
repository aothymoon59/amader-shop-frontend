import AntdModal from "@/components/shared/modal/AntdModal";
import { Avatar, Button, Divider, Form, InputNumber, Select, Switch, Tag, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  useGetProviderCommissionSettingsQuery,
  useUpdateProviderCommissionSettingsMutation,
} from "@/redux/features/wallet/walletApi";

const { Text, Paragraph } = Typography;

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type ProviderRecord = {
  id: string;
  userId: string;
  createdById?: string | null;
  shopName: string;
  businessType: string;
  phone: string;
  address: string;
  tradeLicense: string;
  description: string | null;
  status: ProviderStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

type ProviderDetailsModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  data: ProviderRecord | null;
};

const getStatusTag = (status?: ProviderStatus) => {
  if (status === "APPROVED") {
    return <Tag color="success">APPROVED</Tag>;
  }

  if (status === "REJECTED") {
    return <Tag color="error">REJECTED</Tag>;
  }

  return <Tag color="warning">PENDING</Tag>;
};

const getAccessTag = (isActive?: boolean) =>
  isActive ? <Tag color="blue">ACTIVE</Tag> : <Tag color="default">INACTIVE</Tag>;

const ProviderDetailsModal = ({
  isModalOpen,
  closeModal,
  data: provider,
}: ProviderDetailsModalProps) => {
  const [commissionForm] = Form.useForm();
  const { data: commissionData } = useGetProviderCommissionSettingsQuery(
    provider?.userId || "",
    { skip: !provider?.userId || !isModalOpen },
  );
  const [updateCommissionSettings, { isLoading: isSavingCommission }] =
    useUpdateProviderCommissionSettingsMutation();

  const commissionSettings = commissionData?.data;

  const handleSaveCommission = async () => {
    if (!provider?.userId) return;

    try {
      const values = await commissionForm.validateFields();
      await updateCommissionSettings({
        providerId: provider.userId,
        useCustomCommission: Boolean(values.useCustomCommission),
        commissionEnabled: Boolean(values.commissionEnabled),
        commissionType: values.commissionType,
        commissionValue: Number(values.commissionValue || 0),
      }).unwrap();

      toast({
        title: "Commission updated",
        description: "Provider commission settings were saved successfully.",
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
          : "Unable to update provider commission settings.";

      toast({
        title: "Commission update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!commissionSettings) {
      return;
    }

    commissionForm.setFieldsValue({
      useCustomCommission: commissionSettings.useCustomCommission,
      commissionEnabled: commissionSettings.commissionEnabled,
      commissionType: commissionSettings.commissionType,
      commissionValue: commissionSettings.commissionValue,
    });
  }, [commissionForm, commissionSettings]);

  return (
    <AntdModal
      title="Provider Details"
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      width={800}
      height="70vh"
      isCentered
    >
      {!provider ? (
        <div className="py-10 text-center text-muted-foreground">
          No provider selected.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                size={64}
                className="!bg-primary !text-primary-foreground !font-semibold"
              >
                {provider.shopName?.[0] || "S"}
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {provider.shopName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {getStatusTag(provider.status)}
                  {getAccessTag(provider.isActive)}
                  <Tag>{provider.businessType}</Tag>
                </div>
              </div>
            </div>
          </div>

          <Divider className="!my-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border p-4 space-y-4">
              <h3 className="text-base font-semibold">Business Information</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShopOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Shop Name</Text>
                    <div className="font-medium">{provider.shopName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileTextOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Business Type</Text>
                    <div className="font-medium">{provider.businessType}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Phone Number</Text>
                    <div className="font-medium">{provider.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Address</Text>
                    <div className="font-medium">{provider.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-4">
              <h3 className="text-base font-semibold">Owner Information</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Owner Name</Text>
                    <div className="font-medium">{provider.user?.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MailOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Email Address</Text>
                    <div className="font-medium break-all">
                      {provider.user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Current User Role</Text>
                    <div className="font-medium">{provider.user?.role}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Provider Access</Text>
                    <div className="font-medium">
                      {provider.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="text-base font-semibold">Description</h3>
            <Paragraph className="!mb-0">
              {provider.description || "No description provided."}
            </Paragraph>
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="text-base font-semibold">Trade License</h3>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="primary"
                href={provider.tradeLicense}
                target="_blank"
              >
                View License
              </Button>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <h3 className="text-base font-semibold">Payment / Commission Settings</h3>
            <Form form={commissionForm} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Use Custom Commission"
                  name="useCustomCommission"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="Commission Enabled"
                  name="commissionEnabled"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item label="Commission Type" name="commissionType">
                  <Select
                    options={[
                      { label: "Percentage", value: "PERCENTAGE" },
                      { label: "Fixed", value: "FIXED" },
                    ]}
                  />
                </Form.Item>

                <Form.Item label="Commission Value" name="commissionValue">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </div>
            </Form>

            {commissionSettings?.effectiveCommission && (
              <div className="rounded-lg bg-secondary/30 p-3 text-sm">
                Effective:{" "}
                {commissionSettings.effectiveCommission.enabled
                  ? `${commissionSettings.effectiveCommission.type} ${commissionSettings.effectiveCommission.value} (${commissionSettings.effectiveCommission.source})`
                  : `Disabled (${commissionSettings.effectiveCommission.source})`}
              </div>
            )}

            <Button type="primary" onClick={handleSaveCommission} loading={isSavingCommission}>
              Save Commission Settings
            </Button>
          </div>

          {provider.createdBy && (
            <div className="rounded-xl border p-4 space-y-4">
              <h3 className="text-base font-semibold">Created By(Admin)</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Text type="secondary">Name</Text>
                  <div className="font-medium">{provider.createdBy.name}</div>
                </div>

                <div>
                  <Text type="secondary">Email</Text>
                  <div className="font-medium break-all">
                    {provider.createdBy.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border p-4 space-y-2">
              <Text type="secondary">Created At</Text>
              <div className="font-medium">
                {dayjs(provider.createdAt).format("MMMM D, YYYY h:mm A")}
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <Text type="secondary">Last Updated</Text>
              <div className="font-medium">
                {dayjs(provider.updatedAt).format("MMMM D, YYYY h:mm A")}
              </div>
            </div>
          </div>
        </div>
      )}
    </AntdModal>
  );
};

export default ProviderDetailsModal;
