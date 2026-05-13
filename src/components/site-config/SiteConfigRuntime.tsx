import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useGetPublicSiteConfigQuery } from "@/redux/features/generalApi/publicSiteConfigApi";
import type { SeoConfigRecord } from "@/redux/features/generalApi/systemSettingsApi";

const DEFAULT_SEO_CONFIG = {
  page: "default",
  meta_title: "GroMart - Fresh Grocery Delivered",
  meta_description:
    "Buy fresh groceries, vegetables, fruits, and daily essentials online from GroMart.",
  meta_keywords: ["grocery", "online grocery", "fresh food", "GroMart"],
  robots_directive: "index, follow",
};

const DEFAULT_TITLE = DEFAULT_SEO_CONFIG.meta_title;
const DEFAULT_DESCRIPTION = DEFAULT_SEO_CONFIG.meta_description;

const routeSeoMap: Array<{ pattern: RegExp; page: string }> = [
  { pattern: /^\/$/, page: "home" },
  { pattern: /^\/products(\/.*)?$/, page: "products" },
  { pattern: /^\/product\/(.+)$/, page: "product details" },
  { pattern: /^\/about$/, page: "about" },
  { pattern: /^\/contact$/, page: "contact" },
  { pattern: /^\/privacy$/, page: "privacy policy" },
  { pattern: /^\/terms$/, page: "terms of service" },
  { pattern: /^\/provider\/apply$/, page: "provider apply" },
  { pattern: /^\/cart$/, page: "cart" },
  { pattern: /^\/checkout(\/.*)?$/, page: "checkout" },
  { pattern: /^\/login$/, page: "login" },
  { pattern: /^\/register$/, page: "register" },
];

const getRouteSeoPage = (pathname: string) =>
  routeSeoMap.find((item) => item.pattern.test(pathname))?.page || "default";

const setMeta = (selector: string, attribute: string, value?: string) => {
  if (!value) return;

  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
    const propertyMatch = selector.match(/meta\[property="([^"]+)"\]/);
    if (nameMatch?.[1]) element.setAttribute("name", nameMatch[1]);
    if (propertyMatch?.[1]) element.setAttribute("property", propertyMatch[1]);
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
};

const setLink = (rel: string, href?: string) => {
  if (!href) return;

  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};

const normalizeKeywords = (keywords?: string[]) =>
  Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : "";

const pickSeoConfig = (
  configs: SeoConfigRecord[] = [],
  pathname: string,
): SeoConfigRecord | undefined => {
  const page = getRouteSeoPage(pathname);
  return (
    configs.find((config) => config.page === page) ||
    configs.find((config) => config.page === "default") ||
    DEFAULT_SEO_CONFIG
  );
};

const removeElement = (id: string) => {
  document.getElementById(id)?.remove();
};

const injectAnalytics = ({
  gaId,
  gtmId,
}: {
  gaId?: string;
  gtmId?: string;
}) => {
  removeElement("site-config-ga-src");
  removeElement("site-config-ga-inline");
  removeElement("site-config-gtm-inline");
  removeElement("site-config-gtm-noscript");

  if (gaId) {
    const gaScript = document.createElement("script");
    gaScript.id = "site-config-ga-src";
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(gaScript);

    const gaInline = document.createElement("script");
    gaInline.id = "site-config-ga-inline";
    gaInline.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(gaInline);
  }

  if (gtmId) {
    const gtmInline = document.createElement("script");
    gtmInline.id = "site-config-gtm-inline";
    gtmInline.text = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmInline);

    const noscript = document.createElement("noscript");
    noscript.id = "site-config-gtm-noscript";
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(noscript);
  }
};

const SiteConfigRuntime = () => {
  const location = useLocation();
  const { data } = useGetPublicSiteConfigQuery();
  const config = data?.data;

  const seoConfig = useMemo(
    () => pickSeoConfig(config?.seoConfigs, location.pathname),
    [config?.seoConfigs, location.pathname],
  );

  console.log("SEO Page:", getRouteSeoPage(location.pathname));
  console.log("SEO Config:", seoConfig);

  useEffect(() => {
    const title =
      seoConfig?.meta_title || config?.siteOverview?.name || DEFAULT_TITLE;
    const description =
      seoConfig?.meta_description ||
      config?.siteOverview?.description ||
      DEFAULT_DESCRIPTION;
    const image = seoConfig?.og_image_url || config?.siteOverview?.logoUrl;
    const canonicalUrl =
      seoConfig?.canonical_url ||
      `${window.location.origin}${location.pathname}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta(
      'meta[name="keywords"]',
      "content",
      normalizeKeywords(seoConfig?.meta_keywords),
    );
    setMeta('meta[name="robots"]', "content", seoConfig?.robots_directive);
    setMeta(
      'meta[property="og:title"]',
      "content",
      seoConfig?.og_title || title,
    );
    setMeta(
      'meta[property="og:description"]',
      "content",
      seoConfig?.og_description || description,
    );
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta(
      'meta[name="twitter:card"]',
      "content",
      seoConfig?.twitter_card_type || "summary_large_image",
    );
    setMeta(
      'meta[name="twitter:title"]',
      "content",
      seoConfig?.twitter_title || seoConfig?.og_title || title,
    );
    setMeta(
      'meta[name="twitter:description"]',
      "content",
      seoConfig?.twitter_description ||
        seoConfig?.og_description ||
        description,
    );
    setMeta('meta[name="twitter:image"]', "content", image);
    setLink("canonical", canonicalUrl);
    setLink("icon", config?.siteOverview?.faviconUrl);
  }, [config?.siteOverview, location.pathname, seoConfig]);

  useEffect(() => {
    injectAnalytics({
      gaId: config?.gaGtmConfig?.googleAnalyticsMeasurementId,
      gtmId: config?.gaGtmConfig?.googleTagManagerId,
    });
  }, [
    config?.gaGtmConfig?.googleAnalyticsMeasurementId,
    config?.gaGtmConfig?.googleTagManagerId,
  ]);

  return null;
};

export default SiteConfigRuntime;
