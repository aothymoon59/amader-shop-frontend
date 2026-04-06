import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CmsPageSlug = "about" | "contact" | "terms" | "privacy";

export type CmsPageStatus = "Published" | "Draft";

export interface CmsPage {
  slug: CmsPageSlug;
  name: string;
  path: string;
  status: CmsPageStatus;
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  sectionBody: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  formTitle?: string;
  formDescription?: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
  updatedBy: string;
}

type CmsContextValue = {
  pages: CmsPage[];
  getPageBySlug: (slug: CmsPageSlug) => CmsPage | undefined;
  updatePage: (slug: CmsPageSlug, updates: Partial<CmsPage>, updatedBy: string) => void;
};

const CMS_STORAGE_KEY = "smallshop-cms-pages";

const defaultPages: CmsPage[] = [
  {
    slug: "about",
    name: "About Page",
    path: "/about",
    status: "Published",
    heroTitle: "About SmallShop",
    heroSubtitle:
      "We are building the future of multi-vendor commerce by helping small businesses grow online.",
    sectionTitle: "Our mission",
    sectionBody:
      "SmallShop was founded with a simple mission: make it easy for small businesses to sell online. Our platform gives vendors the tools they need to manage products, process orders, run POS sales, and grow with confidence.\n\nWe believe in transparency, quality, and community. Every vendor on our platform goes through a verification process so customers can shop with trust.",
    metaTitle: "About SmallShop",
    metaDescription: "Learn about SmallShop and our mission to help vendors and customers grow together.",
    lastUpdated: "2026-04-06 10:00",
    updatedBy: "System Seed",
  },
  {
    slug: "contact",
    name: "Contact Page",
    path: "/contact",
    status: "Published",
    heroTitle: "Contact Us",
    heroSubtitle: "We would love to hear from you and help with your questions.",
    sectionTitle: "Get in touch",
    sectionBody:
      "Reach out to our support team for account help, vendor onboarding questions, order issues, or partnership inquiries.",
    contactEmail: "support@smallshop.com",
    contactPhone: "+1-800-SMALL-SHOP",
    contactAddress: "123 Commerce St, NY 10001",
    formTitle: "Send us a message",
    formDescription: "Share your question and our team will get back to you soon.",
    metaTitle: "Contact SmallShop",
    metaDescription: "Contact the SmallShop support team for help and business inquiries.",
    lastUpdated: "2026-04-06 10:00",
    updatedBy: "System Seed",
  },
  {
    slug: "terms",
    name: "Terms of Service",
    path: "/terms",
    status: "Published",
    heroTitle: "Terms of Service",
    heroSubtitle: "The basic rules, responsibilities, and conditions for using SmallShop.",
    sectionTitle: "Terms overview",
    sectionBody:
      "By using SmallShop, you agree to follow our marketplace policies, payment rules, and vendor/customer conduct standards.\n\nThis demo content can be edited from the CMS now and later connected to an API-backed publishing workflow.",
    metaTitle: "SmallShop Terms of Service",
    metaDescription: "Read the SmallShop terms of service and platform usage conditions.",
    lastUpdated: "2026-04-06 10:00",
    updatedBy: "System Seed",
  },
  {
    slug: "privacy",
    name: "Privacy Policy",
    path: "/privacy",
    status: "Published",
    heroTitle: "Privacy Policy",
    heroSubtitle: "How SmallShop handles, stores, and protects customer and vendor data.",
    sectionTitle: "Privacy overview",
    sectionBody:
      "SmallShop collects only the data needed to operate the marketplace, improve service quality, and support secure transactions.\n\nThis demo policy content is managed from the CMS so admins can update public legal pages without code changes.",
    metaTitle: "SmallShop Privacy Policy",
    metaDescription: "Understand how SmallShop collects and uses data across the platform.",
    lastUpdated: "2026-04-06 10:00",
    updatedBy: "System Seed",
  },
];

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

const getTimestamp = () => {
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<CmsPage[]>(defaultPages);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedPages = window.localStorage.getItem(CMS_STORAGE_KEY);

    if (!storedPages) {
      return;
    }

    try {
      const parsedPages = JSON.parse(storedPages) as CmsPage[];
      setPages(parsedPages);
    } catch (error) {
      console.error("Failed to parse CMS pages from storage", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(pages));
  }, [pages]);

  const value = useMemo<CmsContextValue>(
    () => ({
      pages,
      getPageBySlug: (slug) => pages.find((page) => page.slug === slug),
      updatePage: (slug, updates, updatedBy) => {
        setPages((currentPages) =>
          currentPages.map((page) =>
            page.slug === slug
              ? {
                  ...page,
                  ...updates,
                  lastUpdated: getTimestamp(),
                  updatedBy,
                }
              : page,
          ),
        );
      },
    }),
    [pages],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

export const useCms = () => {
  const context = useContext(CmsContext);

  if (!context) {
    throw new Error("useCms must be used within a CmsProvider");
  }

  return context;
};
