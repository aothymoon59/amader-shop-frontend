import { useState } from "react";
import { CheckCircle, Eye, Plus, XCircle } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProviderDetailsDialog from "@/components/providers/ProviderDetailsDialog";
import ProviderFormDialog, { type ProviderFormValues } from "@/components/providers/ProviderFormDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type ProviderRecord = {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  status: string;
  products: number;
};

const initialProviders: ProviderRecord[] = [
  { id: 1, name: "TechStore", owner: "Mike Johnson", email: "mike@techstore.com", phone: "+880171000001", category: "Electronics", address: "Banani, Dhaka", status: "approved", products: 45 },
  { id: 2, name: "EcoWear", owner: "Sarah Lee", email: "sarah@ecowear.com", phone: "+880171000002", category: "Fashion", address: "Dhanmondi, Dhaka", status: "pending", products: 0 },
  { id: 3, name: "SmartLife", owner: "David Chen", email: "david@smartlife.com", phone: "+880171000003", category: "Electronics", address: "Gulshan, Dhaka", status: "approved", products: 28 },
  { id: 4, name: "NewVendor", owner: "Lisa Park", email: "lisa@newvendor.com", phone: "+880171000004", category: "Home", address: "Uttara, Dhaka", status: "pending", products: 0 },
];

const AdminProviders = () => {
  const [providers, setProviders] = useState(initialProviders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderRecord | null>(null);

  const handleSubmit = (values: ProviderFormValues) => {
    if (
      !values.businessName.trim() ||
      !values.ownerName.trim() ||
      !values.email.trim() ||
      !values.phone.trim() ||
      !values.category.trim() ||
      !values.tradeLicense.trim() ||
      !values.address.trim()
    ) {
      toast({
        title: "Missing provider details",
        description: "Please fill in all required provider fields.",
        variant: "destructive",
      });
      return;
    }

    setProviders((current) => [
      {
        id: Date.now(),
        name: values.businessName,
        owner: values.ownerName,
        email: values.email,
        phone: values.phone,
        category: values.category,
        address: values.address,
        status: values.status,
        products: 0,
      },
      ...current,
    ]);

    setDialogOpen(false);
    toast({
      title: "Provider added",
      description: `${values.businessName} has been created manually by admin.`,
    });
  };

  const updateStatus = (providerId: number, status: string) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId ? { ...provider, status } : provider,
      ),
    );
    toast({
      title: "Provider updated",
      description: `Provider status changed to ${status}.`,
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Provider Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Admin can approve applications, inspect provider details, or manually create providers from this panel.
            </p>
          </div>
          <Button variant="hero" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Provider
          </Button>
        </div>

        <div className="grid gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-4 p-5 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {provider.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-muted-foreground">{provider.owner} · {provider.products} products · {provider.category}</p>
                <p className="text-xs text-muted-foreground mt-1">{provider.email} · {provider.phone}</p>
              </div>
              {provider.status === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedProvider(provider)}><Eye className="mr-1 h-4 w-4" /> View Details</Button>
                  <Button size="sm" variant="accent" onClick={() => updateStatus(provider.id, "approved")}><CheckCircle className="mr-1 h-4 w-4" /> Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(provider.id, "rejected")}><XCircle className="mr-1 h-4 w-4" /> Reject</Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => setSelectedProvider(provider)}><Eye className="mr-1 h-4 w-4" /> View Details</Button>
                  <span className={`flex items-center gap-1 text-sm font-medium ${provider.status === "approved" ? "text-success" : "text-destructive"}`}>
                    {provider.status === "approved" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {provider.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ProviderFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add Provider"
        description="Create a provider account manually by filling in the onboarding details."
        onSubmit={handleSubmit}
      />
      <ProviderDetailsDialog
        open={Boolean(selectedProvider)}
        onOpenChange={(open) => !open && setSelectedProvider(null)}
        provider={selectedProvider}
      />
    </DashboardLayout>
  );
};

export default AdminProviders;
