import { Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { toast } from "@/hooks/use-toast";
import { useChangePasswordMutation } from "@/redux/features/auth/usersApi";

const { Title, Paragraph, Text } = Typography;

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as {
      errorMessage?: string;
      message?: string;
    };

    return data.errorMessage || data.message;
  }

  return undefined;
};

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordSection = () => {
  const [form] = Form.useForm<ChangePasswordFormValues>();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast({
        title: "Password changed",
        description:
          response.message || "Your password has been updated successfully.",
      });
      form.resetFields();
    } catch (error: unknown) {
      toast({
        title: "Password change failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while changing your password.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card bordered={false} className="shadow-sm">
      <div className="mb-6">
        <Title level={4} className="!mb-1">
          Change Password
        </Title>
        <Paragraph className="!mb-0 text-muted-foreground">
          Choose a strong new password to keep your account secure.
        </Paragraph>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-muted-foreground" />}
            placeholder="Enter current password"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 6, message: "New password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-muted-foreground" />}
            placeholder="Enter new password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-muted-foreground" />}
            placeholder="Confirm new password"
          />
        </Form.Item>

        <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text className="block font-medium">Update your password</Text>
            <Text type="secondary">
              After changing it, use the new password the next time you sign in.
            </Text>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="w-full sm:w-auto"
          >
            Change Password
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ChangePasswordSection;
