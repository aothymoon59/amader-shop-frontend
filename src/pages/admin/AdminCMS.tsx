import DashboardLayout from "@/components/layouts/DashboardLayout";

const AdminCMS = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CMS Management</h1>
      <div className="grid gap-4">
        {["About Page", "Contact Page", "Terms of Service", "Privacy Policy"].map((page) => (
          <div key={page} className="flex items-center justify-between p-4 rounded-xl border bg-card">
            <div>
              <h3 className="font-semibold">{page}</h3>
              <p className="text-sm text-muted-foreground">Last updated: Apr 1, 2026</p>
            </div>
            <span className="text-sm text-primary font-medium cursor-pointer hover:underline">Edit</span>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminCMS;
