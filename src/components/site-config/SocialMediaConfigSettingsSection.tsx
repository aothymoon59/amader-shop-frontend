import { useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SystemSettings,
} from "@/redux/features/generalApi/systemSettingsApi";

type SocialMediaConfigFormValues = {
  socialMediaConfig: SystemSettings["socialMediaConfig"];
};

const SocialMediaConfigSettingsSection = () => {
  const [form] = Form.useForm<SocialMediaConfigFormValues>();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (!data?.data?.socialMediaConfig) {
      return;
    }

    form.setFieldsValue({
      socialMediaConfig: data.data.socialMediaConfig,
    });
  }, [data, form]);

  const handleSubmit = async (values: SocialMediaConfigFormValues) => {
    try {
      await updateSystemSettings({
        socialMediaConfig: values.socialMediaConfig,
      }).unwrap();

      toast({
        title: "Social media config updated",
        description: "Social profile links have been saved. Partial entries are allowed.",
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
          : "Unable to update social media settings right now.";

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
        message="Social Media Config"
        description="These fields are optional. Save all of them or only the platforms you actually use."
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item label="Facebook URL" name={["socialMediaConfig", "facebookUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="Instagram URL" name={["socialMediaConfig", "instagramUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="X / Twitter URL" name={["socialMediaConfig", "xUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="YouTube URL" name={["socialMediaConfig", "youtubeUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="LinkedIn URL" name={["socialMediaConfig", "linkedinUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="TikTok URL" name={["socialMediaConfig", "tiktokUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
          <Form.Item label="WhatsApp URL" name={["socialMediaConfig", "whatsappUrl"]}>
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <Button type="primary" onClick={() => form.submit()} loading={isUpdating}>
            Save Social Media Config
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SocialMediaConfigSettingsSection;
