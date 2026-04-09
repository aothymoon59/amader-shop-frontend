import { Link } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import SettingsTabs from "@/components/settings/SettingsTabs";

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal profile settings
            {user?.role ? ` as ${user.role}` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/account/orders">
            <Button variant="outline">Order History</Button>
          </Link>
          <Link to="/account/payments">
            <Button variant="outline">Payment History</Button>
          </Link>
        </div>
        <SettingsTabs
          title={null}
          description={null}
          items={[
            {
              key: "profile",
              label: "Personal Profile",
              children: <ProfileSettingsSection title="Customer Profile" />,
            },
            {
              key: "password",
              label: "Change Password",
              children: <ChangePasswordSection />,
            },
          ]}
        />
      </div>
    </PublicLayout>
  );
};

export default AccountSettings;
