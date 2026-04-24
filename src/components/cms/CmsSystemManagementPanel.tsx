import CategoryManagementPage from "@/components/categories/CategoryManagementPage";
import CommissionSettingsSection from "@/components/settings/CommissionSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SystemCurrencySettingsSection from "@/components/settings/SystemCurrencySettingsSection";

const CmsSystemManagementPanel = () => (
  <SettingsTabs
    title="System Management"
    description="Manage shared platform controls for categories, currency, and commission from one place."
    items={[
      {
        key: "categories",
        label: "Categories",
        children: <CategoryManagementPage embedded />,
      },
      {
        key: "currency",
        label: "System Currency",
        children: <SystemCurrencySettingsSection />,
      },
      {
        key: "commission",
        label: "Commission Settings",
        children: <CommissionSettingsSection />,
      },
    ]}
  />
);

export default CmsSystemManagementPanel;
