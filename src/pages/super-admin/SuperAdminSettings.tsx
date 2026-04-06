import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SuperAdminSettings = () => (
  <DashboardLayout role="super-admin">
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Platform Configuration</h2>
        <div><Label>Platform Name</Label><Input defaultValue="SmallShop" className="mt-1.5" /></div>
        <div><Label>Admin Email</Label><Input defaultValue="admin@smallshop.com" className="mt-1.5" /></div>
        <Button variant="hero">Save Changes</Button>
      </div>
    </div>
  </DashboardLayout>
);

export default SuperAdminSettings;
