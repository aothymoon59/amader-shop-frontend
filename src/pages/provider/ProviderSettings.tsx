import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProfileSettingsSection from "@/components/settings/ProfileSettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProviderSettings = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <ProfileSettingsSection title="Provider Profile Settings" />
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Shop Settings</h2>
        <div><Label>Shop Name</Label><Input defaultValue="TechStore" className="mt-1.5" /></div>
        <div><Label>Contact Email</Label><Input defaultValue="tech@example.com" className="mt-1.5" /></div>
        <div><Label>Phone</Label><Input defaultValue="+1 234 567 890" className="mt-1.5" /></div>
        <Button variant="hero">Save Changes</Button>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderSettings;
