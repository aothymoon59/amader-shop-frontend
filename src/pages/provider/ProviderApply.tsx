/* eslint-disable @typescript-eslint/no-explicit-any */
import PublicLayout from "@/components/layouts/PublicLayout";
import { Store } from "lucide-react";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { FiUpload } from "react-icons/fi";
import { useApplyProviderMutation } from "@/redux/features/provider/providerApi";
import { toast } from "@/hooks/use-toast";
import type { UploadFile } from "antd/es/upload/interface";
import { businessTypes } from "@/constants/businessType";

const { TextArea } = Input;
const { Option } = Select;

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const ProviderApply = () => {
  const [form] = Form.useForm();
  const [applyProvider, { isLoading }] = useApplyProviderMutation();

  const onFinish = async (values: any) => {
    try {
      const tradeLicenseFile = values.tradeLicense?.[0]?.originFileObj;

      if (!tradeLicenseFile) {
        message.error("Trade license is required");
        return;
      }

      const payload = new FormData();

      payload.append("shopName", values.shopName);
      payload.append("businessType", values.businessType);
      payload.append("phone", values.phone);
      payload.append("address", values.address);
      if (values.description) {
        payload.append("description", values.description);
      }

      payload.append("tradeLicense", tradeLicenseFile);

      const res = await applyProvider(payload).unwrap();
      if (res.success) {
        toast({
          title: "Application submitted",
          description: res.message || "Your application has been submitted.",
        });
        form.resetFields();
      }
    } catch (error: any) {
      toast({
        title: "Application failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <PublicLayout>
      <div className="container py-16 max-w-2xl">
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
            <Store className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">
            Apply to sell your products on SmallShop
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Shop Name */}
            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[{ required: true, message: "Shop name is required" }]}
            >
              <Input placeholder="Rahim Store" />
            </Form.Item>

            {/* Business Type */}
            <Form.Item
              label="Business Type"
              name="businessType"
              rules={[{ required: true, message: "Select business type" }]}
            >
              <Select placeholder="Select business type">
                {businessTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Phone is required" },
                {
                  pattern: /^01[0-9]{9}$/,
                  message: "Enter valid Bangladeshi phone number",
                },
              ]}
            >
              <Input placeholder="01700111222" />
            </Form.Item>

            {/* Address */}
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input placeholder="Dhaka, Bangladesh" />
            </Form.Item>

            {/* Trade License Upload */}
            <Form.Item
              label="Trade License"
              name="tradeLicense"
              valuePropName="fileList"
              getValueFromEvent={normalizeUploadValue}
              rules={[{ required: true, message: "Trade license is required" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".pdf,.jpg,.png"
              >
                <Button icon={<FiUpload />}>Upload Trade License</Button>
              </Upload>
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} placeholder="Describe your shop..." />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Submit Application
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProviderApply;
