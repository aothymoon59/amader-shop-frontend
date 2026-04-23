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

export type HomePageSection = {
  key: HomeSectionKey;
  name: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  content: Record<string, unknown>;
};

export type HomePageSectionsPayload = {
  sections: HomePageSection[];
  updatedAt: string;
};

export const defaultHomePageSections: HomePageSection[] = [
  {
    key: "topPromoBar",
    name: "Top Promo Bar",
    enabled: true,
    order: 1,
    title: "",
    subtitle: "",
    description: "",
    content: {
      primaryText: "Free delivery on orders above $30",
      secondaryText: "Delivery in 30-60 minutes in selected areas",
    },
  },
  {
    key: "hero",
    name: "Hero",
    enabled: true,
    order: 2,
    title: "Your everyday grocery shopping, delivered fresh & fast",
    subtitle:
      "Shop fruits, vegetables, meat, dairy, snacks, and household essentials from trusted local vendors all in one convenient marketplace.",
    description: "Fresh groceries, local stores, fast delivery",
    content: {
      primaryButtonText: "Start Shopping",
      primaryButtonLink: "/products",
      secondaryButtonText: "Become a Grocery Vendor",
      secondaryButtonLink: "/provider/apply",
      highlights: [
        "Fresh stock daily",
        "Verified sellers",
        "Easy returns on eligible items",
      ],
      promoCardTitle: "Up to 25% off",
      promoCardSubtitle: "Today's essentials",
      promoCardItems: ["Fresh fruits", "Vegetables", "Dairy deals"],
      deliveryTitle: "30-60 min",
      deliverySubtitle: "Delivery",
      trustedTitle: "10K+ families",
      trustedSubtitle: "Trusted by",
    },
  },
  {
    key: "stats",
    name: "Stats",
    enabled: true,
    order: 3,
    title: "",
    subtitle: "",
    description: "",
    content: {
      items: [
        { label: "Local Shops", value: "300+" },
        { label: "Daily Orders", value: "8K+" },
        { label: "Products", value: "15K+" },
        { label: "Cities Served", value: "25+" },
      ],
    },
  },
  {
    key: "popularProducts",
    name: "Popular Products",
    enabled: true,
    order: 4,
    title: "Popular daily essentials",
    subtitle: "Frequently bought grocery items from trusted shops.",
    description: "",
    content: {
      ctaText: "View all products",
      ctaLink: "/products",
      emptyStateText: "No popular products available right now.",
      errorTitle: "Failed to load popular products.",
      errorDescription: "Please try again in a moment.",
    },
  },
  {
    key: "categories",
    name: "Categories",
    enabled: true,
    order: 5,
    title: "Shop by category",
    subtitle:
      "Explore marketplace categories from local vendors in a quick, scrollable carousel.",
    description: "",
    content: {
      cardSubtitle: "Browse products",
      ctaText: "Explore All Categories",
      ctaLink: "/products",
      emptyStateText: "No categories available right now.",
      errorTitle: "Failed to load categories.",
      errorDescription: "Please try again in a moment.",
    },
  },
  {
    key: "featuredProducts",
    name: "Featured Products",
    enabled: true,
    order: 6,
    title: "Featured Products",
    subtitle: "Top picks from our best vendors",
    description: "",
    content: {
      ctaText: "View All",
      ctaLink: "/products",
      emptyStateText: "No featured products available right now.",
      errorTitle: "Failed to load featured products.",
      errorDescription: "Please try again in a moment.",
    },
  },
  {
    key: "promo",
    name: "Promo Highlights",
    enabled: true,
    order: 7,
    title: "What makes us better",
    subtitle:
      "Built for real grocery shopping habits, not just generic product browsing.",
    description: "",
    content: {
      items: [
        {
          title: "Fresh Vegetables",
          subtitle: "Direct from local markets",
          emoji: "Fresh",
          theme: "primary",
        },
        {
          title: "Daily Grocery Deals",
          subtitle: "Save more on essentials",
          emoji: "Deals",
          theme: "accent",
        },
        {
          title: "Fast Delivery",
          subtitle: "Get it in as little as 30 mins",
          emoji: "Fast",
          theme: "mixed",
        },
      ],
    },
  },
  {
    key: "whyChooseUs",
    name: "Why Choose Us",
    enabled: true,
    order: 8,
    title: "Why customers choose us",
    subtitle: "Built to serve both customers and local grocery providers.",
    description: "",
    content: {
      items: [
        {
          icon: "Truck",
          title: "Express Delivery",
          desc: "Get groceries delivered to your doorstep quickly and safely.",
        },
        {
          icon: "ShieldCheck",
          title: "Trusted Sellers",
          desc: "Verified grocery vendors and local stores you can rely on.",
        },
        {
          icon: "BadgePercent",
          title: "Daily Offers",
          desc: "Enjoy flash deals, combo bundles, and seasonal discounts.",
        },
        {
          icon: "Clock3",
          title: "Same-Day Fulfillment",
          desc: "Perfect for urgent household needs and repeat grocery shopping.",
        },
      ],
    },
  },
  {
    key: "howItWorks",
    name: "How It Works",
    enabled: true,
    order: 9,
    title: "How it works",
    subtitle: "Grocery shopping made simple in three steps.",
    description: "",
    content: {
      items: [
        {
          title: "Choose your essentials",
          desc: "Browse vegetables, meat, snacks, dairy, bakery, and household needs.",
        },
        {
          title: "Add to cart",
          desc: "Pick items from trusted local vendors with clear prices and reviews.",
        },
        {
          title: "Receive fast delivery",
          desc: "Sit back while your groceries arrive fresh at your doorstep.",
        },
      ],
    },
  },
  {
    key: "appAndCoverage",
    name: "App and Coverage",
    enabled: true,
    order: 10,
    title: "Shop anytime, anywhere",
    subtitle:
      "A mobile-first shopping experience designed for quick repeat orders, daily needs, and easy checkout.",
    description: "Coverage & local vendors",
    content: {
      primaryButtonText: "Download App",
      primaryButtonLink: "#",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "#",
      coverageSubtitle:
        "We partner with neighborhood grocery shops, fresh markets, and specialty food sellers to ensure variety and freshness.",
      coverageItems: [
        "City-based delivery zones",
        "Vendor onboarding & approval",
        "Better local product availability",
      ],
    },
  },
  {
    key: "testimonials",
    name: "Testimonials",
    enabled: true,
    order: 11,
    title: "What customers are saying",
    subtitle: "",
    description: "",
    content: {
      emptyStateText:
        "Featured customer reviews will appear here after an admin marks them as featured.",
    },
  },
  {
    key: "vendorCta",
    name: "Vendor CTA",
    enabled: true,
    order: 12,
    title: "Own a grocery shop or local store?",
    subtitle:
      "Join our marketplace, list your products, manage orders, and grow your business with more local customers.",
    description: "",
    content: {
      primaryButtonText: "Apply as Vendor",
      primaryButtonLink: "/provider/apply",
      secondaryButtonText: "Explore Marketplace",
      secondaryButtonLink: "/products",
    },
  },
];

export const getDefaultHomeSection = (key: HomeSectionKey) =>
  defaultHomePageSections.find((section) => section.key === key);
