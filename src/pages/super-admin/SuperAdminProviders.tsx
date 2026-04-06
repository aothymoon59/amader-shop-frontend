import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const SuperAdminProviders = () => (
  <DashboardLayout role="super-admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Provider Approvals</h1>
      <div className="grid gap-4">
        {[
          { name: "NewTech Co", owner: "Alex M.", status: "pending" },
          { name: "FashionHub", owner: "Emma K.", status: "pending" },
          { name: "TechStore", owner: "Mike J.", status: "approved" },
          { name: "EcoWear", owner: "Sarah L.", status: "approved" },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-4 p-5 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
              {p.name[0]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">Owner: {p.owner}</p>
            </div>
            {p.status === "pending" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="accent"><CheckCircle className="mr-1 h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="destructive"><XCircle className="mr-1 h-4 w-4" /> Reject</Button>
              </div>
            ) : (
              <span className="text-sm text-success font-medium flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Approved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default SuperAdminProviders;
