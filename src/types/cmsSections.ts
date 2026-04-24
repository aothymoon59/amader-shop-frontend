export type BaseCmsSection<K extends string = string> = {
  key: K;
  name: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  content: Record<string, unknown>;
};

export type HomeSectionKey =
  | "topPromoBar"
  | "hero"
  | "stats"
  | "popularProducts"
  | "categories"
  | "featuredProducts"
  | "promo"
  | "whyChooseUs"
  | "howItWorks"
  | "appAndCoverage"
  | "testimonials"
  | "vendorCta";

export type HomePageSection = BaseCmsSection<HomeSectionKey>;

export type AboutSectionKey = "hero" | "story";
export type AboutPageSection = BaseCmsSection<AboutSectionKey>;

export type CommonSectionKey = "whyChooseUs" | "vendorCta" | "faq";
export type CommonCmsSection = BaseCmsSection<CommonSectionKey>;

export type ManagedCmsSection = HomePageSection | AboutPageSection | CommonCmsSection;

export const defaultAboutPageSections: AboutPageSection[] = [
  {
    key: "hero",
    name: "Hero",
    enabled: true,
    order: 1,
    title: "About Amader Shop",
    subtitle:
      "We are building a marketplace that helps local stores grow online and helps customers shop with confidence.",
    description: "Trusted vendors, better reach, and smoother commerce for everyone.",
    content: {
      primaryButtonText: "Explore Marketplace",
      primaryButtonLink: "/products",
      secondaryButtonText: "Become a Vendor",
      secondaryButtonLink: "/provider/apply",
      bannerImageUrls: [],
      highlights: [
        "Built for local commerce",
        "Growing trusted vendors",
        "Designed for everyday shoppers",
      ],
      promoCardTitle: "Local growth",
      promoCardSubtitle: "Marketplace mission",
      promoCardItems: ["Trusted vendors", "Smooth checkout", "Stronger reach"],
      deliveryTitle: "Community first",
      deliverySubtitle: "Approach",
      trustedTitle: "Platform vision",
      trustedSubtitle: "Focused on",
    },
  },
  {
    key: "story",
    name: "Story Section",
    enabled: true,
    order: 2,
    title: "Our mission",
    subtitle: "Why we built Amader Shop",
    description:
      "Amader Shop was created to make digital commerce more accessible for local businesses and more reliable for customers.\n\nWe want a marketplace where store owners can manage products, orders, and growth from one place while customers enjoy better selection, trust, and convenience.",
    content: {},
  },
];

export const defaultCommonSections: CommonCmsSection[] = [
  {
    key: "whyChooseUs",
    name: "Why Choose Us",
    enabled: true,
    order: 1,
    title: "Why customers choose us",
    subtitle: "Built to support both customers and local sellers.",
    description: "",
    content: {
      items: [
        {
          icon: "Truck",
          title: "Reliable Delivery",
          desc: "Orders move faster with clear operational flows and delivery support.",
        },
        {
          icon: "ShieldCheck",
          title: "Trusted Marketplace",
          desc: "Customers shop from verified sellers with stronger confidence.",
        },
        {
          icon: "BadgePercent",
          title: "Better Value",
          desc: "Promotions, offers, and bundles help customers save more often.",
        },
        {
          icon: "Clock3",
          title: "Simpler Shopping",
          desc: "A smoother experience for repeat orders and everyday essentials.",
        },
      ],
    },
  },
  {
    key: "faq",
    name: "FAQ",
    enabled: true,
    order: 2,
    title: "Frequently asked questions",
    subtitle: "Quick answers about the platform, orders, and vendor participation.",
    description: "",
    content: {
      items: [
        {
          question: "How do customers place orders?",
          answer:
            "Customers browse products, add items to cart, choose delivery details, and place orders through the storefront.",
        },
        {
          question: "Can local stores join the marketplace?",
          answer:
            "Yes. Vendors can apply, get approved, and then manage products, orders, and business activity from their dashboard.",
        },
        {
          question: "How are categories and storefront content managed?",
          answer:
            "Admins and super admins can manage system settings and CMS content from the dashboard without editing code.",
        },
      ],
    },
  },
  {
    key: "vendorCta",
    name: "Vendor CTA",
    enabled: true,
    order: 3,
    title: "Want to grow your shop online?",
    subtitle:
      "Join the marketplace, reach more customers, and manage your business from one dashboard.",
    description: "",
    content: {
      primaryButtonText: "Apply as Vendor",
      primaryButtonLink: "/provider/apply",
      secondaryButtonText: "Explore Marketplace",
      secondaryButtonLink: "/products",
    },
  },
];
