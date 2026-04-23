import SettingsTabs from "@/components/settings/SettingsTabs";

import AnalyticsConfigSettingsSection from "./AnalyticsConfigSettingsSection";
import EmailCloudinaryConfigSettingsSection from "./EmailCloudinaryConfigSettingsSection";
import SeoConfigSettingsSection from "./SeoConfigSettingsSection";
import SiteOverviewSettingsSection from "./SiteOverviewSettingsSection";
import SocialMediaConfigSettingsSection from "./SocialMediaConfigSettingsSection";

type SiteConfigSettingsPageProps = {
  role: "admin" | "super-admin";
};

const SiteConfigSettingsPage = ({ role }: SiteConfigSettingsPageProps) => (
  <div className="mx-auto">
    <SettingsTabs
      title="Site Config"
      description="Manage overview, SEO, integrations, and social settings for the storefront."
      items={[
        {
          key: "overview",
          label: "Site Overview",
          children: <SiteOverviewSettingsSection />,
        },
        {
          key: "seo",
          label: "SEO Config",
          children: <SeoConfigSettingsSection />,
        },
        {
          key: "ga-gtm",
          label: "GA / GTM",
          children: <AnalyticsConfigSettingsSection />,
        },
        {
          key: "email-cloudinary",
          label: "Email & Cloudinary",
          children: <EmailCloudinaryConfigSettingsSection />,
        },
        {
          key: "social-media",
          label: "Social Media",
          children: <SocialMediaConfigSettingsSection />,
        },
      ]}
    />
  </div>
);

export default SiteConfigSettingsPage;
