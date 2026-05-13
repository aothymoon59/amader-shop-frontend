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

export type ProductsPageSectionKey = "hero" | "productList";
export type ProductsPageSection = BaseCmsSection<ProductsPageSectionKey>;

export type ContactPageSectionKey = "hero" | "contactDetails" | "contactForm";
export type ContactPageSection = BaseCmsSection<ContactPageSectionKey>;

export type LegalPageSlug = "terms" | "privacy";
export type LegalCmsPage = {
  slug: LegalPageSlug;
  name: string;
  path: string;
  enabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  contentTitle: string;
  contentHtml: string;
  updatedAt: string;
};

export type ManagedCmsSection =
  | HomePageSection
  | AboutPageSection
  | CommonCmsSection
  | ProductsPageSection
  | ContactPageSection;

export const defaultLegalPages: LegalCmsPage[] = [
  {
    slug: "terms",
    name: "Terms of Service",
    path: "/terms",
    enabled: true,
    heroTitle: "Terms of Service",
    heroSubtitle:
      "Please read these terms carefully before using the marketplace.",
    contentTitle: "Platform terms",
    contentHtml:
      "<p>By using Amader Shop, you agree to follow our marketplace policies, payment rules, and vendor/customer conduct standards.</p><p>These terms can be updated from the CMS Management area.</p>",
    updatedAt: new Date().toISOString(),
  },
  {
    slug: "privacy",
    name: "Privacy Policy",
    path: "/privacy",
    enabled: true,
    heroTitle: "Privacy Policy",
    heroSubtitle:
      "Learn how we collect, use, and protect information across the marketplace.",
    contentTitle: "How we handle data",
    contentHtml:
      "<p>Amader Shop collects only the data needed to operate the marketplace, improve service quality, and support secure transactions.</p><p>This policy content can be updated from the CMS Management area.</p>",
    updatedAt: new Date().toISOString(),
  },
];

export const defaultAboutPageSections: AboutPageSection[] = [
  {
    key: "hero",
    name: "Hero",
    enabled: true,
    order: 1,
    title: "About Amader Shop",
    subtitle:
      "We are building a marketplace that helps local stores grow online and helps customers shop with confidence.",
    description:
      "Trusted vendors, better reach, and smoother commerce for everyone.",
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
    subtitle:
      "Quick answers about the platform, orders, and vendor participation.",
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

export const defaultProductsPageSections: ProductsPageSection[] = [
  {
    key: "hero",
    name: "Products Banner",
    enabled: true,
    order: 1,
    title: "Shop products from trusted local sellers",
    subtitle:
      "Browse everyday essentials, fresh grocery items, and marketplace deals from approved vendors in one place.",
    description: "Products marketplace",
    content: {
      primaryButtonText: "Browse Products",
      primaryButtonLink: "/products",
      secondaryButtonText: "Become a Vendor",
      secondaryButtonLink: "/provider/apply",
      bannerImageUrls: [],
      highlights: ["Verified sellers", "Fresh stock", "Simple checkout"],
      promoCardTitle: "Fresh picks",
      promoCardSubtitle: "Marketplace deals",
      promoCardItems: ["Daily essentials", "Local shops", "Fast delivery"],
      deliveryTitle: "Fast delivery",
      deliverySubtitle: "Available",
      trustedTitle: "Trusted vendors",
      trustedSubtitle: "Shop from",
    },
  },
  {
    key: "productList",
    name: "Products Section",
    enabled: true,
    order: 2,
    title: "All Products",
    subtitle:
      "Find the right products with search, filters, and category browsing.",
    description: "",
    content: {},
  },
];

export const defaultContactPageSections: ContactPageSection[] = [
  {
    key: "hero",
    name: "Hero",
    enabled: true,
    order: 1,
    title: "Contact Us",
    subtitle: "We would love to hear from you and help with your questions.",
    description:
      "Support, vendor onboarding, orders, and partnership inquiries.",
    content: {},
  },
  {
    key: "contactDetails",
    name: "Contact Details",
    enabled: true,
    order: 2,
    title: "Get in touch",
    subtitle:
      "Reach out to our support team for account help, vendor onboarding questions, order issues, or partnership inquiries.",
    description: "",
    content: {
      contactEmail: "support@amadershop.com",
      contactPhone: "+880 1700-000000",
      contactAddress: "Dhaka, Bangladesh",
      supportHours: "Saturday to Thursday, 9:00 AM - 6:00 PM",
      mapEmbedUrl: "",
      responseTimeText: "We usually reply within one business day.",
    },
  },
  {
    key: "contactForm",
    name: "Contact Form",
    enabled: true,
    order: 3,
    title: "Send us a message",
    subtitle: "Share your question and our team will get back to you soon.",
    description: "",
    content: {
      recipientEmail: "",
      successMessage:
        "Thanks for reaching out. Our team will review your message and reply soon.",
    },
  },
];
