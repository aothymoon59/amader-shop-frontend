import { useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import type { HomePageSection } from "@/types/homePageCms";

type CmsHomePageFormModalProps = {
  open: boolean;
  section: HomePageSection | null;
  onClose: () => void;
  onSave: (section: HomePageSection) => void;
};

type RepeaterItem = {
  title?: string;
  subtitle?: string;
  extra?: string;
  extraTwo?: string;
};

type FormValues = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  enabled: boolean;
  primaryText?: string;
  secondaryText?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  highlights?: string[];
  promoCardTitle?: string;
  promoCardSubtitle?: string;
  promoCardItems?: string[];
  deliveryTitle?: string;
  deliverySubtitle?: string;
  trustedTitle?: string;
  trustedSubtitle?: string;
  cardSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  emptyStateText?: string;
  errorTitle?: string;
  errorDescription?: string;
  coverageSubtitle?: string;
  coverageItems?: string[];
  items?: RepeaterItem[];
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const CmsHomePageFormModal = ({
  open,
  section,
  onClose,
  onSave,
}: CmsHomePageFormModalProps) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!section) {
      form.resetFields();
      return;
    }

    const content = section.content as Record<string, unknown>;
    const mapItems = (): RepeaterItem[] => {
      const source = Array.isArray(content.items) ? content.items : [];

      switch (section.key) {
        case "stats":
          return source.map((item) => ({
            title: String(item?.label || ""),
            subtitle: String(item?.value || ""),
          }));
        case "promo":
          return source.map((item) => ({
            title: String(item?.title || ""),
            subtitle: String(item?.subtitle || ""),
            extra: String(item?.emoji || ""),
            extraTwo: String(item?.theme || "primary"),
          }));
        case "whyChooseUs":
          return source.map((item) => ({
            title: String(item?.title || ""),
            subtitle: String(item?.desc || ""),
            extra: String(item?.icon || "Truck"),
          }));
        case "howItWorks":
          return source.map((item) => ({
            title: String(item?.title || ""),
            subtitle: String(item?.desc || ""),
          }));
        default:
          return [];
      }
    };

    form.setFieldsValue({
      name: section.name,
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      enabled: section.enabled,
      primaryText: String(content.primaryText || ""),
      secondaryText: String(content.secondaryText || ""),
      primaryButtonText: String(content.primaryButtonText || ""),
      primaryButtonLink: String(content.primaryButtonLink || ""),
      secondaryButtonText: String(content.secondaryButtonText || ""),
      secondaryButtonLink: String(content.secondaryButtonLink || ""),
      highlights: Array.isArray(content.highlights) ? content.highlights.map(String) : [],
      promoCardTitle: String(content.promoCardTitle || ""),
      promoCardSubtitle: String(content.promoCardSubtitle || ""),
      promoCardItems: Array.isArray(content.promoCardItems)
        ? content.promoCardItems.map(String)
        : [],
      deliveryTitle: String(content.deliveryTitle || ""),
      deliverySubtitle: String(content.deliverySubtitle || ""),
      trustedTitle: String(content.trustedTitle || ""),
      trustedSubtitle: String(content.trustedSubtitle || ""),
      cardSubtitle: String(content.cardSubtitle || ""),
      ctaText: String(content.ctaText || ""),
      ctaLink: String(content.ctaLink || ""),
      emptyStateText: String(content.emptyStateText || ""),
      errorTitle: String(content.errorTitle || ""),
      errorDescription: String(content.errorDescription || ""),
      coverageSubtitle: String(content.coverageSubtitle || ""),
      coverageItems: Array.isArray(content.coverageItems)
        ? content.coverageItems.map(String)
        : [],
      items: mapItems(),
    });
  }, [form, section]);

  const buildContent = (values: FormValues) => {
    switch (section?.key) {
      case "topPromoBar":
        return {
          primaryText: values.primaryText?.trim() || "",
          secondaryText: values.secondaryText?.trim() || "",
        };
      case "hero":
        return {
          primaryButtonText: values.primaryButtonText?.trim() || "",
          primaryButtonLink: values.primaryButtonLink?.trim() || "",
          secondaryButtonText: values.secondaryButtonText?.trim() || "",
          secondaryButtonLink: values.secondaryButtonLink?.trim() || "",
          highlights: (values.highlights || []).map((item) => item.trim()).filter(Boolean),
          promoCardTitle: values.promoCardTitle?.trim() || "",
          promoCardSubtitle: values.promoCardSubtitle?.trim() || "",
          promoCardItems: (values.promoCardItems || [])
            .map((item) => item.trim())
            .filter(Boolean),
          deliveryTitle: values.deliveryTitle?.trim() || "",
          deliverySubtitle: values.deliverySubtitle?.trim() || "",
          trustedTitle: values.trustedTitle?.trim() || "",
          trustedSubtitle: values.trustedSubtitle?.trim() || "",
        };
      case "stats":
        return {
          items: (values.items || []).map((item) => ({
            label: item.title?.trim() || "",
            value: item.subtitle?.trim() || "",
          })),
        };
      case "popularProducts":
      case "featuredProducts":
        return {
          ctaText: values.ctaText?.trim() || "",
          ctaLink: values.ctaLink?.trim() || "",
          emptyStateText: values.emptyStateText?.trim() || "",
          errorTitle: values.errorTitle?.trim() || "",
          errorDescription: values.errorDescription?.trim() || "",
        };
      case "categories":
        return {
          cardSubtitle: values.cardSubtitle?.trim() || "",
          ctaText: values.ctaText?.trim() || "",
          ctaLink: values.ctaLink?.trim() || "",
          emptyStateText: values.emptyStateText?.trim() || "",
          errorTitle: values.errorTitle?.trim() || "",
          errorDescription: values.errorDescription?.trim() || "",
        };
      case "promo":
        return {
          items: (values.items || []).map((item) => ({
            title: item.title?.trim() || "",
            subtitle: item.subtitle?.trim() || "",
            emoji: item.extra?.trim() || "",
            theme: item.extraTwo?.trim() || "primary",
          })),
        };
      case "whyChooseUs":
        return {
          items: (values.items || []).map((item) => ({
            icon: item.extra?.trim() || "Truck",
            title: item.title?.trim() || "",
            desc: item.subtitle?.trim() || "",
          })),
        };
      case "howItWorks":
        return {
          items: (values.items || []).map((item) => ({
            title: item.title?.trim() || "",
            desc: item.subtitle?.trim() || "",
          })),
        };
      case "appAndCoverage":
        return {
          primaryButtonText: values.primaryButtonText?.trim() || "",
          primaryButtonLink: values.primaryButtonLink?.trim() || "",
          secondaryButtonText: values.secondaryButtonText?.trim() || "",
          secondaryButtonLink: values.secondaryButtonLink?.trim() || "",
          coverageSubtitle: values.coverageSubtitle?.trim() || "",
          coverageItems: (values.coverageItems || [])
            .map((item) => item.trim())
            .filter(Boolean),
        };
      case "testimonials":
        return {
          emptyStateText: values.emptyStateText?.trim() || "",
        };
      case "vendorCta":
        return {
          primaryButtonText: values.primaryButtonText?.trim() || "",
          primaryButtonLink: values.primaryButtonLink?.trim() || "",
          secondaryButtonText: values.secondaryButtonText?.trim() || "",
          secondaryButtonLink: values.secondaryButtonLink?.trim() || "",
        };
      default:
        return section?.content || {};
    }
  };

  const submit = async () => {
    if (!section) {
      return;
    }

    const values = await form.validateFields();

    onSave({
      ...section,
      name: values.name.trim() || section.name,
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      description: values.description.trim(),
      enabled: values.enabled,
      content: buildContent(values),
    });
  };

  const renderArrayTextArea = (name: keyof FormValues, label: string, placeholder: string) => (
    <Form.Item
      label={label}
      getValueFromEvent={(event) => splitLines(event.target.value)}
      getValueProps={(value) => ({ value: Array.isArray(value) ? value.join("\n") : "" })}
      name={name}
    >
      <Input.TextArea rows={4} placeholder={placeholder} />
    </Form.Item>
  );

  const renderButtonFields = () => (
    <>
      <Form.Item label="Primary Button Text" name="primaryButtonText">
        <Input placeholder="Primary button label" />
      </Form.Item>
      <Form.Item label="Primary Button Link" name="primaryButtonLink">
        <Input placeholder="/products" />
      </Form.Item>
      <Form.Item label="Secondary Button Text" name="secondaryButtonText">
        <Input placeholder="Secondary button label" />
      </Form.Item>
      <Form.Item label="Secondary Button Link" name="secondaryButtonLink">
        <Input placeholder="/provider/apply" />
      </Form.Item>
    </>
  );

  const renderRepeater = () => {
    if (!section) {
      return null;
    }

    if (!["stats", "promo", "whyChooseUs", "howItWorks"].includes(section.key)) {
      return null;
    }

    return (
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Typography.Text strong>
                {section.key === "stats"
                  ? "Items"
                  : section.key === "promo"
                    ? "Promo Cards"
                    : section.key === "whyChooseUs"
                      ? "Feature Cards"
                      : "Steps"}
              </Typography.Text>
              <Button
                type="dashed"
                onClick={() =>
                  add(
                    section.key === "whyChooseUs"
                      ? { extra: "Truck" }
                      : section.key === "promo"
                        ? { extraTwo: "primary" }
                        : {},
                  )
                }
              >
                Add Item
              </Button>
            </Space>

            {fields.map((field) => (
              <Card size="small" key={field.key}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <Form.Item label="Title" name={[field.name, "title"]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={section.key === "stats" ? "Value" : "Subtitle / Description"}
                    name={[field.name, "subtitle"]}
                  >
                    {section.key === "stats" ? <Input /> : <Input.TextArea rows={3} />}
                  </Form.Item>

                  {section.key === "promo" ? (
                    <>
                      <Form.Item label="Badge Text" name={[field.name, "extra"]}>
                        <Input placeholder="Fresh" />
                      </Form.Item>
                      <Form.Item label="Theme" name={[field.name, "extraTwo"]}>
                        <Select
                          options={[
                            { value: "primary", label: "Primary" },
                            { value: "accent", label: "Accent" },
                            { value: "mixed", label: "Mixed" },
                          ]}
                        />
                      </Form.Item>
                    </>
                  ) : null}

                  {section.key === "whyChooseUs" ? (
                    <Form.Item label="Icon" name={[field.name, "extra"]}>
                      <Select
                        options={[
                          { value: "Truck", label: "Truck" },
                          { value: "ShieldCheck", label: "ShieldCheck" },
                          { value: "BadgePercent", label: "BadgePercent" },
                          { value: "Clock3", label: "Clock3" },
                        ]}
                      />
                    </Form.Item>
                  ) : null}

                  <Button danger type="default" onClick={() => remove(field.name)}>
                    Remove Item
                  </Button>
                </Space>
              </Card>
            ))}
          </Space>
        )}
      </Form.List>
    );
  };

  const renderSectionFields = () => {
    switch (section?.key) {
      case "topPromoBar":
        return (
          <>
            <Form.Item label="Left Promo Text" name="primaryText">
              <Input />
            </Form.Item>
            <Form.Item label="Right Promo Text" name="secondaryText">
              <Input />
            </Form.Item>
          </>
        );
      case "hero":
        return (
          <>
            {renderButtonFields()}
            {renderArrayTextArea("highlights", "Highlights", "One highlight per line")}
            <Form.Item label="Promo Card Subtitle" name="promoCardSubtitle">
              <Input />
            </Form.Item>
            <Form.Item label="Promo Card Title" name="promoCardTitle">
              <Input />
            </Form.Item>
            {renderArrayTextArea("promoCardItems", "Promo Card Items", "One item per line")}
            <Form.Item label="Delivery Label" name="deliverySubtitle">
              <Input />
            </Form.Item>
            <Form.Item label="Delivery Value" name="deliveryTitle">
              <Input />
            </Form.Item>
            <Form.Item label="Trusted Label" name="trustedSubtitle">
              <Input />
            </Form.Item>
            <Form.Item label="Trusted Value" name="trustedTitle">
              <Input />
            </Form.Item>
          </>
        );
      case "stats":
      case "promo":
      case "whyChooseUs":
      case "howItWorks":
        return renderRepeater();
      case "popularProducts":
      case "featuredProducts":
        return (
          <>
            <Form.Item label="Button Text" name="ctaText">
              <Input />
            </Form.Item>
            <Form.Item label="Button Link" name="ctaLink">
              <Input />
            </Form.Item>
            <Form.Item label="Empty State Text" name="emptyStateText">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Error Title" name="errorTitle">
              <Input />
            </Form.Item>
            <Form.Item label="Error Description" name="errorDescription">
              <Input />
            </Form.Item>
          </>
        );
      case "categories":
        return (
          <>
            <Form.Item label="Card Subtitle" name="cardSubtitle">
              <Input />
            </Form.Item>
            <Form.Item label="Button Text" name="ctaText">
              <Input />
            </Form.Item>
            <Form.Item label="Button Link" name="ctaLink">
              <Input />
            </Form.Item>
            <Form.Item label="Empty State Text" name="emptyStateText">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Error Title" name="errorTitle">
              <Input />
            </Form.Item>
            <Form.Item label="Error Description" name="errorDescription">
              <Input />
            </Form.Item>
          </>
        );
      case "appAndCoverage":
        return (
          <>
            {renderButtonFields()}
            <Form.Item label="Coverage Description" name="coverageSubtitle">
              <Input.TextArea rows={4} />
            </Form.Item>
            {renderArrayTextArea(
              "coverageItems",
              "Coverage Bullet Points",
              "One point per line",
            )}
          </>
        );
      case "testimonials":
        return (
          <Form.Item label="Empty State Text" name="emptyStateText">
            <Input.TextArea rows={4} />
          </Form.Item>
        );
      case "vendorCta":
        return renderButtonFields();
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      title={section ? `Edit ${section.name}` : "Edit Section"}
      onCancel={onClose}
      onOk={submit}
      width={900}
      okText="Save Changes"
      destroyOnClose
    >
      <Typography.Paragraph type="secondary">
        Update this section using simple form fields so admins can manage content without editing
        technical data.
      </Typography.Paragraph>

      <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
        <Form.Item label="Section Enabled" name="enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Section Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Subtitle" name="subtitle">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        {renderSectionFields()}
      </Form>
    </Modal>
  );
};

export default CmsHomePageFormModal;
