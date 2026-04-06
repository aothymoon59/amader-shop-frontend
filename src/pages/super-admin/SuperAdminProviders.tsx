import { useState } from "react";
import { CheckCircle, Eye, Plus, XCircle } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProviderDetailsDialog from "@/components/providers/ProviderDetailsDialog";
import ProviderFormDialog, { type ProviderFormValues } from "@/components/providers/ProviderFormDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type SuperAdminProviderRecord = {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  status: string;
};

const initialProviders: SuperAdminProviderRecord[] = [
  { id: 1, name: "NewTech Co", owner: "Alex M.", email: "alex@newtech.com", phone: "+880171200001", category: "Electronics", address: "Banani, Dhaka", status: "pending" },
  { id: 2, name: "FashionHub", owner: "Emma K.", email: "emma@fashionhub.com", phone: "+880171200002", category: "Fashion", address: "Gulshan, Dhaka", status: "pending" },
  { id: 3, name: "TechStore", owner: "Mike J.", email: "mike@techstore.com", phone: "+880171200003", category: "Electronics", address: "Mohakhali, Dhaka", status: "approved" },
  { id: 4, name: "EcoWear", owner: "Sarah L.", email: "sarah@ecowear.com", phone: "+880171200004", category: "Fashion", address: "Dhanmondi, Dhaka", status: "approved" },
];

const SuperAdminProviders = () => {
  const [providers, setProviders] = useState(initialProviders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SuperAdminProviderRecord | null>(null);

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
      },
      ...current,
    ]);

    setDialogOpen(false);
    toast({
      title: "Provider added",
      description: `${values.businessName} has been created manually by super admin.`,
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
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Provider Approvals</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Super admin can approve applications, inspect provider details, or manually create providers from this screen.
            </p>
          </div>
          <Button variant="hero" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Provider
          </Button>
        </div>

        <div className="grid gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-4 p-5 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                {provider.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-muted-foreground">Owner: {provider.owner} · {provider.category}</p>
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
                  <span className={`text-sm font-medium flex items-center gap-1 ${provider.status === "approved" ? "text-success" : "text-destructive"}`}>
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
        description="Create a provider manually with onboarding details and approval status."
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

export default SuperAdminProviders;
