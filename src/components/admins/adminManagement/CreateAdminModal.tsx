/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";

import AntdModal from "@/components/shared/modal/AntdModal";
import { toast } from "@/hooks/use-toast";
import { useCreateAdminMutation } from "@/redux/features/admin/adminManagementApi";

type CreateAdminFormValues = {
  name: string;
  email: string;
  password: string;
  personalContact?: string;
  personalAddress?: string;
};

type CreateAdminModalProps = {
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

  for (let i = password.length; i < length; i += 1) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const CreateAdminModal = ({
  isModalOpen,
  closeModal,
}: CreateAdminModalProps) => {
  const [form] = Form.useForm<CreateAdminFormValues>();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const handleClose = () => {
    form.resetFields();
    closeModal();
  };

  const onGeneratePassword = () => {
    form.setFieldValue("password", generateRandomPassword(10));
  };

  const onFinish = async (values: CreateAdminFormValues) => {
    try {
      const res = await createAdmin({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        personalContact: values.personalContact?.trim() || undefined,
        personalAddress: values.personalAddress?.trim() || undefined,
      }).unwrap();

      toast({
        title: "Admin created",
        description:
          res?.message || "Admin created and credentials sent by email.",
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: "Create failed",
        description:
          error?.data?.message || "Something went wrong while creating admin.",
        variant: "destructive",
      });
    }
  };

  return (
    <AntdModal
      title="Create Admin"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
      width={820}
      isCentered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Admin Name"
              name="name"
              rules={[{ required: true, message: "Admin name is required" }]}
            >
              <Input placeholder="Sarah Johnson" />
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
              <Input placeholder="sarah@example.com" />
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
                    <Input.Password placeholder="Temporary password" />
                  </Form.Item>
                </Col>
                <Col>
                  <Button icon={<ReloadOutlined />} onClick={onGeneratePassword}>
                    Generate
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="personalContact"
              rules={[
                {
                  pattern: /^$|^01[0-9]{9}$/,
                  message: "Enter valid Bangladeshi phone number",
                },
              ]}
            >
              <Input placeholder="01700111222" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Address" name="personalAddress">
              <Input placeholder="Banani, Dhaka" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Admin
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default CreateAdminModal;
