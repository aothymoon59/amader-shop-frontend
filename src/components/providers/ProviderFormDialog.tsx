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

export type ProviderFormValues = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  tradeLicense: string;
  address: string;
  status: string;
  notes: string;
};

const defaultValues: ProviderFormValues = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  category: "",
  tradeLicense: "",
  address: "",
  status: "approved",
  notes: "",
};

const ProviderFormDialog = ({
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
  initialValues?: Partial<ProviderFormValues>;
  onSubmit: (values: ProviderFormValues) => void;
}) => {
  const [values, setValues] = useState<ProviderFormValues>(defaultValues);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues, open]);

  const handleChange = (field: keyof ProviderFormValues, value: string) => {
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
              <Label htmlFor="provider-business-name">Business Name</Label>
              <Input
                id="provider-business-name"
                value={values.businessName}
                onChange={(event) => handleChange("businessName", event.target.value)}
                placeholder="TechStore"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-owner-name">Owner Name</Label>
              <Input
                id="provider-owner-name"
                value={values.ownerName}
                onChange={(event) => handleChange("ownerName", event.target.value)}
                placeholder="Mike Johnson"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-email">Email</Label>
              <Input
                id="provider-email"
                type="email"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="owner@techstore.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-phone">Phone</Label>
              <Input
                id="provider-phone"
                value={values.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-category">Category</Label>
              <Input
                id="provider-category"
                value={values.category}
                onChange={(event) => handleChange("category", event.target.value)}
                placeholder="Electronics"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-license">Trade License</Label>
              <Input
                id="provider-license"
                value={values.tradeLicense}
                onChange={(event) => handleChange("tradeLicense", event.target.value)}
                placeholder="TL-2026-1001"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="provider-address">Business Address</Label>
              <Input
                id="provider-address"
                value={values.address}
                onChange={(event) => handleChange("address", event.target.value)}
                placeholder="Banani, Dhaka"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="provider-status">Status</Label>
              <select
                id="provider-status"
                value={values.status}
                onChange={(event) => handleChange("status", event.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="provider-notes">Notes</Label>
              <textarea
                id="provider-notes"
                value={values.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Internal onboarding notes"
                className="mt-1.5 min-h-28 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Save Provider
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderFormDialog;
