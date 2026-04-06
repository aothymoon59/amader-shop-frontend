import { useState } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminDetailsDialog from "@/components/admins/AdminDetailsDialog";
import AdminFormDialog, { type AdminFormValues } from "@/components/admins/AdminFormDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type AdminRecord = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  address: string;
  notes: string;
};

const initialAdmins: AdminRecord[] = [
  {
    id: 1,
    fullName: "Sarah Johnson",
    email: "sarah@smallshop.com",
    phone: "+880171300001",
    role: "Admin",
    department: "Operations",
    status: "Active",
    address: "Banani, Dhaka",
    notes: "Handles provider operations and escalations.",
  },
  {
    id: 2,
    fullName: "Mike Chen",
    email: "mike@smallshop.com",
    phone: "+880171300002",
    role: "Senior Admin",
    department: "Catalog",
    status: "Active",
    address: "Gulshan, Dhaka",
    notes: "Oversees product and content moderation.",
  },
  {
    id: 3,
    fullName: "Lisa Park",
    email: "lisa@smallshop.com",
    phone: "+880171300003",
    role: "Operations Admin",
    department: "Support",
    status: "Invited",
    address: "Dhanmondi, Dhaka",
    notes: "Pending final onboarding and login setup.",
  },
];

const SuperAdminAdmins = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminRecord | null>(null);

  const openAddDialog = () => {
    setEditingAdmin(null);
    setFormOpen(true);
  };

  const openEditDialog = (admin: AdminRecord) => {
    setEditingAdmin(admin);
    setFormOpen(true);
  };

  const handleSubmit = (values: AdminFormValues) => {
    if (
      !values.fullName.trim() ||
      !values.email.trim() ||
      !values.phone.trim() ||
      !values.role.trim() ||
      !values.department.trim() ||
      !values.status.trim() ||
      !values.address.trim()
    ) {
      toast({
        title: "Missing admin details",
        description: "Please fill in all required admin fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingAdmin) {
      setAdmins((current) =>
        current.map((admin) =>
          admin.id === editingAdmin.id ? { ...admin, ...values } : admin,
        ),
      );
      toast({
        title: "Admin updated",
        description: `${values.fullName} has been updated.`,
      });
    } else {
      setAdmins((current) => [
        {
          id: Date.now(),
          ...values,
        },
        ...current,
      ]);
      toast({
        title: "Admin added",
        description: `${values.fullName} has been added to admin management.`,
      });
    }

    setFormOpen(false);
    setEditingAdmin(null);
  };

  const handleDelete = (adminId: number) => {
    setAdmins((current) => current.filter((admin) => admin.id !== adminId));
    toast({
      title: "Admin removed",
      description: "The admin entry has been deleted.",
    });
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add admins, edit access profile details, and inspect each admin from one place.
            </p>
          </div>
          <Button variant="hero" onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Admin</Button>
        </div>

        <div className="grid gap-4">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                {admin.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{admin.fullName}</div>
                <div className="text-sm text-muted-foreground">{admin.email}</div>
                <div className="text-xs text-muted-foreground mt-1">{admin.department} · {admin.phone}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{admin.role}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedAdmin(admin)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(admin)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(admin.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingAdmin ? "Edit Admin" : "Add Admin"}
        description={editingAdmin ? "Update the admin profile and access details below." : "Create a new admin profile with the required access information."}
        initialValues={editingAdmin ?? undefined}
        onSubmit={handleSubmit}
      />
      <AdminDetailsDialog
        open={Boolean(selectedAdmin)}
        onOpenChange={(open) => !open && setSelectedAdmin(null)}
        admin={selectedAdmin}
      />
    </DashboardLayout>
  );
};

export default SuperAdminAdmins;
