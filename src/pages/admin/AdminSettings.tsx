import DashboardLayout from "@/components/layouts/DashboardLayout";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import SettingsTabs from "@/components/settings/SettingsTabs";

const AdminSettings = () => (
  <DashboardLayout role="admin">
    <div className="mx-auto max-w-6xl">
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
        ]}
      />
    </div>
  </DashboardLayout>
);

export default AdminSettings;
