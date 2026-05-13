import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import RichTextEditor from "@/components/cms/RichTextEditor";
import {
  useGetAdminLegalPagesQuery,
  useUpdateLegalPagesMutation,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultLegalPages,
  type LegalCmsPage,
  type LegalPageSlug,
} from "@/types/cmsSections";

type CmsLegalPagesManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsLegalPagesManagementBoard = ({
  role,
}: CmsLegalPagesManagementBoardProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LegalCmsPage>();
  const [selectedSlug, setSelectedSlug] = useState<LegalPageSlug>("terms");
  const [contentHtml, setContentHtml] = useState("");
  const { data, isLoading, isError, refetch } = useGetAdminLegalPagesQuery();
  const [updateLegalPages, { isLoading: isSaving }] =
    useUpdateLegalPagesMutation();
  const basePath =
    role === "admin" ? "/admin/cms/management" : "/super-admin/cms/management";

  const pages = useMemo(
    () => (data?.data.pages?.length ? data.data.pages : defaultLegalPages),
    [data?.data.pages],
  );
  const selectedPage =
    pages.find((page) => page.slug === selectedSlug) || defaultLegalPages[0];

  useEffect(() => {
    form.setFieldsValue(selectedPage);
    setContentHtml(selectedPage.contentHtml || "");
  }, [form, selectedPage]);

  const handleSubmit = async (values: LegalCmsPage) => {
    const nextPage: LegalCmsPage = {
      ...selectedPage,
      ...values,
      slug: selectedPage.slug,
      path: selectedPage.path,
      contentHtml,
      updatedAt: new Date().toISOString(),
    };
    const nextPages = pages.map((page) =>
      page.slug === selectedPage.slug ? nextPage : page,
    );

    try {
      await updateLegalPages({ pages: nextPages }).unwrap();
      message.success(`${selectedPage.name} updated successfully.`);
    } catch (error) {
      message.error("The legal page could not be saved.");
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Card bordered={false} style={{ borderRadius: 20 }}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(basePath)}
            style={{ width: "fit-content", borderRadius: 10 }}
          >
            Back to CMS Pages
          </Button>

          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              Legal Pages CMS
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Manage Privacy Policy and Terms of Service content with rich text.
            </Typography.Paragraph>
          </div>
        </Space>
      </Card>

      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load legal pages"
          description={
            <Button type="link" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : null}

      <Card bordered={false} style={{ borderRadius: 18 }}>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Select
            size="large"
            value={selectedSlug}
            loading={isLoading}
            onChange={(value) => setSelectedSlug(value)}
            options={pages.map((page) => ({
              value: page.slug,
              label: page.name,
            }))}
            style={{ maxWidth: 360, width: "100%" }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={isLoading || isSaving}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Item label="Page Name" name="name">
                <Input prefix={<FileTextOutlined />} />
              </Form.Item>

              <Form.Item label="Enabled" name="enabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>

            <Form.Item
              label="Hero Title"
              name="heroTitle"
              rules={[{ required: true, message: "Hero title is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Hero Subtitle" name="heroSubtitle">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Content Title"
              name="contentTitle"
              rules={[{ required: true, message: "Content title is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Description" required>
              <RichTextEditor
                value={contentHtml}
                onChange={setContentHtml}
                disabled={isLoading || isSaving}
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
              >
                Save Legal Page
              </Button>
            </div>
          </Form>
        </Space>
      </Card>
    </Space>
  );
};

export default CmsLegalPagesManagementBoard;
