import { useEffect, useState } from "react";
import { Form, Input, Modal, Switch, Typography, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { HomePageSection } from "@/types/homePageCms";
import { useUploadHeroBannerImagesMutation } from "@/redux/features/generalApi/homePageCmsApi";
import {
  AppAndCoverageSectionFields,
  CategoriesSectionFields,
  HeroSectionFields,
  ProductSectionFields,
  RepeaterSectionFields,
  TestimonialsSectionFields,
  TopPromoBarSectionFields,
  VendorCtaSectionFields,
} from "./homePageSections";
import type {
  ButtonFieldsProps,
  FormValues,
  RepeaterItem,
} from "./homePageSections/types";

type CmsHomePageFormModalProps = {
  open: boolean;
  section: HomePageSection | null;
  onClose: () => void;
  onSave: (section: HomePageSection) => void;
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
    let heroBannerImageUrls = values.bannerImageUrls || [];

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

  const renderArrayTextArea = (
    name: keyof FormValues,
    label: string,
    placeholder: string,
  ) => (
    <Form.Item
      label={label}
      getValueFromEvent={(event) => splitLines(event.target.value)}
      getValueProps={(value) => ({
        value: Array.isArray(value) ? value.join("\n") : "",
      })}
      name={name}
    >
      <Input.TextArea rows={4} placeholder={placeholder} />
    </Form.Item>
  );

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
            renderArrayTextArea={renderArrayTextArea}
            renderButtonFields={renderButtonFields}
          />
        );
      case "stats":
      case "promo":
      case "whyChooseUs":
      case "howItWorks":
        return renderRepeater();
      case "popularProducts":
      case "featuredProducts":
        return <ProductSectionFields />;
      case "categories":
        return <CategoriesSectionFields />;
      case "appAndCoverage":
        return (
          <AppAndCoverageSectionFields
            renderArrayTextArea={renderArrayTextArea}
            renderButtonFields={renderButtonFields}
          />
        );
      case "testimonials":
        return <TestimonialsSectionFields />;
      case "vendorCta":
        return (
          <VendorCtaSectionFields renderButtonFields={renderButtonFields} />
        );
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
      okButtonProps={{ loading: isUploadingBanners }}
      destroyOnClose
      maskClosable={false}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
          <Form.Item
            label="Section Enabled"
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Section Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Internal section name for admins" />
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input placeholder="Main heading shown on the homepage" />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle">
            <Input.TextArea
              rows={3}
              placeholder="Short supporting text under the main heading"
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Optional extra description or SEO-friendly summary"
            />
          </Form.Item>

          {renderSectionFields()}
        </Form>
      </div>
    </Modal>
  );
};

export default CmsHomePageFormModal;
