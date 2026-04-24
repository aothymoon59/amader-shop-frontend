import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { ManagedCmsSection } from "@/types/cmsSections";
import { useUploadHeroBannerImagesMutation } from "@/redux/features/generalApi/homePageCmsApi";
import {
  AppAndCoverageSectionFields,
  CategoriesSectionFields,
  FaqSectionFields,
  HeroSectionFields,
  ProductSectionFields,
  RepeaterSectionFields,
  StorySectionFields,
  TestimonialsSectionFields,
  TopPromoBarSectionFields,
  VendorCtaSectionFields,
} from "./homePageSections";
import type {
  ButtonFieldsProps,
  CmsSectionFormModalProps,
  FormValues,
  RepeaterItem,
} from "./homePageSections/types";

const sectionDescriptions: Partial<Record<ManagedCmsSection["key"], string>> = {
  topPromoBar:
    "Update the short announcement that appears at the very top of the homepage.",
  hero: "Manage the main first-impression area including messaging, actions, and rotating banners.",
  stats: "Edit the quick trust signals and headline metrics shown to visitors.",
  popularProducts:
    "Control CTA and fallback copy for the popular products module.",
  featuredProducts:
    "Control CTA and fallback copy for the featured products module.",
  categories: "Adjust supporting copy and CTA messaging for category browsing.",
  promo:
    "Maintain the promotional cards that highlight key offers or campaigns.",
  whyChooseUs:
    "Refine the value propositions that explain why shoppers should trust the platform.",
  howItWorks:
    "Keep the step-by-step onboarding or shopping guidance clear and concise.",
  appAndCoverage:
    "Manage app download actions and area coverage messaging in one place.",
  testimonials: "Set fallback text for the testimonials experience.",
  vendorCta:
    "Configure the call-to-action that encourages new vendors to join.",
  story:
    "Manage the main story, mission, and narrative copy for the About page.",
  faq: "Keep reusable frequently asked questions and answers updated in one place.",
};

const CmsHomePageFormModal = ({
  open,
  section,
  onClose,
  onSave,
}: CmsSectionFormModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [uploadHeroBannerImages, { isLoading: isUploadingBanners }] =
    useUploadHeroBannerImagesMutation();

  useEffect(() => {
    if (!section) {
      form.resetFields();
      setBannerFileList([]);
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
        case "faq":
          return source.map((item) => ({
            title: String(item?.question || ""),
            subtitle: String(item?.answer || ""),
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
      bannerImageUrls: Array.isArray(content.bannerImageUrls)
        ? content.bannerImageUrls.map(String)
        : [],
      highlights: Array.isArray(content.highlights)
        ? content.highlights.map(String)
        : [],
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
    setBannerFileList([]);
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
          bannerImageUrls: (values.bannerImageUrls || [])
            .map((item) => item.trim())
            .filter(Boolean),
          highlights: (values.highlights || [])
            .map((item) => item.trim())
            .filter(Boolean),
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
      case "faq":
        return {
          items: (values.items || []).map((item) => ({
            question: item.title?.trim() || "",
            answer: item.subtitle?.trim() || "",
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
      case "story":
        return section?.content || {};
      default:
        return section?.content || {};
    }
  };

  const submit = async () => {
    if (!section) {
      return;
    }

    const values = await form.validateFields();
    const existingHeroBannerImageUrls =
      section.key === "hero" &&
      Array.isArray(
        (section.content as Record<string, unknown>).bannerImageUrls,
      )
        ? (
            (section.content as Record<string, unknown>)
              .bannerImageUrls as unknown[]
          )
            .map(String)
            .filter(Boolean)
        : [];
    let heroBannerImageUrls =
      values.bannerImageUrls?.map((item) => item.trim()).filter(Boolean) ||
      existingHeroBannerImageUrls;

    if (section.key === "hero" && bannerFileList.length > 0) {
      try {
        const payload = new FormData();

        bannerFileList.forEach((file) => {
          if (file.originFileObj) {
            payload.append("banners", file.originFileObj);
          }
        });

        const response = await uploadHeroBannerImages(payload).unwrap();
        heroBannerImageUrls = [
          ...heroBannerImageUrls,
          ...response.data.bannerImageUrls,
        ];
      } catch {
        message.error("Hero banner images could not be uploaded.");
        return;
      }
    }

    onSave({
      ...section,
      name: values.name.trim() || section.name,
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      description: values.description.trim(),
      enabled: values.enabled,
      content:
        section.key === "hero"
          ? {
              ...buildContent(values),
              bannerImageUrls: heroBannerImageUrls,
            }
          : buildContent(values),
    });
  };

  const renderButtonFields = (props?: ButtonFieldsProps) => (
    <>
      <Form.Item
        label={props?.primaryTextLabel || "Primary Button Text"}
        name="primaryButtonText"
      >
        <Input
          placeholder={props?.primaryTextPlaceholder || "Enter button label"}
        />
      </Form.Item>
      <Form.Item
        label={props?.primaryLinkLabel || "Primary Button Link"}
        name="primaryButtonLink"
      >
        <Input placeholder={props?.primaryLinkPlaceholder || "/products"} />
      </Form.Item>
      <Form.Item
        label={props?.secondaryTextLabel || "Secondary Button Text"}
        name="secondaryButtonText"
      >
        <Input
          placeholder={
            props?.secondaryTextPlaceholder || "Enter secondary button label"
          }
        />
      </Form.Item>
      <Form.Item
        label={props?.secondaryLinkLabel || "Secondary Button Link"}
        name="secondaryButtonLink"
      >
        <Input
          placeholder={props?.secondaryLinkPlaceholder || "/provider/apply"}
        />
      </Form.Item>
    </>
  );

  const renderRepeater = () => {
    if (!section) {
      return null;
    }

    if (
      !["stats", "promo", "whyChooseUs", "howItWorks"].includes(section.key)
    ) {
      return null;
    }

    return (
      <RepeaterSectionFields
        sectionKey={
          section.key as "stats" | "promo" | "whyChooseUs" | "howItWorks"
        }
      />
    );
  };

  const renderSectionFields = () => {
    switch (section?.key) {
      case "topPromoBar":
        return <TopPromoBarSectionFields />;
      case "hero":
        return (
          <HeroSectionFields
            form={form}
            bannerFileList={bannerFileList}
            isUploadingBanners={isUploadingBanners}
            onBannerFileListChange={setBannerFileList}
            renderButtonFields={renderButtonFields}
          />
        );
      case "stats":
      case "promo":
      case "whyChooseUs":
      case "howItWorks":
        return renderRepeater();
      case "story":
        return <StorySectionFields />;
      case "popularProducts":
      case "featuredProducts":
        return <ProductSectionFields />;
      case "categories":
        return <CategoriesSectionFields />;
      case "appAndCoverage":
        return (
          <AppAndCoverageSectionFields
            renderButtonFields={renderButtonFields}
          />
        );
      case "testimonials":
        return <TestimonialsSectionFields />;
      case "vendorCta":
        return (
          <VendorCtaSectionFields renderButtonFields={renderButtonFields} />
        );
      case "faq":
        return <FaqSectionFields />;
      default:
        return null;
    }
  };

  const sectionDescription = section
    ? sectionDescriptions[section.key] ||
      "Update the content and settings for this homepage section."
    : "Update the content and settings for this homepage section.";

  return (
    <Modal
      open={open}
      title={null}
      onCancel={onClose}
      onOk={submit}
      width={980}
      okText="Save Changes"
      okButtonProps={{ loading: isUploadingBanners }}
      destroyOnClose
      maskClosable={false}
      styles={{
        body: { paddingTop: 12 },
      }}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Typography.Title level={3} className="!mb-0">
                {section ? `Edit ${section.name} Section` : "Edit Section"}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 max-w-2xl text-sm text-slate-600">
                {sectionDescription}
              </Typography.Paragraph>
            </div>

            {section ? (
              <div className="flex flex-wrap items-center gap-2">
                <Tag color={section.enabled ? "green" : "default"}>
                  {section.enabled ? "Live on page" : "Currently hidden"}
                </Tag>
              </div>
            ) : null}
          </div>
        </div>

        <div className="max-h-[68vh] overflow-y-auto pr-1">
          <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
            <Tabs
              defaultActiveKey="basics"
              items={[
                {
                  key: "basics",
                  label: "Basics",
                  children: (
                    <Card
                      bordered={false}
                      className="rounded-2xl bg-slate-50/70"
                      styles={{ body: { padding: 20 } }}
                    >
                      <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Section status"
                            name="enabled"
                            valuePropName="checked"
                            extra="Turn this off to hide the section from the homepage without deleting its content."
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
                    </Card>
                  ),
                },
                {
                  key: "content",
                  label: "Section Content",
                  children: (
                    <Card
                      bordered={false}
                      className="rounded-2xl bg-white"
                      styles={{ body: { padding: 20 } }}
                    >
                      <div className="mb-4">
                        <Typography.Title level={5} className="!mb-1">
                          Section-specific content
                        </Typography.Title>
                        <Typography.Paragraph className="!mb-0 text-sm text-slate-500">
                          These fields control the actual content shown to
                          customers for this homepage block.
                        </Typography.Paragraph>
                      </div>
                      {renderSectionFields()}
                    </Card>
                  ),
                },
              ]}
            />
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CmsHomePageFormModal;
