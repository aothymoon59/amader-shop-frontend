/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import AntdModal from "@/components/shared/modal/AntdModal";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { businessTypes } from "@/constants/businessType";
import { toast } from "@/hooks/use-toast";
import { useCreateProviderByAdminMutation } from "@/redux/features/admin/providerManagementApi";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type CreateProviderByAdminPayload = {
  name: string;
  email: string;
  password: string;
  shopName: string;
  businessType: string;
  phone: string;
  address: string;
  tradeLicense: UploadFile[];
  description: string;
  status: ProviderStatus;
};

type CreateProviderByAdminModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const generateRandomPassword = (length = 10) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!?";
  const all = upper + lower + numbers + symbols;

  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const CreateProviderByAdminModal = ({
  isModalOpen,
  closeModal,
}: CreateProviderByAdminModalProps) => {
  const [form] = Form.useForm<CreateProviderByAdminPayload>();
  const [createProviderByAdmin, { isLoading }] =
    useCreateProviderByAdminMutation();

  const initialValues = useMemo<CreateProviderByAdminPayload>(
    () => ({
      name: "",
      email: "",
      password: "",
      shopName: "",
      businessType: "",
      phone: "",
      address: "",
      tradeLicense: [],
      description: "",
      status: "APPROVED",
    }),
    [],
  );

  const normalizeUploadValue = (
    event: { fileList?: UploadFile[] } | UploadFile[],
  ) => {
    if (Array.isArray(event)) {
      return event;
    }

    return event?.fileList || [];
  };

  const handleGeneratePassword = () => {
    const password = generateRandomPassword(10);
    form.setFieldValue("password", password);
  };

  const handleClose = () => {
    form.resetFields();
    closeModal();
  };

  const onFinish = async (values: CreateProviderByAdminPayload) => {
    try {
      const tradeLicenseFile = values.tradeLicense?.[0]?.originFileObj;

      if (!tradeLicenseFile) {
        toast({
          title: "Trade license required",
          description: "Please upload a trade license file.",
          variant: "destructive",
        });
        return;
      }

      const payload = new FormData();
      payload.append("name", values.name);
      payload.append("email", values.email);
      payload.append("password", values.password);
      payload.append("shopName", values.shopName);
      payload.append("businessType", values.businessType);
      payload.append("phone", values.phone);
      payload.append("address", values.address);
      payload.append("status", values.status);
      payload.append("tradeLicense", tradeLicenseFile);
      if (values.description) {
        payload.append("description", values.description);
      }

      const res = await createProviderByAdmin(payload).unwrap();

      toast({
        title: "Provider created",
        description: res?.message || "Provider has been created successfully.",
      });

      form.resetFields();
      closeModal();
    } catch (error: any) {
      toast({
        title: "Create provider failed",
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
      title="Create Provider"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
      width={900}
      isCentered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Provider Name"
              name="name"
              rules={[{ required: true, message: "Provider name is required" }]}
            >
              <Input placeholder="Jamal Kodu" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input placeholder="jamal@example.com" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Password" required style={{ marginBottom: 0 }}>
              <Row gutter={8}>
                <Col flex="auto">
                  <Form.Item
                    name="password"
                    noStyle
                    rules={[
                      { required: true, message: "Password is required" },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleGeneratePassword}
                  >
                    Generate
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select placeholder="Select status">
                <Option value="APPROVED">APPROVED</Option>
                <Option value="PENDING">PENDING</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[{ required: true, message: "Shop name is required" }]}
            >
              <Input placeholder="Rahim Store" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Business Type"
              name="businessType"
              rules={[{ required: true, message: "Business type is required" }]}
            >
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
                { required: true, message: "Phone number is required" },
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
              rules={[{ required: true, message: "Trade license is required" }]}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.jpeg,.png,.webp">
                <Button>Upload Trade License</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input placeholder="Dhaka, Bangladesh" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Neighborhood retail shop" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Provider
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default CreateProviderByAdminModal;
