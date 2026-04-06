import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProductFormDialog, { type ProductFormValues } from "@/components/products/ProductFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

type ProviderProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  sku: string;
  description: string;
};

const initialProducts: ProviderProduct[] = [
  { id: 1, name: "Wireless Headphones Pro", category: "Electronics", price: 89.99, stock: 45, status: "Active", sku: "PRO-1001", description: "Premium wireless headphones." },
  { id: 2, name: "Smart Speaker Mini", category: "Electronics", price: 129.99, stock: 30, status: "Active", sku: "SPK-1002", description: "Compact smart speaker." },
  { id: 3, name: "USB-C Cable Pack", category: "Accessories", price: 19.99, stock: 200, status: "Active", sku: "USB-1003", description: "Durable cable bundle." },
  { id: 4, name: "Bluetooth Keyboard", category: "Accessories", price: 59.99, stock: 0, status: "Out of Stock", sku: "KEY-1004", description: "Wireless productivity keyboard." },
];

const ProviderProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProviderProduct | null>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.category, product.sku].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [products, search],
  );

  const openAddDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: ProviderProduct) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (
      !values.name.trim() ||
      !values.category.trim() ||
      !values.price.trim() ||
      !values.stock.trim() ||
      !values.sku.trim() ||
      !values.description.trim()
    ) {
      toast({
        title: "Missing product details",
        description: "Please fill in all required product fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: values.name,
                category: values.category,
                price: Number(values.price),
                stock: Number(values.stock),
                status: values.status,
                sku: values.sku,
                description: values.description,
              }
            : product,
        ),
      );
      toast({ title: "Product updated", description: `${values.name} has been updated.` });
    } else {
      setProducts((current) => [
        {
          id: Date.now(),
          name: values.name,
          category: values.category,
          price: Number(values.price),
          stock: Number(values.stock),
          status: values.status,
          sku: values.sku,
          description: values.description,
        },
        ...current,
      ]);
      toast({ title: "Product added", description: `${values.name} has been created.` });
    }

    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId: number) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    toast({ title: "Product removed", description: "The product has been deleted from your list." });
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">My Products</h1>
          <Button variant="hero" onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Stock</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.sku}</div>
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price.toFixed(2)}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "Active" ? "bg-success/10 text-success" : product.status === "Draft" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingProduct ? "Edit Product" : "Add Product"}
        description={editingProduct ? "Update the product information below." : "Add a new product with the required selling details."}
        initialValues={
          editingProduct
            ? {
                name: editingProduct.name,
                category: editingProduct.category,
                price: String(editingProduct.price),
                stock: String(editingProduct.stock),
                status: editingProduct.status,
                sku: editingProduct.sku,
                description: editingProduct.description,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
};

export default ProviderProducts;
