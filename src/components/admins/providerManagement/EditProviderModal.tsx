/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import AntdModal from "@/components/shared/modal/AntdModal";
import { Button, Card, Col, Form, Input, Row, Select, Space, Typography, Upload } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { toast } from "@/hooks/use-toast";
import { businessTypes } from "@/constants/businessType";
import { useUpdateProviderMutation } from "@/redux/features/admin/providerManagementApi";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;
const { Text, Link } = Typography;

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type ProviderRecord = {
  id: string;
  shopName: string;
  businessType: string;
  phone: string;
  address: string;
  tradeLicense: string;
  description: string | null;
  status: ProviderStatus;
  isActive: boolean;
};

type EditProviderFormValues = {
  shopName?: string;
  businessType?: string;
  phone?: string;
  address?: string;
  description?: string;
  tradeLicense?: UploadFile[];
};

type EditProviderModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  provider: ProviderRecord | null;
};

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const EditProviderModal = ({
  isModalOpen,
  closeModal,
  provider,
}: EditProviderModalProps) => {
  const [form] = Form.useForm<EditProviderFormValues>();
  const [updateProvider, { isLoading }] = useUpdateProviderMutation();

  useEffect(() => {
    if (!provider || !isModalOpen) return;

    form.setFieldsValue({
      shopName: provider.shopName,
      businessType: provider.businessType,
      phone: provider.phone,
      address: provider.address,
      description: provider.description || "",
      tradeLicense: [],
    });
  }, [provider, isModalOpen, form]);

  const handleClose = () => {
    form.resetFields();
    closeModal();
  };

  const onFinish = async (values: EditProviderFormValues) => {
    if (!provider) return;

    try {
      const payload = new FormData();
      const tradeLicenseFile = values.tradeLicense?.[0]?.originFileObj;

      if (values.shopName?.trim() && values.shopName !== provider.shopName) {
        payload.append("shopName", values.shopName.trim());
      }
      if (
        values.businessType?.trim() &&
        values.businessType !== provider.businessType
      ) {
        payload.append("businessType", values.businessType);
      }
      if (values.phone?.trim() && values.phone !== provider.phone) {
        payload.append("phone", values.phone.trim());
      }
      if (values.address?.trim() && values.address !== provider.address) {
        payload.append("address", values.address.trim());
      }

      const nextDescription = values.description?.trim() || "";
      const currentDescription = provider.description || "";
      if (nextDescription !== currentDescription) {
        payload.append("description", nextDescription);
      }

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

      const res = await updateProvider({
        id: provider.id,
        payload,
      }).unwrap();

      toast({
        title: "Provider updated",
        description: res?.message || "Provider updated successfully.",
      });

      handleClose();
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

  return (
    <AntdModal
      title="Update Provider"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
      width={900}
      isCentered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {provider?.tradeLicense && (
          <Card
            size="small"
            className="mb-4 shadow-sm"
            title="Current Trade License"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Space align="start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileTextOutlined />
                </div>
                <div>
                  <Text className="block font-medium">Existing uploaded file</Text>
                  <Text type="secondary">
                    Upload a new file below only if you want to replace it.
                  </Text>
                </div>
              </Space>

              <Link href={provider.tradeLicense} target="_blank">
                View Current File
              </Link>
            </div>
          </Card>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[{ min: 2, message: "Shop name must be at least 2 characters" }]}
            >
              <Input placeholder="Rahim Store" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Business Type" name="businessType">
              <Select placeholder="Select business type">
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
                  message: "Enter valid Bangladeshi phone number",
                },
              ]}
            >
              <Input placeholder="01700111222" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Trade License"
              name="tradeLicense"
              valuePropName="fileList"
              getValueFromEvent={normalizeUploadValue}
              extra="Upload a new file only if you want to replace the current license."
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
              >
                <Button>Replace Trade License</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ min: 5, message: "Address must be at least 5 characters" }]}
            >
              <Input placeholder="Dhaka, Bangladesh" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Description" name="description">
              <TextArea rows={4} placeholder="Neighborhood retail shop" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default EditProviderModal;
