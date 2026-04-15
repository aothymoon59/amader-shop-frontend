import { useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SystemCurrency,
} from "@/redux/features/generalApi/systemSettingsApi";

type CurrencyFormValues = {
  currency: SystemCurrency;
};

const SystemCurrencySettingsSection = () => {
  const [form] = Form.useForm<CurrencyFormValues>();
  const watchedCurrency = Form.useWatch("currency", form);
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    form.setFieldsValue({
      currency: data.data.currency,
    });
  }, [data, form]);

  const handleSubmit = async (values: CurrencyFormValues) => {
    try {
      await updateSystemSettings({
        currency: {
          code: values.currency.code.trim().toUpperCase(),
          symbol: values.currency.symbol.trim(),
          name: values.currency.name.trim(),
        },
      }).unwrap();

      toast({
        title: "System currency updated",
        description: "All currency displays will now use the latest system currency.",
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
          : "Unable to update system currency right now.";

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
        message="System-wide currency"
        description="Admins can change the currency code, symbol, and name here. Amounts that use the shared formatter will update automatically."
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          currency: {
            code: "BDT",
            symbol: "৳",
            name: "Bangladeshi Taka",
          },
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Form.Item
            label="Currency Code"
            name={["currency", "code"]}
            rules={[
              { required: true, message: "Please enter currency code" },
              { len: 3, message: "Currency code must be exactly 3 characters" },
            ]}
          >
            <Input placeholder="BDT" maxLength={3} disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item
            label="Currency Symbol"
            name={["currency", "symbol"]}
            rules={[{ required: true, message: "Please enter currency symbol" }]}
          >
            <Input placeholder="৳" disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item
            label="Currency Name"
            name={["currency", "name"]}
            rules={[{ required: true, message: "Please enter currency name" }]}
          >
            <Input
              placeholder="Bangladeshi Taka"
              disabled={isLoading || isUpdating}
            />
          </Form.Item>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-secondary/20 p-4">
          <div>
            <div className="font-medium">Preview</div>
            <div className="text-sm text-muted-foreground">
              {form.getFieldValue(["currency", "symbol"]) || "৳"} 1250.00 •{" "}
              {form.getFieldValue(["currency", "code"]) || "BDT"} •{" "}
              {form.getFieldValue(["currency", "name"]) || "Bangladeshi Taka"}
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isUpdating}
          >
            Save Currency
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SystemCurrencySettingsSection;
