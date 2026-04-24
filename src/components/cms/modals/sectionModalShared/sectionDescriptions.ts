import type { ManagedCmsSection } from "@/types/cmsSections";

const sectionDescriptions: Partial<Record<ManagedCmsSection["key"], string>> = {
  topPromoBar:
    "Update the short announcement that appears at the very top of the homepage.",
  hero:
    "Manage the main first-impression area including messaging, actions, and rotating banners.",
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
  faq:
    "Keep reusable frequently asked questions and answers updated in one place.",
  productList:
    "Manage the Products page listing title and subtitle shown above filters and product results.",
};

export const getSectionDescription = (section: ManagedCmsSection | null) =>
  section
    ? sectionDescriptions[section.key] ||
      "Update the content and settings for this page section."
    : "Update the content and settings for this page section.";
