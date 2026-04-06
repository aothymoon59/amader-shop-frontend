import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminFormValues = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  address: string;
  notes: string;
};

const defaultValues: AdminFormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "Admin",
  department: "",
  status: "Active",
  address: "",
  notes: "",
};

const AdminFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  initialValues,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialValues?: Partial<AdminFormValues>;
  onSubmit: (values: AdminFormValues) => void;
}) => {
  const [values, setValues] = useState<AdminFormValues>(defaultValues);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues, open]);

  const handleChange = (field: keyof AdminFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin-full-name">Full Name</Label>
              <Input
                id="admin-full-name"
                value={values.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                placeholder="Sarah Johnson"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="sarah@smallshop.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="admin-phone">Phone</Label>
              <Input
                id="admin-phone"
                value={values.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="admin-role">Role</Label>
              <select
                id="admin-role"
                value={values.role}
                onChange={(event) => handleChange("role", event.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Admin">Admin</option>
                <option value="Senior Admin">Senior Admin</option>
                <option value="Operations Admin">Operations Admin</option>
              </select>
            </div>
            <div>
              <Label htmlFor="admin-department">Department</Label>
              <Input
                id="admin-department"
                value={values.department}
                onChange={(event) => handleChange("department", event.target.value)}
                placeholder="Operations"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="admin-status">Status</Label>
              <select
                id="admin-status"
                value={values.status}
                onChange={(event) => handleChange("status", event.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Invited">Invited</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="admin-address">Address</Label>
              <Input
                id="admin-address"
                value={values.address}
                onChange={(event) => handleChange("address", event.target.value)}
                placeholder="Banani, Dhaka"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="admin-notes">Notes</Label>
              <textarea
                id="admin-notes"
                value={values.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Internal notes about this admin"
                className="mt-1.5 min-h-28 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Save Admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFormDialog;
