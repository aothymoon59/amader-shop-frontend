import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

const SuperAdminAdmins = () => (
  <DashboardLayout role="super-admin">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button variant="hero"><Plus className="mr-2 h-4 w-4" /> Add Admin</Button>
      </div>
      <div className="grid gap-4">
        {[
          { name: "Sarah Johnson", email: "sarah@smallshop.com", role: "Admin" },
          { name: "Mike Chen", email: "mike@smallshop.com", role: "Admin" },
          { name: "Lisa Park", email: "lisa@smallshop.com", role: "Admin" },
        ].map((a) => (
          <div key={a.email} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              {a.name[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm text-muted-foreground">{a.email}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{a.role}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default SuperAdminAdmins;
