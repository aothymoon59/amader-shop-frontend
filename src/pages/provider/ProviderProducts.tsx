import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const products = [
  { id: 1, name: "Wireless Headphones Pro", price: "$89.99", stock: 45, status: "Active" },
  { id: 2, name: "Smart Speaker Mini", price: "$129.99", stock: 30, status: "Active" },
  { id: 3, name: "USB-C Cable Pack", price: "$19.99", stock: 200, status: "Active" },
  { id: 4, name: "Bluetooth Keyboard", price: "$59.99", stock: 0, status: "Out of Stock" },
];

const ProviderProducts = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button variant="hero"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" />
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Stock</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderProducts;
