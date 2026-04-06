import PublicLayout from "@/components/layouts/PublicLayout";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import { useAuth } from "@/context/AuthContext";

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12 max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal profile settings{user?.role ? ` as ${user.role}` : ""}.
          </p>
        </div>
        <ProfileSettingsSection title="Customer Profile" />
      </div>
    </PublicLayout>
  );
};

export default AccountSettings;
