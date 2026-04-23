import type { FormInstance } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { ReactNode } from "react";

export type RepeaterItem = {
  title?: string;
  subtitle?: string;
  extra?: string;
  extraTwo?: string;
};

export type FormValues = {
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
  bannerImageUrls?: string[];
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

export type ButtonFieldsProps = {
  primaryTextLabel?: string;
  primaryTextPlaceholder?: string;
  primaryLinkLabel?: string;
  primaryLinkPlaceholder?: string;
  secondaryTextLabel?: string;
  secondaryTextPlaceholder?: string;
  secondaryLinkLabel?: string;
  secondaryLinkPlaceholder?: string;
};

export type HeroSectionFieldsProps = {
  form: FormInstance<FormValues>;
  bannerFileList: UploadFile[];
  isUploadingBanners: boolean;
  onBannerFileListChange: (files: UploadFile[]) => void;
  renderButtonFields: (props?: ButtonFieldsProps) => ReactNode;
};
