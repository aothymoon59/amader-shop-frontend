import { useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SystemSettings,
} from "@/redux/features/generalApi/systemSettingsApi";

type AnalyticsConfigFormValues = {
  gaGtmConfig: SystemSettings["gaGtmConfig"];
};

const AnalyticsConfigSettingsSection = () => {
  const [form] = Form.useForm<AnalyticsConfigFormValues>();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (!data?.data?.gaGtmConfig) {
      return;
    }

    form.setFieldsValue({
      gaGtmConfig: data.data.gaGtmConfig,
    });
  }, [data, form]);

  const handleSubmit = async (values: AnalyticsConfigFormValues) => {
    try {
      await updateSystemSettings({
        gaGtmConfig: values.gaGtmConfig,
      }).unwrap();

      toast({
        title: "Analytics config updated",
        description: "Google Analytics and GTM settings have been saved.",
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
          : "Unable to update analytics settings right now.";

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
        message="GA / GTM Configuration"
        description="Manage analytics identifiers used for site-wide tracking and tag management."
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Google Analytics Measurement ID"
            name={["gaGtmConfig", "googleAnalyticsMeasurementId"]}
          >
            <Input
              disabled={isLoading || isUpdating}
              placeholder="G-ABC1234567"
            />
          </Form.Item>

          <Form.Item
            label="Google Tag Manager ID"
            name={["gaGtmConfig", "googleTagManagerId"]}
          >
            <Input
              disabled={isLoading || isUpdating}
              placeholder="GTM-ABC1234"
            />
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <Button type="primary" onClick={() => form.submit()} loading={isUpdating}>
            Save Analytics Config
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AnalyticsConfigSettingsSection;
