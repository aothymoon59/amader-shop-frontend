import type { ManagedCmsSection } from "@/types/cmsSections";
import type {
  FormValues,
  RepeaterItem,
} from "../../sections/sharedSectionFields/types";

export const trimField = (value?: string) => value?.trim() || "";

export const trimList = (items?: string[]) =>
  (items || []).map((item) => item.trim()).filter(Boolean);

export const getHeroBannerImageUrls = (section: ManagedCmsSection) => {
  const content = section.content as Record<string, unknown>;

  return Array.isArray(content.bannerImageUrls)
    ? content.bannerImageUrls.map(String).filter(Boolean)
    : [];
};

const getString = (value: unknown) => String(value || "");

const getStringList = (value: unknown) =>
  Array.isArray(value) ? value.map(String) : [];

const mapItems = (section: ManagedCmsSection): RepeaterItem[] => {
  const content = section.content as Record<string, unknown>;
  const source = Array.isArray(content.items)
    ? (content.items as Record<string, unknown>[])
    : [];

  switch (section.key) {
    case "stats":
      return source.map((item) => ({
        title: getString(item.label),
        subtitle: getString(item.value),
      }));
    case "promo":
      return source.map((item) => ({
        title: getString(item.title),
        subtitle: getString(item.subtitle),
        extra: getString(item.emoji),
        extraTwo: getString(item.theme || "primary"),
      }));
    case "whyChooseUs":
      return source.map((item) => ({
        title: getString(item.title),
        subtitle: getString(item.desc),
        extra: getString(item.icon || "Truck"),
      }));
    case "howItWorks":
      return source.map((item) => ({
        title: getString(item.title),
        subtitle: getString(item.desc),
      }));
    case "faq":
      return source.map((item) => ({
        title: getString(item.question),
        subtitle: getString(item.answer),
      }));
    default:
      return [];
  }
};

export const getSectionFormValues = (
  section: ManagedCmsSection,
): Partial<FormValues> => {
  const content = section.content as Record<string, unknown>;

  return {
    name: section.name,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    enabled: section.enabled,
    primaryText: getString(content.primaryText),
    secondaryText: getString(content.secondaryText),
    primaryButtonText: getString(content.primaryButtonText),
    primaryButtonLink: getString(content.primaryButtonLink),
    secondaryButtonText: getString(content.secondaryButtonText),
    secondaryButtonLink: getString(content.secondaryButtonLink),
    bannerImageUrls: getStringList(content.bannerImageUrls),
    highlights: getStringList(content.highlights),
    promoCardTitle: getString(content.promoCardTitle),
    promoCardSubtitle: getString(content.promoCardSubtitle),
    promoCardItems: getStringList(content.promoCardItems),
    deliveryTitle: getString(content.deliveryTitle),
    deliverySubtitle: getString(content.deliverySubtitle),
    trustedTitle: getString(content.trustedTitle),
    trustedSubtitle: getString(content.trustedSubtitle),
    cardSubtitle: getString(content.cardSubtitle),
    ctaText: getString(content.ctaText),
    ctaLink: getString(content.ctaLink),
    emptyStateText: getString(content.emptyStateText),
    errorTitle: getString(content.errorTitle),
    errorDescription: getString(content.errorDescription),
    coverageSubtitle: getString(content.coverageSubtitle),
    coverageItems: getStringList(content.coverageItems),
    contactEmail: getString(content.contactEmail),
    contactPhone: getString(content.contactPhone),
    contactAddress: getString(content.contactAddress),
    supportHours: getString(content.supportHours),
    mapEmbedUrl: getString(content.mapEmbedUrl),
    responseTimeText: getString(content.responseTimeText),
    recipientEmail: getString(content.recipientEmail),
    successMessage: getString(content.successMessage),
    items: mapItems(section),
  };
};
