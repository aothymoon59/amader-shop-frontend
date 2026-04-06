import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <ProfileSettingsSection title="Admin Profile Settings" />
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">General Settings</h2>
        <div><Label>Store Name</Label><Input defaultValue="SmallShop" className="mt-1.5" /></div>
        <div><Label>Support Email</Label><Input defaultValue="support@smallshop.com" className="mt-1.5" /></div>
        <Button variant="hero">Save Changes</Button>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminSettings;
