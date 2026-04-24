import { useEffect } from "react";
import { Button, Col, Form, Input, Row, Switch, Tabs, Tag, Typography } from "antd";

import AntdModal from "@/components/shared/modal/AntdModal";
import { getSectionFormValues, trimField } from "./sectionFormValues";
import type { CmsSectionEditorModalProps } from "./types";
import type { FormValues } from "../../sections/sharedSectionFields/types";

const CmsSectionEditorModal = ({
  open,
  section,
  onClose,
  onSave,
  description,
  submitLoading = false,
  buildContent,
  children,
}: CmsSectionEditorModalProps) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!section) {
      form.resetFields();
      return;
    }

    form.setFieldsValue(getSectionFormValues(section));
  }, [form, section]);

  const submit = async () => {
    if (!section) {
      return;
    }

    const values = await form.validateFields();
    const content = await buildContent(values, section);

    if (content === null) {
      return;
    }

    onSave({
      ...section,
      name: trimField(values.name) || section.name,
      title: trimField(values.title),
      subtitle: trimField(values.subtitle),
      description: trimField(values.description),
      enabled: values.enabled,
      content,
    });
  };

  return (
    <AntdModal
      title={section ? `Edit ${section.name} Section` : "Edit Section"}
      width={980}
      height="76vh"
      isModalOpen={open}
      closeModal={onClose}
    >
      <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <Typography.Paragraph className="!mb-0 max-w-2xl text-sm text-slate-600">
                {description}
              </Typography.Paragraph>

              {section ? (
                <Tag color={section.enabled ? "green" : "default"}>
                  {section.enabled ? "Live on page" : "Currently hidden"}
                </Tag>
              ) : null}
            </div>
          </div>

          <Tabs
            defaultActiveKey="basics"
            items={[
              {
                key: "basics",
                label: "Basics",
                children: (
                  <div className="rounded-lg bg-slate-50/70 p-4">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Section status"
                          name="enabled"
                          valuePropName="checked"
                          extra="Turn this off to hide the section without deleting its content."
                        >
                          <Switch
                            checkedChildren="Enabled"
                            unCheckedChildren="Hidden"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Internal section name"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Section name is required.",
                            },
                          ]}
                          extra="Used by admins for identification inside the dashboard."
                        >
                          <Input placeholder="Homepage Hero" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Title"
                          name="title"
                          extra="Main heading visitors will notice first."
                        >
                          <Input placeholder="Fresh groceries delivered fast" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Subtitle"
                          name="subtitle"
                          extra="Short supporting copy that adds context under the title."
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Add a concise and helpful supporting message"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Description"
                          name="description"
                          extra="Optional longer explanation or admin-managed marketing summary."
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Include any extra detail you want editors to maintain here"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: "content",
                label: "Section Content",
                children: (
                  <div className="rounded-lg border border-slate-100 bg-white p-4">
                    <div className="mb-4">
                      <Typography.Title level={5} className="!mb-1">
                        Section-specific content
                      </Typography.Title>
                      <Typography.Paragraph className="!mb-0 text-sm text-slate-500">
                        These fields control the actual content shown to
                        customers for this page section.
                      </Typography.Paragraph>
                    </div>
                    {children(form)}
                  </div>
                ),
              },
            ]}
          />

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" loading={submitLoading} onClick={submit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
    </AntdModal>
  );
};

export default CmsSectionEditorModal;
