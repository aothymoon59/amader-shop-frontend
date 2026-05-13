import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Input, Select } from "antd";

import { useCms } from "@/context/CmsContext";
import { toast } from "@/hooks/use-toast";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SeoConfigRecord,
} from "@/redux/features/generalApi/systemSettingsApi";

type SeoConfigFormValues = SeoConfigRecord;

const defaultSeoPages = [
  "home",
  "products",
  "product details",
  "about",
  "contact",
  "privacy policy",
  "terms of service",
  "provider apply",
  "cart",
  "checkout",
  "login",
  "register",
];

const createEmptySeoConfig = (page: string): SeoConfigRecord => ({
  page,
  meta_title: "",
  meta_description: "",
  meta_keywords: [],
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  twitter_card_type: "",
  twitter_title: "",
  twitter_description: "",
  robots_directive: "",
});

const SeoConfigSettingsSection = () => {
  const [form] = Form.useForm<SeoConfigFormValues>();
  // const { pages } = useCms();
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating }] =
    useUpdateSystemSettingsMutation();

  const pageOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...defaultSeoPages,
          // ...pages.map((page) => page.slug.replace(/-/g, " ")),
          ...(data?.data?.seoConfigs || []).map((config) => config.page),
        ]),
      ).filter(Boolean),
    [data?.data?.seoConfigs],
  );

  const [selectedPage, setSelectedPage] = useState(pageOptions[0] || "home");

  useEffect(() => {
    if (pageOptions.length === 0) {
      return;
    }

    setSelectedPage((current) =>
      pageOptions.includes(current) ? current : pageOptions[0],
    );
  }, [pageOptions]);

  useEffect(() => {
    if (!selectedPage) {
      return;
    }

    const currentConfig =
      data?.data?.seoConfigs?.find(
        (config) => config.page.toLowerCase() === selectedPage.toLowerCase(),
      ) || createEmptySeoConfig(selectedPage);

    form.setFieldsValue(currentConfig);
  }, [data?.data?.seoConfigs, form, selectedPage]);

  const handleSubmit = async (values: SeoConfigFormValues) => {
    try {
      await updateSystemSettings({
        seoConfigs: [
          {
            ...values,
            page: selectedPage,
            meta_keywords: (values.meta_keywords || []).filter(Boolean),
          },
        ],
      }).unwrap();

      toast({
        title: "SEO config updated",
        description: `SEO metadata for ${selectedPage} has been saved.`,
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
          : "Unable to update SEO settings right now.";

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
        message="SEO Config"
        description="Metadata is stored per page. Choose a page, edit its metadata, and save it independently."
      />

      <div className="rounded-xl border bg-secondary/20 p-4">
        <div className="mb-2 text-sm font-medium">Select Page</div>
        <Select
          className="w-full"
          value={selectedPage}
          onChange={setSelectedPage}
          disabled={isLoading || isUpdating}
          options={pageOptions.map((page) => ({
            label: page.toLocaleUpperCase(),
            value: page,
          }))}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Meta Title"
            name="meta_title"
            rules={[{ required: true, message: "Please enter meta title" }]}
          >
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Canonical URL" name="canonical_url">
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
        </div>

        <Form.Item
          label="Meta Description"
          name="meta_description"
          rules={[{ required: true, message: "Please enter meta description" }]}
        >
          <Input.TextArea rows={3} disabled={isLoading || isUpdating} />
        </Form.Item>

        <Form.Item label="Meta Keywords" name="meta_keywords">
          <Select
            mode="tags"
            tokenSeparators={[","]}
            disabled={isLoading || isUpdating}
            placeholder="Add keywords"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item label="OG Title" name="og_title">
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="OG Image URL" name="og_image_url">
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
        </div>

        <Form.Item label="OG Description" name="og_description">
          <Input.TextArea rows={3} disabled={isLoading || isUpdating} />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item label="Twitter Card Type" name="twitter_card_type">
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>

          <Form.Item label="Twitter Title" name="twitter_title">
            <Input disabled={isLoading || isUpdating} />
          </Form.Item>
        </div>

        <Form.Item label="Twitter Description" name="twitter_description">
          <Input.TextArea rows={3} disabled={isLoading || isUpdating} />
        </Form.Item>

        <Form.Item label="Robots Directive" name="robots_directive">
          <Input disabled={isLoading || isUpdating} />
        </Form.Item>

        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isUpdating}
          >
            Save SEO Config
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SeoConfigSettingsSection;
