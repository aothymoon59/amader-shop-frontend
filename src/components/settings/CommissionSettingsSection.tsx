import { useEffect } from "react";
import { Alert, Button, Form, InputNumber, Select, Switch } from "antd";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "@/redux/features/generalApi/systemSettingsApi";

type CommissionFormValues = {
  commission: {
    enabled: boolean;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    balanceReleaseDelayDays: number;
  };
};

const CommissionSettingsSection = () => {
  const [form] = Form.useForm<CommissionFormValues>();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (!data?.data?.commission) {
      return;
    }

    form.setFieldsValue({
      commission: data.data.commission,
    });
  }, [data, form]);

  const handleSubmit = async (values: CommissionFormValues) => {
    try {
      await updateSystemSettings({
        commission: {
          enabled: Boolean(values.commission.enabled),
          type: values.commission.type,
          value: Number(values.commission.value || 0),
          balanceReleaseDelayDays: Number(
            values.commission.balanceReleaseDelayDays || 0,
          ),
        },
      }).unwrap();

      toast({
        title: "Commission settings updated",
        description:
          "Global provider commission and wallet release timing have been saved.",
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
          : "Unable to update commission settings right now.";

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
        message="Global provider commission"
        description="Set the default commission rule for all providers and choose how many days earnings should stay pending before becoming available."
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          commission: {
            enabled: false,
            type: "PERCENTAGE",
            value: 0,
            balanceReleaseDelayDays: 7,
          },
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Form.Item
            label="Commission Enabled"
            name={["commission", "enabled"]}
            valuePropName="checked"
          >
            <Switch disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item
            label="Commission Type"
            name={["commission", "type"]}
            rules={[
              { required: true, message: "Please select commission type" },
            ]}
          >
            <Select
              disabled={isLoading || isUpdating}
              options={[
                { label: "Percentage", value: "PERCENTAGE" },
                { label: "Fixed", value: "FIXED" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Commission Value"
            name={["commission", "value"]}
            rules={[
              { required: true, message: "Please enter commission value" },
            ]}
          >
            <InputNumber
              min={0}
              className="w-full"
              disabled={isLoading || isUpdating}
            />
          </Form.Item>

          <Form.Item
            label="Release Delay (Days)"
            name={["commission", "balanceReleaseDelayDays"]}
            rules={[{ required: true, message: "Please enter release delay" }]}
          >
            <InputNumber
              min={0}
              max={90}
              className="w-full"
              disabled={isLoading || isUpdating}
            />
          </Form.Item>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-secondary/20 p-4">
          <div>
            <div className="font-medium">Commission preview</div>
            <div className="text-sm text-muted-foreground">
              {data?.data?.commission?.type} {data?.data?.commission?.value} •
              Wallet release after{" "}
              {data?.data?.commission?.balanceReleaseDelayDays || 0} days
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isUpdating}
          >
            Save Commission
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CommissionSettingsSection;
