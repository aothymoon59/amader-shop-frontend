import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const providers = [
  { id: 1, name: "TechStore", owner: "Mike Johnson", status: "approved", products: 45 },
  { id: 2, name: "EcoWear", owner: "Sarah Lee", status: "pending", products: 0 },
  { id: 3, name: "SmartLife", owner: "David Chen", status: "approved", products: 28 },
  { id: 4, name: "NewVendor", owner: "Lisa Park", status: "pending", products: 0 },
];

const AdminProviders = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Provider Management</h1>
      <div className="grid gap-4">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-5 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.owner} · {p.products} products</p>
            </div>
            {p.status === "pending" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="accent"><CheckCircle className="mr-1 h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="destructive"><XCircle className="mr-1 h-4 w-4" /> Reject</Button>
              </div>
            ) : (
              <span className="flex items-center gap-1 text-sm text-success font-medium">
                <CheckCircle className="h-4 w-4" /> Approved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminProviders;
