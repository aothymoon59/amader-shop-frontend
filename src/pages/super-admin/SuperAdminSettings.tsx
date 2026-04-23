import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SystemCurrencySettingsSection from "@/components/settings/SystemCurrencySettingsSection";

const SuperAdminSettings = () => (
  <div className="mx-auto">
    <SettingsTabs
      title="Settings"
      description="Manage your profile information and account password."
      items={[
        {
          key: "profile",
          label: "Personal Profile",
          children: <ProfileSettingsSection title="My Account" />,
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
      ]}
    />
  </div>
);

export default SuperAdminSettings;
