import { useEffect } from "react";
import { Alert, Button, Form, Image, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSiteOverviewSettingsMutation,
} from "@/redux/features/generalApi/systemSettingsApi";

type SiteOverviewFormValues = {
  name?: string;
  description?: string;
  copyrights?: string;
  logo?: UploadFile[];
  favicon?: UploadFile[];
};

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const SiteOverviewSettingsSection = () => {
  const [form] = Form.useForm<SiteOverviewFormValues>();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSiteOverviewSettings, { isLoading: isUpdating }] =
    useUpdateSiteOverviewSettingsMutation();

  useEffect(() => {
    if (!data?.data?.siteOverview) {
      return;
    }

    form.setFieldsValue({
      name: data.data.siteOverview.name,
      description: data.data.siteOverview.description,
      copyrights: data.data.siteOverview.copyrights,
      logo: [],
      favicon: [],
    });
  }, [data, form]);

  const handleSubmit = async (values: SiteOverviewFormValues) => {
    try {
      const payload = new FormData();

      payload.append("name", values.name?.trim() || "");
      payload.append("description", values.description?.trim() || "");
      payload.append("copyrights", values.copyrights?.trim() || "");

      const logoFile = values.logo?.[0]?.originFileObj;
      const faviconFile = values.favicon?.[0]?.originFileObj;

      if (logoFile) {
        payload.append("logo", logoFile);
      }

      if (faviconFile) {
        payload.append("favicon", faviconFile);
      }

      await updateSiteOverviewSettings(payload).unwrap();

      toast({
        title: "Site overview updated",
        description:
          "Name, description, logo, and favicon settings have been saved.",
      });

      form.setFieldValue("logo", []);
      form.setFieldValue("favicon", []);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to update site overview right now.";

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
        message="Site Overview"
        description="Define the main website identity fields and upload the actual logo and favicon files."
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Site Name"
            name="name"
            rules={[{ required: true, message: "Please enter the site name" }]}
          >
            <Input disabled={isLoading || isUpdating} placeholder="SmallShop" />
          </Form.Item>

          <Form.Item label="Copyrights" name="copyrights">
            <Input
              disabled={isLoading || isUpdating}
              placeholder="Copyright 2026 SmallShop. All rights reserved."
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea
            rows={4}
            disabled={isLoading || isUpdating}
            placeholder="Brief site description"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-secondary/20 p-4">
            <div className="mb-3 text-sm font-medium">Current Logo</div>
            {data?.data?.siteOverview?.logoUrl ? (
              <Image
                src={data.data.siteOverview.logoUrl}
                alt="Site logo"
                className="max-h-24 object-contain"
                preview={false}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No logo uploaded yet.
              </div>
            )}
            <Form.Item
              className="mt-4 mb-0"
              label="Upload Logo"
              name="logo"
              valuePropName="fileList"
              getValueFromEvent={normalizeUploadValue}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.webp,.svg"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Choose Logo File</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="rounded-xl border bg-secondary/20 p-4">
            <div className="mb-3 text-sm font-medium">Current Favicon</div>
            {data?.data?.siteOverview?.faviconUrl ? (
              <Image
                src={data.data.siteOverview.faviconUrl}
                alt="Site favicon"
                className="max-h-16 max-w-16 object-contain"
                preview={false}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No favicon uploaded yet.
              </div>
            )}
            <Form.Item
              className="mt-4 mb-0"
              label="Upload Favicon"
              name="favicon"
              valuePropName="fileList"
              getValueFromEvent={normalizeUploadValue}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".ico,.png,.svg,.webp"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Choose Favicon File</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isUpdating}
          >
            Save Site Overview
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SiteOverviewSettingsSection;
