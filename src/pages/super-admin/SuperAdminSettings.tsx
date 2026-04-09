import DashboardLayout from "@/components/layouts/DashboardLayout";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";

const SuperAdminSettings = () => (
  <DashboardLayout role="super-admin">
    <div className="mx-auto">
      <SettingsTabs
        title="Profile Settings"
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
        ]}
      />
    </div>
  </DashboardLayout>
);

export default SuperAdminSettings;
