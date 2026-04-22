import { useEffect } from "react";
import { Alert, Button, Form, Input, InputNumber, Switch } from "antd";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SystemSettings,
} from "@/redux/features/generalApi/systemSettingsApi";

type EmailCloudinaryConfigFormValues = {
  emailCloudinaryConfig: SystemSettings["emailCloudinaryConfig"];
};

const EmailCloudinaryConfigSettingsSection = () => {
  const [form] = Form.useForm<EmailCloudinaryConfigFormValues>();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (!data?.data?.emailCloudinaryConfig) {
      return;
    }

    form.setFieldsValue({
      emailCloudinaryConfig: data.data.emailCloudinaryConfig,
    });
  }, [data, form]);

  const handleSubmit = async (values: EmailCloudinaryConfigFormValues) => {
    try {
      await updateSystemSettings({
        emailCloudinaryConfig: values.emailCloudinaryConfig,
      }).unwrap();

      toast({
        title: "Email and Cloudinary config updated",
        description: "Email and media storage settings have been saved.",
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
          : "Unable to update email and Cloudinary settings right now.";

      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      <Alert
        type="info"
        showIcon
        message="Email & Cloudinary Config"
        description="Keep these values aligned with your deployment environment variables for mail delivery and asset uploads."
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Form.Item label="Email From Name" name={["emailCloudinaryConfig", "emailFromName"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Email From Address" name={["emailCloudinaryConfig", "emailFromAddress"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="SMTP Host" name={["emailCloudinaryConfig", "smtpHost"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="SMTP Port" name={["emailCloudinaryConfig", "smtpPort"]}>
            <InputNumber
              min={1}
              max={65535}
              className="w-full"
              disabled={isLoading || isUpdating}
            />
          </Form.Item>

          <Form.Item label="SMTP Username" name={["emailCloudinaryConfig", "smtpUsername"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="SMTP Password" name={["emailCloudinaryConfig", "smtpPassword"]}>
            <Input.Password disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item
            label="SMTP Secure"
            name={["emailCloudinaryConfig", "smtpSecure"]}
            valuePropName="checked"
          >
            <Switch disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Cloudinary Cloud Name" name={["emailCloudinaryConfig", "cloudinaryCloudName"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Cloudinary API Key" name={["emailCloudinaryConfig", "cloudinaryApiKey"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Cloudinary API Secret" name={["emailCloudinaryConfig", "cloudinaryApiSecret"]}>
            <Input.Password disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Cloudinary Upload Preset" name={["emailCloudinaryConfig", "cloudinaryUploadPreset"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Cloudinary Folder" name={["emailCloudinaryConfig", "cloudinaryFolder"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <Button type="primary" onClick={() => form.submit()} loading={isUpdating}>
            Save Email & Cloudinary Config
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmailCloudinaryConfigSettingsSection;
