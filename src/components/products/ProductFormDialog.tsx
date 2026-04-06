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

export type ProductFormValues = {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  sku: string;
  description: string;
  vendor?: string;
};

const defaultValues: ProductFormValues = {
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "Active",
  sku: "",
  description: "",
  vendor: "",
};

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  showVendorField?: boolean;
};

const ProductFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  initialValues,
  onSubmit,
  showVendorField = false,
}: ProductFormDialogProps) => {
  const [values, setValues] = useState<ProductFormValues>(defaultValues);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues, open]);

  const handleChange = (field: keyof ProductFormValues, value: string) => {
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
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={values.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Wireless Headphones Pro"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={values.category}
                onChange={(event) => handleChange("category", event.target.value)}
                placeholder="Electronics"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={values.price}
                onChange={(event) => handleChange("price", event.target.value)}
                placeholder="89.99"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={values.stock}
                onChange={(event) => handleChange("stock", event.target.value)}
                placeholder="45"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="product-status">Status</Label>
              <select
                id="product-status"
                value={values.status}
                onChange={(event) => handleChange("status", event.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                value={values.sku}
                onChange={(event) => handleChange("sku", event.target.value)}
                placeholder="SKU-1001"
                className="mt-1.5"
              />
            </div>
            {showVendorField && (
              <div className="sm:col-span-2">
                <Label htmlFor="product-vendor">Vendor</Label>
                <Input
                  id="product-vendor"
                  value={values.vendor}
                  onChange={(event) => handleChange("vendor", event.target.value)}
                  placeholder="TechStore"
                  className="mt-1.5"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label htmlFor="product-description">Description</Label>
              <textarea
                id="product-description"
                value={values.description}
                onChange={(event) => handleChange("description", event.target.value)}
                placeholder="Short product description"
                className="mt-1.5 min-h-28 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Save Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
