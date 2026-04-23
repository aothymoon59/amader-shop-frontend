import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SystemCurrencySettingsSection from "@/components/settings/SystemCurrencySettingsSection";
import CommissionSettingsSection from "@/components/settings/CommissionSettingsSection";

const AdminSettings = () => (
  <div className="mx-auto">
    <SettingsTabs
      title="Settings"
      description="Manage your personal account details and password from one place."
      items={[
        {
          key: "profile",
          label: "Personal Profile",
          children: <ProfileSettingsSection title="Admin Profile Settings" />,
        },
        {
          key: "password",
          label: "Change Password",
          children: <ChangePasswordSection />,
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
  </div>
);

export default AdminSettings;
